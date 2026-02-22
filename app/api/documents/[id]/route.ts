import { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";
import { supabaseAdmin } from "@/supabase/admin";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { SUPABASE_STORAGE_BUCKET } from "@/constants";
import { requireAuth } from "@/lib/utils/api-guard";
import { logger } from "@/lib/utils/logger";

type RouteParams = { params: Promise<{ id: string }> };

// DELETE /api/documents/:id — delete document, chunks, and storage file
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    // Fetch storage path before deleting
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !doc) return errorResponse("Document not found", 404);

    // Delete from storage (chunks cascade-delete via DB foreign key)
    await supabaseAdmin.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([doc.storage_path]);

    // Delete document row (chunks auto-delete via ON DELETE CASCADE)
    const { error: deleteError } = await supabaseAdmin
      .from("documents")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return successResponse({ id });
  } catch (err) {
    logger.error("[DELETE /api/documents/:id]", {route:'DELETE /api/documents/:id',error: err instanceof Error ? err.message : err,});
    return errorResponse("Failed to delete document", 500);
  }
}
