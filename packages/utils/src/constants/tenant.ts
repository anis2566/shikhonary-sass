import { enumToOptions } from "../enum-utils.js";

/**
 * Tenant classification categories
 */
export enum TENANT_TYPE {
  SCHOOL = "SCHOOL",
  COACHING_CENTER = "COACHING_CENTER",
  INDIVIDUAL = "INDIVIDUAL",
  TRAINING_CENTER = "TRAINING_CENTER",
  OTHER = "OTHER",
}

/**
 * Lifecycle status of the tenant's dedicated database
 */
export enum TENANT_DATABASE_STATUS {
  PROVISIONING = "PROVISIONING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const tenantTypeOptions = [
  {
    value: TENANT_TYPE.SCHOOL,
    label: "School",
    description: "General education schools (K-12)",
  },
  {
    value: TENANT_TYPE.COACHING_CENTER,
    label: "Coaching Center",
    description: "Test prep or supplementary education",
  },
  {
    value: TENANT_TYPE.INDIVIDUAL,
    label: "Individual",
    description: "Private tutors or independent instructors",
  },
  {
    value: TENANT_TYPE.TRAINING_CENTER,
    label: "Training Center",
    description: "Vocational or professional training",
  },
  {
    value: TENANT_TYPE.OTHER,
    label: "Other",
    description: "Other educational organizations",
  },
] as const;

export const tenantDatabaseStatusOptions = enumToOptions(
  TENANT_DATABASE_STATUS,
);
