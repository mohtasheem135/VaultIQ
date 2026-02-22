"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Logo } from "./Logo";
import { useUIStore } from "@/lib/stores/ui.store";

export function MobileHeader() {
  const { isSidebarOpen, openSidebar, closeSidebar } = useUIStore();

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-40">
      <Logo />

      <Sheet open={isSidebarOpen} onOpenChange={(open) => (open ? openSidebar() : closeSidebar())}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={openSidebar}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar className="w-full" onNavClick={closeSidebar} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
