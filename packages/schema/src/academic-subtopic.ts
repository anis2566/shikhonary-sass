import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields";

/**
 * Academic Sub-Topic Schema
 */

export const academicSubTopicFormSchema = z.object({
  classId: z.string().optional().nullable(),
  subjectId: z.string().optional().nullable(),
  chapterId: z.string().optional().nullable(),
  topicId: z.string().min(1, "Please select a topic"),
  name: nameSchema,
  displayName: nameSchema,
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
  isActive: z.boolean(),
});

export type AcademicSubTopicFormValues = z.infer<
  typeof academicSubTopicFormSchema
>;

export const defaultAcademicSubTopicValues: AcademicSubTopicFormValues = {
  classId: "",
  subjectId: "",
  chapterId: "",
  topicId: "",
  name: "",
  displayName: "",
  position: 0,
  isActive: true,
};

export const updateAcademicSubTopicSchema =
  academicSubTopicFormSchema.partial();
