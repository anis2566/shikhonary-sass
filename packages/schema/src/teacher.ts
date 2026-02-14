import { z } from "zod";
import { GENDER } from "@workspace/utils/constants";
import {
  nameSchema,
  emailSchema,
  bdPhoneSchema,
  addressSchema,
  citySchema,
  stateSchema,
  postalCodeSchema,
} from "./shared/fields.js";

/**
 * Teacher Schema
 */

export const teacherFormSchema = z.object({
  // Personal Info
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: bdPhoneSchema,
  dateOfBirth: z.coerce.date().optional(),
  gender: z.nativeEnum(GENDER),
  qualification: z.string().min(1, "Qualification is required"),
  bio: z.string().max(500).optional().or(z.literal("")),

  // Professional
  employeeId: z.string().min(1, "Employee ID is required"),
  designation: z.string().min(1, "Designation is required"),
  joiningDate: z.coerce.date().optional(),

  // Address
  address: addressSchema.optional().or(z.literal("")),
  city: citySchema.optional().or(z.literal("")),
  state: stateSchema.optional().or(z.literal("")),
  postalCode: postalCodeSchema,

  // Status
  isActive: z.boolean().default(true),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;

export const defaultTeacherValues: Partial<TeacherFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: GENDER.MALE,
  qualification: "",
  bio: "",
  employeeId: "",
  designation: "",
  isActive: true,
};

export const updateTeacherSchema = teacherFormSchema.partial();
