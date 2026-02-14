"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "@workspace/ui/components/sonner";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </NextThemesProvider>
  );
}
