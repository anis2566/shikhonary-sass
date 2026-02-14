import { createTRPCRouter, publicProcedure } from "../trpc";
import { auth } from "@workspace/auth";
import { type TRPCRouterRecord } from "@trpc/server";

/**
 * Auth Router (Thin wrapper around better-auth)
 */
export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return await auth.api.getSession({ headers: ctx.headers });
  }),
} satisfies TRPCRouterRecord);
