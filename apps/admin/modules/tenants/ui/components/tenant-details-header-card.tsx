import {
  Building2,
  Globe,
  ExternalLink,
  AlertCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import { Tenant } from "@workspace/db";

import { TENANT_SUBSCRIPTION_STATUS, TENANT_TYPE } from "@workspace/utils";

interface TenantWithRelation extends Tenant {
  subscription: {
    status: string;
    plan: {
      name: string;
    };
  } | null;
}

interface TenantDetailsHeaderCardProps {
  tenant: TenantWithRelation;
}

export const TenantDetailsHeaderCard = ({
  tenant,
}: TenantDetailsHeaderCardProps) => {
  const typeLabels: Record<TENANT_TYPE, string> = {
    SCHOOL: "School",
    COACHING_CENTER: "Coaching Center",
    INDIVIDUAL: "Individual",
    TRAINING_CENTER: "Training Center",
    OTHER: "Other",
  };

  const statusColors: Record<
    TENANT_SUBSCRIPTION_STATUS,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    TRIAL: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    ACTIVE: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    PAST_DUE: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    CANCELED: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      icon: <XCircle className="w-4 h-4" />,
    },
    EXPIRED: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft transition-all duration-300 hover:shadow-medium group">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="relative group/logo">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-primary/0 rounded-2xl blur-sm group-hover/logo:blur-md transition-all duration-500" />
              <div className="relative w-20 h-20 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center overflow-hidden shadow-soft group-hover/logo:shadow-medium transition-all duration-500">
                {tenant.logo ? (
                  <Image
                    src={tenant.logo}
                    alt={tenant.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/logo:scale-110"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-primary/40 group-hover/logo:text-primary transition-colors duration-500" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                  {tenant.name}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 font-bold text-[10px] uppercase tracking-wider rounded-md px-2 py-1 h-6"
                >
                  {typeLabels[tenant.type as TENANT_TYPE]}
                </Badge>
                {!tenant.isActive || tenant.isSuspended ? (
                  <Badge
                    variant="destructive"
                    className="font-bold text-[10px] uppercase tracking-widest rounded-md px-2 py-1 h-6"
                  >
                    Suspended
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-bold text-[10px] uppercase tracking-widest rounded-md px-2 py-1 h-6 hover:bg-green-500/20 transition-all">
                    Active
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed font-medium">
                {tenant.description ||
                  "Building the future of education with shikhonary's advanced platform tools."}
              </p>

              <div className="flex items-center gap-6 pt-1 flex-wrap justify-center md:justify-start">
                <div className="flex items-center gap-2 group/link">
                  <div className="p-1.5 bg-muted rounded-lg border border-border/50 group-hover/link:bg-primary/10 group-hover/link:border-primary/20 transition-all duration-300">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover/link:text-primary" />
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground tracking-tight group-hover/link:text-foreground transition-colors">
                    {tenant.subdomain}.shikhonary.com
                  </span>
                </div>

                {tenant.customDomain && tenant.customDomainVerified && (
                  <a
                    href={`https://${tenant.customDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group/domain hover:no-underline"
                  >
                    <div className="p-1.5 bg-muted rounded-lg border border-border/50 group-hover/domain:bg-green-500/10 group-hover/domain:border-green-500/20 transition-all duration-300">
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/domain:text-green-500" />
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground tracking-tight group-hover/domain:text-foreground transition-colors underline decoration-dotted decoration-muted-foreground/30 underline-offset-4 group-hover/domain:decoration-green-500/50">
                      {tenant.customDomain}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/30 backdrop-blur-sm border border-border/50 rounded-2xl p-4 lg:p-6 flex flex-row lg:flex-col gap-4 items-center justify-between lg:justify-center min-w-[240px] shadow-soft group-hover:border-primary/10 transition-colors">
            <div className="space-y-1 lg:text-center w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none">
                Current Plan
              </p>
              <div className="flex items-center lg:justify-center gap-2 pt-1">
                <div
                  className={cn(
                    "size-2 rounded-full animate-pulse shadow-glow",
                    tenant.subscription?.plan?.name === "FREE"
                      ? "bg-muted-foreground"
                      : "bg-primary",
                  )}
                />
                <span className="text-xl font-black tracking-tighter uppercase italic">
                  {tenant.subscription?.plan?.name || "FREE"}
                </span>
              </div>
            </div>

            <div className="h-full w-px lg:w-full lg:h-px bg-border/50" />

            <div className="space-y-2 w-full">
              <Badge
                className={cn(
                  "w-full justify-center gap-2 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all duration-300",
                  statusColors[
                    tenant.subscription?.status as TENANT_SUBSCRIPTION_STATUS
                  ].bg,
                  statusColors[
                    tenant.subscription?.status as TENANT_SUBSCRIPTION_STATUS
                  ].text,
                  "shadow-soft group-hover:shadow-glow",
                )}
              >
                {
                  statusColors[
                    tenant.subscription?.status as TENANT_SUBSCRIPTION_STATUS
                  ].icon
                }
                {tenant.subscription?.status?.replace("_", " ")}
              </Badge>
              {tenant.subscription?.status === "TRIAL" && (
                <p className="text-[9px] font-black uppercase text-center tracking-widest text-amber-500 animate-pulse">
                  Trial version enabled
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
