import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { SubTopicView } from "@/modules/academic-sub-topic/ui/views/sub-topic-view";

export const metadata: Metadata = {
  title: "Sub-Topic Details",
  description: "View academic sub-topic details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const SubTopic = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicSubTopic.getById.queryOptions({ id }));
  prefetch(trpc.academicSubTopic.getDetailedStats.queryOptions({ id }));
  prefetch(trpc.academicSubTopic.getStatisticsData.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Sub-Topic Details"
          subtitle="Overview and statistics for this sub-topic"
        />
        <SubTopicView subTopicId={id} />
      </div>
    </HydrateClient>
  );
};

export default SubTopic;
