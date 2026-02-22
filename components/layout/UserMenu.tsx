"use client";

import { useState } from "react";
import { LogOut, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth.actions";
import { useUser } from "@/hooks/useUser";

export function UserMenu() {
  const { user, displayName, initials, isLoading } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-2.5 w-32 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full hover:bg-accent transition-colors text-left group">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-semibold dark:bg-indigo-950 dark:text-indigo-400">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-muted-foreground">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
