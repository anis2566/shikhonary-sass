"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";

import { TenantFormValues } from "@workspace/schema";
import { UseFormReturn } from "@workspace/ui/components/form";

export interface ContactInfoStepProps {
  form: UseFormReturn<TenantFormValues>;
}

export function ContactInfoStep({ form }: ContactInfoStepProps) {
  const inputClasses =
    "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold";
  const labelClasses =
    "text-sm font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Business Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="admin@school.com"
                  {...field}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Contact Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="+880 1XXX-XXXXXX"
                  {...field}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>Physical Address</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Street address..."
                {...field}
                className={cn(inputClasses, "min-h-[100px] py-3 resize-none")}
              />
            </FormControl>
            <FormMessage className="font-bold text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Dhaka"
                  {...field}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>State/Division</FormLabel>
              <FormControl>
                <Input
                  placeholder="Dhaka"
                  {...field}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Postal Code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Postal Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="1205"
                  {...field}
                  value={field.value ?? ""}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
