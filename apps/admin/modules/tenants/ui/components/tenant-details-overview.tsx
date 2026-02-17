import {
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Database,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import { SubscriptionPlan, Tenant } from "@workspace/db";

interface TenantWithRelations extends Tenant {
  subscription: {
    plan: SubscriptionPlan;
  } | null;
}

interface TenantDetailsOverviewProps {
  tenant: TenantWithRelations;
}

export const TenantDetailsOverview = ({
  tenant,
}: TenantDetailsOverviewProps) => {
  // Turn features in an array
  const features = Object.entries(
    (tenant.subscription?.plan.features as Record<string, boolean>) || {},
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Info */}
      <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft group hover:shadow-medium transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <Mail className="w-4 h-4" />
            </div>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 pt-2">
            {tenant.email && (
              <div className="flex items-center gap-4 group/item">
                <div className="size-9 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground group-hover/item:text-primary group-hover/item:bg-primary/5 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${tenant.email}`}
                    className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {tenant.email}
                  </a>
                </div>
              </div>
            )}
            {tenant.phone && (
              <div className="flex items-center gap-4 group/item">
                <div className="size-9 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground group-hover/item:text-green-500 group-hover/item:bg-green-500/5 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Phone Number
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {tenant.phone}
                  </span>
                </div>
              </div>
            )}
            {(tenant.address || tenant.city) && (
              <div className="flex items-start gap-4 group/item">
                <div className="size-9 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground group-hover/item:text-blue-500 group-hover/item:bg-blue-500/5 transition-all">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Registered Office
                  </span>
                  <div className="text-sm font-bold text-foreground">
                    {tenant.address && <p>{tenant.address}</p>}
                    <p className="text-muted-foreground font-medium">
                      {[tenant.city, tenant.state, tenant.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft group hover:shadow-medium transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <Database className="w-4 h-4" />
            </div>
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 pt-2">
            {[
              {
                label: "Students",
                value: tenant.studentCount,
                icon: GraduationCap,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                label: "Teachers",
                value: tenant.teacherCount,
                icon: Users,
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                label: "Exams",
                value: tenant.examCount,
                icon: FileText,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                label: "Storage",
                value: (tenant.storageUsedMB / 1024).toFixed(1) + " GB",
                icon: Database,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-all hover:bg-muted/50 group/stat"
              >
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center transition-transform group-hover/stat:-translate-y-1",
                    stat.bg,
                    stat.color,
                  )}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="size-fit text-2xl font-black tracking-tighter text-foreground group-hover/stat:text-primary transition-colors">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      {tenant.metadata && Object.keys(tenant.metadata).length > 0 && (
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft group hover:shadow-medium transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                <FileText className="w-4 h-4" />
              </div>
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/50 bg-muted/20 border border-border/50 rounded-2xl overflow-hidden">
              {tenant.currentAcademicYear && (
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                    Academic Year
                  </span>
                  <Badge
                    variant="outline"
                    className="font-bold text-xs rounded-lg border-primary/20 text-primary bg-primary/5"
                  >
                    {tenant.currentAcademicYear}
                  </Badge>
                </div>
              )}
              {Object.entries(tenant.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {value as string}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft group hover:shadow-medium transition-all duration-300 lg:col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            Feature Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {features.map(([key, enabled]) => (
              <div
                key={key}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all h-full",
                  enabled
                    ? "bg-green-500/5 border-green-500/20 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.02)]"
                    : "bg-muted/30 border-border/50 text-muted-foreground/40 opacity-50 grayscale",
                )}
              >
                <div
                  className={cn(
                    "size-6 rounded-md flex items-center justify-center transition-all",
                    enabled
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted/50 text-muted-foreground/40",
                  )}
                >
                  {enabled ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-xs font-bold leading-tight">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
