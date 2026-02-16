import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { NewSubjectView } from "@/modules/academic-subject/ui/views/new-subject-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Subject",
  description: "Create a new academic subject",
};

const NewSubjectPage = async () => {
  prefetch(trpc.academicClass.forSelection.queryOptions());

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="New Subject"
          subtitle="Create a new academic subject"
        />
        <NewSubjectView />
      </div>
    </HydrateClient>
  );
};

export default NewSubjectPage;
