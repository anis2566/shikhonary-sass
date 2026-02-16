import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields";

/**
 * Academic Chapter Schema
 */

export const academicChapterFormSchema = z.object({
  subjectId: z.string().min(1, "Please select a subject"),
  name: nameSchema,
  displayName: nameSchema,
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
  isActive: z.boolean(),
});

export type AcademicChapterFormValues = z.infer<
  typeof academicChapterFormSchema
>;

export const defaultAcademicChapterValues: AcademicChapterFormValues = {
  subjectId: "",
  name: "",
  displayName: "",
  position: 0,
  isActive: true,
};

export const updateAcademicChapterSchema = academicChapterFormSchema.partial();
