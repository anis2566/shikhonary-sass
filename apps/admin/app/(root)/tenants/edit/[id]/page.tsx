import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditTenantView } from "@/modules/tenants/ui/views/edit-tenant-view";

export const metadata: Metadata = {
  title: "Edit Tenant",
  description: "Edit tenant details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditTenantPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.tenant.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <EditTenantView tenantId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditTenantPage;
