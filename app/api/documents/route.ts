import { createClient } from "@/supabase/server";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requireAuth } from "@/lib/utils/api-guard";
import { logger } from "@/lib/utils/logger";

// GET /api/documents — fetch all documents with their category for the user
export async function GET() {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return successResponse(data);
  } catch (err) {
    logger.error("[GET /api/documents]", { route: 'GET /api/documents', error: err instanceof Error ? err.message : err });
    return errorResponse("Failed to fetch documents", 500);
  }
}
