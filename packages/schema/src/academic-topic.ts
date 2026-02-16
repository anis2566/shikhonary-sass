import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields";

/**
 * Academic Topic Schema
 */

export const academicTopicFormSchema = z.object({
  classId: z.string().optional().nullable(),
  subjectId: z.string().optional().nullable(),
  chapterId: z.string().min(1, "Please select a chapter"),
  parentId: z.string().optional().nullable(),
  name: nameSchema,
  displayName: nameSchema,
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
  isActive: z.boolean(),
});

export type AcademicTopicFormValues = z.infer<typeof academicTopicFormSchema>;

export const defaultAcademicTopicValues: AcademicTopicFormValues = {
  classId: "",
  subjectId: "",
  chapterId: "",
  parentId: "none",
  name: "",
  displayName: "",
  position: 0,
  isActive: true,
};

export const updateAcademicTopicSchema = academicTopicFormSchema.partial();
