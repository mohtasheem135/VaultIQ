"use client";

import { FileText, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatFileSize } from "@/lib/utils/file-helpers";
import type { UploadQueueItem as UploadQueueItemType } from "@/types/app.types";

type Props = {
  item: UploadQueueItemType;
  onRemove: (id: string) => void;
};

const STATUS_LABELS: Record<UploadQueueItemType["status"], string> = {
  pending:    "Waiting...",
  uploading:  "Uploading...",
  processing: "Processing & embedding...",
  done:       "Ready",
  error:      "Failed",
};

export function UploadQueueItem({ item, onRemove }: Props) {
  const isActive = item.status === "uploading" || item.status === "processing";
  const isDone = item.status === "done";
  const isError = item.status === "error";

  return (
    <div className={cn(
      "flex items-start gap-3 rounded-lg border p-3 transition-colors",
      isDone && "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900",
      isError && "bg-destructive/5 border-destructive/20",
      !isDone && !isError && "bg-background"
    )}>
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : isError ? (
          <XCircle className="h-5 w-5 text-destructive" />
        ) : isActive ? (
          <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
        ) : (
          <FileText className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">{item.file.name}</p>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatFileSize(item.file.size)}
          </span>
        </div>

        {isActive && (
          <Progress
            value={item.progress}
            className="h-1.5"
          />
        )}

        <p className={cn(
          "text-xs",
          isDone ? "text-green-600 dark:text-green-400" :
          isError ? "text-destructive" :
          "text-muted-foreground"
        )}>
          {isError ? item.error : STATUS_LABELS[item.status]}
        </p>
      </div>

      {/* Remove button (only for done/error states) */}
      {(isDone || isError) && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => onRemove(item.id)}
          aria-label="Remove from list"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
