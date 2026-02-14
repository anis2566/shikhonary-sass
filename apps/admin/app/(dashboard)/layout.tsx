import * as React from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-mesh min-h-screen flex flex-col relative z-10">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-10 scroll-smooth overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto space-y-10">{children}</div>
          <footer className="mt-16 text-center text-xs font-medium text-muted-foreground/60 pb-6">
            © 2024 Shikhonary Systems Inc. All rights reserved.
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
