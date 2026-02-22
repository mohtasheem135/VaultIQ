"use client";

import { FileText, Layers, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { SimilarityBadge } from "./SimilarityBadge";
import { cn } from "@/lib/utils/cn";
import type { SearchResult } from "@/types/app.types";

type SearchResultCardProps = {
  result: SearchResult;
  query: string;
  rank: number;
};

function HighlightedExcerpt({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (!terms.length) {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {text}
      </p>
    );
  }

  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export function SearchResultCard({ result, query, rank }: SearchResultCardProps) {
  const handleOpen = () => {
    window.open(`/documents/${result.document_id}`, "_blank");
  };

  return (
    <div
      className={cn(
        "group rounded-xl border bg-background p-4 transition-all duration-150",
        "hover:border-indigo-200 hover:shadow-sm dark:hover:border-indigo-900",
        rank === 1 && "border-indigo-200 dark:border-indigo-900 shadow-sm"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold text-foreground truncate"
              title={result.file_name}
            >
              {result.file_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <CategoryBadge category={result.category} size="sm" />
            </div>
          </div>
        </div>

        {/* Right side — badge + open button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <SimilarityBadge score={result.similarity} />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-indigo-500"
            onClick={handleOpen}
            aria-label={`Open ${result.file_name} in new tab`}
            title="Open document"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Excerpt */}
      <div className="pl-10">
        <HighlightedExcerpt text={result.excerpt} query={query} />

        {/* Footer meta */}
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-muted-foreground">
          <Layers className="h-3 w-3 shrink-0" />
          <span>
            {result.chunk_count_matched} matching{" "}
            {result.chunk_count_matched === 1 ? "section" : "sections"}
          </span>
          {rank === 1 && (
            <span className="ml-auto text-indigo-500 font-medium text-[10px] uppercase tracking-wide">
              Best match
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
