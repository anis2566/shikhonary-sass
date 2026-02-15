"use client";

import { GraduationCap, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import {
  academicClassFormSchema,
  AcademicClassFormValues,
  defaultAcademicClassValues,
} from "@workspace/schema";
import { ACADEMIC_LEVEL } from "@workspace/utils/constant";

import { useUpdateAcademicClass } from "@/trpc/api/use-academic-class";
import { useAcademicClassById } from "@/trpc/api/use-academic-class";

interface EditClassFormProps {
  classId: string;
}

export function EditClassForm({ classId }: EditClassFormProps) {
  const router = useRouter();
  const { data: academicClass } = useAcademicClassById(classId);
  const { mutateAsync: updateClass, isPending } = useUpdateAcademicClass();

  const form = useForm<AcademicClassFormValues>({
    resolver: zodResolver(academicClassFormSchema),
    defaultValues: defaultAcademicClassValues,
  });

  useEffect(() => {
    if (academicClass) {
      form.reset({
        name: academicClass?.name,
        displayName: academicClass?.displayName,
        level: academicClass?.level as ACADEMIC_LEVEL,
        position: academicClass?.position,
        isActive: academicClass?.isActive,
      });
    }
  }, [academicClass, form]);

  const onSubmit = async (data: AcademicClassFormValues) => {
    await updateClass({ id: classId, data })
      .then(() => {
        form.reset();
        router.push("/classes");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="w-full p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Update Academic Class
          </CardTitle>
          <CardDescription>
            Customize academic class information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Class 10"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
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
                        placeholder="e.g., Tenth Grade"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select academic level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ACADEMIC_LEVEL).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <CardDescription>
                        Make this class available for students
                      </CardDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Class
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
