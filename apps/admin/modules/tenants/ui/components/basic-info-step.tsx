"use client";

import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { TenantFormValues } from "@workspace/schema";
import { slugify } from "@workspace/utils";
import { tenantTypeOptions } from "@workspace/utils";
import { cn } from "@workspace/ui/lib/utils";

export interface BasicInfoStepProps {
  form: UseFormReturn<TenantFormValues>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!isSlugManuallyEdited) {
      const slug = slugify(name);
      form.setValue("slug", slug);
      form.setValue("subdomain", slug);
    }
  };

  const inputClasses =
    "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full";
  const labelClasses =
    "text-sm font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-8">
      {/* Tenant Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>Tenant Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., ABC High School"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleNameChange(e.target.value);
                }}
                className={inputClasses}
              />
            </FormControl>
            <FormMessage className="font-bold text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Slug Identifier</FormLabel>
              <FormControl>
                <Input
                  placeholder="abc-high-school"
                  {...field}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    field.onChange(e);
                  }}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Tenant Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Institution Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                  {tenantTypeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-lg font-medium"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the tenant..."
                {...field}
                value={field.value ?? ""}
                className={cn(inputClasses, "min-h-[120px] py-3 resize-none")}
              />
            </FormControl>
            <FormMessage className="font-bold text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo URL */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Logo URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/logo.png"
                  {...field}
                  value={field.value ?? ""}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Current Academic Year */}
        <FormField
          control={form.control}
          name="currentAcademicYear"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>
                Current Academic Year
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="2024-2025"
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
