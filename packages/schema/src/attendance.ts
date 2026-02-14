import { z } from "zod";
import { ATTENDANCE_STATUS } from "@workspace/utils/constants";
import { uuidSchema } from "./shared/fields.js";

/**
 * Attendance Schema
 */

export const attendanceSchema = z.object({
  studentId: uuidSchema,
  batchId: uuidSchema,
  date: z.coerce.date(),
  status: z.nativeEnum(ATTENDANCE_STATUS),
  note: z.string().max(200).optional().or(z.literal("")),
});

export const bulkAttendanceSchema = z.object({
  batchId: uuidSchema,
  date: z.coerce.date(),
  records: z
    .array(
      z.object({
        studentId: uuidSchema,
        status: z.nativeEnum(ATTENDANCE_STATUS),
        note: z.string().optional(),
      }),
    )
    .min(1, "At least one record is required"),
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
