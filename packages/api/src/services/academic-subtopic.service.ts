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

export class AcademicSubTopicService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    topicId?: string;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where = buildWhere(input);
      if (input.topicId) where.topicId = input.topicId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.academicSubTopic.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            topic: {
              include: {
                chapter: { include: { subject: { include: { class: true } } } },
              },
            },
            _count: {
              select: { mcqs: true },
            },
          },
        }),
        this.db.academicSubTopic.count({ where }),
      ]);

      return createPaginatedResponse(items, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      return await this.db.academicSubTopic.findUnique({
        where: { id },
        include: {
          topic: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(data: any): Promise<any | undefined> {
    try {
      if (data.position === undefined) {
        const count = await this.db.academicSubTopic.count({
          where: { topicId: data.topicId },
        });
        data.position = count;
      }
      return await this.db.academicSubTopic.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, data: any): Promise<any | undefined> {
    try {
      return await this.db.academicSubTopic.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      return await this.db.academicSubTopic.delete({
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
          this.db.academicSubTopic.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkActive(ids: string[]): Promise<any | undefined> {
    try {
      return await this.db.academicSubTopic.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDeactive(ids: string[]): Promise<any | undefined> {
    try {
      return await this.db.academicSubTopic.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<any | undefined> {
    try {
      return await this.db.academicSubTopic.deleteMany({
        where: { id: { in: ids } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(
    topicId?: string,
  ): Promise<{ total: number; active: number; inactive: number } | undefined> {
    try {
      const where = topicId ? { topicId } : {};
      const [total, active] = await Promise.all([
        this.db.academicSubTopic.count({ where }),
        this.db.academicSubTopic.count({ where: { ...where, isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
