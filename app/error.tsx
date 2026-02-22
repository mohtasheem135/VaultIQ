"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/utils/logger";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to error reporting service in production
    logger.error("[GlobalError]", {route:'Global',error: error instanceof Error ? error.message : error,});
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-2 max-w-sm">
        An unexpected error occurred. Our team has been notified.
      </p>
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-destructive font-mono bg-destructive/5 rounded px-3 py-2 mb-4 max-w-md">
          {error.message}
        </p>
      )}
      <Button
        variant="outline"
        onClick={reset}
        className="mt-2"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-2" />
        Try again
      </Button>
    </div>
  );
}
