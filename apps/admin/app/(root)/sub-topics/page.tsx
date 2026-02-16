import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { SubTopicsView } from "@/modules/academic-sub-topic/ui/views/sub-topics-view";
import { academicSubTopicLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Sub-Topics",
  description: "Manage academic sub-topics",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const SubTopics = async ({ searchParams }: Props) => {
  const params = await academicSubTopicLoader(searchParams);

  // prefetch(trpc.academicSubTopic.getStats.queryOptions());
  prefetch(trpc.academicSubTopic.list.queryOptions(params));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Sub-Topics"
          subtitle="Manage academic sub-topics"
        />
        <SubTopicsView />
      </div>
    </HydrateClient>
  );
};

export default SubTopics;
