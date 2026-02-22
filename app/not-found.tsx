import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">404</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-indigo-500 hover:bg-indigo-600">
        <Link href="/upload">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
