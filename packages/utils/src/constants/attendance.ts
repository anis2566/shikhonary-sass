import { enumToOptions } from "../enum-utils.js";

/**
 * Daily attendance status for students/staff
 */
export enum ATTENDANCE_STATUS {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
}

export const attendanceStatusOptions = [
  { value: ATTENDANCE_STATUS.PRESENT, label: "Present" },
  { value: ATTENDANCE_STATUS.ABSENT, label: "Absent" },
  { value: ATTENDANCE_STATUS.LATE, label: "Late" },
  { value: ATTENDANCE_STATUS.EXCUSED, label: "Excused/Leave" },
] as const;

export const attendanceStatusMap = enumToOptions(ATTENDANCE_STATUS);
