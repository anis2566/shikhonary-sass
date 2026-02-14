import { z } from "zod";

/**
 * Roles supported by the system.
 */
export type Role = "USER" | "TENANT_ADMIN" | "SUPER_ADMIN";

/**
 * Zod schema for Role
 */
export const RoleSchema = z.enum(["USER", "TENANT_ADMIN", "SUPER_ADMIN"]);

/**
 * Permission types
 */
export type Permission =
  | "manage:tenants"
  | "manage:users"
  | "manage:billing"
  | "manage:exams"
  | "view:analytics"
  | "take:exams";

/**
 * Role to Permission mapping
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "manage:tenants",
    "manage:users",
    "manage:billing",
    "manage:exams",
    "view:analytics",
    "take:exams",
  ],
  TENANT_ADMIN: [
    "manage:users",
    "manage:billing",
    "manage:exams",
    "view:analytics",
    "take:exams",
  ],
  USER: ["take:exams", "view:analytics"],
};

/**
 * Check if a role has a specific permission
 */
export const can = (
  role: string | undefined | null,
  permission: Permission,
): boolean => {
  const result = RoleSchema.safeParse(role);
  if (!result.success) return false;
  const typedRole = result.data as Role;
  const permissions = ROLE_PERMISSIONS[typedRole];
  return permissions?.includes(permission) || false;
};

/**
 * Check if a user is a super admin
 */
export const isSuperAdmin = (role: string | undefined | null): boolean => {
  return role === "SUPER_ADMIN";
};
