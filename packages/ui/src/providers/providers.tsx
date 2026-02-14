"use client";

import * as React from "react";
import { ThemeProvider, type TenantTheme } from "./theme-provider";

export interface ProvidersProps {
    children: React.ReactNode;
    tenantTheme?: TenantTheme;
    defaultTheme?: "light" | "dark" | "system";
    forcedTheme?: "light" | "dark";
}

/**
 * Root provider composition
 * Combines all providers needed by the UI package
 * Apps can simply import and use this single provider
 */
export function Providers({
    children,
    tenantTheme,
    defaultTheme = "system",
    forcedTheme,
}: ProvidersProps) {
    return (
        <ThemeProvider
            tenantTheme={tenantTheme}
            defaultTheme={defaultTheme}
            forcedTheme={forcedTheme}
        >
            {children}
        </ThemeProvider>
    );
}
