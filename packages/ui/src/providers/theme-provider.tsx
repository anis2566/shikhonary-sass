"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from "next-themes";

/**
 * Tenant theme configuration
 */
export interface TenantTheme {
    primary: string; // OKLCH: "oklch(0.55 0.12 185)"
    accent: string; // OKLCH: "oklch(0.7 0.2 35)"
    radius: string; // "0.75rem" | "0.5rem" | "1rem"
    font: string; // "Inter" | "Poppins" | "Outfit"
}

/**
 * Default theme (Ocean - teal-cyan)
 */
export const DEFAULT_THEME: TenantTheme = {
    primary: "oklch(0.55 0.12 185)", // teal-cyan
    accent: "oklch(0.7 0.2 35)", // warm coral
    radius: "0.75rem",
    font: "Inter",
};

/**
 * Preset theme palettes
 */
export const THEME_PRESETS = {
    ocean: DEFAULT_THEME,
    royal: {
        primary: "oklch(0.5 0.15 280)", // indigo
        accent: "oklch(0.65 0.18 45)", // gold
        radius: "0.75rem",
        font: "Inter",
    },
    forest: {
        primary: "oklch(0.5 0.12 145)", // green
        accent: "oklch(0.7 0.15 85)", // lime
        radius: "0.75rem",
        font: "Inter",
    },
    sunset: {
        primary: "oklch(0.6 0.18 25)", // red-orange
        accent: "oklch(0.7 0.2 310)", // pink
        radius: "0.75rem",
        font: "Inter",
    },
    midnight: {
        primary: "oklch(0.45 0.1 260)", // deep blue
        accent: "oklch(0.65 0.2 195)", // cyan
        radius: "0.75rem",
        font: "Inter",
    },
} as const;

/**
 * Component for applying tenant color overrides
 */
function TenantColorOverride({
    theme,
    children,
}: {
    theme: TenantTheme;
    children: React.ReactNode;
}) {
    React.useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--color-primary", theme.primary);
        root.style.setProperty("--color-accent", theme.accent);
        root.style.setProperty("--radius-lg", theme.radius);

        // Apply font if specified
        if (theme.font) {
            root.style.setProperty("--font-family", theme.font);
        }
    }, [theme]);

    return <>{children}</>;
}

export interface ThemeProviderProps extends Omit<NextThemesProviderProps, "children"> {
    children: React.ReactNode;
    tenantTheme?: TenantTheme;
}

/**
 * Centralized theme provider combining next-themes dark/light mode
 * with optional per-tenant color override
 */
export function ThemeProvider({
    children,
    tenantTheme,
    defaultTheme = "system",
    ...props
}: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme={defaultTheme}
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            {...props}
        >
            {tenantTheme ? (
                <TenantColorOverride theme={tenantTheme}>{children}</TenantColorOverride>
            ) : (
                children
            )}
        </NextThemesProvider>
    );
}
