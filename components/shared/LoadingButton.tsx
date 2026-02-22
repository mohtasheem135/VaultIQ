import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  isLoading: boolean;
  loadingText?: string;
};

export function LoadingButton({
  isLoading,
  loadingText = "Please wait...",
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={isLoading || disabled}
      className={cn("relative", className)}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
