import { useState } from "react";

/**
 * Hook for copying text to clipboard with feedback
 * @returns Tuple of [copiedText, copy function, isCopied boolean]
 */
export function useCopyToClipboard(): [
    string | null,
    (text: string) => Promise<void>,
    boolean
] {
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const copy = async (text: string) => {
        if (!navigator?.clipboard) {
            console.warn("Clipboard not supported");
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            setIsCopied(true);

            // Reset after 2 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.warn("Copy failed:", error);
            setCopiedText(null);
            setIsCopied(false);
        }
    };

    return [copiedText, copy, isCopied];
}
