"use client";

import * as React from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

export function DashboardHeader() {
  return (
    <header className="h-24 glass-panel sticky top-0 z-20 px-10 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, Super Admin
        </p>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative hidden lg:block group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-shikhonary-teal transition-colors" />
          <Input
            className="pl-11 pr-4 py-2.5 w-72 bg-white/50 dark:bg-black/20 border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-shikhonary-teal/20 focus:border-shikhonary-teal/30 focus:bg-white dark:focus:bg-black transition-all placeholder:text-muted-foreground/60 shadow-sm"
            placeholder="Search tenants, users..."
            type="text"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="relative w-11 h-11 rounded-full bg-white dark:bg-slate-900 border-border/60 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all group"
        >
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-shikhonary-teal" />
          <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 group-hover:scale-110 transition-transform"></span>
        </Button>
      </div>
    </header>
  );
}
