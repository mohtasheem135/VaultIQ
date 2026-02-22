import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Only letters, numbers, spaces, hyphens and underscores allowed"
    ),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .default("#6366f1"),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().uuid("Invalid category ID"),
});

// ✅ Use z.input<> for the form (what the user fills in — color is optional)
// ✅ Use z.infer<> / z.output<> for the API payload (color always present after default is applied)
export type CreateCategoryFormValues = z.input<typeof createCategorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
