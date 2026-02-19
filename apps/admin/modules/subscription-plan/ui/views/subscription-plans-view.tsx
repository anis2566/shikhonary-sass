"use client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { Layers } from "lucide-react";

import { Filter } from "../components/filter";
import { SubscriptionPlanList } from "../components/subscription-plan-list";
import {
  useActivateSubscriptionPlan,
  useDeactivateSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "@workspace/api-client";

export const SubscriptionPlansView = () => {
  const { openDeleteModal } = useDeleteModal();

  const { mutateAsync: activate, isPending: isActivating } =
    useActivateSubscriptionPlan();
  const { mutateAsync: deactivate, isPending: isDeactivating } =
    useDeactivateSubscriptionPlan();
  const { mutate: deleteSubscriptionPlan, isPending: isDeleting } =
    useDeleteSubscriptionPlan();

  const onActive = async (id: string) => {
    await activate({ id });
  };

  const onDeactivate = async (id: string) => {
    await deactivate({ id });
  };

  const handleDeleteSubscriptionPlan = (
    planId: string,
    subscriptionPlanName: string,
  ) => {
    openDeleteModal({
      entityId: planId,
      entityType: "subscriptionPlan",
      entityName: subscriptionPlanName,
      onConfirm: (id: string) => {
        deleteSubscriptionPlan({ id });
      },
    });
  };

  const isLoading = isActivating || isDeactivating || isDeleting;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 text-foreground">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-border/30">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-soft transition-transform hover:rotate-3">
            <Layers className="size-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">
              Subscription Tiers
            </h1>
            <p className="text-muted-foreground font-medium">
              Manage billing plans and service levels for organizations
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Filter Section - Standardized background */}
        <div className="p-4 bg-muted/20 rounded-[1.5rem] border border-border/30 backdrop-blur-sm">
          <Filter isLoading={isLoading} />
        </div>

        {/* Subscription Plan List */}
        <SubscriptionPlanList
          onActive={onActive}
          handleDelete={handleDeleteSubscriptionPlan}
          onDeactivate={onDeactivate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
