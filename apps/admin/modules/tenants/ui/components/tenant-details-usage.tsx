import { GraduationCap, Users, FileText, Database } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { cn } from "@workspace/ui/lib/utils";

import { SubscriptionPlan, Tenant } from "@workspace/db";

interface TenantWithRelations extends Tenant {
  subscription: {
    plan: SubscriptionPlan;
  } | null;
}

interface TenantDetailsUsageProps {
  tenant: TenantWithRelations;
}

export const TenantDetailsUsage = ({ tenant }: TenantDetailsUsageProps) => {
  const usageStats = [
    {
      label: "Students",
      current: tenant.studentCount,
      limit: tenant.subscription?.plan.defaultStudentLimit ?? 0,
      icon: GraduationCap,
      color: "text-blue-500",
      progressColor: "bg-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Teachers",
      current: tenant.teacherCount,
      limit: tenant.subscription?.plan.defaultTeacherLimit ?? 0,
      icon: Users,
      color: "text-green-500",
      progressColor: "bg-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Exams",
      current: tenant.examCount,
      limit: tenant.subscription?.plan.defaultExamLimit ?? 0,
      icon: FileText,
      color: "text-purple-500",
      progressColor: "bg-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Storage",
      current: tenant.storageUsedMB,
      limit: tenant.subscription?.plan.defaultStorageLimit ?? 0,
      icon: Database,
      color: "text-amber-500",
      progressColor: "bg-amber-500",
      bg: "bg-amber-500/10",
      unit: "MB",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {usageStats.map((stat, i) => {
        const percent = Math.min(
          Math.round((stat.current / (stat.limit || 1)) * 100),
          100,
        );
        const isCritical = percent > 90;

        return (
          <Card
            key={i}
            className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden shadow-soft group hover:shadow-medium transition-all duration-300"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2.5">
                  <div
                    className={cn(
                      "p-2 rounded-xl border border-current/20",
                      stat.bg,
                      stat.color,
                    )}
                  >
                    <stat.icon className="w-4 h-4" />
                  </div>
                  {stat.label}
                </CardTitle>
                <div
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                    isCritical
                      ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
                      : "bg-muted text-muted-foreground border-transparent",
                  )}
                >
                  {percent}% Used
                </div>
              </div>
              <CardDescription className="text-sm font-bold text-foreground/70 mt-3 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-foreground">
                  {stat.current.toLocaleString()}
                </span>
                <span className="text-muted-foreground/50">
                  of {stat.limit.toLocaleString()}{" "}
                  {stat.unit || stat.label.toLowerCase()} registered
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-3 w-full bg-muted/50 rounded-full overflow-hidden border border-border/50">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-out rounded-full",
                    stat.progressColor,
                    isCritical &&
                      "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
                  )}
                  style={{ width: `${percent}%` }}
                />
                {isCritical && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                <span>Current Tier Utilization</span>
                <span className={cn(isCritical && "text-red-500")}>
                  {stat.limit - stat.current} Remaining
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
