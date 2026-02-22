"use client";

import { useState, useEffect } from "react";
import { FileStack, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DropzoneUploader } from "@/components/upload/DropzoneUploader";
import { CategorySelector } from "@/components/upload/CategorySelector";
import { UploadQueueItem } from "@/components/upload/UploadQueueItem";
import { DocumentCard } from "@/components/upload/DocumentCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpload } from "@/hooks/useUpload";
import { useDocuments } from "@/hooks/useDocuments";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "@/hooks/useDocuments";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function UploadPage() {
  const [categoryId, setCategoryId] = useState<string>("none");
  const { queue, addFiles, removeFromQueue, clearCompleted, hasActive } = useUpload();
  const { data: documents, isLoading: docsLoading } = useDocuments();
  const queryClient = useQueryClient();

  // Poll for processing documents every 4 seconds
  useEffect(() => {
    const hasProcessing = documents?.some((d) => d.status === "processing");
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    }, 4000);

    return () => clearInterval(interval);
  }, [documents, queryClient]);

  const handleFilesDrop = (files: File[]) => {
    addFiles(files, categoryId === "none" ? "" : categoryId);
  };

  const hasQueue = queue.length > 0;
  const completedCount = queue.filter((i) => i.status === "done").length;

  return (
    <ErrorBoundary>
<div className="space-y-8">
      <PageHeader
        title="Upload Documents"
        description="Upload PDF, DOCX, TXT, and more. Documents are automatically parsed, chunked, and made searchable."
      />

      {/* Upload Section */}
      <div className="space-y-4">
        {/* Category Selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Category
          </label>
          <CategorySelector
            value={categoryId}
            onChange={setCategoryId}
            disabled={hasActive}
          />
        </div>

        {/* Dropzone */}
        <DropzoneUploader
          onFilesDrop={handleFilesDrop}
          disabled={hasActive}
        />
      </div>

      {/* Upload Queue */}
      {hasQueue && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Upload Queue
            </h2>
            {completedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={clearCompleted}
              >
                <X className="h-3 w-3 mr-1" />
                Clear completed
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {queue.map((item) => (
              <UploadQueueItem
                key={item.id}
                item={item}
                onRemove={removeFromQueue}
              />
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Your Documents
            {documents && (
              <span className="ml-2 text-muted-foreground font-normal">
                ({documents.length})
              </span>
            )}
          </h2>
        </div>

        {docsLoading ? (
          <DocumentListSkeleton />
        ) : !documents?.length ? (
          <EmptyDocumentsState />
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
    
  );
}

function DocumentListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border p-3.5">
          <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyDocumentsState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center rounded-xl border border-dashed">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <FileStack className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No documents yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Upload your first document above to get started
      </p>
    </div>
  );
}
