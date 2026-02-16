import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { TopicView } from "@/modules/academic-topic/ui/views/topic-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Topic",
  description: "View academic topic details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const TopicViewPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicTopic.getById.queryOptions({ id }));
  prefetch(trpc.academicTopic.getDetailedStats.queryOptions({ id }));
  prefetch(trpc.academicTopic.getStatisticsData.queryOptions({ id }));
  prefetch(
    trpc.academicTopic.getRecentSubTopics.queryOptions({
      topicId: id,
      limit: 4,
    }),
  );

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="Topic" subtitle="View academic topic details" />
        <TopicView topicId={id} />
      </div>
    </HydrateClient>
  );
};

export default TopicViewPage;
