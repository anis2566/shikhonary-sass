"use client";

import { Save, Loader2, CreditCard, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  subscriptionPlanFormSchema,
  SubscriptionPlanFormValues,
  defaultSubscriptionPlanValues,
} from "@workspace/schema";
import { TENANT_SUBSCRIPTION_PLAN } from "@workspace/utils/constant";

import {
  useUpdateSubscriptionPlan,
  useSubscriptionPlan,
} from "@/trpc/api/use-subscription-plan";

interface EditSubscriptionFormProps {
  id: string;
}

export function EditSubscriptionForm({ id }: EditSubscriptionFormProps) {
  const router = useRouter();
  const { data: existingPlan, isLoading: isLoadingPlan } =
    useSubscriptionPlan(id);
  const { mutateAsync: updatePlan, isPending: isUpdating } =
    useUpdateSubscriptionPlan();

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanFormSchema),
    defaultValues: defaultSubscriptionPlanValues as SubscriptionPlanFormValues,
  });

  useEffect(() => {
    if (existingPlan) {
      form.reset({
        name: existingPlan.name as TENANT_SUBSCRIPTION_PLAN,
        displayName: existingPlan.displayName,
        description: existingPlan.description || "",
        monthlyPriceBDT: existingPlan.monthlyPriceBDT,
        yearlyPriceBDT: existingPlan.yearlyPriceBDT,
        monthlyPriceUSD: existingPlan.monthlyPriceUSD,
        yearlyPriceUSD: existingPlan.yearlyPriceUSD,
        studentLimit: existingPlan.defaultStudentLimit,
        teacherLimit: existingPlan.defaultTeacherLimit,
        storageLimit: existingPlan.defaultStorageLimit,
        examLimit: existingPlan.defaultExamLimit,
        features: (existingPlan.features as Record<string, boolean>) || {},
        isActive: existingPlan.isActive,
        isPopular: existingPlan.isPopular,
      });
    }
  }, [existingPlan, form]);

  const onSubmit = async (data: SubscriptionPlanFormValues) => {
    await updatePlan({ id, data })
      .then(() => {
        router.push("/subscription-plans");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isLoadingPlan) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Update Information</CardTitle>
                  <CardDescription>
                    Update plan details for existing subscriptions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Identifier</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={true}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select plan level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TENANT_SUBSCRIPTION_PLAN).map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Identifiers cannot be changed after creation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Professional Plan"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormDescription>
                      The name visible to your customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Highlight the main value of this plan..."
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-lg">৳</span> BDT Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-6">
                <FormField
                  control={form.control}
                  name="monthlyPriceBDT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearlyPriceBDT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-lg">$</span> USD Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-6">
                <FormField
                  control={form.control}
                  name="monthlyPriceUSD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearlyPriceUSD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Resource Limits */}
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-500" />
                </div>
                <CardTitle>Resource Quotas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              <FormField
                control={form.control}
                name="studentLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Students</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teachers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage (MB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="examLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exams</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Features Toggle */}
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </div>
                <CardTitle>Feature Entitlements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              {[
                { key: "smsNotifications", label: "SMS Notifications" },
                { key: "parentPortal", label: "Parent Portal" },
                { key: "customBranding", label: "Custom Branding" },
                { key: "analytics", label: "Analytics Dashboard" },
                { key: "apiAccess", label: "API Access" },
                { key: "prioritySupport", label: "Priority Support" },
              ].map(({ key, label }) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`features.${key}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/50">
                      <FormLabel className="font-medium cursor-pointer">
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          disabled={isUpdating}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/10">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <CardDescription>
                          Plan visibility for new users
                        </CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isUpdating}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-primary/5 border-primary/20">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Recommended
                        </FormLabel>
                        <CardDescription>Highlight this plan</CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isUpdating}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isUpdating}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isUpdating}
              className="min-w-[160px] shadow-lg shadow-primary/20"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
