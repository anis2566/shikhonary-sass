import { type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";

export class AcademicSubjectService {
  constructor(private db: PrismaClient) { }

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    classId?: string;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where = buildWhere(input);
      if (input.classId) where.classId = input.classId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.academicSubject.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            class: true,
            _count: {
              select: { chapters: true, mcqs: true },
            },
          },
        }),
        this.db.academicSubject.count({ where }),
      ]);

      return createPaginatedResponse(items, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      return await this.db.academicSubject.findUnique({
        where: { id },
        include: {
          class: true,
          chapters: {
            orderBy: { position: "asc" },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(data: any): Promise<any | undefined> {
    try {
      if (data.position === undefined) {
        const count = await this.db.academicSubject.count({
          where: { classId: data.classId },
        });
        data.position = count;
      }
      return await this.db.academicSubject.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, data: any): Promise<any | undefined> {
    try {
      return await this.db.academicSubject.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      return await this.db.academicSubject.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async reorder(
    items: { id: string; position: number }[],
  ): Promise<any | undefined> {
    try {
      return await this.db.$transaction(
        items.map((item) =>
          this.db.academicSubject.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(
    classId?: string,
  ): Promise<{ total: number; active: number; inactive: number } | undefined> {
    try {
      const where = classId ? { classId } : {};
      const [total, active] = await Promise.all([
        this.db.academicSubject.count({ where }),
        this.db.academicSubject.count({ where: { ...where, isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
