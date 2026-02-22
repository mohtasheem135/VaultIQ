"use client";

import { useState } from "react";
import {
  FileText,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { formatFileSize } from "@/lib/utils/file-helpers";
import { useDeleteDocument } from "@/hooks/useDocuments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils/cn";
import type { DocumentWithCategory } from "@/types/database.types";

type DocumentCardProps = {
  document: DocumentWithCategory;
};

const STATUS_CONFIG = {
  ready: {
    icon: CheckCircle2,
    label: "Ready",
    className: "text-green-500",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    className: "text-indigo-500 animate-spin",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "text-destructive",
  },
};

export function DocumentCard({ document: doc }: DocumentCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteDocument = useDeleteDocument();

  const statusConfig = STATUS_CONFIG[doc.status];
  const StatusIcon = statusConfig.icon;

  const handleDelete = async () => {
    await deleteDocument.mutateAsync(doc.id);
    setConfirmDelete(false);
  };

  const handleOpen = () => {
    window.open(`/documents/${doc.id}`, "_blank");
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-3 rounded-lg border bg-background p-3.5 transition-colors hover:border-border/80",
          doc.status === "failed" && "border-destructive/20 bg-destructive/5"
        )}
      >
        {/* File icon */}
        <div className="mt-0.5 shrink-0 h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
          <FileText className="h-4.5 w-4.5 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-sm font-medium truncate" title={doc.file_name}>
            {doc.file_name}
          </p>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <CategoryBadge category={doc.category ?? null} size="sm" />
            <span className="text-xs text-muted-foreground">
              {formatFileSize(doc.file_size)}
            </span>
            {doc.status === "ready" && (
              <span className="text-xs text-muted-foreground">
                {doc.chunk_count} chunks
              </span>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <StatusIcon
              className={cn("h-3.5 w-3.5 shrink-0", statusConfig.className)}
            />
            <span className={cn("text-xs font-medium", statusConfig.className)}>
              {statusConfig.label}
            </span>
            {doc.status === "failed" && doc.error_message && (
              <span className="text-xs text-muted-foreground truncate">
                — {doc.error_message}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Open in new tab — only for ready documents */}
          {doc.status === "ready" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-indigo-500"
              onClick={handleOpen}
              aria-label={`Open ${doc.file_name}`}
              title="Open document"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
            disabled={deleteDocument.isPending}
            aria-label={`Delete ${doc.file_name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{doc.file_name}"</strong> and all its indexed data will
              be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
