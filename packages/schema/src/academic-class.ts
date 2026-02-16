import { z } from "zod";
import { ACADEMIC_LEVEL } from "@workspace/utils/constants";
import { nameSchema } from "./shared/fields";

/**
 * Academic Class Schema
 */

export const academicClassFormSchema = z.object({
  name: nameSchema,
  displayName: nameSchema,
  level: z.nativeEnum(ACADEMIC_LEVEL, {
    errorMap: () => ({ message: "Please select a valid academic level" }),
  }),
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
  isActive: z.boolean(),
});

export type AcademicClassFormValues = z.infer<typeof academicClassFormSchema>;

export const academicClassSchema = academicClassFormSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AcademicClass = z.infer<typeof academicClassSchema>;

export const defaultAcademicClassValues: AcademicClassFormValues = {
  name: "",
  displayName: "",
  level: ACADEMIC_LEVEL.SECONDARY,
  position: 0,
  isActive: true,
};

export const updateAcademicClassSchema = academicClassFormSchema.partial();
