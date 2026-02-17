import { format } from "date-fns";
import { CheckCircle2, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { cn } from "@workspace/ui/lib/utils";
import { Tenant } from "@workspace/db";
import { TENANT_DATABASE_STATUS } from "@workspace/utils";

interface TenantDetailsDatabaseProps {
  tenant: Tenant;
}

import { Database } from "lucide-react";

export const TenantDetailsDatabase = ({
  tenant,
}: TenantDetailsDatabaseProps) => {
  const dbStatusConfig: Record<
    TENANT_DATABASE_STATUS,
    { label: string; color: string; icon: React.ReactNode; bgColor: string }
  > = {
    PROVISIONING: {
      label: "Provisioning",
      color: "text-amber-500",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      bgColor: "bg-amber-500/10",
    },
    ACTIVE: {
      label: "Healthy & Active",
      color: "text-green-500",
      icon: <CheckCircle2 className="w-4 h-4" />,
      bgColor: "bg-green-500/10",
    },
    INACTIVE: {
      label: "Maintenance Mode",
      color: "text-blue-500",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      bgColor: "bg-blue-500/10",
    },
  };

  const status =
    dbStatusConfig[tenant.databaseStatus as TENANT_DATABASE_STATUS] ||
    dbStatusConfig.PROVISIONING;

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft group hover:shadow-medium transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4 border-b border-border/50 pb-6">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-soft">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <CardTitle className="text-xl font-black tracking-tight">
            Database Architecture
          </CardTitle>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">
            Isolated tenant-specific data store
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              System Identifier
            </h4>
            <div className="relative group/code">
              <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-sm opacity-0 group-hover/code:opacity-100 transition-opacity" />
              <code className="relative flex items-center justify-between px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-bold font-mono text-primary shadow-inner">
                {tenant.databaseName}
                <div className="size-2 rounded-full bg-primary/30" />
              </code>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Deployment Status
            </h4>
            <div
              className={cn(
                "h-12 flex items-center gap-3 px-4 rounded-xl border border-border/50 transition-all shadow-soft",
                status.bgColor,
              )}
            >
              <div className={status.color}>{status.icon}</div>
              <span
                className={cn(
                  "font-black text-sm tracking-tight",
                  status.color,
                )}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 shadow-soft">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">
              Provisioned
            </p>
            <p className="text-sm font-black text-foreground">
              {format(new Date(tenant.createdAt), "MMM d, yyyy")}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 shadow-soft">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">
              Schema Version
            </p>
            <p className="text-sm font-black text-foreground">v2.4.0-prod</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 shadow-soft">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">
              Last Migration
            </p>
            <p className="text-sm font-black text-foreground">
              {format(new Date(tenant.updatedAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
