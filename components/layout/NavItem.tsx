"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  onClick?: () => void;
};

export function NavItem({
  href,
  label,
  icon: Icon,
  onClick,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        "hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
          : "text-muted-foreground"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-indigo-500" : "text-muted-foreground"
        )}
      />
      {label}
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
      )}
    </Link>
  );
}
