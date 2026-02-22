import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "@/constants";

export function isValidFileType(file: File): boolean {
  return Object.keys(ACCEPTED_FILE_TYPES).includes(file.type);
}

export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE_BYTES;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Generates a unique storage path for a file
export function buildStoragePath(userId: string, documentId: string, fileName: string): string {
  const sanitized = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  return `${userId}/${documentId}/${sanitized}`;
}
