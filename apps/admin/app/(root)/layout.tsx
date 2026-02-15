import { DashboardLayout } from "@/modules/layout/ui/layout/dashboard-layout";

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: RootLayoutProps) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
