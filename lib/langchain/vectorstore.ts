import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { supabaseAdmin } from "@/supabase/admin";
import { documentEmbeddings } from "./embeddings";

export function createVectorStore() {
  return new SupabaseVectorStore(documentEmbeddings, {
    client: supabaseAdmin,
    tableName: "document_chunks",
    queryName: "match_documents",
  });
}
