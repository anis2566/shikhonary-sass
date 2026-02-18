"use client";

import { useDeleteModal } from "@/hooks/use-delete";
import { Filter } from "../components/fiter";
import { SubscriptionPlanList } from "../components/subscription-plan-list";
import {
  useActivateSubscriptionPlan,
  useDeactivateSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "@/trpc/api/use-subscription-plan";

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
      onConfirm: (id) => {
        deleteSubscriptionPlan({ id });
      },
    });
  };

  const isLoading = isActivating || isDeactivating || isDeleting;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <Filter isLoading={isLoading} />
      <SubscriptionPlanList
        onActive={onActive}
        handleDelete={handleDeleteSubscriptionPlan}
        onDeactivate={onDeactivate}
        isLoading={isLoading}
      />
    </div>
  );
};
