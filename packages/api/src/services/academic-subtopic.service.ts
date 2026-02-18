import { z } from "zod";
import { type AcademicSubTopic, type PrismaClient } from "@workspace/db";
import {
  academicSubTopicFormSchema,
  updateAcademicSubTopicSchema,
  uuidSchema,
} from "@workspace/schema";
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

export interface SubTopicWithRelations extends AcademicSubTopic {
  topic: {
    id: string;
    name: string;
    displayName: string;
    chapter: {
      id: string;
      name: string;
      displayName: string;
      subject: {
        id: string;
        name: string;
        displayName: string;
        class: {
          id: string;
          name: string;
          displayName: string;
        };
      };
    };
  };
  _count?: {
    mcqs: number;
    cqs: number;
  };
}

export interface SubTopicDetailedStats {
  overview: {
    totalMcqs: number;
    totalCqs: number;
    totalQuestions: number;
  };
}

export interface SubTopicStatisticsData {
  questionBank: {
    mcqs: number;
    cqs: number;
    total: number;
  };
  mcqDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
}

export interface RecentQuestionsResponse {
  mcqs: any[];
  cqs: any[];
}

const reorderItemsSchema = z.array(
  z.object({
    id: uuidSchema,
    position: z.number().int().min(0),
  }),
);

export class AcademicSubTopicService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    classId?: string;
    subjectId?: string;
    chapterId?: string;
    topicId?: string;
  }): Promise<PaginatedResponse<SubTopicWithRelations> | undefined> {
    try {
      const where: any = buildWhere(input);

      if (input.topicId) {
        where.topicId = input.topicId;
      } else if (input.chapterId) {
        where.topic = { chapterId: input.chapterId };
      } else if (input.subjectId) {
        where.topic = { chapter: { subjectId: input.subjectId } };
      } else if (input.classId) {
        where.topic = { chapter: { subject: { classId: input.classId } } };
      }

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
              select: { mcqs: true, cqs: true },
            },
          },
        }),
        this.db.academicSubTopic.count({ where }),
      ]);

      return createPaginatedResponse(
        items as SubTopicWithRelations[],
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<SubTopicWithRelations | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.academicSubTopic.findUnique({
        where: { id: validatedId },
        include: {
          topic: {
            include: {
              chapter: { include: { subject: { include: { class: true } } } },
            },
          },
          _count: {
            select: { mcqs: true, cqs: true },
          },
        },
      });
      return item as SubTopicWithRelations | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: AcademicSubTopic): Promise<AcademicSubTopic | undefined> {
    try {
      const data = academicSubTopicFormSchema.parse(input);
      const { classId, subjectId, chapterId, ...prismaData } = data;

      if (prismaData.position === undefined) {
        const count = await this.db.academicSubTopic.count({
          where: { topicId: prismaData.topicId },
        });
        (prismaData as any).position = count;
      }
      return await this.db.academicSubTopic.create({
        data: prismaData as any,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    input: AcademicSubTopic,
  ): Promise<AcademicSubTopic | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateAcademicSubTopicSchema.parse(input);
      const { classId, subjectId, chapterId, ...prismaData } = data;
      return await this.db.academicSubTopic.update({
        where: { id: validatedId },
        data: prismaData as any,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<AcademicSubTopic | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.academicSubTopic.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async reorder(
    items: { id: string; position: number }[],
  ): Promise<AcademicSubTopic[] | undefined> {
    try {
      const validatedItems = reorderItemsSchema.parse(items);
      return await this.db.$transaction(
        validatedItems.map((item) =>
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

  async bulkActive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicSubTopic.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDeactive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicSubTopic.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicSubTopic.deleteMany({
        where: { id: { in: validatedIds } },
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

  async forSelection(
    topicId?: string,
  ): Promise<{ id: string; displayName: string }[] | undefined> {
    try {
      const where: { isActive: boolean; topicId?: string } = { isActive: true };
      if (topicId) where.topicId = topicId;

      return await this.db.academicSubTopic.findMany({
        where,
        select: {
          id: true,
          displayName: true,
        },
        orderBy: { position: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getDetailedStats(
    id: string,
  ): Promise<SubTopicDetailedStats | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [mcqCount, cqCount] = await Promise.all([
        this.db.mcq.count({ where: { subTopicId: validatedId } }),
        this.db.cq.count({ where: { subTopicId: validatedId } }),
      ]);

      return {
        overview: {
          totalMcqs: mcqCount,
          totalCqs: cqCount,
          totalQuestions: mcqCount + cqCount,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStatisticsData(
    id: string,
  ): Promise<SubTopicStatisticsData | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [mcqCount, cqCount, mcqs] = await Promise.all([
        this.db.mcq.count({ where: { subTopicId: validatedId } }),
        this.db.cq.count({ where: { subTopicId: validatedId } }),
        this.db.mcq.findMany({
          where: { subTopicId: validatedId },
          select: { type: true },
        }),
      ]);

      const totalMcqs = mcqCount;
      const mcqTypes: Record<string, number> = {};
      mcqs.forEach((m) => {
        mcqTypes[m.type] = (mcqTypes[m.type] || 0) + 1;
      });

      const mcqDistribution = Object.entries(mcqTypes).map(([type, count]) => ({
        type,
        count,
        percentage: totalMcqs > 0 ? Math.round((count / totalMcqs) * 100) : 0,
      }));

      return {
        questionBank: {
          mcqs: mcqCount,
          cqs: cqCount,
          total: mcqCount + cqCount,
        },
        mcqDistribution,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getRecentQuestions(input: {
    subTopicId: string;
    limit: number;
  }): Promise<RecentQuestionsResponse | undefined> {
    try {
      const validatedSubTopicId = uuidSchema.parse(input.subTopicId);
      const [mcqs, cqs] = await Promise.all([
        this.db.mcq.findMany({
          where: { subTopicId: validatedSubTopicId },
          orderBy: { updatedAt: "desc" },
          take: input.limit,
        }),
        this.db.cq.findMany({
          where: { subTopicId: validatedSubTopicId },
          orderBy: { updatedAt: "desc" },
          take: input.limit,
        }),
      ]);

      return { mcqs, cqs };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
