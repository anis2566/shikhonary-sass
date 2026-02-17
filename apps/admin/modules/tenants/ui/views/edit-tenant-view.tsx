import { EditTenantForm } from "../form/edit-tenant-form";

interface EditTenantViewProps {
  tenantId: string;
}

export const EditTenantView = ({ tenantId }: EditTenantViewProps) => {
  return <EditTenantForm tenantId={tenantId} />;
};
