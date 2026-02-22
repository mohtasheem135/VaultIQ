"use client";

import { NAV_ITEMS } from "@/constants";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import { UserMenu } from "./UserMenu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  className?: string;
  onNavClick?: () => void;
};

export function Sidebar({ className, onNavClick }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-background border-r",
        className
      )}
    >
      {/* Logo */}
      <div className="px-4 py-5">
        <Logo />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            description={item.description}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <Separator />

      {/* User Menu at bottom */}
      <div className="px-3 py-4">
        <UserMenu />
      </div>
    </aside>
  );
}
