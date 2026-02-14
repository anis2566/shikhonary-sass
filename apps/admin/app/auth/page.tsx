import { AuthView } from "@/modules/auth/ui/views/auth-view";
import { ThemeToggle } from "@workspace/ui/composite/theme-toggle";

export const metadata = {
  title: "Authenticate | Shikhonary Admin",
  description: "Access the Shikhonary Global Control Center",
};

export default function AuthPage() {
  return (
    <>
      <ThemeToggle />
      <AuthView />
    </>
  );
}
