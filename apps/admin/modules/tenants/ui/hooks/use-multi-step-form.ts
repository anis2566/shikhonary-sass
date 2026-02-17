"use client";

import { useState } from "react";
import { toast } from "sonner";

import { UseFormReturn } from "@workspace/ui/components/form";

import { TenantFormValues } from "@workspace/schema";

// TODO: Add these validation hooks to @workspace/api-client
// import {
//   useValidateTenantBasicInfo,
//   useValidateTenantDomain,
// } from "@workspace/api-client";

function getFieldsForStep(step: number) {
  switch (step) {
    case 1:
      return ["name", "slug", "type"] as const;
    case 2:
      return [
        "email",
        "phone",
        "address",
        "city",
        "state",
        "postalCode",
      ] as const;
    case 3:
      return ["subdomain", "customDomain"] as const;
    case 4:
      return ["planId"] as const;
    case 5:
      return [
        "isActive",
        "customStudentLimit",
        "customTeacherLimit",
        "customExamLimit",
        "customStorageLimit",
      ] as const;
    default:
      return [] as const;
  }
}

export function useMultiStepForm(
  form: UseFormReturn<TenantFormValues>,
  totalSteps: number,
) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidating, setIsValidating] = useState(false);

  // TODO: Uncomment when validation hooks are available
  // const { mutateAsync: validateBasicInfo } = useValidateTenantBasicInfo();
  // const { mutateAsync: validateDomain } = useValidateTenantDomain();

  const validateStep = async (step: number): Promise<boolean> => {
    setIsValidating(true);

    try {
      const fieldsToValidate = getFieldsForStep(step);

      // First validate form fields
      const isFormValid = await form.trigger(fieldsToValidate);

      if (!isFormValid) {
        // Get the errors for better user feedback
        const errors = form.formState.errors;
        fieldsToValidate.forEach((field) => {
          if (errors[field]) {
            console.log(
              `Validation error on ${field}:`,
              errors[field]?.message,
            );
          }
        });
        return false;
      }

      // TODO: Re-enable server-side validation when hooks are available
      // For step 1 (basic info), perform additional server-side validation
      // if (step === 1) {
      //   try {
      //     const values = form.getValues();
      //     const result = await validateBasicInfo({
      //       name: values.name,
      //       slug: values.slug,
      //     });
      //     return result.success;
      //   } catch {
      //     return false;
      //   }
      // }

      // For step 3 (subdomain), you might want to validate subdomain availability
      // if (step === 3) {
      //   try {
      //     const values = form.getValues();
      //     if (!values.subdomain) {
      //       return false;
      //     }
      //     const result = await validateDomain({
      //       subdomain: values.subdomain,
      //     });
      //     return result.success;
      //   } catch {
      //     return false;
      //   }
      // }

      return isFormValid;
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < totalSteps) {
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
      // Allow going back without validation
      setCurrentStep(step);
    } else if (step === currentStep + 1) {
      // Validate current step before moving to next
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep(step);
      }
    } else if (step > currentStep + 1) {
      // Validate all steps between current and target
      let allValid = true;
      for (let i = currentStep; i < step; i++) {
        const isValid = await validateStep(i);
        if (!isValid) {
          allValid = false;
          toast.error(`Please complete step ${i} before proceeding`);
          break;
        }
      }
      if (allValid) {
        setCurrentStep(step);
      }
    }
  };

  return {
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleStepClick,
    validateStep,
    isValidating,
  };
}
