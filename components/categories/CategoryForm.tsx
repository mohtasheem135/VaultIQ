"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  type CreateCategoryFormValues,  // ← input type for the form
  type CreateCategoryInput,        // ← output type for onSubmit
} from "@/lib/validations/category.schema";
import { CATEGORY_PRESET_COLORS } from "@/constants";
import { FormField } from "@/components/shared/FormField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/database.types";

type CategoryFormProps = {
  defaultValues?: Partial<Category>;
  onSubmit: (values: CreateCategoryInput) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
};

export function CategoryForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({   // ← input type here
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      color: defaultValues?.color ?? "#6366f1",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name ?? "",
        color: defaultValues.color ?? "#6366f1",
      });
    }
  }, [defaultValues?.id]);

  const selectedColor = watch("color") ?? "#6366f1";

  return (
    <form
      onSubmit={handleSubmit(onSubmit as (values: CreateCategoryFormValues) => void)}
      className="space-y-5"
    >
      <FormField
        id="category-name"
        label="Category name"
        placeholder="e.g. Legal Documents"
        error={errors.name?.message}
        autoFocus
        {...register("name")}
      />

      {/* Color Picker */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Color</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue("color", color)}
              className={cn(
                "h-7 w-7 rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedColor === color
                  ? "ring-2 ring-offset-2 ring-foreground scale-110"
                  : "hover:scale-105"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
              aria-pressed={selectedColor === color}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs text-muted-foreground font-mono">
            {selectedColor}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Saving..."
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
