"use client";

import { useState } from "react";
import { Tag, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

type CategorySelectorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function CategorySelector({
  value,
  onChange,
  disabled,
}: CategorySelectorProps) {
  const [managerOpen, setManagerOpen] = useState(false);
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-lg" />;
  }

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={
            <span className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              Select a category (optional)
            </span>
          }>
            {value && categories && (
              <CategoryBadge
                category={categories.find((c) => c.id === value) ?? null}
                size="sm"
              />
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <span className="text-muted-foreground">No category</span>
          </SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <CategoryBadge category={category} size="sm" />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setManagerOpen(true)}
        disabled={disabled}
        aria-label="Manage categories"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <CategoryManager
        open={managerOpen}
        onOpenChange={setManagerOpen}
      />
    </div>
  );
}
