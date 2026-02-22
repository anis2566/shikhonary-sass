"use client";

import { BookOpen, ChevronLeft, Loader2, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import {
  AcademicSubjectFormValues,
  defaultAcademicSubjectValues,
  academicSubjectFormSchema,
} from "@workspace/schema";
import { cn } from "@workspace/ui/lib/utils";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  useAcademicClassesForSelection,
  useAcademicSubjectById,
  useUpdateAcademicSubject,
} from "@workspace/api-client";
import { AcademicSubject } from "@workspace/db";
import { groupOptions } from "@workspace/utils";

interface SubjectWithRelations extends AcademicSubject {
  classSubjects: { classId: string }[];
}

interface EditSubjectFormProps {
  subjectId: string;
}

export const EditSubjectForm = ({ subjectId }: EditSubjectFormProps) => {
  const router = useRouter();
  const { data: classes } = useAcademicClassesForSelection();
  const { data: academicSubject } = useAcademicSubjectById(subjectId);
  const { mutateAsync: updateSubject, isPending } = useUpdateAcademicSubject();

  const form = useForm<AcademicSubjectFormValues>({
    resolver: zodResolver(academicSubjectFormSchema),
    defaultValues: defaultAcademicSubjectValues,
  });

  useEffect(() => {
    if (academicSubject) {
      const subject = academicSubject as SubjectWithRelations;
      const dbClassIds = subject.classSubjects?.map((cs) => cs.classId) || [];

      form.reset({
        name: subject.name,
        displayName: subject.displayName,
        code: subject.code ?? "",
        group: subject.group ?? "",
        classIds: dbClassIds,
        isActive: subject.isActive,
        position: subject.position,
      });
    }
  }, [academicSubject, form]);

  const onSubmit = async (data: AcademicSubjectFormValues) => {
    try {
      await updateSubject({ id: subjectId, data });
      form.reset();
      router.push("/subjects");
    } catch (error) {
      console.error(error);
    }
  };

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
            <BookOpen className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Update Subject
            </h1>
            <p className="text-muted-foreground font-medium">
              Refine the details of your academic subject
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="size-24 text-primary" />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Subject Information
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Fill in the details below to update the subject.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form} key={academicSubject?.id}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Parent Classes - Multi Select */}
                <FormField
                  control={form.control}
                  name="classIds"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                          Associated Classes
                        </FormLabel>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5"
                        >
                          {field.value?.length || 0} Selected
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/50 shadow-inner">
                        {classes?.map((cls) => (
                          <label
                            key={cls.id}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-2xl border border-border/50 cursor-pointer transition-all hover:bg-background/80 hover:shadow-soft group",
                              field.value?.includes(cls.id)
                                ? "bg-background border-primary shadow-glow ring-4 ring-primary/5"
                                : "bg-card/30",
                            )}
                          >
                            <div className="relative flex items-center justify-center">
                              <Checkbox
                                checked={field.value?.includes(cls.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      cls.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (id) => id !== cls.id,
                                      ),
                                    );
                                  }
                                }}
                                className="rounded-md border-border/50 data-[state=checked]:bg-primary transition-all scale-110"
                              />
                            </div>
                            <span
                              className={cn(
                                "text-sm font-bold truncate transition-colors",
                                field.value?.includes(cls.id)
                                  ? "text-primary"
                                  : "text-foreground group-hover:text-primary/70",
                              )}
                            >
                              {cls.displayName}
                            </span>
                          </label>
                        ))}
                      </div>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Internal Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., class-10-physics"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Display Name */}
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
                          placeholder="e.g., Physics"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Code */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., PHY"
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Group */}
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
                        Group
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? ""}
                        value={field.value ?? ""}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full py-6">
                            <SelectValue placeholder="Select a Group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                          {groupOptions.map((subj) => (
                            <SelectItem
                              key={subj.value}
                              value={subj.value.toString()}
                              className="rounded-lg font-medium"
                            >
                              {subj.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Position */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Position
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status Toggle */}
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
                        Enable this subject to make it visible in the app.
                      </CardDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => router.back()}
                  className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[170px]"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
                  ) : (
                    <Save className="mr-2 h-4 w-4 stroke-[3]" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
