import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
    freezeOnceVisible?: boolean;
}

/**
 * Hook for detecting when an element enters the viewport
 * @param options - IntersectionObserver options
 * @returns Tuple of [ref, entry, isIntersecting]
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
    options: UseIntersectionObserverOptions = {}
) {
    const { threshold = 0, root = null, rootMargin = "0%", freezeOnceVisible = false } = options;

    const elementRef = useRef<T | null>(null);
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

    const frozen = entry?.isIntersecting && freezeOnceVisible;

    useEffect(() => {
        const node = elementRef?.current;
        const hasIOSupport = !!window.IntersectionObserver;

        if (!hasIOSupport || frozen || !node) return;

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setEntry(entry);
            }
        }, observerParams);

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [elementRef, threshold, root, rootMargin, frozen]);

    return [elementRef, entry, !!entry?.isIntersecting];
}
