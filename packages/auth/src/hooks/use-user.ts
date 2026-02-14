import { useSession } from "./use-session";

/**
 * Hook to get the current user object.
 */
export function useUser() {
  const { data } = useSession();
  return data?.user || null;
}
