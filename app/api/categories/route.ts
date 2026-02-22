import { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";
import { createCategorySchema } from "@/lib/validations/category.schema";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requireAuth } from "@/lib/utils/api-guard";
import { logger } from "@/lib/utils/logger";

// GET /api/categories — fetch all categories for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient();

    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return successResponse(data);
  } catch (err) {
    logger.error("Categories API failed", {
      route: "GET /api/categories",
      error: err instanceof Error ? err.message : err
    });
    return errorResponse("Failed to fetch categories", 500);
  }
}

// POST /api/categories — create a new category
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { name, color } = parsed.data;

    const { data, error } = await supabase
      .from("categories")
      .insert({ name, color, user_id: user.id })
      .select()
      .single();

    if (error) {
      // Unique constraint violation — duplicate name
      if (error.code === "23505") {
        return errorResponse(`Category "${name}" already exists`, 409);
      }
      throw error;
    }

    return successResponse(data, 201);
  } catch (err) {
    logger.error("Categories API failed", {
      route: "POST /api/categories",
      error: err instanceof Error ? err.message : err
    });
    return errorResponse("Failed to create category", 500);
  }
}
