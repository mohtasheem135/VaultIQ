import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "@/constants";

export const uploadDocumentSchema = z.object({
  category_id: z
    .string()
    .uuid("Invalid category ID")
    .optional()
    .nullable(),
});

// Client-side file validation (used in the Dropzone)
export function validateFile(file: File): string | null {
  if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
    return `"${file.name}" has an unsupported file type`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `"${file.name}" exceeds the ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB}MB limit`;
  }
  return null;
}

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
