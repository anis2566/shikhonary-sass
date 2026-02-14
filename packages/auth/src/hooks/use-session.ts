import { authClient } from "../lib/auth-client";

/**
 * Hook to get the current session and user.
 * Wraps Better Auth's useSession for consistent access.
 */
export const useSession = () => authClient.useSession();
