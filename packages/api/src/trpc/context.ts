import { auth, User } from "@workspace/auth";
import {
  prisma,
  type Tenant,
  type PrismaClient as BasePrismaClient,
  type TenantPrismaClient as BaseTenantPrismaClient,
} from "@workspace/db";

/**
 * Portability Fix: Define branded types that wrap the complex Prisma types.
 * To prevent internal Prisma runtime symbols from leaking into tRPC declarations (TS2742),
 * we use interfaces that extend the base types.
 *
 * IF the error persists, we can switch to a mapped type that picks only the methods we need,
 * but for now, interfaces with the same name are the first line of defense.
 */
export interface PrismaClient extends BasePrismaClient {}
export interface TenantPrismaClient extends BaseTenantPrismaClient {}

/**
 * Define the context type explicitly.
 */
export interface TRPCContext {
  user: User | null;
  userId: string | null;
  userRole: string | null;
  db: PrismaClient;
  tenant: Tenant | null;
  tenantClient: TenantPrismaClient | null;
  headers: Headers;
}

/**
 * The context for every tRPC request.
 */
export async function createTRPCContext(opts: {
  headers: Headers;
}): Promise<TRPCContext> {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  const user = session?.user ?? null;
  const userId = user?.id ?? null;
  const userRole = (user as any)?.role ?? null;

  return {
    user,
    userId,
    userRole,
    db: prisma as unknown as PrismaClient,
    tenant: null,
    tenantClient: null,
    headers: opts.headers,
  };
}

export type Context = TRPCContext;
