import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { TenantsView } from "@/modules/tenants/ui/views/tenants-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { tenantLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Tenants",
  description: "Manage tenants",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Tenants = async ({ searchParams }: Props) => {
  const params = await tenantLoader(searchParams);

  prefetch(trpc.tenant.list.queryOptions(params));
  prefetch(trpc.tenant.getStats.queryOptions());

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader title="Tenants" subtitle="Manage tenants" />
        <TenantsView />
      </div>
    </HydrateClient>
  );
};

export default Tenants;
