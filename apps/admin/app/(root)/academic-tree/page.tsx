import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { AcademicTreeView } from "@/modules/academic-tree/ui/views/academic-tree-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Academic Tree",
  description: "View the complete academic hierarchy",
};

const AcademicTreePage = async () => {
  prefetch(trpc.academicTree.getHierarchy.queryOptions());
  prefetch(trpc.academicTree.getCounts.queryOptions());

  return (
    <HydrateClient>
      <DashboardHeader
        title="Academic Tree"
        subtitle="Browse the complete academic hierarchy"
      />
      <AcademicTreeView />
    </HydrateClient>
  );
};

export default AcademicTreePage;
