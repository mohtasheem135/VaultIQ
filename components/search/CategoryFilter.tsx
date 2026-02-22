"use client";

import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";

type CategoryFilterProps = {
  selectedId: string | null;
  onChange: (id: string | null) => void;
};

export function CategoryFilter({ selectedId, onChange }: CategoryFilterProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by category">
      {/* All filter chip */}
      <button
        onClick={() => onChange(null)}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150",
          selectedId === null
            ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
            : "bg-background text-muted-foreground border-border hover:border-indigo-300 hover:text-foreground"
        )}
        aria-pressed={selectedId === null}
      >
        All
      </button>

      {/* Category chips */}
      {categories.map((category) => {
        const isSelected = selectedId === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onChange(isSelected ? null : category.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150",
              isSelected
                ? "shadow-sm scale-105"
                : "bg-background border-border hover:scale-[1.02]"
            )}
            style={
              isSelected
                ? {
                    backgroundColor: category.color,
                    borderColor: category.color,
                    color: "#ffffff",
                  }
                : {
                    color: category.color,
                    borderColor: `${category.color}50`,
                  }
            }
            aria-pressed={isSelected}
          >
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: isSelected ? "#ffffff" : category.color,
              }}
            />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
