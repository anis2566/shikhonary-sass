import { z } from "zod";

/**
 * Shared field validators used across multiple schemas
 */

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .trim();

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .toLowerCase()
  .trim();

export const bdPhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^01[3-9]\d{8}$/,
    "Invalid Bangladesh phone number (e.g., 01712345678)",
  );

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(50, "Slug must be less than 50 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  )
  .toLowerCase()
  .trim();

export const uuidSchema = z.string().uuid("Invalid unique identifier");

export const urlSchema = z.string().url("Invalid URL").or(z.literal(""));

export const addressSchema = z
  .string()
  .min(1, "Address is required")
  .max(255, "Address must be less than 255 characters");

export const citySchema = z
  .string()
  .min(1, "City is required")
  .max(50, "City must be less than 50 characters");

export const stateSchema = z
  .string()
  .min(1, "State is required")
  .max(50, "State must be less than 50 characters");

export const postalCodeSchema = z
  .string()
  .max(20, "Postal code must be less than 20 characters")
  .optional()
  .or(z.literal(""));

export const timestampSchema = z.date();

export const baseEntitySchema = z.object({
  id: uuidSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const metadataSchema = z.record(z.any()).optional();
