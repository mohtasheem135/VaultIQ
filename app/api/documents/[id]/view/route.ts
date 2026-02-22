import { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";
import { supabaseAdmin } from "@/supabase/admin";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { SUPABASE_STORAGE_BUCKET } from "@/constants";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/documents/:id/view — returns a short-lived signed URL
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    // Verify ownership
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("storage_path, file_name, file_type")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !doc) return errorResponse("Document not found", 404);

    // Generate signed URL valid for 60 minutes
    const { data: signedData, error: signedError } = await supabaseAdmin
      .storage
      .from(SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(doc.storage_path, 3600);

    if (signedError || !signedData) {
      throw new Error("Failed to generate signed URL");
    }

    return successResponse({
      url:       signedData.signedUrl,
      file_name: doc.file_name,
      file_type: doc.file_type,
    });
  } catch (err) {
    console.error("[GET /api/documents/:id/view]", err);
    return errorResponse("Failed to generate view URL", 500);
  }
}
