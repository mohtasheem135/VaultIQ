import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  id: string;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </Label>
        <Input
          id={id}
          ref={ref}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-destructive font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
export { FormField };
