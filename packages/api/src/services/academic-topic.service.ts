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

export class AcademicTopicService {
  constructor(private db: PrismaClient) { }

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    chapterId?: string;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where = buildWhere(input);
      if (input.chapterId) where.chapterId = input.chapterId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.academicTopic.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            chapter: {
              include: { subject: { include: { class: true } } },
            },
            _count: {
              select: { subtopics: true, mcqs: true },
            },
          },
        }),
        this.db.academicTopic.count({ where }),
      ]);

      return createPaginatedResponse(items, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      return await this.db.academicTopic.findUnique({
        where: { id },
        include: {
          chapter: true,
          subtopics: {
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
        const count = await this.db.academicTopic.count({
          where: { chapterId: data.chapterId },
        });
        data.position = count;
      }
      return await this.db.academicTopic.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, data: any): Promise<any | undefined> {
    try {
      return await this.db.academicTopic.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      return await this.db.academicTopic.delete({
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
          this.db.academicTopic.update({
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
    chapterId?: string,
  ): Promise<{ total: number; active: number; inactive: number } | undefined> {
    try {
      const where = chapterId ? { chapterId } : {};
      const [total, active] = await Promise.all([
        this.db.academicTopic.count({ where }),
        this.db.academicTopic.count({ where: { ...where, isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
