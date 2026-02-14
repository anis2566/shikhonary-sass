import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getTenantClientByTenantId, auditStorage } from "@workspace/db";

// ONLY import from context.ts to maintain the branded type chain
import type {
  Context,
  TRPCContext,
  PrismaClient,
  TenantPrismaClient,
} from "./context";
import { rateLimit } from "../middleware/rate-limiter";
import { recordAuditLog, parseTRPCPath } from "../middleware/audit-logger";
import { sanitizeInput } from "../middleware/input-sanitizer";

/**
 * Initialization of tRPC backend
 */
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers.
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export type { Context, TRPCContext, PrismaClient, TenantPrismaClient };

/**
 * Middleware to check if the user is logged in
 */
const isAuthed = t.middleware(({ next, ctx }) => {
  // if (!ctx.user || !ctx.userId) {
  //   throw new TRPCError({ code: "UNAUTHORIZED" });
  // }
  return next({
    ctx: {
      user: ctx.user,
      userId: ctx.userId,
    },
  });
});

/**
 * 2. Protected (authenticated) procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Middleware to check if the user is a SUPER_ADMIN
 */
const isAdmin = t.middleware(({ next, ctx }) => {
  // if (ctx.userRole !== "SUPER_ADMIN" && ctx.userRole !== "ADMIN") {
  //   throw new TRPCError({
  //     code: "FORBIDDEN",
  //     message: "Admin access required",
  //   });
  // }
  return next();
});

/**
 * 3. Admin procedure (Platform-level admin)
 */
export const adminProcedure = protectedProcedure.use(isAdmin);

/**
 * Middleware for Tenant procedures
 */
const isTenantMember = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });

  const membership = await ctx.db.tenantMember.findFirst({
    where: {
      userId: ctx.userId,
      isActive: true,
      tenant: { isActive: true },
    },
    include: { tenant: true },
  });

  if (!membership || !membership.tenant) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Active tenant membership required.",
    });
  }

  const tenantClient = await getTenantClientByTenantId(membership.tenantId);
  if (!tenantClient) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not connect to tenant database.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      tenant: membership.tenant,
      tenantClient: tenantClient as unknown as TenantPrismaClient,
    },
  });
});

/**
 * 4. Tenant procedure
 */
export const tenantProcedure = protectedProcedure.use(isTenantMember);

/**
 * Middleware for Tenant Admin
 */
const isTenantAdmin = t.middleware(({ next, ctx }) => {
  if (ctx.userRole !== "ADMIN" && (ctx as any).membership?.role !== "ADMIN") {
    // Check...
  }
  return next();
});

/**
 * 5. Tenant Admin Procedure
 */
export const tenantAdminProcedure = tenantProcedure.use(isTenantAdmin);

/**
 * Global Mutation Middleware
 */
export const mutationMiddleware = t.middleware(
  async ({ next, ctx, path, type, input }) => {
    if (type !== "mutation") return next();

    if (ctx.userId) rateLimit(ctx.userId);
    const sanitizedInput = sanitizeInput(input);

    // Set the audit context for DB-level automatic auditing
    return auditStorage.run(
      {
        userId: ctx.userId ?? undefined,
        tenantId: ctx.tenant?.id ?? undefined,
        ipAddress:
          ctx.headers.get("x-forwarded-for") ||
          ctx.headers.get("x-real-ip") ||
          undefined,
        userAgent: ctx.headers.get("user-agent") || undefined,
      },
      async () => {
        const result = await next({ ctx });
        return result;
      },
    );
  },
);

/**
 * Base procedure for all mutations
 */
export const baseMutationProcedure = protectedProcedure.use(mutationMiddleware);

/**
 * Base procedure for tenant-level mutations
 */
export const baseTenantMutationProcedure =
  tenantProcedure.use(mutationMiddleware);
