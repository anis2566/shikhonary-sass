import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { SubjectsView } from "@/modules/academic-subject/ui/views/subjects-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { academicSubjectLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Subjects",
  description: "Manage academic subjects",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Subjects = async ({ searchParams }: Props) => {
  const params = await academicSubjectLoader(searchParams);

  prefetch(trpc.academicSubject.list.queryOptions(params));
  prefetch(
    trpc.academicSubject.getStats.queryOptions({ classId: params.classId }),
  );

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="Subjects" subtitle="Manage academic subjects" />
        <SubjectsView />
      </div>
    </HydrateClient>
  );
};

export default Subjects;
