import { cn } from "@/lib/utils/cn";

type SimilarityBadgeProps = {
  score: number; // 0 to 1
};

export function SimilarityBadge({ score }: SimilarityBadgeProps) {
  const percent = Math.round(score * 100);

  const config =
    percent >= 90
      ? { label: "Excellent", className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900" }
      : percent >= 75
      ? { label: "Strong", className: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900" }
      : percent >= 60
      ? { label: "Good", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900" }
      : { label: "Partial", className: "bg-muted text-muted-foreground border-border" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        config.className
      )}
      title={`Similarity score: ${percent}%`}
    >
      {percent}% {config.label}
    </span>
  );
}
