import { NextRequest } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { createClient } from "@/supabase/server";
import { supabaseAdmin } from "@/supabase/admin";
import { loadDocument } from "@/lib/langchain/loaders";
import { createTextSplitter } from "@/lib/langchain/splitter";
import { documentEmbeddings } from "@/lib/langchain/embeddings";
import { uploadDocumentSchema } from "@/lib/validations/document.schema";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { buildStoragePath, getFileExtension } from "@/lib/utils/file-helpers";
import { SUPABASE_STORAGE_BUCKET, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "@/constants";
import type { DocumentInsert, DocumentChunkInsert } from "@/types/database.types";
import { getRateLimitIdentifier, ingestRatelimit } from "@/lib/utils/rate-limit";
import { requireAuth } from "@/lib/utils/api-guard";
import { logger } from "@/lib/utils/logger";

// Vercel max duration for hobby plan — increase if on pro
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;
  let documentId: string | null = null;

  try {
    // ── Step 1: Auth ────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    // ── Rate Limit ───────────────────────────────────────────────────────────────
const identifier = getRateLimitIdentifier(request, user.id);
const { success, limit, remaining, reset } = await ingestRatelimit.limit(identifier);

if (!success) {
  return errorResponse(
    `Too many uploads. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s`,
    429
  );
}

    // ── Step 2: Parse FormData ───────────────────────────────────────────────
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("category_id") as string | null;

    if (!file) return errorResponse("No file provided", 400);

    // ── Step 3: Validate File ────────────────────────────────────────────────
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      return errorResponse(`Unsupported file type: ${file.type}`, 400);
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return errorResponse(`File exceeds ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB}MB limit`, 400);
    }

    const parsed = uploadDocumentSchema.safeParse({ category_id: categoryId || null });
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const fileExt = getFileExtension(file.name) as "pdf" | "docx" | "doc" | "txt" | "md";
    documentId = randomUUID();

    // ── Step 4: Upload Raw File to Supabase Storage ─────────────────────────
    const storagePath = buildStoragePath(user.id, documentId, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: storageError } = await supabaseAdmin.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`);

    // ── Step 5: Insert Document Row (status: processing) ────────────────────
    const documentPayload: DocumentInsert = {
      id: documentId,
      user_id: user.id,
      category_id: parsed.data.category_id ?? null,
      file_name: file.name,
      file_type: fileExt,
      file_size: file.size,
      storage_path: storagePath,
      status: "processing",
    };

    const { error: docError } = await supabaseAdmin
      .from("documents")
      .insert(documentPayload);

    if (docError) throw new Error(`Failed to create document record: ${docError.message}`);

    // ── Step 6: Write to Temp File for LangChain ────────────────────────────
    // LangChain loaders require a file path, not a Buffer
    const tempDir = join(tmpdir(), "vaultiq");
    await mkdir(tempDir, { recursive: true });
    tempFilePath = join(tempDir, `${documentId}.${fileExt}`);
    await writeFile(tempFilePath, fileBuffer);

    // ── Step 7: Parse Document into LangChain Docs ──────────────────────────
    const rawDocs = await loadDocument(tempFilePath, fileExt);

    if (!rawDocs.length) {
      throw new Error("Document appears to be empty or could not be parsed");
    }

    // ── Step 8: Chunk the Text ───────────────────────────────────────────────
    const splitter = createTextSplitter();
    const chunks = await splitter.splitDocuments(rawDocs);

    if (!chunks.length) {
      throw new Error("No text content could be extracted from document");
    }

    // ── Step 9: Embed & Store in Batches ────────────────────────────────────
    // Gemini rate limit: max 100 texts per batch
    const BATCH_SIZE = 100;
    let totalChunksStored = 0;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((chunk) => chunk.pageContent);

      // Embed the batch
      const embeddings = await documentEmbeddings.embedDocuments(texts);

      // Build chunk rows
      const chunkRows: DocumentChunkInsert[] = batch.map((chunk, idx) => ({
        document_id: documentId!,
        user_id: user.id,
        category_id: parsed.data.category_id ?? null,
        content: chunk.pageContent,
        metadata: {
          file_name: file.name,
          chunk_index: i + idx,
          page_number: chunk.metadata?.loc?.pageNumber ?? null,
        },
        embedding: JSON.stringify(embeddings[idx]), // pgvector accepts JSON array string
      }));

      const { error: chunkError } = await supabaseAdmin
        .from("document_chunks")
        .insert(chunkRows);

      if (chunkError) throw new Error(`Failed to store chunks: ${chunkError.message}`);

      totalChunksStored += batch.length;
    }

    // ── Step 10: Update Document Status to Ready ────────────────────────────
    await supabaseAdmin
      .from("documents")
      .update({
        status: "ready",
        chunk_count: totalChunksStored,
      })
      .eq("id", documentId);

    return successResponse(
      {
        document_id: documentId,
        file_name: file.name,
        chunk_count: totalChunksStored,
        status: "ready",
      },
      201
    );

  } catch (err) {
    logger.error("[POST /api/ingest]", {error: err instanceof Error ? err.message : err,});

    // Mark document as failed if it was already created
    if (documentId) {
      await supabaseAdmin
        .from("documents")
        .update({
          status: "failed",
          error_message: err instanceof Error ? err.message : "Unknown error",
        })
        .eq("id", documentId);
    }

    return errorResponse(
      err instanceof Error ? err.message : "Ingestion failed",
      500
    );
  } finally {
    // ── Always clean up temp file ────────────────────────────────────────────
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => null); // silently ignore if already gone
    }
  }
}
