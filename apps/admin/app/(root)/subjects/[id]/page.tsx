import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { SubjectView } from "@/modules/academic-subject/ui/views/subject-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Subject Details",
  description: "View academic subject details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const SubjectViewPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicSubject.getById.queryOptions({ id }));
  prefetch(trpc.academicSubject.getDetailedStats.queryOptions({ id }));
  prefetch(trpc.academicSubject.getStatisticsData.queryOptions({ id }));
  prefetch(
    trpc.academicSubject.getRecentChapters.queryOptions({
      subjectId: id,
      limit: 4,
    }),
  );

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Subject"
          subtitle="View academic subject details"
        />
        <SubjectView subjectId={id} />
      </div>
    </HydrateClient>
  );
};

export default SubjectViewPage;
