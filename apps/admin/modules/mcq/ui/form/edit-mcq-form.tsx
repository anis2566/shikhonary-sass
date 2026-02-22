"use client";

import {
  BookOpen,
  ChevronLeft,
  Loader2,
  Save,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";

import { mcqFormSchema, MCQFormValues } from "@workspace/schema";
import {
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
  useAcademicTopicsForSelection,
  useUpdateMCQ,
} from "@workspace/api-client";
import { mcqTypeOptions } from "@workspace/utils/constants";

interface EditMcqFormProps {
  mcq: MCQFormValues & { id: string };
}

export const EditMcqForm = ({ mcq }: EditMcqFormProps) => {
  const router = useRouter();
  const { mutateAsync: updateMCQ, isPending } = useUpdateMCQ();

  const form = useForm<MCQFormValues>({
    resolver: zodResolver(mcqFormSchema),
    defaultValues: {
      question: mcq.question,
      answer: mcq.answer,
      chapterId: mcq.chapterId,
      subjectId: mcq.subjectId,
      topicId: mcq.topicId ?? "",
      subTopicId: mcq.subTopicId ?? "",
      options: mcq.options,
      type: mcq.type,
      isMath: mcq.isMath,
      reference: mcq.reference ?? [],
      explanation: mcq.explanation ?? "",
      context: mcq.context ?? "",
      statements: mcq.statements ?? [],
      session: mcq.session,
      source: mcq.source ?? "",
    },
  });

  const watchedSubjectId = form.watch("subjectId");
  const watchedChapterId = form.watch("chapterId");
  const watchedOptions = form.watch("options");
  const watchedStatements = form.watch("statements");

  const { data: subjects } = useAcademicSubjectsForSelection();
  const { data: chapters } = useAcademicChaptersForSelection(watchedSubjectId);
  const { data: topics } = useAcademicTopicsForSelection(watchedChapterId);

  const onSubmit = async (data: MCQFormValues) => {
    try {
      await updateMCQ({ id: mcq.id, data });
      router.push("/mcqs");
    } catch (error) {
      console.error(error);
    }
  };

  const addOption = () => {
    const current = form.getValues("options");
    form.setValue("options", [...current, ""]);
  };

  const removeOption = (idx: number) => {
    const current = form.getValues("options");
    if (current.length <= 2) return;
    form.setValue(
      "options",
      current.filter((_, i) => i !== idx),
    );
  };

  const addStatement = () => {
    const current = form.getValues("statements") ?? [];
    form.setValue("statements", [...current, ""]);
  };

  const removeStatement = (idx: number) => {
    const current = form.getValues("statements") ?? [];
    form.setValue(
      "statements",
      current.filter((_, i) => i !== idx),
    );
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
              Edit MCQ
            </h1>
            <p className="text-muted-foreground font-medium">
              Update the multiple choice question details
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Classification Card */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="size-24 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Classification
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Link this MCQ to a subject and chapter
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Subject *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50">
                          {subjects?.map((s) => (
                            <SelectItem
                              key={s.id}
                              value={s.id}
                              className="rounded-lg font-medium"
                            >
                              {s.displayName}
                            </SelectItem>
                          ))}
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
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Chapter *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending || !watchedSubjectId}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold">
                            <SelectValue placeholder="Select chapter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50">
                          {chapters?.map((c) => (
                            <SelectItem
                              key={c.id}
                              value={c.id}
                              className="rounded-lg font-medium"
                            >
                              {c.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Topic (optional) */}
                <FormField
                  control={form.control}
                  name="topicId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Topic{" "}
                        <span className="text-muted-foreground/50 normal-case font-medium">
                          (optional)
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={isPending || !watchedChapterId}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold">
                            <SelectValue placeholder="Select topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50">
                          {topics?.map((t) => (
                            <SelectItem
                              key={t.id}
                              value={t.id}
                              className="rounded-lg font-medium"
                            >
                              {t.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Question Type *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50">
                          {mcqTypeOptions.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              className="rounded-lg font-medium"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Session */}
                <FormField
                  control={form.control}
                  name="session"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Session Year *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={String(new Date().getFullYear())}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Source */}
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Source{" "}
                        <span className="text-muted-foreground/50 normal-case font-medium">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., NCTB, Board Exam 2024"
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* isMath switch */}
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="isMath"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-border/50 bg-primary/5 p-6 shadow-soft transition-all hover:bg-primary/[0.07]">
                      <div className="space-y-1">
                        <FormLabel className="text-lg font-bold text-foreground flex items-center gap-2">
                          Math Rendering
                          {field.value && (
                            <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase">
                              On
                            </Badge>
                          )}
                        </FormLabel>
                        <CardDescription className="text-muted-foreground font-medium">
                          Enable LaTeX math rendering for this question.
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
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Question Content
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Write the question and optionally provide context or statements
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Context */}
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Context / Passage{" "}
                      <span className="text-muted-foreground/50 normal-case font-medium">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a shared context or passage for the question..."
                        {...field}
                        value={field.value ?? ""}
                        disabled={isPending}
                        className="min-h-[80px] bg-background/50 border-border/50 rounded-xl px-4 py-3 font-medium resize-none"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />

              {/* Question */}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Question *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the MCQ question here..."
                        {...field}
                        disabled={isPending}
                        className="min-h-[100px] bg-background/50 border-border/50 rounded-xl px-4 py-3 font-medium resize-none"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />

              {/* Statements */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Statements{" "}
                    <span className="text-muted-foreground/50 normal-case font-medium">
                      (optional)
                    </span>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStatement}
                    disabled={isPending}
                    className="h-8 px-3 rounded-xl border-border/50 font-semibold text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Statement
                  </Button>
                </div>
                <div className="space-y-2">
                  {(watchedStatements ?? []).map((_, idx) => (
                    <FormField
                      key={idx}
                      control={form.control}
                      name={`statements.${idx}`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                              {idx + 1}.
                            </span>
                            <FormControl>
                              <Input
                                placeholder={`Statement ${idx + 1}`}
                                {...field}
                                disabled={isPending}
                                className="h-10 bg-background/50 border-border/50 rounded-xl px-4 font-medium flex-1"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 flex-shrink-0"
                              onClick={() => removeStatement(idx)}
                              disabled={isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage className="font-bold text-xs ml-8" />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options Card */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Answer Options
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Edit options and specify the correct answer
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Options *
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={isPending}
                    className="h-8 px-3 rounded-xl border-border/50 font-semibold text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {watchedOptions.map((_, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <FormField
                        key={idx}
                        control={form.control}
                        name={`options.${idx}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-black text-muted-foreground">
                                {letter}
                              </span>
                              <FormControl>
                                <Input
                                  placeholder={`Option ${letter}`}
                                  {...field}
                                  disabled={isPending}
                                  className="h-10 bg-background/50 border-border/50 rounded-xl px-4 font-medium flex-1"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 flex-shrink-0"
                                onClick={() => removeOption(idx)}
                                disabled={
                                  isPending || watchedOptions.length <= 2
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <FormMessage className="font-bold text-xs ml-9" />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Correct Answer */}
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Correct Answer *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the correct answer text exactly as written above"
                        {...field}
                        disabled={isPending}
                        className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Explanation Card */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Explanation & References
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Provide an explanation and any reference materials
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Explanation{" "}
                      <span className="text-muted-foreground/50 normal-case font-medium">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why the correct answer is correct..."
                        {...field}
                        value={field.value ?? ""}
                        disabled={isPending}
                        className="min-h-[100px] bg-background/50 border-border/50 rounded-xl px-4 py-3 font-medium resize-none"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
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
              Update MCQ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
