import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/database.types";

type CategoryBadgeProps = {
  category: Pick<Category, "name" | "color"> | null | undefined;
  className?: string;
  size?: "sm" | "md";
};

export function CategoryBadge({
  category,
  className,
  size = "md",
}: CategoryBadgeProps) {
  if (!category) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 font-medium text-muted-foreground border-border",
          size === "sm" ? "text-[10px] py-0.5" : "text-xs py-1",
          className
        )}
      >
        Uncategorized
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 font-medium",
        size === "sm" ? "text-[10px] py-0.5" : "text-xs py-1",
        className
      )}
      style={{
        backgroundColor: `${category.color}18`, // 10% opacity background
        color: category.color,
        border: `1px solid ${category.color}40`, // 25% opacity border
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </span>
  );
}
