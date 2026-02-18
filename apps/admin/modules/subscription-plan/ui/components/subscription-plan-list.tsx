"use client";

import {
  MoreHorizontal,
  CreditCard,
  Users,
  Database,
  FileText,
  Check,
  X,
  Star,
  Eye,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

import { useSubscriptionPlans } from "@/trpc/api/use-subscription-plan";
import Link from "next/link";

const FeatureItem: React.FC<{ enabled: boolean; label: string }> = ({
  enabled,
  label,
}) => (
  <div className="flex items-center gap-2 text-sm">
    {enabled ? (
      <Check className="w-4 h-4 text-primary" />
    ) : (
      <X className="w-4 h-4 text-muted-foreground" />
    )}
    <span className={cn(!enabled && "text-muted-foreground")}>{label}</span>
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

  const plans = data?.plans || [];

  const formatPrice = (bdt: number, usd: number, period: "month" | "year") => {
    if (bdt === 0) return "Free";
    return (
      <div className="space-y-1">
        <div className="text-2xl font-bold">
          ৳{bdt.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">
            /{period}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          ${usd}/{period}
        </div>
      </div>
    );
  };

  const handleToggleActiveStatus = (id: string, isActive: boolean) => {
    if (isActive) {
      onDeactivate(id);
    } else {
      onActive(id);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-md cursor-pointer",
                plan.isPopular && "ring-2 ring-primary",
                !plan.isActive && "opacity-60",
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {plan.displayName}
                    </CardTitle>
                    <Badge
                      variant={plan.isActive ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {plan.name}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isLoadingAction}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/subscription-plans/${plan.id}`}>
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/subscription-plans/edit/${plan.id}`}>
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          handleToggleActiveStatus(plan.id, plan.isActive)
                        }
                      >
                        {plan.isActive ? (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => handleDelete(plan.id, plan.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {plan.description && (
                  <CardDescription className="mt-2 line-clamp-2">
                    {plan.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {formatPrice(
                  plan.monthlyPriceBDT,
                  plan.monthlyPriceUSD,
                  "month",
                )}

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {plan.defaultStudentLimit.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {plan.defaultTeacherLimit.toLocaleString()} teachers
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {plan.defaultStorageLimit >= 1000
                        ? `${plan.defaultStorageLimit / 1000}GB`
                        : `${plan.defaultStorageLimit}MB`}{" "}
                      storage
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{plan.defaultExamLimit.toLocaleString()} exams</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <FeatureItem
                    enabled={
                      (plan.features as Record<string, boolean>)
                        ?.smsNotifications ?? false
                    }
                    label="SMS Notifications"
                  />
                  <FeatureItem
                    enabled={
                      (plan.features as Record<string, boolean>)
                        ?.parentPortal ?? false
                    }
                    label="Parent Portal"
                  />
                  <FeatureItem
                    enabled={
                      (plan.features as Record<string, boolean>)
                        ?.customBranding ?? false
                    }
                    label="Custom Branding"
                  />
                  <FeatureItem
                    enabled={
                      (plan.features as Record<string, boolean>)?.analytics ??
                      false
                    }
                    label="Analytics"
                  />
                </div>
              </CardContent>

              <CardFooter className="text-xs text-muted-foreground">
                Yearly: ৳{plan.yearlyPriceBDT.toLocaleString()} ($
                {plan.yearlyPriceUSD})
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {plans.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No subscription plans found</p>
        </div>
      )}
    </>
  );
};
