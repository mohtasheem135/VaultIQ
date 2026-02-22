"use client";

import { useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isSearching: boolean;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  onClear,
  isSearching,
  placeholder = "Ask anything about your documents...",
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Left icon */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        {isSearching ? (
          <Loader2 className="h-4.5 w-4.5 text-indigo-500 animate-spin" />
        ) : (
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
        )}
      </div>

      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "pl-10 pr-10 h-12 text-base rounded-xl border-border",
          "focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400",
          "transition-all duration-150",
          isSearching && "border-indigo-300 dark:border-indigo-800"
        )}
        aria-label="Search documents"
        autoComplete="off"
        spellCheck={false}
      />

      {/* Clear button */}
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
