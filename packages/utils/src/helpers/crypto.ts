import { randomUUID } from "crypto";

/**
 * Generates a cryptographically secure random token (UUID).
 * FIXED: Replaced Math.random() with Node's crypto.randomUUID().
 */
export const generateRandomToken = () => {
  return randomUUID();
};

/**
 * Generates a shorter random string for IDs or slugs.
 */
export const generateShortId = (length = 8) => {
  return randomUUID().replace(/-/g, "").substring(0, length);
};
