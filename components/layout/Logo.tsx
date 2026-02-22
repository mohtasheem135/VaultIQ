import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { APP_NAME } from "@/constants";

type LogoProps = {
  className?: string;
  collapsed?: boolean;
};

export function Logo({ className, collapsed = false }: LogoProps) {
  return (
    <Link
      href="/upload"
      className={cn("flex items-center gap-2.5 group", className)}
    >
      <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm group-hover:bg-indigo-600 transition-colors">
        <span className="text-white font-bold text-sm">V</span>
      </div>
      {!collapsed && (
        <span className="font-semibold text-base tracking-tight text-foreground">
          {APP_NAME}
        </span>
      )}
    </Link>
  );
}
