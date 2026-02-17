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
import { Info } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantFormValues } from "@workspace/schema";

export interface DomainConfigStepProps {
  form: UseFormReturn<TenantFormValues>;
}

export function DomainConfigStep({ form }: DomainConfigStepProps) {
  const inputClasses =
    "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold";
  const labelClasses =
    "text-sm font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-8">
      {/* Subdomain */}
      <FormField
        control={form.control}
        name="subdomain"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>Subdomain</FormLabel>
            <div className="flex items-center">
              <FormControl>
                <Input
                  placeholder="abc-school"
                  {...field}
                  value={field.value ?? ""}
                  className={cn(inputClasses, "rounded-r-none border-r-0")}
                />
              </FormControl>
              <div className="h-12 bg-muted/50 border border-border/50 border-l-0 rounded-r-xl px-4 flex items-center text-sm font-bold text-muted-foreground whitespace-nowrap">
                .shikhonary.com
              </div>
            </div>
            <FormDescription className="text-xs font-medium pl-1">
              This will be the tenant&apos;s primary access URL
            </FormDescription>
            <FormMessage className="font-bold text-xs" />
          </FormItem>
        )}
      />

      {/* Custom Domain */}
      <FormField
        control={form.control}
        name="customDomain"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>
              Custom Domain (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="school.example.com"
                {...field}
                value={field.value ?? ""}
                className={inputClasses}
              />
            </FormControl>
            <FormDescription className="text-xs font-medium pl-1">
              Custom domains require DNS verification after creation
            </FormDescription>
            <FormMessage className="font-bold text-xs" />
          </FormItem>
        )}
      />

      {/* Info Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4">
        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
          <Info className="size-5" />
        </div>
        <div className="space-y-2">
          <p className="font-bold text-foreground text-sm">
            Domain Information
          </p>
          <ul className="space-y-1.5 text-xs font-medium text-muted-foreground leading-relaxed">
            <li className="flex items-center gap-2">
              <div className="size-1.5 bg-primary rounded-full" />
              Subdomain will be automatically active after creation
            </li>
            <li className="flex items-center gap-2">
              <div className="size-1.5 bg-primary rounded-full" />
              Custom domains require DNS verification
            </li>
            <li className="flex items-center gap-2">
              <div className="size-1.5 bg-primary rounded-full" />
              SSL certificates are provisioned automatically
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
