"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";

// ============================================================================
// AUTH QUERIES
// ============================================================================

/**
 * Hook for getting the current session
 */
export function useSession() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.auth.getSession.queryOptions());
}
