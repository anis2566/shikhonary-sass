import type { Variants, Transition } from "framer-motion";

/**
 * Standardized Framer Motion animation presets
 * Extracted from batch module to ensure consistent animations across all modules
 */

/**
 * Page-level fade-in animation
 * Used for headers, main content areas
 */
export const pageFadeIn: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

/**
 * Card stagger animation
 * Used for stat cards, entity cards in lists
 */
export const cardStagger = {
    container: {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    },
} as const;

/**
 * Section reveal animation
 * Used for collapsible sections, filters
 */
export const sectionReveal: Variants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
};

/**
 * Bulk action bar slide-up animation
 * Used for floating action bars
 */
export const bulkBarSlide: Variants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
};

/**
 * Spring transition for bulk bar
 */
export const bulkBarTransition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
};

/**
 * Progress bar animation
 * Used for capacity bars, loading indicators
 */
export const progressBar = (percent: number): Variants => ({
    initial: { width: 0 },
    animate: { width: `${percent}%` },
});

/**
 * Progress bar transition
 */
export const progressTransition: Transition = {
    duration: 1,
    ease: "easeOut",
};

/**
 * Modal/Dialog animations
 */
export const modalOverlay: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const modalContent: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
};

/**
 * List item animations
 */
export const listItem: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

/**
 * Slide in from right (for sheets/drawers)
 */
export const slideInRight: Variants = {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
};

/**
 * Slide in from bottom (for mobile sheets)
 */
export const slideInBottom: Variants = {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
};

/**
 * Scale animation (for popovers, tooltips)
 */
export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

/**
 * Fade in with slight scale
 */
export const fadeInScale: Variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
};

/**
 * Accordion content animation
 */
export const accordionContent: Variants = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
};

/**
 * Standard transition presets
 */
export const transitions = {
    fast: { duration: 0.2, ease: "easeOut" },
    normal: { duration: 0.3, ease: "easeOut" },
    slow: { duration: 0.5, ease: "easeOut" },
    spring: { type: "spring", stiffness: 300, damping: 30 },
    springBouncy: { type: "spring", stiffness: 400, damping: 25 },
    springSmooth: { type: "spring", stiffness: 200, damping: 35 },
} as const;

/**
 * Stagger configurations
 */
export const staggerConfigs = {
    fast: { staggerChildren: 0.05 },
    normal: { staggerChildren: 0.1 },
    slow: { staggerChildren: 0.15 },
} as const;

/**
 * Helper function to create custom stagger animation
 */
export function createStagger(delay: number = 0.1) {
    return {
        container: {
            animate: {
                transition: {
                    staggerChildren: delay,
                },
            },
        },
        item: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
        },
    };
}

/**
 * Helper function to create custom fade animation
 */
export function createFade(direction: "up" | "down" | "left" | "right" = "up", distance: number = 20): Variants {
    const directionMap = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
    };

    return {
        initial: { opacity: 0, ...directionMap[direction] },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: { opacity: 0, ...directionMap[direction] },
    };
}
