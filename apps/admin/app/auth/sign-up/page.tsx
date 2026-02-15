import type { Metadata } from "next";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

export const metadata: Metadata = {
  title: "Sign Up | Shikhonary Admin",
  description: "Create an account for Shikhonary admin dashboard",
};

export default function SignUpPage() {
  return <SignUpView />;
}
