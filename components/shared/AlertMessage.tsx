import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type AlertMessageProps = {
  type: "error" | "success";
  message: string;
  className?: string;
};

export function AlertMessage({ type, message, className }: AlertMessageProps) {
  const isError = type === "error";

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm",
        isError
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
        className
      )}
    >
      {isError ? (
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
