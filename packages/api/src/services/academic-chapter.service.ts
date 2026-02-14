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

export class AcademicChapterService {
  constructor(private db: PrismaClient) { }

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    subjectId?: string;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where = buildWhere(input);
      if (input.subjectId) where.subjectId = input.subjectId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.academicChapter.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            subject: {
              include: { class: true },
            },
            _count: {
              select: { topics: true, mcqs: true },
            },
          },
        }),
        this.db.academicChapter.count({ where }),
      ]);

      return createPaginatedResponse(items, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      return await this.db.academicChapter.findUnique({
        where: { id },
        include: {
          subject: true,
          topics: {
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
        const count = await this.db.academicChapter.count({
          where: { subjectId: data.subjectId },
        });
        data.position = count;
      }
      return await this.db.academicChapter.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, data: any): Promise<any | undefined> {
    try {
      return await this.db.academicChapter.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      return await this.db.academicChapter.delete({
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
          this.db.academicChapter.update({
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
    subjectId?: string,
  ): Promise<{ total: number; active: number; inactive: number } | undefined> {
    try {
      const where = subjectId ? { subjectId } : {};
      const [total, active] = await Promise.all([
        this.db.academicChapter.count({ where }),
        this.db.academicChapter.count({ where: { ...where, isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
