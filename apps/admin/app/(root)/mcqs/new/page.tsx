import { Metadata } from "next";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { NewMcqView } from "@/modules/mcq/ui/views/new-mcq-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Create MCQ",
  description: "Add a new multiple choice question to the bank",
};

const NewMcqPage = async () => {
  prefetch(trpc.academicSubject.forSelection.queryOptions({}));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Create MCQ"
          subtitle="Add a new question to the bank"
        />
        <Suspense>
          <NewMcqView />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default NewMcqPage;
