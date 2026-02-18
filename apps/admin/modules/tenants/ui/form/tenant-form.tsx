"use client";

import { useState } from "react";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
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

import {
  Sparkles,
  Check,
  Loader2,
  Database,
  Server,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

// ─── Provisioning Progress UI ─────────────────────────────────────────────────

type ProvisionStatus = "idle" | "pending" | "success" | "error";

interface ProvisionStep {
  id: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  durationMs: number; // approximate time for animation pacing
}

const provisionSteps: ProvisionStep[] = [
  {
    id: 1,
    label: "Creating tenant record",
    description: "Saving tenant details and subscription to the database",
    icon: Server,
    durationMs: 1500,
  },
  {
    id: 2,
    label: "Provisioning database",
    description: "Creating a dedicated PostgreSQL database for this tenant",
    icon: Database,
    durationMs: 8000,
  },
  {
    id: 3,
    label: "Applying schema",
    description: "Pushing the tenant schema and running migrations",
    icon: ShieldCheck,
    durationMs: 12000,
  },
];

interface ProvisioningScreenProps {
  status: ProvisionStatus;
  activeStep: number;
  tenantName: string;
  errorMessage?: string;
  onGoToTenants: () => void;
  onRetry: () => void;
}

function ProvisioningScreen({
  status,
  activeStep,
  tenantName,
  errorMessage,
  onGoToTenants,
  onRetry,
}: ProvisioningScreenProps) {
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Sparkles className="size-24 text-primary" />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <Database className="h-4 w-4" />
            </div>
            {status === "success"
              ? "Tenant Ready!"
              : status === "error"
                ? "Provisioning Failed"
                : "Setting Up Tenant"}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium pl-1">
            {status === "success"
              ? `"${tenantName}" has been created and its database is live.`
              : status === "error"
                ? "Something went wrong during provisioning."
                : `Provisioning "${tenantName}" — this takes about 15–30 seconds.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="min-h-[300px] flex flex-col justify-center gap-6">
            {/* Step list */}
            <div className="space-y-4">
              {provisionSteps.map((step, index) => {
                const stepNum = index + 1;
                const isDone =
                  status === "success" ||
                  (status !== "error" && activeStep > stepNum);
                const isActive =
                  status !== "success" &&
                  status !== "error" &&
                  activeStep === stepNum;
                const isFailed = status === "error" && activeStep === stepNum;
                const isPending =
                  status !== "success" && activeStep < stepNum && !isFailed;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-500",
                      isDone
                        ? "border-primary/20 bg-primary/5"
                        : isActive
                          ? "border-primary/40 bg-primary/10 shadow-glow/20"
                          : isFailed
                            ? "border-destructive/30 bg-destructive/5"
                            : "border-border/30 bg-muted/10 opacity-50",
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 size-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500",
                        isDone
                          ? "bg-primary/20 border-primary/30 text-primary"
                          : isActive
                            ? "bg-primary border-primary text-primary-foreground"
                            : isFailed
                              ? "bg-destructive/20 border-destructive/30 text-destructive"
                              : "bg-muted/30 border-border/30 text-muted-foreground",
                      )}
                    >
                      {isDone ? (
                        <Check className="size-5 stroke-[3]" />
                      ) : isActive ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : isFailed ? (
                        <AlertCircle className="size-5" />
                      ) : (
                        <step.icon className="size-5" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-bold transition-colors",
                          isDone
                            ? "text-primary"
                            : isActive
                              ? "text-foreground"
                              : isFailed
                                ? "text-destructive"
                                : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>

                    {/* Status badge */}
                    {isDone && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-lg">
                        Done
                      </span>
                    )}
                    {isActive && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-lg animate-pulse">
                        Running
                      </span>
                    )}
                    {isFailed && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-destructive bg-destructive/10 px-2 py-1 rounded-lg">
                        Failed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error message */}
            {status === "error" && errorMessage && (
              <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/5 text-sm text-destructive font-medium">
                <span className="font-bold">Error: </span>
                {errorMessage}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
              {status === "error" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRetry}
                  className="h-12 px-6 rounded-xl font-bold border-border/50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Go Back & Retry
                </Button>
              )}
              {status === "success" && (
                <Button
                  type="button"
                  onClick={onGoToTenants}
                  className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Check className="mr-2 h-4 w-4 stroke-[3]" />
                  View All Tenants
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {status === "pending" && (
                <p className="text-xs text-muted-foreground italic">
                  Please wait — do not close this page…
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function TenantForm() {
  const router = useRouter();

  const [provisionStatus, setProvisionStatus] =
    useState<ProvisionStatus>("idle");
  const [activeProvisionStep, setActiveProvisionStep] = useState(1);
  const [provisionError, setProvisionError] = useState<string | undefined>();
  const [tenantName, setTenantName] = useState("");

  const { mutate: createTenant, isPending: isSubmitting } = useCreateTenant({
    onMutate: () => {
      // Switch to provisioning screen immediately when mutation fires
      setProvisionStatus("pending");
      setActiveProvisionStep(1);
      setProvisionError(undefined);

      // Animate through steps to reflect backend timing
      // Step 1: tenant record creation (~1.5s)
      setTimeout(() => setActiveProvisionStep(2), 1500);
      // Step 2: database creation (~8s)
      setTimeout(() => setActiveProvisionStep(3), 9500);
      // Step 3: schema push (~12s more) — stays here until onSuccess/onError
    },
    onSuccess: () => {
      setProvisionStatus("success");
      setActiveProvisionStep(provisionSteps.length + 1); // all done
    },
    onError: (error: any) => {
      setProvisionStatus("error");
      setProvisionError(error?.message ?? "An unexpected error occurred.");
    },
  });

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: defaultTenantValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick,
    isValidating,
  } = useMultiStepForm(form, steps.length);

  const isLastStep = currentStep === steps.length;

  const onSubmit = (data: TenantFormValues) => {
    setTenantName(data.name);
    createTenant(data);
  };

  const onNext = () => {
    if (isLastStep) {
      onSubmit(form.getValues());
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

  // ── Show provisioning screen once submitted ──────────────────────────────
  if (provisionStatus !== "idle") {
    return (
      <ProvisioningScreen
        status={provisionStatus}
        activeStep={activeProvisionStep}
        tenantName={tenantName}
        errorMessage={provisionError}
        onGoToTenants={() => router.push("/tenants")}
        onRetry={() => {
          setProvisionStatus("idle");
          setActiveProvisionStep(1);
          setProvisionError(undefined);
        }}
      />
    );
  }

  // ── Multi-step form ──────────────────────────────────────────────────────
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
                onNext={onNext}
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
