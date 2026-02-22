"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { validateFile } from "@/lib/validations/document.schema";
import { documentKeys } from "./useDocuments";
import type { UploadQueueItem } from "@/types/app.types";

export function useUpload() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const queryClient = useQueryClient();

  const updateItem = useCallback(
    (id: string, updates: Partial<UploadQueueItem>) => {
      setQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const uploadFile = useCallback(
    async (item: UploadQueueItem) => {
      updateItem(item.id, { status: "uploading", progress: 10 });

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        if (item.category_id) {
          formData.append("category_id", item.category_id);
        }

        updateItem(item.id, { progress: 30 });

        const res = await fetch("/api/ingest", {
          method: "POST",
          body: formData,
        });

        updateItem(item.id, { progress: 80, status: "processing" });

        const json = await res.json();

        if (!res.ok || json.error) {
          throw new Error(json.error ?? "Upload failed");
        }

        updateItem(item.id, { status: "done", progress: 100 });

        queryClient.invalidateQueries({ queryKey: documentKeys.lists() });

        toast.success(`"${item.file.name}" is ready`, {
          description: `${json.data.chunk_count} chunks indexed`,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        updateItem(item.id, { status: "error", progress: 0, error: message });
        toast.error(`Failed to upload "${item.file.name}"`, {
          description: message,
        });
      }
    },
    [updateItem, queryClient]
  );

  const addFiles = useCallback(
    (files: File[], categoryId: string) => {
      const validItems: UploadQueueItem[] = [];

      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          toast.error(error);
          continue;
        }

        validItems.push({
          id: `upload-${crypto.randomUUID()}`,  // ✅ Web Crypto API — works in browser
          file,
          category_id: categoryId,
          status: "pending",
          progress: 0,
        });
      }

      if (!validItems.length) return;

      setQueue((prev) => [...prev, ...validItems]);

      validItems.reduce((chain, item) => {
        return chain.then(() => uploadFile(item));
      }, Promise.resolve());
    },
    [uploadFile]
  );

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== "done"));
  }, []);

  const hasActive = queue.some(
    (item) => item.status === "uploading" || item.status === "processing"
  );

  return {
    queue,
    addFiles,
    removeFromQueue,
    clearCompleted,
    hasActive,
  };
}
