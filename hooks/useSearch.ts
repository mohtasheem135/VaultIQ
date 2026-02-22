"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { searchSchema } from "@/lib/validations/search.schema";   // ← import schema
import type { SearchResult, ApiResponse } from "@/types/app.types";
import type { SearchInput, SearchFormValues } from "@/lib/validations/search.schema";

async function searchDocuments(input: SearchInput): Promise<SearchResult[]> {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<SearchResult[]> = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data!;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate, isPending, reset: resetMutation } = useMutation({
    mutationFn: searchDocuments,
    onSuccess: (data) => {
      setResults(data);
      setHasSearched(true);
    },
    onError: (err) => {
      toast.error("Search failed", { description: err.message });
      setHasSearched(true);
    },
  });

  // ✅ Parses FormValues → applies defaults → resolves to SearchInput
  const resolveInput = useCallback((formValues: SearchFormValues): SearchInput => {
    return searchSchema.parse(formValues);
  }, []);

  const search = useCallback(
    (formValues: SearchFormValues) => {           // ← accepts partial input
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        mutate(resolveInput(formValues));          // ← resolve defaults before sending
      }, 400);
    },
    [mutate, resolveInput]
  );

  const searchImmediate = useCallback(
    (formValues: SearchFormValues) => {           // ← accepts partial input
      if (debounceRef.current) clearTimeout(debounceRef.current);
      mutate(resolveInput(formValues));            // ← resolve defaults before sending
    },
    [mutate, resolveInput]
  );

  const clearResults = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setResults([]);
    setHasSearched(false);
    resetMutation();
  }, [resetMutation]);

  return {
    results,
    hasSearched,
    isSearching: isPending,
    search,
    searchImmediate,
    clearResults,
  };
}
