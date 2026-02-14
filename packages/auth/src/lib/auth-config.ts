import { prisma } from "@workspace/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { BetterAuthOptions } from "better-auth";

/**
 * Universal Better Auth configuration
 * This providing the core options and database adapter.
 */
export const getAuthConfig = (): BetterAuthOptions => {
  return {
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
    emailVerification: {
      sendOnSignUp: false,
    },
    user: {
      additionalFields: {
        role: {
          type: "string" as const,
          defaultValue: "USER",
          input: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
    },
  };
};
