/**
 * Shared logic for ID generation
 */
import { generateShortId } from "./crypto.js";

/**
 * Generates a student ID with year and sequence
 * Format: {PREFIX}-{YEAR}-{SHORT_ID}
 */
export const generateStudentId = (prefix: string = "STU") => {
  const year = new Date().getFullYear().toString().substring(2);
  const suffix = generateShortId(4).toUpperCase();
  return `${prefix}-${year}-${suffix}`;
};

/**
 * Generates a tenant slug from name
 */
export { slugify as generateTenantSlug } from "./string.js";
