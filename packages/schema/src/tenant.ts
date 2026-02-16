import { z } from "zod";
import {
  TENANT_TYPE,
  TENANT_DATABASE_STATUS,
} from "@workspace/utils/constants";
import {
  nameSchema,
  emailSchema,
  bdPhoneSchema,
  slugSchema,
  urlSchema,
  addressSchema,
  citySchema,
  stateSchema,
  postalCodeSchema,
  uuidSchema,
  metadataSchema,
} from "./shared/fields";

/**
 * Tenant Schema
 */

export const tenantFormSchema = z.object({
  // Basic Info
  name: nameSchema,
  slug: slugSchema,
  description: z.string().max(500).optional().or(z.literal("")),
  logo: urlSchema.optional().or(z.literal("")),
  type: z.nativeEnum(TENANT_TYPE),

  // Contact Info
  email: emailSchema,
  phone: bdPhoneSchema,
  address: addressSchema,
  city: citySchema,
  state: stateSchema,
  postalCode: postalCodeSchema,

  // Domain Configuration
  subdomain: slugSchema.optional().or(z.literal("")),
  customDomain: z.string().max(100).optional().or(z.literal("")),

  // Subscription Settings (Overrides)
  planId: uuidSchema.optional().nullable(),
  customStudentLimit: z.coerce.number().int().min(1).optional().nullable(),
  customTeacherLimit: z.coerce.number().int().min(1).optional().nullable(),
  customExamLimit: z.coerce.number().int().min(1).optional().nullable(),
  customStorageLimit: z.coerce.number().int().min(1).optional().nullable(),

  // Academic Settings
  currentAcademicYear: z.string().max(20).optional().or(z.literal("")),

  // Status
  isActive: z.boolean().default(true),
  isSuspended: z.boolean().default(false),
  suspendReason: z.string().optional().nullable(),
  metadata: metadataSchema,
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;

export const defaultTenantValues: Partial<TenantFormValues> = {
  name: "",
  slug: "",
  description: "",
  type: TENANT_TYPE.SCHOOL,
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  isActive: true,
  isSuspended: false,
  metadata: {},
};

export const updateTenantSchema = tenantFormSchema.partial();

export const tenantSchema = tenantFormSchema.extend({
  id: uuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  studentCount: z.number().default(0),
  teacherCount: z.number().default(0),
  examCount: z.number().default(0),
  storageUsedMB: z.number().default(0),
  databaseStatus: z.nativeEnum(TENANT_DATABASE_STATUS),
});

export type Tenant = z.infer<typeof tenantSchema>;

/**
 * Specific schemas for different tenant types if needed
 */
export const schoolTypeSchema = tenantFormSchema.extend({
  currentAcademicYear: z
    .string()
    .min(4, "Academic year is required for schools"),
});
