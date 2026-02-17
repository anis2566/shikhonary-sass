"use client";

import { useState } from "react";
import { zodResolver, useForm } from "@workspace/ui/components/form";
import {
  tenantFormSchema,
  TenantFormValues,
  defaultTenantValues,
} from "@workspace/schema";

export function useTenantForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: defaultTenantValues,
  });

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    form.setValue("slug", slug);
    form.setValue("subdomain", slug);
  };

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof TenantFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["name", "slug", "type"];
        break;
      case 2:
        fieldsToValidate = ["email", "phone", "address", "city", "state"];
        break;
      case 3:
        fieldsToValidate = [];
        break;
      case 4:
        fieldsToValidate = ["planId"];
        break;
      case 5:
        fieldsToValidate = [];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep + 1) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep(step);
      }
    }
  };

  return {
    form,
    currentStep,
    handleNameChange,
    handleNext,
    handlePrevious,
    handleStepClick,
  };
}
