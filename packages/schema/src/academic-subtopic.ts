import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields.js";

/**
 * Academic Sub-Topic Schema
 */

export const academicSubTopicFormSchema = z.object({
  topicId: uuidSchema.or(z.string().min(1, "Please select a topic")),
  name: nameSchema,
  displayName: nameSchema,
  position: z.coerce
    .number()
    .int()
    .min(0, "Position must be 0 or greater")
    .default(0),
  isActive: z.boolean().default(true),
});

export type AcademicSubTopicFormValues = z.infer<
  typeof academicSubTopicFormSchema
>;

export const defaultAcademicSubTopicValues: AcademicSubTopicFormValues = {
  topicId: "",
  name: "",
  displayName: "",
  position: 0,
  isActive: true,
};

export const updateAcademicSubTopicSchema =
  academicSubTopicFormSchema.partial();
