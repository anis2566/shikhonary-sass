import { z } from "zod";
import { GENDER, BLOOD_GROUP, RELIGION } from "@workspace/utils/constants";
import {
  nameSchema,
  emailSchema,
  bdPhoneSchema,
  uuidSchema,
  addressSchema,
  citySchema,
  stateSchema,
  postalCodeSchema,
} from "./shared/fields.js";

/**
 * Student Schema
 */

export const studentFormSchema = z.object({
  // Personal Info
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema.optional().or(z.literal("")),
  phone: bdPhoneSchema,
  dateOfBirth: z.coerce.date({
    errorMap: () => ({ message: "Please provide a valid date of birth" }),
  }),
  gender: z.nativeEnum(GENDER),
  bloodGroup: z.nativeEnum(BLOOD_GROUP).optional().nullable(),
  religion: z.nativeEnum(RELIGION).optional().nullable(),
  nationality: z.string().default("Bangladeshi"),

  // Academic Info
  studentId: z.string().min(1, "Student ID is required"),
  academicClassId: uuidSchema.or(z.string().min(1, "Please select a class")),
  batchId: uuidSchema.or(z.string().min(1, "Please select a batch")),
  rollNo: z.string().optional().or(z.literal("")),
  session: z.string().min(1, "Session is required"),

  // Guardian Info
  guardianName: nameSchema,
  guardianPhone: bdPhoneSchema,
  guardianEmail: emailSchema.optional().or(z.literal("")),
  relationToGuardian: z.string().min(1, "Relation to guardian is required"),

  // Address
  presentAddress: addressSchema,
  presentCity: citySchema,
  presentState: stateSchema,
  presentPostalCode: postalCodeSchema,

  sameAsPresentAddress: z.boolean().default(true),

  permanentAddress: addressSchema.optional().or(z.literal("")),
  permanentCity: citySchema.optional().or(z.literal("")),
  permanentState: stateSchema.optional().or(z.literal("")),
  permanentPostalCode: postalCodeSchema,

  // Status
  isActive: z.boolean().default(true),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

export const defaultStudentValues: Partial<StudentFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: GENDER.MALE,
  bloodGroup: null,
  religion: RELIGION.ISLAM,
  nationality: "Bangladeshi",
  studentId: "",
  academicClassId: "",
  batchId: "",
  rollNo: "",
  session: new Date().getFullYear().toString(),
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  relationToGuardian: "",
  presentAddress: "",
  presentCity: "",
  presentState: "",
  presentPostalCode: "",
  sameAsPresentAddress: true,
  permanentAddress: "",
  permanentCity: "",
  permanentState: "",
  permanentPostalCode: "",
  isActive: true,
};

export const updateStudentSchema = studentFormSchema.partial();

export const studentSchema = studentFormSchema.extend({
  id: uuidSchema,
  name: z.string(), // firstName + lastName computed
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Student = z.infer<typeof studentSchema>;
