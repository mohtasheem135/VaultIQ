import type { Document, Category } from "./database.types";

// API Response wrapper — all API routes return this shape
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// Search result returned to the frontend
export type SearchResult = {
  document_id: string;
  file_name: string;
  category: Category | null;
  similarity: number;
  excerpt: string;
  chunk_count_matched: number;
};

// Upload queue item (client-side only)
export type UploadQueueItem = {
  id: string;            // temp client-side ID
  file: File;
  category_id: string;
  status: "pending" | "uploading" | "processing" | "done" | "error";
  progress: number;
  error?: string;
  document?: Document;
};
