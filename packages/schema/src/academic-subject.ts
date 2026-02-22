import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields";

/**
 * Academic Subject Schema
 */

export const academicSubjectFormSchema = z.object({
  classIds: z.array(z.string()).min(1, "Please select at least one class"),
  name: nameSchema,
  displayName: nameSchema,
  code: z.string().max(20, "Code must be less than 20 characters").nullable(),
  group: z.string().max(50, "Group must be less than 50 characters").nullable(),
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
  isActive: z.boolean(),
});

export type AcademicSubjectFormValues = z.infer<
  typeof academicSubjectFormSchema
>;

export const defaultAcademicSubjectValues: AcademicSubjectFormValues = {
  classIds: [],
  name: "",
  displayName: "",
  code: null,
  group: null,
  position: 0,
  isActive: true,
};

export const academicSubjectSchema = academicSubjectFormSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AcademicSubject = z.infer<typeof academicSubjectSchema>;

export const updateAcademicSubjectSchema = academicSubjectFormSchema.partial();
