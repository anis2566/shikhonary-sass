import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields.js";

/**
 * Academic Subject Schema
 */

export const academicSubjectFormSchema = z.object({
  academicClassId: uuidSchema.or(z.string().min(1, "Please select a class")),
  name: nameSchema,
  displayName: nameSchema,
  code: z
    .string()
    .max(20, "Code must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  position: z.coerce
    .number()
    .int()
    .min(0, "Position must be 0 or greater")
    .default(0),
  isActive: z.boolean().default(true),
});

export type AcademicSubjectFormValues = z.infer<
  typeof academicSubjectFormSchema
>;

export const defaultAcademicSubjectValues: AcademicSubjectFormValues = {
  academicClassId: "",
  name: "",
  displayName: "",
  code: "",
  position: 0,
  isActive: true,
};

export const updateAcademicSubjectSchema = academicSubjectFormSchema.partial();
