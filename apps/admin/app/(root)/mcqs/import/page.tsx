import { Metadata } from "next";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ImportMcqView } from "@/modules/mcq/ui/views/import-mcq-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Import MCQs",
  description: "Bulk import multiple choice questions from JSON",
};

const ImportMcqPage = async () => {
  prefetch(trpc.academicSubject.forSelection.queryOptions({}));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Import MCQs"
          subtitle="Bulk import questions from JSON"
        />
        <Suspense>
          <ImportMcqView />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default ImportMcqPage;
