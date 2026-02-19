"use client";

import {
  ChevronLeft,
  CreditCard,
  Loader2,
  Save,
  Sparkles,
  Zap,
} from "lucide-react";
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
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
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
import { TENANT_SUBSCRIPTION_PLAN } from "@workspace/utils";

import {
  useUpdateSubscriptionPlan,
  useSubscriptionPlanById,
} from "@workspace/api-client";

interface EditSubscriptionFormProps {
  id: string;
}

export function EditSubscriptionForm({ id }: EditSubscriptionFormProps) {
  const router = useRouter();
  const { data: existingPlan, isLoading: isLoadingPlan } =
    useSubscriptionPlanById(id);

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
        defaultStudentLimit: existingPlan.defaultStudentLimit,
        defaultTeacherLimit: existingPlan.defaultTeacherLimit,
        defaultStorageLimit: existingPlan.defaultStorageLimit,
        defaultExamLimit: existingPlan.defaultExamLimit,

        features: (existingPlan.features as Record<string, boolean>) || {},
        isActive: existingPlan.isActive,
        isPopular: existingPlan.isPopular,
      });
    }
  }, [existingPlan, form]);

  const onSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      await updatePlan({ id, data });
      router.push("/subscription-plans");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingPlan) {
    return (
      <div className="flex h-[400px] items-center justify-center animate-in fade-in duration-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-500 text-foreground">
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
            <CreditCard className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Edit Subscription Plan
            </h1>
            <p className="text-muted-foreground font-medium">
              Update the details of your {existingPlan?.displayName} tier
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="size-24 text-primary" />
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Update Plan Details
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Core identity and positioning of the subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Plan Identifier
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={true}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full opacity-60">
                            <SelectValue placeholder="Select plan level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                          {Object.values(TENANT_SUBSCRIPTION_PLAN).map(
                            (plan) => (
                              <SelectItem
                                key={plan}
                                value={plan}
                                className="rounded-lg font-medium"
                              >
                                {plan}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Display Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Professional Plan"
                          {...field}
                          disabled={isUpdating}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Highlight the main value of this plan..."
                        className="min-h-[100px] bg-background/50 border-border/50 rounded-xl p-4 focus:ring-primary/20 transition-all shadow-soft font-medium resize-none"
                        {...field}
                        value={field.value || ""}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <div className="size-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
                    <span className="font-black">৳</span>
                  </div>
                  BDT Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="monthlyPriceBDT"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Monthly
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                          className="h-11 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-bold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearlyPriceBDT"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Yearly
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                          className="h-11 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-bold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-[10px]" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <div className="size-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-600">
                    <span className="font-black">$</span>
                  </div>
                  USD Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="monthlyPriceUSD"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Monthly
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                          className="h-11 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-bold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearlyPriceUSD"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Yearly
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          disabled={isUpdating}
                          className="h-11 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-bold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-[10px]" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Resource Limits */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-2xl text-orange-600 shadow-soft">
                  <Zap className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Resource Quotas
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
                    Scaling limits for organizations on this plan
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                [
                  { name: "defaultStudentLimit", label: "Students" },
                  { name: "defaultTeacherLimit", label: "Teachers" },
                  { name: "defaultStorageLimit", label: "Storage (MB)" },
                  { name: "defaultExamLimit", label: "Exams" },
                ] as const
              ).map((limit) => (
                <FormField
                  key={limit.name}
                  control={form.control}
                  name={limit.name}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {limit.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          value={(field.value as number) || ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                          disabled={isUpdating}
                          className="h-11 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-bold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-[10px]" />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Features Toggle */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 rounded-2xl text-purple-600 shadow-soft">
                  <Sparkles className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Feature Entitlements
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
                    Manage feature availability for this plan
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/50 bg-background/30 p-4 transition-all hover:bg-background/50 hover:border-primary/30 group shadow-soft">
                      <FormLabel className="font-bold text-sm cursor-pointer group-hover:text-primary transition-colors">
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          disabled={isUpdating}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Status Switches */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-border/50 bg-primary/5 p-6 shadow-soft transition-all hover:bg-primary/[0.07]">
                  <div className="space-y-1">
                    <FormLabel className="text-lg font-bold text-foreground flex items-center gap-2">
                      Active Status
                      {field.value && (
                        <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase">
                          Live
                        </Badge>
                      )}
                    </FormLabel>
                    <CardDescription className="text-muted-foreground font-medium">
                      Control overall plan availability
                    </CardDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isUpdating}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-primary/20 bg-primary/10 p-6 shadow-soft transition-all hover:bg-primary/15">
                  <div className="space-y-1">
                    <FormLabel className="text-lg font-bold text-primary flex items-center gap-2">
                      Popular / Recommended
                      {field.value && (
                        <Badge className="bg-orange-500 text-white font-black text-[10px] uppercase">
                          Featured
                        </Badge>
                      )}
                    </FormLabel>
                    <CardDescription className="text-primary/70 font-medium">
                      Visual highlighting in storefronts
                    </CardDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isUpdating}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30">
            <Button
              type="button"
              variant="outline"
              disabled={isUpdating}
              onClick={() => router.back()}
              className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[170px]"
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
              ) : (
                <Save className="mr-2 h-4 w-4 stroke-[3]" />
              )}
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
