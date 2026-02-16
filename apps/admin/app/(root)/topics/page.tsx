import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { TopicsView } from "@/modules/academic-topic/ui/views/topics-view";
import { academicTopicLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Topics",
  description: "Manage academic topics",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Topics = async ({ searchParams }: Props) => {
  const params = await academicTopicLoader(searchParams);

  // prefetch(trpc.academicTopic.getStats.queryOptions());
  prefetch(trpc.academicTopic.list.queryOptions(params));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="Topics" subtitle="Manage academic topics" />
        <TopicsView />
      </div>
    </HydrateClient>
  );
};

export default Topics;
