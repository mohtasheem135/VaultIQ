"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { CategoryFilter } from "@/components/search/CategoryFilter";
import { SearchResults } from "@/components/search/SearchResults";
import { Separator } from "@/components/ui/separator";
import { useSearch } from "@/hooks/useSearch";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    results,
    hasSearched,
    isSearching,
    search,
    searchImmediate,
    clearResults,
  } = useSearch();

  // Trigger debounced search whenever query or category changes
  useEffect(() => {
    if (query.trim().length < 3) {
      clearResults();
      return;
    }
    search({
      query,
      category_id: selectedCategory,
    });
  }, [query, selectedCategory]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedCategory(null);
    clearResults();
  };

  const handleCategoryChange = (id: string | null) => {
    setSelectedCategory(id);
    // Re-run search immediately on category change if query exists
    if (query.trim().length >= 3) {
      searchImmediate({
        query,
        category_id: id,
      });
    }
  };

  return (
    <ErrorBoundary>
<div className="space-y-6">
      <PageHeader
        title="Search Documents"
        description="Ask anything. VaultIQ finds the most relevant documents using AI-powered semantic search."
      />

      {/* Search Input */}
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onClear={handleClear}
        isSearching={isSearching}
      />

      {/* Category Filters */}
      <CategoryFilter
        selectedId={selectedCategory}
        onChange={handleCategoryChange}
      />

      <Separator />

      {/* Results */}
      <SearchResults
        results={results}
        query={query}
        isSearching={isSearching}
        hasSearched={hasSearched}
      />
    </div>
    </ErrorBoundary>
    
  );
}
