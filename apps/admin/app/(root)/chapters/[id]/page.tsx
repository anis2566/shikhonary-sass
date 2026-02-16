import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { ChapterView } from "@/modules/academic-chapter/ui/views/chapter-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Chapter",
  description: "View academic chapter details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const ChapterViewPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicChapter.getById.queryOptions({ id }));
  prefetch(trpc.academicChapter.getDetailedStats.queryOptions({ id }));
  prefetch(trpc.academicChapter.getStatisticsData.queryOptions({ id }));
  prefetch(
    trpc.academicChapter.getRecentTopics.queryOptions({
      chapterId: id,
      limit: 4,
    }),
  );

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Chapter"
          subtitle="View academic chapter details"
        />
        <ChapterView chapterId={id} />
      </div>
    </HydrateClient>
  );
};

export default ChapterViewPage;
