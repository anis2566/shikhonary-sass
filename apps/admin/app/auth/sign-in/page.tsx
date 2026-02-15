import type { Metadata } from "next";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

export const metadata: Metadata = {
  title: "Sign In | Shikhonary Admin",
  description: "Sign in to Shikhonary admin dashboard",
};

export default function SignInPage() {
  return <SignInView />;
}
