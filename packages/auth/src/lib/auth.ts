import { betterAuth, type Auth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getAuthConfig } from "./auth-config";

const config = getAuthConfig();

/**
 * Better Auth Server Instance
 */
export const auth: Auth = betterAuth({
  ...config,
  plugins: [nextCookies()],
  emailAndPassword: {
    ...config.emailAndPassword,
    enabled: true,
  },
  emailVerification: {
    ...config.emailVerification,
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
