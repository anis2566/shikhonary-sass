import { useState } from "react";

interface UseMultiStepFormReturn<T> {
    currentStep: number;
    data: Partial<T>;
    isFirstStep: boolean;
    isLastStep: boolean;
    totalSteps: number;
    goToStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    updateData: (newData: Partial<T>) => void;
    resetForm: () => void;
}

/**
 * Hook for managing multi-step form state
 * @param totalSteps - Total number of steps in the form
 * @param initialData - Initial form data
 * @returns Multi-step form state and controls
 */
export function useMultiStepForm<T extends Record<string, any>>(
    totalSteps: number,
    initialData: Partial<T> = {}
): UseMultiStepFormReturn<T> {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<Partial<T>>(initialData);

    const goToStep = (step: number) => {
        if (step >= 0 && step < totalSteps) {
            setCurrentStep(step);
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const updateData = (newData: Partial<T>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const resetForm = () => {
        setCurrentStep(0);
        setData(initialData);
    };

    return {
        currentStep,
        data,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === totalSteps - 1,
        totalSteps,
        goToStep,
        nextStep,
        previousStep,
        updateData,
        resetForm,
    };
}
