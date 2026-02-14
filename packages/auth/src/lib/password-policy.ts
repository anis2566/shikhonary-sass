import { z } from "zod";

/**
 * Zod schema for password validation
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must not exceed 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

/**
 * Validate a password against the policy
 * Returns an error message if invalid, or null if valid.
 */
export const validatePassword = (password: string): string | null => {
  const result = PasswordSchema.safeParse(password);
  if (result.success) return null;
  const firstError = result.error.errors[0];
  return firstError?.message ?? "Invalid password";
};
