import { authClient } from "../lib/auth-client";

/**
 * Hook to access auth actions like signIn, signUp, and signOut.
 */
export function useAuth() {
  return {
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    signOut: authClient.signOut,
    forgetPassword: authClient.requestPasswordReset,
    resetPassword: authClient.resetPassword,
    verifyEmail: authClient.verifyEmail,
  };
}
