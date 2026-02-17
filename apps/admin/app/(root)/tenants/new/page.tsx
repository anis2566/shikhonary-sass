import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";

import { NewTenantView } from "@/modules/tenants/ui/views/new-tenant-view";

export const metadata: Metadata = {
  title: "New Tenant",
  description: "Create a new tenant",
};

const NewTenant = async () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <NewTenantView />
      </div>
    </HydrateClient>
  );
};

export default NewTenant;
