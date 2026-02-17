"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import { Settings2, ClipboardCheck } from "lucide-react";
import { TenantFormValues } from "@workspace/schema";
import { tenantTypeOptions } from "@workspace/utils";

export interface UsageLimitsStepProps {
  form: UseFormReturn<TenantFormValues>;
}

export function UsageLimitsStep({ form }: UsageLimitsStepProps) {
  const inputClasses =
    "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold";
  const labelClasses =
    "text-sm font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-8">
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-sm font-medium text-amber-600/80">
        <Settings2 className="size-5 shrink-0" />
        <p>
          Usage limits are inherited from the selected plan by default. Override
          these only for enterprise or special institutional requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Limit */}
        <FormField
          control={form.control}
          name="customStudentLimit"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>
                Custom Student Limit
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Leave empty for plan default"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Teacher Limit */}
        <FormField
          control={form.control}
          name="customTeacherLimit"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>
                Custom Teacher Limit
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Leave empty for plan default"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exam Limit */}
        <FormField
          control={form.control}
          name="customExamLimit"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Custom Exam Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Leave empty for plan default"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Storage Limit */}
        <FormField
          control={form.control}
          name="customStorageLimit"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>
                Custom Storage (MB)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Leave empty for plan default"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Active Toggle */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-border/50 bg-primary/5 p-6 shadow-soft transition-all hover:bg-primary/[0.07]">
            <div className="space-y-1">
              <FormLabel className="text-lg font-bold text-foreground flex items-center gap-2">
                Immediate Activation
                {field.value && (
                  <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase">
                    Live
                  </Badge>
                )}
              </FormLabel>
              <FormDescription className="text-muted-foreground font-medium">
                Tenant will be functional and accessible immediately after
                creation.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Summary Box */}
      <div className="bg-primary/[0.02] border border-dashed border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ClipboardCheck className="size-24" />
        </div>

        <p className="font-black text-foreground uppercase tracking-[0.1em] text-xs mb-6 flex items-center gap-2">
          <ClipboardCheck className="size-4 text-primary" />
          Final Review Summary
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Institution", value: form.watch("name") || "Not set" },
            {
              label: "Primary URL",
              value: form.watch("subdomain")
                ? `${form.watch("subdomain")}.shikhonary.com`
                : "Not set",
            },
            {
              label: "Type",
              value:
                tenantTypeOptions.find((t) => t.value === form.watch("type"))
                  ?.label || "Not set",
            },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                {item.label}
              </p>
              <p className="text-sm font-bold text-foreground truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
