"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "@/constants";

type DropzoneUploaderProps = {
  onFilesDrop: (files: File[]) => void;
  disabled?: boolean;
};

export function DropzoneUploader({ onFilesDrop, disabled }: DropzoneUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesDrop(acceptedFiles);
      }
    },
    [onFilesDrop]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer",
        "hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20",
        isDragActive && !isDragReject &&
          "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.01]",
        isDragReject &&
          "border-destructive bg-destructive/5",
        disabled &&
          "pointer-events-none opacity-50",
        !isDragActive && "border-border bg-background"
      )}
    >
      <input {...getInputProps()} />

      <div className={cn(
        "mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors",
        isDragActive && !isDragReject
          ? "bg-indigo-100 dark:bg-indigo-900/50"
          : "bg-muted"
      )}>
        {isDragActive ? (
          <FileUp className={cn(
            "h-7 w-7",
            isDragReject ? "text-destructive" : "text-indigo-500"
          )} />
        ) : (
          <Upload className="h-7 w-7 text-muted-foreground" />
        )}
      </div>

      {isDragReject ? (
        <p className="text-sm font-medium text-destructive">
          File type not supported
        </p>
      ) : isDragActive ? (
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Drop to upload
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-foreground">
            Drop files here or{" "}
            <span className="text-indigo-500 hover:text-indigo-600">
              browse
            </span>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            PDF, DOCX, DOC, TXT, MD — up to {process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB}MB
          </p>
        </>
      )}
    </div>
  );
}
