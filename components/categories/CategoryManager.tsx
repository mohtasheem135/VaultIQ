"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CategoryForm } from "./CategoryForm";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import type { Category } from "@/types/database.types";
import type { CreateCategoryInput } from "@/lib/validations/category.schema";

type ManagerMode = "list" | "create" | "edit";

type CategoryManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryManager({ open, onOpenChange }: CategoryManagerProps) {
  const [mode, setMode] = useState<ManagerMode>("list");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCreate = async (values: CreateCategoryInput) => {
    await createCategory.mutateAsync(values);
    setMode("list");
  };

  const handleUpdate = async (values: CreateCategoryInput) => {
    if (!selectedCategory) return;
    await updateCategory.mutateAsync({ id: selectedCategory.id, ...values });
    setMode("list");
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory.mutateAsync(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setMode("edit");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation completes
    setTimeout(() => {
      setMode("list");
      setSelectedCategory(null);
    }, 200);
  };

  // ── Titles per mode ──────────────────────────────────────────────────────────
  const titles: Record<ManagerMode, { title: string; description: string }> = {
    list: {
      title: "Manage Categories",
      description: "Organize your documents with custom categories.",
    },
    create: {
      title: "New Category",
      description: "Create a new category to organize your documents.",
    },
    edit: {
      title: "Edit Category",
      description: `Editing "${selectedCategory?.name}"`,
    },
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{titles[mode].title}</DialogTitle>
            <DialogDescription>{titles[mode].description}</DialogDescription>
          </DialogHeader>

          {/* LIST MODE */}
          {mode === "list" && (
            <div className="space-y-4">
              {/* Category List */}
              <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin pr-1">
                {isLoading ? (
                  <CategoryListSkeleton />
                ) : categories?.length === 0 ? (
                  <EmptyCategoryState />
                ) : (
                  categories?.map((category) => (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      onEdit={() => handleEditClick(category)}
                      onDelete={() => setCategoryToDelete(category)}
                    />
                  ))
                )}
              </div>

              <Separator />

              {/* Create New Button */}
              <Button
                onClick={() => setMode("create")}
                className="w-full bg-indigo-500 hover:bg-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </div>
          )}

          {/* CREATE MODE */}
          {mode === "create" && (
            <CategoryForm
              onSubmit={handleCreate}
              onCancel={() => setMode("list")}
              isLoading={createCategory.isPending}
              submitLabel="Create Category"
            />
          )}

          {/* EDIT MODE */}
          {mode === "edit" && selectedCategory && (
            <CategoryForm
              defaultValues={selectedCategory}
              onSubmit={handleUpdate}
              onCancel={() => {
                setMode("list");
                setSelectedCategory(null);
              }}
              isLoading={updateCategory.isPending}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>"{categoryToDelete?.name}"</strong>? Documents in this
              category will become uncategorized. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent group transition-colors">
      <CategoryBadge category={category} />
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onEdit}
          aria-label={`Edit ${category.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          aria-label={`Delete ${category.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function CategoryListSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2.5">
          <Skeleton className="h-5 w-28 rounded-full" />
          <div className="flex gap-1">
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyCategoryState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
        <Tag className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No categories yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Create your first category below
      </p>
    </div>
  );
}
