import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewClassView } from "@/modules/academic-class/ui/views/new-class-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Class",
  description: "New Class",
};

const NewClass = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="New Class" subtitle="Create a new class" />
        <NewClassView />
      </div>
    </HydrateClient>
  );
};

export default NewClass;
