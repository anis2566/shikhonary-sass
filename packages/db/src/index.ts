export * from "./client";
export * from "./tenant-client";
export * from "./health";
export * from "./extensions/audit";

// Export master client types
export * from "../master-client-types/client";

// Export tenant client types as a separate namespace
export type * as TenantTypes from "../tenant-client-types/client";
export {
  Prisma as TenantPrisma,
  PrismaClient as TenantPrismaClient,
} from "../tenant-client-types/client";
