"use client";

import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  tenantFormSchema,
  TenantFormValues,
  defaultTenantValues,
} from "@workspace/schema";

import { StepIndicator, steps } from "../components/step-indicator";
import { FormNavigation } from "../components/form-navigation";
import { BasicInfoStep } from "../components/basic-info-step";
import { ContactInfoStep } from "../components/contact-info-step";
import { DomainConfigStep } from "../components/domain-config-step";
import { SubscriptionStep } from "../components/subscription-step";
import { UsageLimitsStep } from "../components/usage-limit-step";

import { useMultiStepForm } from "../hooks/use-multi-step-form";

import { useCreateTenant } from "@workspace/api-client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function TenantForm() {
  const router = useRouter();

  const { mutate: createTenant, isPending: isSubmitting } = useCreateTenant();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: defaultTenantValues,
  });

  const {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick,
    isValidating,
  } = useMultiStepForm(form, steps.length);

  const onSubmit = (data: TenantFormValues) => {
    if (currentStep === steps.length) {
      createTenant(data);
      router.push("/tenants");
    } else {
      handleNext();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <ContactInfoStep form={form} />;
      case 3:
        return <DomainConfigStep form={form} />;
      case 4:
        return <SubscriptionStep form={form} />;
      case 5:
        return <UsageLimitsStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />

      <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Sparkles className="size-24 text-primary" />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
              {(() => {
                const StepIcon = steps[currentStep - 1]?.icon as LucideIcon;
                return <StepIcon className="h-4 w-4" />;
              })()}
            </div>
            {steps[currentStep - 1]?.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium pl-1">
            {steps[currentStep - 1]?.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="min-h-[300px] animate-in fade-in duration-300">
                {renderStepContent()}
              </div>

              <FormNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isSubmitting={isSubmitting}
                isValidating={isValidating}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
