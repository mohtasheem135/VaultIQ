"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";                        // ← replaces useToast hook
import type { Category } from "@/types/database.types";
import type { ApiResponse } from "@/types/app.types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/validations/category.schema";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};

// ── API Calls ─────────────────────────────────────────────────────────────────
async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  const json: ApiResponse<Category[]> = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data!;
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<Category> = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data!;
}

async function updateCategory(input: UpdateCategoryInput): Promise<Category> {
  const { id, ...rest } = input;
  const res = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  const json: ApiResponse<Category> = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data!;
}

async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
  const json: ApiResponse<{ id: string }> = await res.json();
  if (json.error) throw new Error(json.error);
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });
      const previous = queryClient.getQueryData<Category[]>(categoryKeys.lists());

      queryClient.setQueryData<Category[]>(categoryKeys.lists(), (old = []) => [
        ...old,
        {
          id: `temp-${Date.now()}`,
          user_id: "",
          created_at: new Date().toISOString(),
          ...newCategory,
        },
      ]);

      return { previous };
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(categoryKeys.lists(), context.previous);
      }
      toast.error("Failed to create category", {
        description: err.message,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Category created", {
        description: `"${data.name}" has been added.`,
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });
      const previous = queryClient.getQueryData<Category[]>(categoryKeys.lists());

      queryClient.setQueryData<Category[]>(categoryKeys.lists(), (old = []) =>
        old.map((cat) =>
          cat.id === updated.id ? { ...cat, ...updated } : cat
        )
      );

      return { previous };
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(categoryKeys.lists(), context.previous);
      }
      toast.error("Failed to update category", {
        description: err.message,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Category updated", {
        description: `"${data.name}" has been saved.`,
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });
      const previous = queryClient.getQueryData<Category[]>(categoryKeys.lists());

      queryClient.setQueryData<Category[]>(categoryKeys.lists(), (old = []) =>
        old.filter((cat) => cat.id !== id)
      );

      return { previous };
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(categoryKeys.lists(), context.previous);
      }
      toast.error("Failed to delete category", {
        description: err.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Category deleted");
    },
  });
}
