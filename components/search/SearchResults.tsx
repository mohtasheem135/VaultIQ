"use client";

import { SearchResultCard } from "./SearchResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX, Sparkles } from "lucide-react";
import type { SearchResult } from "@/types/app.types";

type SearchResultsProps = {
  results: SearchResult[];
  query: string;
  isSearching: boolean;
  hasSearched: boolean;
};

export function SearchResults({
  results,
  query,
  isSearching,
  hasSearched,
}: SearchResultsProps) {
  // Loading state
  if (isSearching) {
    return <SearchResultsSkeleton />;
  }

  // No results after a search
  if (hasSearched && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <SearchX className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No matching documents</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Try a different query or broaden your category filter
        </p>
      </div>
    );
  }

  // Results
  if (results.length > 0) {
    return (
      <div className="space-y-3">
        {/* Results count */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <p className="text-xs text-muted-foreground">
            Found{" "}
            <span className="font-semibold text-foreground">{results.length}</span>{" "}
            {results.length === 1 ? "document" : "documents"} matching{" "}
            <span className="font-semibold text-foreground">"{query}"</span>
          </p>
        </div>

        {results.map((result, index) => (
          <SearchResultCard
            key={result.document_id}
            result={result}
            query={query}
            rank={index + 1}
          />
        ))}
      </div>
    );
  }

  // Initial idle state — nothing searched yet
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Ask anything about your documents
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        VaultIQ uses AI embeddings to find the most relevant documents — not just keyword matches
      </p>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-background p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-full shrink-0" />
          </div>
          <div className="pl-10 space-y-1.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3.5 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
