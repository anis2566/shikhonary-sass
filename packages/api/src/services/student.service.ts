import { z } from "zod";
import { handlePrismaError } from "../middleware/error-handler";
import {
  type Student,
  studentFormSchema,
  updateStudentSchema,
  uuidSchema,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";

/**
 * Service for managing Students (Tenant Level)
 */
export class StudentService {
  /**
   * Note: This service expects a Tenant-specific Prisma Client
   */
  constructor(private db: any) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    batchId?: string;
    classId?: string;
  }): Promise<PaginatedResponse<Student & { batch: any }> | undefined> {
    try {
      const where = buildWhere(input, ["name", "studentId", "email"]);
      if (input.batchId) where.batchId = input.batchId;
      if (input.classId) where.academicClassId = input.classId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.student.findMany({
          where,
          orderBy,
          ...pagination,
          include: { batch: true },
        }),
        this.db.student.count({ where }),
      ]);

      return createPaginatedResponse(
        items as any,
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.student.findUnique({
        where: { id: validatedId },
        include: { batch: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: Student): Promise<Student | undefined> {
    try {
      const data = studentFormSchema.parse(input);
      const item = await this.db.student.create({ data });
      return item as unknown as Student;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: Student): Promise<Student | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateStudentSchema.parse(input);
      const item = await this.db.student.update({
        where: { id: validatedId },
        data,
      });
      return item as unknown as Student;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<Student | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.student.delete({ where: { id: validatedId } });
      return item as unknown as Student;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkImport(students: unknown[]): Promise<any | undefined> {
    try {
      const data = z.array(studentFormSchema).parse(students);
      return await this.db.student.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
