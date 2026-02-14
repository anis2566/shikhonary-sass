import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields.js";

/**
 * Academic Topic Schema
 */

export const academicTopicFormSchema = z.object({
  chapterId: uuidSchema.or(z.string().min(1, "Please select a chapter")),
  name: nameSchema,
  displayName: nameSchema,
  position: z.coerce
    .number()
    .int()
    .min(0, "Position must be 0 or greater")
    .default(0),
  isActive: z.boolean().default(true),
});

export type AcademicTopicFormValues = z.infer<typeof academicTopicFormSchema>;

export const defaultAcademicTopicValues: AcademicTopicFormValues = {
  chapterId: "",
  name: "",
  displayName: "",
  position: 0,
  isActive: true,
};

export const updateAcademicTopicSchema = academicTopicFormSchema.partial();
