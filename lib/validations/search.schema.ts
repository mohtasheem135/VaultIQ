import { z } from "zod";
import { MATCH_COUNT, MATCH_THRESHOLD } from "@/constants";

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .min(3, "Query must be at least 3 characters")
    .max(500, "Query must be less than 500 characters")
    .transform((val) => val.trim()),
  category_id: z
    .string()
    .uuid("Invalid category ID")
    .optional()
    .nullable(),
  match_count: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(MATCH_COUNT),
  match_threshold: z
    .number()
    .min(0)
    .max(1)
    .default(MATCH_THRESHOLD),
});

// ✅ Input type — match_count and match_threshold are optional (have defaults)
export type SearchFormValues = z.input<typeof searchSchema>;

// ✅ Output type — match_count and match_threshold are always present after Zod processes
export type SearchInput = z.infer<typeof searchSchema>;
