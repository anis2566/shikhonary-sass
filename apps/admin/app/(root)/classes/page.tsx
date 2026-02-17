import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { ClassesView } from "@/modules/academic-class/ui/views/classes-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { academicClassLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Classes",
  description: "Classes",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Classes = async ({ searchParams }: Props) => {
  const params = await academicClassLoader(searchParams);

  prefetch(trpc.academicClass.getStats.queryOptions());
  prefetch(trpc.academicClass.list.queryOptions(params));

  return (
    <HydrateClient>
      <DashboardHeader title="Classes" subtitle="Manage academic classes" />
      <ClassesView />
    </HydrateClient>
  );
};

export default Classes;
