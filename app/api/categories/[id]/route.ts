import { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";
import { createCategorySchema } from "@/lib/validations/category.schema";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requireAuth } from "@/lib/utils/api-guard";
import { logger } from "@/lib/utils/logger";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/categories/:id — update a category
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    const body = await request.json();
    const parsed = createCategorySchema.partial().safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { data, error } = await supabase
      .from("categories")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", user.id) // RLS double-check
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return errorResponse(`Category name already exists`, 409);
      }
      throw error;
    }

    if (!data) return errorResponse("Category not found", 404);

    return successResponse(data);
  } catch (err) {
    logger.error("api/categories ", { route: 'PATCH /api/categories/:id',error: err instanceof Error ? err.message : err });
    return errorResponse("Failed to update category", 500);
  }
}

// DELETE /api/categories/:id — delete a category
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { user, error: authError } = await requireAuth();
if (authError) return authError;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return successResponse({ id });
  } catch (err) {
    logger.error("api/categories ", { route: 'DELETE /api/categories/:id',error: err instanceof Error ? err.message : err });
    return errorResponse("Failed to delete category", 500);
  }
}
