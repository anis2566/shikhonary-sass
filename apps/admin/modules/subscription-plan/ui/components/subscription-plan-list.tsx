"use client";

import {
  MoreHorizontal,
  CreditCard,
  Users,
  Database,
  Check,
  X,
  Star,
  Eye,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";

import { useSubscriptionPlans } from "@workspace/api-client";
import Link from "next/link";

const FeatureItem: React.FC<{ enabled: boolean; label: string }> = ({
  enabled,
  label,
}) => (
  <div className="flex items-center gap-3 text-sm group/item">
    <div
      className={cn(
        "size-5 rounded-full flex items-center justify-center transition-all duration-300",
        enabled
          ? "bg-primary/10 text-primary scale-110 shadow-soft"
          : "bg-muted text-muted-foreground/40 opacity-50",
      )}
    >
      {enabled ? (
        <Check className="w-3 h-3 stroke-[4]" />
      ) : (
        <X className="w-3 h-3 stroke-[4]" />
      )}
    </div>
    <span
      className={cn(
        "font-semibold transition-colors duration-300",
        enabled
          ? "text-foreground group-hover/item:text-primary"
          : "text-muted-foreground/60",
      )}
    >
      {label}
    </span>
  </div>
);

interface SubscriptionPlanListProps {
  onActive: (id: string) => Promise<void>;
  handleDelete: (id: string, name: string) => void;
  onDeactivate: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const SubscriptionPlanList = ({
  onActive,
  handleDelete,
  onDeactivate,
  isLoading: isLoadingAction,
}: SubscriptionPlanListProps) => {
  const { data, isLoading } = useSubscriptionPlans();

  const plans = data?.items || [];

  const handleToggleActiveStatus = (id: string, isActive: boolean) => {
    if (isActive) {
      onDeactivate(id);
    } else {
      onActive(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[500px] w-full rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-32 bg-card/10 backdrop-blur-md rounded-[3rem] border border-dashed border-border/50 animate-in zoom-in duration-500">
        <div className="size-24 bg-muted/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-muted-foreground/40">
          <CreditCard className="size-12" />
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-2">
          No tiers found
        </h3>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto">
          We couldn&apos;t find any subscription plans matching your criteria.
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "group relative flex flex-col h-full bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-medium hover:shadow-glow hover:-translate-y-2",
            plan.isPopular && "ring-2 ring-primary/40 bg-primary/[0.03]",
            !plan.isActive && "opacity-60 grayscale-[0.5]",
          )}
        >
          {plan.isPopular && (
            <div className="absolute top-0 right-0 z-20 overflow-hidden rounded-bl-3xl">
              <div className="bg-primary px-6 py-2 flex items-center gap-2 shadow-glow animate-in slide-in-from-top duration-700">
                <Star className="size-3.5 fill-white text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  Recommended
                </span>
              </div>
            </div>
          )}

          <div className="absolute top-0 left-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
            <Sparkles className="size-32 text-primary" />
          </div>

          <CardHeader className="p-8 pb-4 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="size-14 rounded-2xl bg-background/50 border border-border/50 flex items-center justify-center text-primary shadow-soft group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="size-7 stroke-[2.5]" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 bg-background/30 backdrop-blur-md hover:bg-muted rounded-xl border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    disabled={isLoadingAction}
                  >
                    <MoreHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-2xl border-border/50 p-2 min-w-[180px] shadow-medium backdrop-blur-xl bg-background/95"
                >
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl gap-3 py-3 cursor-pointer"
                  >
                    <Link href={`/subscription-plans/${plan.id}`}>
                      <Eye className="size-4 text-primary" />
                      <span className="font-bold">View Analytics</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl gap-3 py-3 cursor-pointer"
                  >
                    <Link href={`/subscription-plans/edit/${plan.id}`}>
                      <Pencil className="size-4 text-primary" />
                      <span className="font-bold">Edit Details</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-xl gap-3 py-3 cursor-pointer"
                    onClick={() =>
                      handleToggleActiveStatus(plan.id, plan.isActive)
                    }
                  >
                    {plan.isActive ? (
                      <>
                        <ToggleLeft className="size-4 text-orange-500" />
                        <span className="font-bold text-orange-500">
                          Suspend Tier
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleRight className="size-4 text-green-500" />
                        <span className="font-bold text-green-500">
                          Activate Tier
                        </span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-border/50" />
                  <DropdownMenuItem
                    className="rounded-xl gap-3 py-3 cursor-pointer text-destructive focus:text-white focus:bg-destructive"
                    onClick={() => handleDelete(plan.id, plan.displayName)}
                  >
                    <Trash2 className="size-4" />
                    <span className="font-bold uppercase tracking-wider text-[11px]">
                      Delete Permanently
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                  {plan.displayName}
                </CardTitle>
                {!plan.isActive && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-black uppercase tracking-widest border-red-500/20 text-red-500 bg-red-500/5 px-2 py-0"
                  >
                    Inactive
                  </Badge>
                )}
              </div>
              <Badge
                variant="secondary"
                className="font-black text-[10px] uppercase tracking-[0.15em] px-2 py-0 border-none bg-muted-foreground/10 text-muted-foreground/80"
              >
                {plan.name}
              </Badge>
            </div>

            {plan.description && (
              <p className="mt-4 text-sm text-muted-foreground/80 font-medium leading-relaxed line-clamp-3 min-h-[4.5rem]">
                {plan.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="p-8 pt-4 flex-1 flex flex-col gap-8 relative z-10">
            {/* Pricing Box */}
            <div className="p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-[2rem] border border-border/50 shadow-soft group-hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-foreground">
                  ৳{plan.monthlyPriceBDT.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-muted-foreground/60">
                  /month
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/10">
                <Badge
                  variant="outline"
                  className="border-green-500/20 bg-green-500/5 text-green-600 font-bold text-[11px] px-2 py-0"
                >
                  Save 25% Yearly
                </Badge>
                <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  ৳{plan.yearlyPriceBDT.toLocaleString()} /year
                </span>
              </div>
            </div>

            {/* Quotas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 whitespace-nowrap">
                  Provisioning
                </span>
                <div className="h-px flex-1 bg-border/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-3 rounded-2xl bg-muted/10 border border-border/20 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="size-3.5 stroke-[2.5]" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Students
                    </span>
                  </div>
                  <span className="text-lg font-black tracking-tight">
                    {plan.defaultStudentLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-2xl bg-muted/10 border border-border/20 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-2 text-primary">
                    <Database className="size-3.5 stroke-[2.5]" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Storage
                    </span>
                  </div>
                  <span className="text-lg font-black tracking-tight">
                    {plan.defaultStorageLimit >= 1024
                      ? `${(plan.defaultStorageLimit / 1024).toFixed(1)}GB`
                      : `${plan.defaultStorageLimit}MB`}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 whitespace-nowrap">
                  Core Entitlements
                </span>
                <div className="h-px flex-1 bg-border/30" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <FeatureItem
                  enabled={
                    (plan.features as Record<string, boolean>)
                      ?.smsNotifications ?? false
                  }
                  label="Advanced SMS Gateway"
                />
                <FeatureItem
                  enabled={
                    (plan.features as Record<string, boolean>)?.parentPortal ??
                    false
                  }
                  label="Unified Parent App"
                />
                <FeatureItem
                  enabled={
                    (plan.features as Record<string, boolean>)?.analytics ??
                    false
                  }
                  label="Deep Analytics Engine"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0 relative z-10">
            <Button
              className={cn(
                "w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-soft hover:shadow-glow transition-all duration-300",
                plan.isPopular
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/80 hover:bg-muted border border-border/50 text-foreground",
              )}
              asChild
            >
              <Link href={`/subscription-plans/${plan.id}`}>
                View Full Specifications
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
