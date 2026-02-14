/**
 * Design Tokens - Standardized Tailwind class presets
 * Extracted from batch module to ensure consistent design language across all modules
 */

/**
 * Page Layout Tokens
 */
export const pageTokens = {
    root: "min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative",
    content: "relative z-10 p-4 lg:p-6 max-w-[1600px] mx-auto w-full",
} as const;

/**
 * Sticky Header Tokens
 */
export const headerTokens = {
    sticky:
        "sticky top-0 z-30 pt-4 px-4 lg:pt-6 lg:px-6 pb-4 bg-background/60 backdrop-blur-xl border-b border-primary/5 shadow-sm shadow-primary/[0.02]",
    title:
        "text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent",
    subtitle: "text-sm lg:text-base text-muted-foreground mt-1",
} as const;

/**
 * Card Tokens - Glassmorphism System
 */
export const cardTokens = {
    // Base glass card with dual-layer dark mode
    glass:
        "bg-gradient-to-br from-card via-card to-card backdrop-blur-xl dark:from-slate-900/90 dark:via-slate-800/50 dark:to-slate-900/90 border border-primary/10 dark:border-primary/30 shadow-lg dark:shadow-2xl dark:shadow-primary/5 transition-all duration-300 rounded-xl",

    // Glass card with hover effects
    glassHover:
        "hover:shadow-2xl hover:shadow-primary/15 dark:hover:shadow-primary/20 hover:-translate-y-1 dark:hover:border-primary/50",

    // Glass card selected state
    glassSelected:
        "ring-2 ring-primary dark:ring-primary/70 bg-primary/5 dark:bg-primary/10 shadow-xl shadow-primary/10 dark:shadow-primary/20",

    // Form card
    form:
        "bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-primary/10 dark:border-slate-800 shadow-xl overflow-hidden rounded-2xl",

    // Filter card
    filter: "bg-card/60 backdrop-blur-xl border border-primary/10 shadow-lg rounded-xl",

    // Entity card (for list items)
    entity:
        "bg-gradient-to-br from-card via-card to-card dark:from-slate-900/90 dark:via-slate-800/50 border-primary/10 dark:border-primary/30 shadow-lg dark:shadow-2xl rounded-xl overflow-hidden",
} as const;

/**
 * Stat Card Tokens (by color variant)
 */
export const statCardTokens = {
    primary: {
        card: "bg-gradient-to-br from-card via-card to-card dark:from-slate-900/90 dark:via-slate-800/60 backdrop-blur-xl border-primary/10 dark:border-primary/30 shadow-xl dark:shadow-primary/10 rounded-2xl overflow-hidden",
        glow: "absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl",
        shine: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent",
    },
    emerald: {
        card: "bg-gradient-to-br from-card via-card to-card dark:from-slate-900/90 dark:via-slate-800/60 backdrop-blur-xl border-emerald-500/10 dark:border-emerald-500/30 shadow-xl dark:shadow-emerald-500/10 rounded-2xl overflow-hidden",
        glow: "absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-3xl",
        shine: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent",
    },
    red: {
        card: "bg-gradient-to-br from-card via-card to-card dark:from-slate-900/90 dark:via-slate-800/60 backdrop-blur-xl border-red-500/10 dark:border-red-500/30 shadow-xl dark:shadow-red-500/10 rounded-2xl overflow-hidden",
        glow: "absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-3xl",
        shine: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/30 to-transparent",
    },
    blue: {
        card: "bg-gradient-to-br from-card via-card to-card dark:from-slate-900/90 dark:via-slate-800/60 backdrop-blur-xl border-blue-500/10 dark:border-blue-500/30 shadow-xl dark:shadow-blue-500/10 rounded-2xl overflow-hidden",
        glow: "absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl",
        shine: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent",
    },
    amber: {
        card: "bg-gradient-to-br from-card via-card to-card dark:from-slate-900/90 dark:via-slate-800/60 backdrop-blur-xl border-amber-500/10 dark:border-amber-500/30 shadow-xl dark:shadow-amber-500/10 rounded-2xl overflow-hidden",
        glow: "absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/20 dark:bg-amber-500/30 rounded-full blur-3xl",
        shine: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent",
    },
} as const;

/**
 * Form Tokens
 */
export const formTokens = {
    sectionHeader:
        "bg-primary/[0.03] dark:bg-primary/[0.02] border-b border-primary/10 dark:border-slate-800 py-6 px-6",
    sectionTitle: "text-xl font-bold text-foreground dark:text-slate-100",
    sectionDescription: "text-sm text-muted-foreground dark:text-slate-400 mt-1",

    inputField:
        "h-11 bg-background/50 dark:bg-slate-950/50 border-muted-foreground/10 dark:border-slate-800 focus:border-primary/40 focus:ring-primary/10 transition-all font-medium rounded-xl",

    label: "text-sm font-medium text-foreground dark:text-slate-200",
    description: "text-xs text-muted-foreground dark:text-slate-400",
    error: "text-xs text-destructive",
} as const;

/**
 * Filter Tokens
 */
export const filterTokens = {
    card: "bg-card/60 backdrop-blur-xl border border-primary/10 shadow-lg rounded-xl p-4",
    label: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2",

    pill: "pl-2.5 pr-1 h-7 rounded-lg flex gap-1.5 items-center transition-all shadow-sm text-xs font-medium",
    pillPrimary: "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground border border-primary/20",
    pillPurple: "bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20",
    pillOrange: "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/20",
} as const;

/**
 * Floating Action Bar Tokens
 */
export const floatingBarTokens = {
    container: "fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-4",
    content:
        "pointer-events-auto bg-background/80 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-2 ring-1 ring-white/10",
} as const;

/**
 * Badge Tokens
 */
export const badgeTokens = {
    active:
        "bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white text-[10px] uppercase font-bold px-2 py-0.5 h-5 border-none shadow-sm rounded-md",
    inactive:
        "bg-muted dark:bg-muted/50 text-muted-foreground dark:text-white/80 text-[10px] uppercase font-bold px-2 py-0.5 h-5 border-none rounded-md",

    // Status badges by color
    success: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
    warning: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20",
    danger: "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/20",
    info: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20",
} as const;

/**
 * Typography Tokens
 */
export const typographyTokens = {
    pageTitle: "text-2xl lg:text-3xl font-bold",
    sectionTitle: "text-xl font-bold dark:text-slate-100",
    cardLabel: "text-[10px] lg:text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-slate-400",
    badgeText: "text-[10px] uppercase font-bold tracking-wider",
    buttonText: "text-xs uppercase tracking-wider font-bold",
    statValue: "text-xl lg:text-3xl font-black tracking-tighter",
    statLabel: "text-xs lg:text-sm font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider",
} as const;

/**
 * Result Indicator Tokens
 */
export const resultTokens = {
    indicator:
        "bg-muted/40 dark:bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/5 dark:border-primary/20 shadow-sm dark:shadow-md",
    text: "text-xs font-medium text-muted-foreground dark:text-slate-300",
} as const;

/**
 * Animation Class Tokens (for non-Framer Motion animations)
 */
export const animationTokens = {
    hoverLift: "hover:-translate-y-1 transition-all duration-300",
    iconSpin: "group-hover:rotate-12 transition-transform duration-500",
    fadeIn: "animate-in fade-in duration-500",
    slideUp: "animate-in slide-in-from-bottom-4 duration-500",
} as const;
