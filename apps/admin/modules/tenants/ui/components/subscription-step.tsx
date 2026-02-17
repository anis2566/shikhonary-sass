"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { CreditCard, CheckCircle2 } from "lucide-react";

import { TenantFormValues } from "@workspace/schema";
import { useSubscriptionPlansForSelection } from "@workspace/api-client";

export interface SubscriptionStepProps {
  form: UseFormReturn<TenantFormValues>;
}

export function SubscriptionStep({ form }: SubscriptionStepProps) {
  const { data: plansData } = useSubscriptionPlansForSelection();

  const selectedPlanId = form.watch("planId");
  const selectedPlan = plansData?.find((p) => p.id === selectedPlanId);

  const inputClasses =
    "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold";
  const labelClasses =
    "text-sm font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-8">
      {/* Subscription Plan Select */}
      <FormField
        control={form.control}
        name="planId"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>Subscription Plan</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? undefined}
            >
              <FormControl>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                {plansData?.map((plan) => (
                  <SelectItem
                    key={plan.id}
                    value={plan.id}
                    className="rounded-lg font-medium"
                  >
                    {plan.displayName} - {plan.monthlyPriceBDT} BDT/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="font-bold text-xs" />
          </FormItem>
        )}
      />

      {/* Plan Details Preview */}
      {selectedPlan ? (
        <div className="bg-primary/5 border border-primary/20 rounded-[1.5rem] p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <CreditCard className="size-5" />
              </div>
              <div>
                <p className="font-black text-foreground uppercase tracking-tight">
                  {selectedPlan.displayName} Plan
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Selected Tier
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-foreground">
                ৳{selectedPlan.monthlyPriceBDT}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Per Month
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Students", value: selectedPlan.defaultStudentLimit },
              { label: "Teachers", value: selectedPlan.defaultTeacherLimit },
              {
                label: "Storage",
                value: `${selectedPlan.defaultStorageLimit} MB`,
              },
              { label: "Exams", value: selectedPlan.defaultExamLimit },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-background/40 border border-border/50 p-4 rounded-2xl flex flex-col gap-1 shadow-soft"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  {feature.label}
                </span>
                <span className="font-black text-foreground truncate">
                  {feature.value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-primary/10 flex items-center gap-2 text-xs font-bold text-primary">
            <CheckCircle2 className="size-4" />
            Plan includes automatic backups and 24/7 support
          </div>
        </div>
      ) : (
        <div className="h-48 border-2 border-dashed border-border/30 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 text-muted-foreground/50">
          <CreditCard className="size-8 opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest">
            Select a plan to see details
          </p>
        </div>
      )}
    </div>
  );
}
