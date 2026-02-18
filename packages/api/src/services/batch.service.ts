import { z } from "zod";
import { handlePrismaError } from "../middleware/error-handler";
import {
  batchFormSchema,
  updateBatchSchema,
  uuidSchema,
  BatchFormValues,
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
 * Service for managing Batches (Tenant Level)
 */
export class BatchService {
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
    classId?: string;
    academicYear?: string;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where = buildWhere(input, ["name", "className"]);
      if (input.classId) where.academicClassId = input.classId;
      if (input.academicYear) where.academicYear = input.academicYear;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.batch.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            _count: { select: { students: true } },
          },
        }),
        this.db.batch.count({ where }),
      ]);

      return createPaginatedResponse(items, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.batch.findUnique({
        where: { id: validatedId },
        include: {
          students: { take: 10, orderBy: { name: "asc" } },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: BatchFormValues): Promise<any | undefined> {
    try {
      const data = batchFormSchema.parse(input);
      return await this.db.batch.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: BatchFormValues): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateBatchSchema.parse(input);
      return await this.db.batch.update({
        where: { id: validatedId },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.batch.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(
    classId?: string,
  ): Promise<{ total: number; active: number; inactive: number } | undefined> {
    try {
      const where = classId ? { academicClassId: classId } : {};
      const total = await this.db.batch.count({ where });
      const active = await this.db.batch.count({
        where: { ...where, isActive: true },
      });
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
