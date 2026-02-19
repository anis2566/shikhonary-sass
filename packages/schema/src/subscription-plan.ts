import { z } from "zod";
import { TENANT_SUBSCRIPTION_PLAN } from "@workspace/utils/constants";
import { nameSchema } from "./shared/fields";

/**
 * Subscription Plan Schema
 * Aligned with Prisma model fields
 */

export const subscriptionPlanFormSchema = z.object({
  name: z.nativeEnum(TENANT_SUBSCRIPTION_PLAN),
  displayName: nameSchema,
  description: z.string().max(500).optional(),

  // Pricing (in cents/paisa)
  monthlyPriceBDT: z.coerce.number().int().min(0, "Price cannot be negative"),
  yearlyPriceBDT: z.coerce.number().int().min(0, "Price cannot be negative"),
  monthlyPriceUSD: z.coerce.number().int().min(0, "Price cannot be negative"),
  yearlyPriceUSD: z.coerce.number().int().min(0, "Price cannot be negative"),

  // Limits (Aligned with Prisma: defaultStudentLimit, etc.)
  defaultStudentLimit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1"),
  defaultTeacherLimit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1"),
  defaultStorageLimit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1"), // in GB
  defaultExamLimit: z.coerce.number().int().min(1, "Limit must be at least 1"),

  features: z.record(z.boolean()),
  isActive: z.boolean(),
  isPopular: z.boolean(),
});

export type SubscriptionPlanFormValues = z.infer<
  typeof subscriptionPlanFormSchema
>;

export const defaultSubscriptionPlanValues: Partial<SubscriptionPlanFormValues> =
  {
    name: TENANT_SUBSCRIPTION_PLAN.STARTER,
    displayName: "",
    description: "",
    monthlyPriceBDT: 0,
    yearlyPriceBDT: 0,
    monthlyPriceUSD: 0,
    yearlyPriceUSD: 0,
    defaultStudentLimit: 100,
    defaultTeacherLimit: 10,
    defaultStorageLimit: 5,
    defaultExamLimit: 50,
    features: {},
    isActive: true,
    isPopular: false,
  };

export const updateSubscriptionPlanSchema =
  subscriptionPlanFormSchema.partial();

export const subscriptionPlanSchema = subscriptionPlanFormSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  planId: z.string().uuid(),
  status: z.string(),
  billingCycle: z.string(),
  pricePerMonth: z.number(),
  pricePerYear: z.number(),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
