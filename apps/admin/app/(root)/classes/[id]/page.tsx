import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { ClassView } from "@/modules/academic-class/ui/views/class-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Class",
  description: "View academic class details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const ClassViewPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicClass.getById.queryOptions({ id }));
  prefetch(trpc.academicClass.getDetailedStats.queryOptions({ id }));
  prefetch(trpc.academicClass.getStatisticsData.queryOptions({ id }));
  prefetch(
    trpc.academicClass.getRecentTopics.queryOptions({
      classId: id,
      limit: 4,
    }),
  );

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="Class" subtitle="View academic class details" />
        <ClassView classId={id} />
      </div>
    </HydrateClient>
  );
};

export default ClassViewPage;
