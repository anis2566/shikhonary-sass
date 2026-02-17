"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  isValidating: boolean;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false,
  isValidating,
}: FormNavigationProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between gap-3 pt-8 border-t border-border/30">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting || isValidating}
        className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Previous
      </Button>

      <Button
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? undefined : onNext}
        disabled={isSubmitting || isValidating}
        className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[140px] group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
            Submitting...
          </>
        ) : isValidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
            Validating...
          </>
        ) : isLastStep ? (
          <>
            <Check className="mr-2 h-4 w-4 stroke-[3]" />
            Finalize Creation
          </>
        ) : (
          <>
            Next Step
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  );
}
