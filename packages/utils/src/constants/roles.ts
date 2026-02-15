import { enumToOptions } from "../enum-utils";

/**
 * Global application roles
 */
export enum ROLE {
  USER = "USER",
  TENANT_ADMIN = "TENANT_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

/**
 * Tenant-scoped roles for members
 */
export enum TENANT_MEMBER_ROLE {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export const roleOptions = enumToOptions(ROLE);
export const tenantMemberRoleOptions = enumToOptions(TENANT_MEMBER_ROLE);
