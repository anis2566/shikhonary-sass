import { type PrismaClient } from "@workspace/db";
import { type MCQ } from "@workspace/schema";
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

export class McqService {
  constructor(private db: PrismaClient) { }

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    subjectId?: string;
    chapterId?: string;
    type?: string;
  }): Promise<
    PaginatedResponse<MCQ & { subject: any; chapter: any }> | undefined
  > {
    try {
      const where = buildWhere(input, ["question", "explanation"]);
      if (input.subjectId) where.subjectId = input.subjectId;
      if (input.chapterId) where.chapterId = input.chapterId;
      if (input.type) where.type = input.type;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.mcq.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            subject: true,
            chapter: true,
          },
        }),
        this.db.mcq.count({ where }),
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
      return await this.db.mcq.findUnique({
        where: { id },
        include: {
          subject: true,
          chapter: true,
          topic: true,
          subtopic: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(data: any): Promise<MCQ | undefined> {
    try {
      const item = await this.db.mcq.create({ data });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, data: any): Promise<MCQ | undefined> {
    try {
      const item = await this.db.mcq.update({
        where: { id },
        data,
      });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<MCQ | undefined> {
    try {
      const item = await this.db.mcq.delete({
        where: { id },
      });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<any | undefined> {
    try {
      return await this.db.mcq.deleteMany({
        where: { id: { in: ids } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(chapterId?: string): Promise<any | undefined> {
    try {
      const where = chapterId ? { chapterId } : {};
      const total = await this.db.mcq.count({ where });
      // Example of type-based stats
      const types = await this.db.mcq.groupBy({
        by: ["type"],
        where,
        _count: true,
      });

      return { total, types };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
