export const APP_NAME = "VaultIQ";
export const APP_DESCRIPTION = "Upload anything. Find everything.";

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
} as const;

export const MAX_FILE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB) || 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 200;
export const MATCH_THRESHOLD = 0.75;
export const MATCH_COUNT = 10;

export const DOCUMENT_STATUS = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;

export const SUPABASE_STORAGE_BUCKET = "documents";

// nav items

import { Upload, Search, LayoutDashboard } from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Upload",
    href: "/upload",
    icon: Upload,
    description: "Upload and manage documents",
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
    description: "Search across all documents",
  },
] as const;

export const CATEGORY_PRESET_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#3b82f6", // Blue
  "#64748b", // Slate
] as const;
