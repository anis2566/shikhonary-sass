"use client";

import { EditSubscriptionForm } from "../form/edit-subscription-form";

interface EditSubscriptionPlanViewProps {
  id: string;
}

export const EditSubscriptionPlanView = ({
  id,
}: EditSubscriptionPlanViewProps) => {
  return <EditSubscriptionForm id={id} />;
};
