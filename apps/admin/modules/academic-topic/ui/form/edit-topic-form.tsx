"use client";

import { BookText, ChevronLeft, Loader2, Save, Sparkles } from "lucide-react";
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
import { Separator } from "@workspace/ui/components/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  academicTopicFormSchema,
  AcademicTopicFormValues,
  defaultAcademicTopicValues,
} from "@workspace/schema";

import {
  useUpdateAcademicTopic,
  useAcademicTopicById,
  useAcademicClassesForSelection,
  useAcademicSubjectByClassId,
  useAcademicChaptersForSelection,
  useAcademicTopicsForSelection,
} from "@workspace/api-client";

interface EditTopicFormProps {
  topicId: string;
}

export function EditTopicForm({ topicId }: EditTopicFormProps) {
  const router = useRouter();
  const { data: topic } = useAcademicTopicById(topicId);
  const { mutateAsync: updateTopic, isPending } = useUpdateAcademicTopic();

  const { data: classes } = useAcademicClassesForSelection();

  const form = useForm<AcademicTopicFormValues>({
    resolver: zodResolver(academicTopicFormSchema),
    defaultValues: {
      ...defaultAcademicTopicValues,
      parentId: "none",
    },
  });

  const selectedClassId = form.watch("classId");
  const selectedSubjectId = form.watch("subjectId");
  const selectedChapterId = form.watch("chapterId");

  const { data: subjects } = useAcademicSubjectByClassId(selectedClassId || "");
  const { data: chapters } = useAcademicChaptersForSelection(
    selectedSubjectId || "",
  );
  const { data: topics } = useAcademicTopicsForSelection(
    selectedChapterId || "",
  );

  useEffect(() => {
    if (topic) {
      form.reset({
        name: topic.name,
        displayName: topic.displayName,
        chapterId: topic.chapterId,
        subjectId: topic.chapter.subject.id,
        classId: topic.chapter.subject.class?.id || "",
        parentId: "none", // Currently editing a top-level topic, sub-topic edit would be different
        position: topic.position,
        isActive: topic.isActive,
      });
    }
  }, [topic, form]);

  const onSubmit = async (data: AcademicTopicFormValues) => {
    try {
      await updateTopic({ id: topicId, data });
      router.push("/topics");
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
            <BookText className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Edit Topic
            </h1>
            <p className="text-muted-foreground font-medium">
              Update the details of your academic topic
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
            Topic Configuration
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Modify the parameters for this module.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form} key={topic?.id}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Parent Selection Grid */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 bg-muted/20 p-6 rounded-3xl border border-border/50">
                  {/* Parent Class */}
                  <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
                          Class
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full">
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                            {classes?.map((cls) => (
                              <SelectItem
                                key={cls.id}
                                value={cls.id.toString()}
                                className="rounded-lg font-medium"
                              >
                                {cls.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-bold text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
                          Subject
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                          disabled={isPending || !selectedClassId}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                            {subjects?.length ? (
                              subjects.map((subj) => (
                                <SelectItem
                                  key={subj.id}
                                  value={subj.id.toString()}
                                  className="rounded-lg font-medium"
                                >
                                  {subj.displayName}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-xs text-muted-foreground italic font-medium">
                                No subjects available for this class
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-bold text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Chapter */}
                  <FormField
                    control={form.control}
                    name="chapterId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
                          Chapter
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                          disabled={isPending || !selectedSubjectId}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full">
                              <SelectValue placeholder="Select a chapter" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                            {chapters?.length ? (
                              chapters.map((ch) => (
                                <SelectItem
                                  key={ch.id}
                                  value={ch.id.toString()}
                                  className="rounded-lg font-medium"
                                >
                                  {ch.displayName}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-xs text-muted-foreground italic font-medium">
                                No chapters available for this subject
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-bold text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Parent Topic */}
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
                          Parent Topic (Optional)
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString() || "none"}
                          disabled={isPending || !selectedChapterId}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full">
                              <SelectValue placeholder="Select a parent topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                            <SelectItem
                              value="none"
                              className="rounded-lg font-medium italic opacity-60"
                            >
                              None (Top-level topic)
                            </SelectItem>
                            {topics?.length &&
                              topics.map((topic) => (
                                <SelectItem
                                  key={topic.id}
                                  value={topic.id.toString()}
                                  className="rounded-lg font-medium"
                                >
                                  {topic.displayName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-bold text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Separator className="bg-border/30" />
                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Internal Name (Slug)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., circular-motion"
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
                          placeholder="e.g., Circular Motion"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
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
                        Sort Position
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
                        Publish this topic to make it visible to users.
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
                  onClick={() => form.reset()}
                  className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all"
                >
                  Discard Changes
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[170px]"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
                  ) : (
                    <Save className="mr-2 h-4 w-4 stroke-[2.5]" />
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
}
