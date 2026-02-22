import { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";
import { queryEmbeddings } from "@/lib/langchain/embeddings";
import { searchSchema } from "@/lib/validations/search.schema";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import type { SearchResult } from "@/types/app.types";
import type { MatchDocumentsResult } from "@/types/database.types";
import { getRateLimitIdentifier, searchRatelimit } from "@/lib/utils/rate-limit";
import { requireAuth } from "@/lib/utils/api-guard";
import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
  try {
    // ── Step 1: Auth ─────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    const identifier = getRateLimitIdentifier(request, user.id);
const { success, reset } = await searchRatelimit.limit(identifier);

if (!success) {
  return errorResponse(
    `Too many searches. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s`,
    429
  );
}

    // ── Step 2: Validate request body ─────────────────────────────────────────
    const body = await request.json();
    const parsed = searchSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { query, category_id, match_count, match_threshold } = parsed.data;

    // ── Step 3: Embed the query ───────────────────────────────────────────────
    const queryVector = await queryEmbeddings.embedQuery(query);

    // ── Step 4: Run vector similarity search via RPC ──────────────────────────
    const { data: chunks, error: rpcError } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: JSON.stringify(queryVector),
        match_threshold,
        match_count,
        filter_user_id: user.id,
        filter_category_id: category_id ?? undefined,
      }
    );

    if (rpcError) throw new Error(rpcError.message);
    if (!chunks || chunks.length === 0) {
      return successResponse<SearchResult[]>([]);
    }

    // ── Step 5: Fetch document + category metadata for matched chunks ─────────
    const uniqueDocumentIds = [...new Set(
      (chunks as MatchDocumentsResult[]).map((c) => c.document_id)
    )];

    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("*, category:categories(*)")
      .in("id", uniqueDocumentIds);

    if (docsError) throw new Error(docsError.message);

    // ── Step 6: Group chunks by document and build SearchResult ───────────────
    const documentMap = new Map(documents?.map((doc) => [doc.id, doc]) ?? []);

    // Group all matching chunks per document
    const groupedChunks = (chunks as MatchDocumentsResult[]).reduce<
      Record<string, MatchDocumentsResult[]>
    >((acc, chunk) => {
      const key = chunk.document_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(chunk);
      return acc;
    }, {});

    // Build results sorted by best similarity score per document
    const results: SearchResult[] = uniqueDocumentIds
      .map((docId) => {
        const doc = documentMap.get(docId);
        if (!doc) return null;

        const docChunks = groupedChunks[docId];

        // Pick the highest-scoring chunk's content as the excerpt
        const bestChunk = docChunks.reduce((best, current) =>
          current.similarity > best.similarity ? current : best
        );

        return {
          document_id: docId,
          file_name: doc.file_name,
          category: doc.category ?? null,
          similarity: Math.round(bestChunk.similarity * 100) / 100,
          excerpt: bestChunk.content.slice(0, 300).trim(),
          chunk_count_matched: docChunks.length,
        } satisfies SearchResult;
      })
      .filter((r): r is SearchResult => r !== null)
      .sort((a, b) => b.similarity - a.similarity); // Best match first

    return successResponse(results);
  } catch (err) {
    logger.error("[POST /api/search]", {error: err instanceof Error ? err.message : err,}); 
    return errorResponse(
      err instanceof Error ? err.message : "Search failed",
      500
    );
  }
}
