import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { TenantView } from "@/modules/tenants/ui/views/tenant-view";

export const metadata: Metadata = {
  title: "Tenant",
  description: "View tenant details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const TenantViewPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.tenant.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <TenantView tenantId={id} />
      </div>
    </HydrateClient>
  );
};

export default TenantViewPage;
