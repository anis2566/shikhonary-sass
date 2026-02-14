/**
 * Simple XSS sanitization for string inputs
 */

/**
 * Sanitizes a string by removing common XSS vectors
 */
export function sanitizeString(input: string): string {
  if (!input) return input;

  return input
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") // Remove script tags
    .replace(/on\w+="[^"]*"/gim, "") // Remove on* attributes
    .replace(/on\w+='[^']*'/gim, "")
    .replace(/javascript:[^"']*/gim, ""); // Remove javascript: pseudo-protocol
}

/**
 * Recursively sanitizes strings in an object or array
 */
export function sanitizeInput<T>(input: T): T {
  if (typeof input === "string") {
    return sanitizeString(input) as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)) as unknown as T;
  }

  if (input !== null && typeof input === "object") {
    const sanitized = { ...input } as any;
    for (const key in sanitized) {
      sanitized[key] = sanitizeInput(sanitized[key]);
    }
    return sanitized;
  }

  return input;
}
