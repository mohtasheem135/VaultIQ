"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, send to your logging service (e.g. Sentry)
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground mb-1 max-w-sm">
            An unexpected error occurred in this section.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <p className="text-xs text-destructive font-mono bg-destructive/5 rounded px-3 py-2 mb-4 max-w-md text-left">
              {this.state.error.message}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleReset}
            className="mt-2"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
