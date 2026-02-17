"use client";

import { Building2, ChevronLeft, Loader2, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import {
  tenantFormSchema,
  TenantFormValues,
  defaultTenantValues,
} from "@workspace/schema";
import { useTenantById, useUpdateTenant } from "@workspace/api-client";

import { BasicInfoStep } from "../components/basic-info-step";
import { ContactInfoStep } from "../components/contact-info-step";
import { DomainConfigStep } from "../components/domain-config-step";
import { SubscriptionStep } from "../components/subscription-step";
import { UsageLimitsStep } from "../components/usage-limit-step";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

interface EditTenantFormProps {
  tenantId: string;
}

export function EditTenantForm({ tenantId }: EditTenantFormProps) {
  const router = useRouter();
  const { data: tenant, isLoading: isLoadingTenant } = useTenantById(tenantId);
  const { mutate: updateTenant, isPending: isUpdating } = useUpdateTenant();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: defaultTenantValues,
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        slug: tenant.slug,
        type: tenant.type as TenantFormValues["type"],
        description: tenant.description ?? "",
        logo: tenant.logo ?? "",
        currentAcademicYear: tenant.currentAcademicYear ?? "",
        email: tenant.email ?? "",
        phone: tenant.phone ?? "",
        address: tenant.address ?? "",
        city: tenant.city ?? "",
        state: tenant.state ?? "",
        postalCode: tenant.postalCode ?? "",
        subdomain: tenant.subdomain ?? "",
        customDomain: tenant.customDomain ?? "",
        planId: tenant.subscription?.plan?.id ?? "",
        isActive: tenant.isActive ?? true,
        customStudentLimit: tenant.customStudentLimit ?? undefined,
        customTeacherLimit: tenant.customTeacherLimit ?? undefined,
        customExamLimit: tenant.customExamLimit ?? undefined,
        customStorageLimit: tenant.customStorageLimit ?? undefined,
      });
    }
  }, [tenant, form]);

  const onSubmit = (data: TenantFormValues) => {
    updateTenant({ id: tenantId, data });
  };

  if (isLoadingTenant) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-500 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-soft">
            <Building2 className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Edit Tenant
              </h1>
              {tenant?.isActive ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                  Live
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest"
                >
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground font-medium">
              Update institutional settings and configurations for{" "}
              <span className="text-primary font-bold">{tenant?.name}</span>
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full space-y-8">
            <TabsList className="bg-card/30 backdrop-blur-xl border border-border/50 p-1.5 rounded-2xl h-auto gap-1 shadow-soft w-full sm:w-fit overflow-x-auto justify-start flex-nowrap scrollbar-none">
              <TabsTrigger
                value="basic"
                className="rounded-xl px-4 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="rounded-xl px-4 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all"
              >
                Contact
              </TabsTrigger>
              <TabsTrigger
                value="domain"
                className="rounded-xl px-4 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all"
              >
                Domain
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="rounded-xl px-4 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all"
              >
                Plan
              </TabsTrigger>
              <TabsTrigger
                value="limits"
                className="rounded-xl px-4 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all"
              >
                Limits
              </TabsTrigger>
            </TabsList>

            <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Sparkles className="size-24 text-primary" />
              </div>

              <CardContent className="p-8">
                <TabsContent
                  value="basic"
                  className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  <BasicInfoStep form={form} />
                </TabsContent>
                <TabsContent
                  value="contact"
                  className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  <ContactInfoStep form={form} />
                </TabsContent>
                <TabsContent
                  value="domain"
                  className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  <DomainConfigStep form={form} />
                </TabsContent>
                <TabsContent
                  value="subscription"
                  className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  <SubscriptionStep form={form} />
                </TabsContent>
                <TabsContent
                  value="limits"
                  className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  <UsageLimitsStep form={form} />
                </TabsContent>
              </CardContent>

              <div className="px-8 py-6 bg-primary/5 border-t border-border/50 flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Carefully review changes before saving
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="h-11 px-6 rounded-xl font-bold hover:bg-background/50 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="h-11 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[150px]"
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
                    ) : (
                      <Save className="mr-2 h-4 w-4 stroke-[3]" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
