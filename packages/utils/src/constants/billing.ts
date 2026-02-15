import { enumToOptions } from "../enum-utils";

/**
 * Pricing tiers for subscriptions
 */
export enum TENANT_SUBSCRIPTION_PLAN {
  FREE = "FREE",
  STARTER = "STARTER",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

/**
 * Subscription lifecycle status
 */
export enum TENANT_SUBSCRIPTION_STATUS {
  TRIAL = "TRIAL",
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

/**
 * Payment frequency
 */
export enum BILLING_CYCLE {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

/**
 * Supported payment gateways
 */
export enum PAYMENT_PROVIDER {
  SSLCOMMERZ = "SSLCOMMERZ",
  BKASH = "BKASH",
  NAGAD = "NAGAD",
  STRIPE = "STRIPE",
  MANUAL = "MANUAL",
}

export const subscriptionTierOptions = [
  {
    value: TENANT_SUBSCRIPTION_PLAN.FREE,
    label: "Free",
    description: "Basic features for small groups",
  },
  {
    value: TENANT_SUBSCRIPTION_PLAN.STARTER,
    label: "Starter",
    description: "Essential tools for growing centers",
  },
  {
    value: TENANT_SUBSCRIPTION_PLAN.PRO,
    label: "Pro",
    description: "Advanced features for professional institutions",
  },
  {
    value: TENANT_SUBSCRIPTION_PLAN.ENTERPRISE,
    label: "Enterprise",
    description: "Custom solutions for large organizations",
  },
] as const;

export const subscriptionStatusOptions = enumToOptions(
  TENANT_SUBSCRIPTION_STATUS,
);
export const billingCycleOptions = enumToOptions(BILLING_CYCLE);
export const paymentProviderOptions = enumToOptions(PAYMENT_PROVIDER);
