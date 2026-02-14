import { useEffect, useRef } from "react";

/**
 * Hook for detecting clicks outside of an element
 * @param handler - Callback function to execute on outside click
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    handler: (event: MouseEvent | TouchEvent) => void
) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref?.current;

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [handler]);

    return ref;
}
