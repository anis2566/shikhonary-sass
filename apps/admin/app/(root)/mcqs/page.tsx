import { Metadata } from "next";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { McqsView } from "@/modules/mcq/ui/views/mcqs-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { mcqLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "MCQs",
  description: "Manage your MCQ question bank",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const McqsPage = async ({ searchParams }: Props) => {
  const params = await mcqLoader(searchParams);

  prefetch(trpc.mcq.list.queryOptions(params));
  prefetch(trpc.mcq.getStats.queryOptions({}));
  prefetch(trpc.academicSubject.forSelection.queryOptions({}));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="MCQ Bank"
          subtitle="Manage your question bank"
        />
        <Suspense>
          <McqsView />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default McqsPage;
