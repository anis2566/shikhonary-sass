"use client";

import {
  CreditCard,
  Pencil,
  Trash2,
  Users,
  Database,
  FileText,
  Check,
  X,
  Star,
  TrendingUp,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

import {
  useSubscriptionPlanById,
  useDeleteSubscriptionPlan,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

interface SubscriptionPlanDetailsViewProps {
  id: string;
}

const FeatureRow: React.FC<{ label: string; enabled: boolean }> = ({
  label,
  enabled,
}) => (
  <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0 hover:bg-primary/5 px-4 rounded-xl transition-all duration-300 group">
    <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">
      {label}
    </span>
    {enabled ? (
      <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-soft">
        <Check className="w-3.5 h-3.5 mr-1 stroke-[3]" /> Enabled
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="opacity-70 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg"
      >
        <X className="w-3.5 h-3.5 mr-1 stroke-[3]" /> Disabled
      </Badge>
    )}
  </div>
);

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  colorClass?: string;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  colorClass,
}: StatCardProps) => (
  <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] group relative">
    <div
      className={cn(
        "absolute top-0 right-0 p-6 opacity-10 transition-transform duration-500 group-hover:scale-110",
        colorClass,
      )}
    >
      <Icon className="size-16" />
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <div
          className={cn(
            "p-2 rounded-xl bg-opacity-10",
            colorClass?.replace("text-", "bg-"),
            colorClass,
          )}
        >
          <Icon className="size-4 stroke-[2.5]" />
        </div>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-black tracking-tighter text-foreground mb-1">
        {value}
      </div>
      <p className="text-xs text-muted-foreground font-medium">{description}</p>
    </CardContent>
  </Card>
);

export const SubscriptionPlanDetailsView = ({
  id,
}: SubscriptionPlanDetailsViewProps) => {
  const router = useRouter();
  const { openDeleteModal } = useDeleteModal();
  const { data: plan, isLoading } = useSubscriptionPlanById(id);
  const { mutate: deletePlan } = useDeleteSubscriptionPlan();

  const handleDelete = () => {
    if (!plan) return;
    openDeleteModal({
      entityId: plan.id,
      entityType: "subscriptionPlan",
      entityName: plan.displayName,
      onConfirm: (id: string) => {
        deletePlan(
          { id },
          {
            onSuccess: () => router.push("/subscription-plans"),
          },
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-700">
        <Skeleton className="h-[200px] w-full rounded-[2rem]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto p-4 lg:p-6 text-center py-20 bg-card/30 backdrop-blur-xl rounded-[3rem] border border-dashed border-border/50 shadow-medium mt-10 animate-in zoom-in duration-500">
        <div className="size-20 bg-muted/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-muted-foreground">
          <CreditCard className="w-10 h-10 opacity-50" />
        </div>
        <h3 className="text-3xl font-black tracking-tight mb-3">
          Plan Not Found
        </h3>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-8">
          The subscription plan you&apos;re looking for might have been removed
          or the link is invalid.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="h-12 px-8 rounded-xl font-bold border-border/50 hover:bg-muted transition-all"
          onClick={() => router.push("/subscription-plans")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
      </div>
    );
  }

  const features = (plan.features as Record<string, boolean>) || {};

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-foreground">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="w-fit -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="flex items-start gap-6">
            <div
              className={cn(
                "size-20 rounded-[2.5rem] flex items-center justify-center shadow-medium transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden",
                plan.isPopular
                  ? "bg-primary/10 text-primary"
                  : "bg-muted/20 text-muted-foreground",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CreditCard className="size-10 stroke-[2.5] relative z-10" />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl font-black tracking-tighter">
                  {plan.displayName}
                </h1>
                {plan.isPopular && (
                  <Badge className="bg-orange-500 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] py-1.5 px-3 shadow-glow animate-pulse">
                    <Star className="size-3 mr-1.5 fill-current" /> Featured
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-black border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-widest rounded-lg px-2 py-0.5"
                >
                  {plan.name}
                </Badge>
                <div className="flex items-center gap-1.5 ml-1">
                  <div
                    className={cn(
                      "size-2 rounded-full",
                      plan.isActive
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      plan.isActive ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {plan.isActive ? "Live" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-6 rounded-xl border-border/50 bg-card/50 backdrop-blur-md shadow-soft hover:bg-muted transition-all font-bold group"
            asChild
          >
            <Link href={`/subscription-plans/edit/${plan.id}`}>
              <Pencil className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Edit details
            </Link>
          </Button>
          <Button
            size="lg"
            className="h-12 px-6 rounded-xl bg-destructive text-destructive-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Plan
          </Button>
        </div>
      </div>

      {plan.description && (
        <Card className="bg-primary/5 border-primary/20 rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="size-20 text-primary" />
            </div>
            <p className="text-xl font-medium italic text-primary/80 leading-relaxed text-center max-w-4xl mx-auto">
              &quot;{plan.description}&quot;
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="bg-card/50 backdrop-blur-xl border border-border/50 p-1.5 rounded-[2rem] h-auto shadow-medium">
            {[
              { value: "overview", label: "Overview", icon: Building2 },
              { value: "pricing", label: "Pricing", icon: TrendingUp },
              { value: "limits", label: "Service Limits", icon: Zap },
              { value: "features", label: "Feature Set", icon: Sparkles },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-[1.5rem] px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all font-bold text-sm flex items-center gap-2"
              >
                <tab.icon className="size-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent
          value="overview"
          className="space-y-8 outline-none animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={TrendingUp}
              title="Base Rate"
              value={`৳${plan.monthlyPriceBDT.toLocaleString()}`}
              description="Monthly Local Currency"
              colorClass="text-blue-500"
            />
            <StatCard
              icon={Users}
              title="Capacity"
              value={plan.defaultStudentLimit.toLocaleString()}
              description="Max students per org"
              colorClass="text-green-500"
            />
            <StatCard
              icon={Database}
              title="Storage"
              value={
                plan.defaultStorageLimit >= 1024
                  ? `${(plan.defaultStorageLimit / 1024).toFixed(1)} GB`
                  : `${plan.defaultStorageLimit} MB`
              }
              description="Allocated cloud space"
              colorClass="text-purple-500"
            />
            <StatCard
              icon={Star}
              title="Identity"
              value={plan.name}
              description="Internal system identifier"
              colorClass="text-orange-500"
            />
          </div>

          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2.5rem] overflow-hidden shadow-medium">
            <CardHeader className="pb-2 border-b border-border/30 bg-muted/5 p-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-soft">
                  <Clock className="size-6 stroke-[2.5]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Lifecycle Metrics
                  </CardTitle>
                  <CardDescription className="font-medium">
                    Administrative tracking and validity periods
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12 p-10">
              <div className="flex items-center gap-6 group">
                <div className="size-16 rounded-[1.5rem] bg-muted/20 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 shadow-soft group-hover:scale-110">
                  <Calendar className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">
                    System Entry Date
                  </p>
                  <p className="font-bold text-2xl tracking-tight text-foreground/90">
                    {format(new Date(plan.createdAt), "PPP")}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {format(new Date(plan.createdAt), "p")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="size-16 rounded-[1.5rem] bg-muted/20 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 shadow-soft group-hover:scale-110">
                  <Clock className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">
                    Most Recent Sync
                  </p>
                  <p className="font-bold text-2xl tracking-tight text-foreground/90">
                    {format(new Date(plan.updatedAt), "PPP")}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {format(new Date(plan.updatedAt), "p")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="pricing"
          className="space-y-8 outline-none animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[3rem] overflow-hidden shadow-medium relative group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <span className="text-[12rem] font-black tracking-tighter">
                  ৳
                </span>
              </div>
              <CardHeader className="bg-blue-500/5 p-8 border-b border-blue-500/10">
                <CardTitle className="flex items-center gap-4 text-blue-700 text-2xl font-black tracking-tight">
                  <div className="size-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-glow rotate-3 group-hover:rotate-0 transition-transform">
                    <span className="text-2xl font-black">৳</span>
                  </div>
                  Regional Tier (BDT)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8 relative z-10">
                <div className="flex items-center justify-between py-6 border-b border-blue-500/10 transition-colors hover:bg-blue-500/5 px-4 rounded-2xl -mx-4 group/item">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/40 group-hover/item:text-blue-500">
                      Standard Monthly
                    </span>
                    <p className="text-foreground/70 text-sm font-medium">
                      Regular billing interval
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-blue-700 tracking-tighter group-hover/item:scale-105 transition-transform">
                      ৳{plan.monthlyPriceBDT.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-6 border-b border-blue-500/10 last:border-0 transition-colors hover:bg-blue-500/5 px-4 rounded-2xl -mx-4 group/item">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/40 group-hover/item:text-blue-500">
                      Discounted Yearly
                    </span>
                    <p className="text-foreground/70 text-sm font-medium">
                      Billed annually upfront
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-blue-700 tracking-tighter group-hover/item:scale-105 transition-transform">
                      ৳{plan.yearlyPriceBDT.toLocaleString()}
                    </div>
                  </div>
                </div>

                {plan.monthlyPriceBDT > 0 && (
                  <div className="mt-4 p-6 bg-gradient-to-br from-green-500/10 to-transparent rounded-3xl border border-green-500/20 flex items-center gap-6 shadow-soft group/promo overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.1] group-hover/promo:scale-125 transition-transform">
                      <Sparkles className="size-12 text-green-600" />
                    </div>
                    <div className="size-16 bg-green-500 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-glow -rotate-6 group-hover/promo:rotate-0 transition-transform">
                      %
                    </div>
                    <div>
                      <p className="text-green-700 font-black text-lg">
                        Massive Annual Savings
                      </p>
                      <p className="text-green-600/80 text-sm font-bold">
                        Keep{" "}
                        <span className="text-green-700 text-base">
                          ৳
                          {(
                            plan.monthlyPriceBDT * 12 -
                            plan.yearlyPriceBDT
                          ).toLocaleString()}
                        </span>{" "}
                        extra per year
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-green-600 text-white font-black text-[10px] uppercase rounded-lg">
                          Save{" "}
                          {Math.round(
                            (1 -
                              plan.yearlyPriceBDT /
                                (plan.monthlyPriceBDT * 12)) *
                              100,
                          )}
                          %
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[3rem] overflow-hidden shadow-medium relative group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <span className="text-[12rem] font-black tracking-tighter">
                  $
                </span>
              </div>
              <CardHeader className="bg-emerald-500/5 p-8 border-b border-emerald-500/10">
                <CardTitle className="flex items-center gap-4 text-emerald-700 text-2xl font-black tracking-tight">
                  <div className="size-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-glow -rotate-3 group-hover:rotate-0 transition-transform">
                    <span className="text-2xl font-black">$</span>
                  </div>
                  Global Tier (USD)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8 relative z-10">
                <div className="flex items-center justify-between py-6 border-b border-emerald-500/10 transition-colors hover:bg-emerald-500/5 px-4 rounded-2xl -mx-4 group/item">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 group-hover/item:text-emerald-500">
                      Monthly Rate
                    </span>
                    <p className="text-foreground/70 text-sm font-medium">
                      USD Global standard
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-emerald-700 tracking-tighter group-hover/item:scale-105 transition-transform">
                      ${plan.monthlyPriceUSD}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-6 border-b border-emerald-500/10 last:border-0 transition-colors hover:bg-emerald-500/5 px-4 rounded-2xl -mx-4 group/item">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 group-hover/item:text-emerald-500">
                      Annual Rate
                    </span>
                    <p className="text-foreground/70 text-sm font-medium">
                      Prefunded for 12 months
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-emerald-700 tracking-tighter group-hover/item:scale-105 transition-transform">
                      ${plan.yearlyPriceUSD}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-emerald-500/5 rounded-[2rem] border border-dashed border-emerald-500/20 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600/60 mb-2">
                    Automated Exchange Policy
                  </p>
                  <p className="text-sm font-bold text-emerald-800/80 italic leading-relaxed">
                    Convert using real-time market averages at point of
                    purchase. Fixed platform safeguards apply.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="limits"
          className="space-y-8 outline-none animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[3rem] overflow-hidden shadow-medium">
            <CardHeader className="pb-2 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 p-8 border-b border-border/30">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-orange-500/10 rounded-2xl text-orange-600 flex items-center justify-center shadow-soft">
                  <Zap className="size-6 stroke-[2.5]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight tracking-tight">
                    Quota Infrastructure
                  </CardTitle>
                  <CardDescription className="font-medium text-muted-foreground/80">
                    Scaling thresholds and operational resource caps
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="group transition-all hover:bg-orange-500/5 p-6 rounded-[2rem] -mx-6 border border-transparent hover:border-orange-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-orange-100/50 text-orange-600 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                          <Users className="size-7 stroke-[2]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
                            Max Students
                          </p>
                          <p className="text-sm text-foreground/70 font-bold italic">
                            Active enrollments Cap
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-black tracking-tighter bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform block">
                          {plan.defaultStudentLimit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="group transition-all hover:bg-blue-500/5 p-6 rounded-[2rem] -mx-6 border border-transparent hover:border-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-blue-100/50 text-blue-600 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                          <Users className="size-7 stroke-[2]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
                            Faculty Seats
                          </p>
                          <p className="text-sm text-foreground/70 font-bold italic">
                            Assigned staff accounts
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform block">
                          {plan.defaultTeacherLimit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group transition-all hover:bg-purple-500/5 p-6 rounded-[2rem] -mx-6 border border-transparent hover:border-purple-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-purple-100/50 text-purple-600 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                          <Database className="size-7 stroke-[2]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
                            Workspace Storage
                          </p>
                          <p className="text-sm text-foreground/70 font-bold italic">
                            Shared media repository
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-black tracking-tighter bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform block">
                          {plan.defaultStorageLimit >= 1024
                            ? `${(plan.defaultStorageLimit / 1024).toFixed(1)}GB`
                            : `${plan.defaultStorageLimit}MB`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="group transition-all hover:bg-red-500/5 p-6 rounded-[2rem] -mx-6 border border-transparent hover:border-red-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-red-100/50 text-red-600 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                          <FileText className="size-7 stroke-[2]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
                            Exam Quota
                          </p>
                          <p className="text-sm text-foreground/70 font-bold italic">
                            Assessments per window
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-black tracking-tighter bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform block">
                          {plan.defaultExamLimit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="features"
          className="space-y-8 outline-none animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[3rem] overflow-hidden shadow-medium">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent p-8 border-b border-border/30">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-purple-500/10 rounded-2xl text-purple-600 flex items-center justify-center shadow-soft">
                  <Sparkles className="size-6 stroke-[2.5]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">
                    Feature Provisioning
                  </CardTitle>
                  <CardDescription className="font-medium">
                    Entitlement matrix for advanced functional modules
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <FeatureRow
                  label="SMS Gateway Access"
                  enabled={features.smsNotifications ?? false}
                />
                <FeatureRow
                  label="Unified Parent Portal"
                  enabled={features.parentPortal ?? false}
                />
                <FeatureRow
                  label="Custom White Labeling"
                  enabled={features.customBranding ?? false}
                />
                <FeatureRow
                  label="Advance Analytics Hub"
                  enabled={features.analytics ?? false}
                />
                <FeatureRow
                  label="RESTful API Integration"
                  enabled={features.apiAccess ?? false}
                />
                <FeatureRow
                  label="24/7 Priority Support"
                  enabled={features.prioritySupport ?? false}
                />
              </div>

              <div className="mt-12 p-8 bg-muted/20 rounded-[2rem] border border-dashed border-border/50 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-4 relative z-10">
                  Dynamic Capability Disclosure
                </p>
                <p className="text-sm font-bold text-muted-foreground italic leading-relaxed max-w-2xl mx-auto relative z-10">
                  Feature availability is subject to active tenant status,
                  regional regulations, and global platform-wide hardware
                  provisioning configurations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
