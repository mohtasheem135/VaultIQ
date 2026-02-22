"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/app.types";
import type { DocumentWithCategory } from "@/types/database.types";

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  detail: (id: string) => [...documentKeys.all, "detail", id] as const,
};

async function fetchDocuments(): Promise<DocumentWithCategory[]> {
  const res = await fetch("/api/documents");
  const json: ApiResponse<DocumentWithCategory[]> = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data!;
}

async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
  const json: ApiResponse<{ id: string }> = await res.json();
  if (json.error) throw new Error(json.error);
}

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: fetchDocuments,
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: documentKeys.lists() });
      const previous = queryClient.getQueryData<DocumentWithCategory[]>(
        documentKeys.lists()
      );

      // Optimistically remove from list
      queryClient.setQueryData<DocumentWithCategory[]>(
        documentKeys.lists(),
        (old = []) => old.filter((doc) => doc.id !== id)
      );

      return { previous };
    },
    onError: (err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(documentKeys.lists(), context.previous);
      }
      toast.error("Failed to delete document", { description: err.message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      toast.success("Document deleted");
    },
  });
}
