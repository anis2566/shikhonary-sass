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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  useSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "@/trpc/api/use-subscription-plan";
import { useDeleteModal } from "@/hooks/use-delete";
import Link from "next/link";

interface SubscriptionPlanDetailsViewProps {
  id: string;
}

const FeatureRow: React.FC<{ label: string; enabled: boolean }> = ({
  label,
  enabled,
}) => (
  <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 px-2 rounded-lg transition-colors">
    <span className="text-sm font-medium">{label}</span>
    {enabled ? (
      <Badge
        variant="default"
        className="bg-primary/10 text-primary border-primary/20"
      >
        <Check className="w-3 h-3 mr-1" /> Enabled
      </Badge>
    ) : (
      <Badge variant="secondary" className="opacity-70">
        <X className="w-3 h-3 mr-1" /> Disabled
      </Badge>
    )}
  </div>
);

export const SubscriptionPlanDetailsView = ({
  id,
}: SubscriptionPlanDetailsViewProps) => {
  const router = useRouter();
  const { openDeleteModal } = useDeleteModal();
  const { data: plan, isLoading } = useSubscriptionPlan(id);
  const { mutate: deletePlan } = useDeleteSubscriptionPlan();

  const handleDelete = () => {
    if (!plan) return;
    openDeleteModal({
      entityId: plan.id,
      entityType: "subscriptionPlan",
      entityName: plan.displayName,
      onConfirm: (id) => {
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
      <div className="p-4 lg:p-6 space-y-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-4 lg:p-6 text-center py-20 bg-muted/20 rounded-xl border border-dashed mx-6 mt-10">
        <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <h3 className="text-xl font-semibold">Plan Not Found</h3>
        <p className="text-muted-foreground mt-2">
          The subscription plan you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/subscription-plans")}
        >
          Back to Plans
        </Button>
      </div>
    );
  }

  const features = (plan.features as Record<string, boolean>) || {};

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Action Card */}
      <Card className="overflow-hidden border border-muted bg-gradient-to-br from-card to-muted/30">
        <CardContent className="p-0">
          <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div
                className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner transition-transform hover:scale-105 duration-300",
                  plan.isPopular
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <CreditCard className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-bold tracking-tight">
                    {plan.displayName}
                  </h2>
                  {plan.isPopular && (
                    <Badge className="bg-primary text-primary-foreground animate-pulse">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Recommended
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] uppercase tracking-wider"
                  >
                    {plan.name}
                  </Badge>
                  <Badge
                    variant={plan.isActive ? "default" : "destructive"}
                    className="px-3"
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {plan.description && (
                  <p className="text-muted-foreground text-sm max-w-xl line-clamp-2 italic">
                    &quot;{plan.description}&quot;
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" className="shadow-sm" asChild>
                <Link href={`/subscription-plans/edit/${plan.id}`}>
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
              </Button>
              <Button
                size="lg"
                className="shadow-sm border-red-700 bg-red-700 text-white hover:text-white hover:bg-red-700/80"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg px-6">
            Overview
          </TabsTrigger>
          <TabsTrigger value="pricing" className="rounded-lg px-6">
            Pricing
          </TabsTrigger>
          <TabsTrigger value="limits" className="rounded-lg px-6">
            Service Limits
          </TabsTrigger>
          <TabsTrigger value="features" className="rounded-lg px-6">
            Feature Set
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6 animate-in fade-in duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  Price Point
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳{plan.monthlyPriceBDT.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Base monthly rate in Local Currency
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <div className="p-1.5 bg-green-500/10 rounded-md">
                    <Users className="w-4 h-4 text-green-500" />
                  </div>
                  User Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {plan.studentLimit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Students allowed per organization
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500/10 rounded-md">
                    <Database className="w-4 h-4 text-purple-500" />
                  </div>
                  Cloud Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {plan.storageLimit >= 1024
                    ? `${(plan.storageLimit / 1024).toFixed(1)} GB`
                    : `${plan.storageLimit} MB`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Allocated workspace storage
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <div className="p-1.5 bg-orange-500/10 rounded-md">
                    <Building2 className="w-4 h-4 text-orange-500" />
                  </div>
                  Display Rank
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Administrative Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Created On
                  </p>
                  <p className="font-medium text-base">
                    {format(new Date(plan.createdAt), "PPP p")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Clock className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Last Updated
                  </p>
                  <p className="font-medium text-base">
                    {format(new Date(plan.updatedAt), "PPP p")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="pricing"
          className="space-y-6 animate-in fade-in duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg overflow-hidden border-t-4 border-t-blue-500">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="flex items-center gap-3 text-blue-700">
                  <div className="p-2 bg-blue-500 text-white rounded-lg shadow-md">
                    <span className="text-xl font-bold">৳</span>
                  </div>
                  Local Pricing (BDT)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-blue-100">
                  <div className="space-y-1">
                    <span className="text-base font-semibold block uppercase tracking-tight text-blue-900/40 text-sm">
                      Monthly Subscription
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Standard billing cycle
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold text-blue-700">
                    ৳{plan.monthlyPriceBDT.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-blue-100">
                  <div className="space-y-1">
                    <span className="text-base font-semibold block uppercase tracking-tight text-blue-900/40 text-sm">
                      Yearly Subscription
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Billed annually
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold text-blue-700">
                    ৳{plan.yearlyPriceBDT.toLocaleString()}
                  </span>
                </div>
                {plan.monthlyPriceBDT > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      %
                    </div>
                    <div>
                      <p className="text-green-800 font-bold">Annual Savings</p>
                      <p className="text-green-700 text-sm">
                        You save{" "}
                        <span className="underline decoration-2 underline-offset-4">
                          ৳
                          {(
                            plan.monthlyPriceBDT * 12 -
                            plan.yearlyPriceBDT
                          ).toLocaleString()}
                        </span>{" "}
                        per year with annual billing (Save{" "}
                        {Math.round(
                          (1 -
                            plan.yearlyPriceBDT / (plan.monthlyPriceBDT * 12)) *
                            100,
                        )}
                        %)
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg overflow-hidden border-t-4 border-t-green-500">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="p-2 bg-green-500 text-white rounded-lg shadow-md">
                    <span className="text-xl font-bold">$</span>
                  </div>
                  International Pricing (USD)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-green-100">
                  <div className="space-y-1">
                    <span className="text-base font-semibold block uppercase tracking-tight text-green-900/40 text-sm">
                      Monthly Rate
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Global currency billing
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold text-green-700">
                    ${plan.monthlyPriceUSD}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-green-100">
                  <div className="space-y-1">
                    <span className="text-base font-semibold block uppercase tracking-tight text-green-900/40 text-sm">
                      Yearly Rate
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Discounted annual payment
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold text-green-700">
                    ${plan.yearlyPriceUSD}
                  </span>
                </div>
                <p className="text-sm text-center text-muted-foreground bg-muted/30 py-3 rounded-lg border border-dashed">
                  Conversion rates based on fixed platform pricing
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="limits"
          className="space-y-6 animate-in fade-in duration-500"
        >
          <Card className="border-none shadow-md">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="text-lg">
                Resource Allocation & Quotas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-center justify-between py-4 group-hover:px-2 transition-all duration-300 group-hover:bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-orange-100/50 text-orange-600 shadow-sm">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg italic tracking-tight uppercase text-xs text-muted-foreground">
                            Student Limit
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Maximum enrollments
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-black bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                        {plan.studentLimit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-center justify-between py-4 group-hover:px-2 transition-all duration-300 group-hover:bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-100/50 text-blue-600 shadow-sm">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg italic tracking-tight uppercase text-xs text-muted-foreground">
                            Faculty/Teacher Limit
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Staff accounts
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        {plan.teacherLimit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-center justify-between py-4 group-hover:px-2 transition-all duration-300 group-hover:bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100/50 text-purple-600 shadow-sm">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg italic tracking-tight uppercase text-xs text-muted-foreground">
                            Allocated Storage
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Cross-platform files
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                        {plan.storageLimit >= 1024
                          ? `${(plan.storageLimit / 1024).toFixed(1)} GB`
                          : `${plan.storageLimit} MB`}
                      </span>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-center justify-between py-4 group-hover:px-2 transition-all duration-300 group-hover:bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-100/50 text-red-600 shadow-sm">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg italic tracking-tight uppercase text-xs text-muted-foreground">
                            Examination Count
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Assessments per term
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-black bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                        {plan.examLimit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="features"
          className="space-y-6 animate-in fade-in duration-500"
        >
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Feature Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-10">
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
              <p className="text-xs text-muted-foreground mt-10 text-center italic border-t pt-4">
                Availability of features depends on active tenant settings and
                platform-wide configurations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
