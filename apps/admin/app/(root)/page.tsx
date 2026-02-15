import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export default async function Page() {
  console.log("done");
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" subtitle="Welcome back, Super Admin" />
    </div>
  );
}
