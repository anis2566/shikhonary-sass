import { z } from "zod";
import { type AcademicTopic, type PrismaClient } from "@workspace/db";
import {
  academicTopicFormSchema,
  updateAcademicTopicSchema,
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

export interface TopicWithRelations extends AcademicTopic {
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
  subtopics?: {
    id: string;
    name: string;
    displayName: string;
    position: number;
    isActive: boolean;
    _count?: {
      mcqs: number;
      cqs: number;
    };
  }[];
  _count?: {
    subtopics: number;
    mcqs: number;
  };
}

export interface TopicDetailedStats {
  overview: {
    totalSubTopics: number;
    activeSubTopics: number;
    totalMcqs: number;
    totalCqs: number;
    totalQuestions: number;
    completionRate: number;
  };
}

export interface TopicStatisticsData {
  contentDistribution: {
    id: string;
    name: string;
    questions: number;
    percentage: number;
  }[];
  hierarchy: {
    subTopics: number;
    questions: number;
  };
  questionBank: {
    mcqs: number;
    cqs: number;
    total: number;
  };
}

export interface RecentSubTopic {
  id: string;
  name: string;
  displayName: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    mcqs: number;
    cqs: number;
  };
}

const reorderItemsSchema = z.array(
  z.object({
    id: uuidSchema,
    position: z.number().int().min(0),
  }),
);

export class AcademicTopicService {
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
  }): Promise<PaginatedResponse<TopicWithRelations> | undefined> {
    try {
      const where: any = buildWhere(input);
      if (input.chapterId) {
        where.chapterId = input.chapterId;
      } else if (input.subjectId) {
        where.chapter = {
          subjectId: input.subjectId,
        };
      } else if (input.classId) {
        where.chapter = {
          subject: {
            classId: input.classId,
          },
        };
      }

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

      return createPaginatedResponse(
        items as TopicWithRelations[],
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<TopicWithRelations | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.academicTopic.findUnique({
        where: { id: validatedId },
        include: {
          chapter: {
            include: { subject: { include: { class: true } } },
          },
          subtopics: {
            orderBy: { position: "asc" },
            include: {
              _count: {
                select: { mcqs: true, cqs: true },
              },
            },
          },
          _count: {
            select: { subtopics: true, mcqs: true },
          },
        },
      });
      return item as TopicWithRelations | null;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: AcademicTopic): Promise<AcademicTopic | undefined> {
    try {
      const data = academicTopicFormSchema.parse(input);
      const { classId, subjectId, parentId, ...rest } = data;
      if (rest.position === undefined) {
        const count = await this.db.academicTopic.count({
          where: { chapterId: rest.chapterId },
        });
        (rest as any).position = count;
      }
      return await this.db.academicTopic.create({ data: rest as any });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    input: AcademicTopic,
  ): Promise<AcademicTopic | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateAcademicTopicSchema.parse(input);
      const { classId, subjectId, parentId, ...rest } = data;
      return await this.db.academicTopic.update({
        where: { id: validatedId },
        data: rest as any,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<AcademicTopic | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.academicTopic.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async reorder(
    items: { id: string; position: number }[],
  ): Promise<AcademicTopic[] | undefined> {
    try {
      const validatedItems = reorderItemsSchema.parse(items);
      return await this.db.$transaction(
        validatedItems.map((item) =>
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

  async bulkActive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicTopic.updateMany({
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
      return await this.db.academicTopic.updateMany({
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
      return await this.db.academicTopic.deleteMany({
        where: { id: { in: validatedIds } },
      });
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

  async forSelection(
    chapterId?: string,
  ): Promise<{ id: string; displayName: string }[] | undefined> {
    try {
      const where: { isActive: boolean; chapterId?: string } = {
        isActive: true,
      };
      if (chapterId) where.chapterId = chapterId;

      return await this.db.academicTopic.findMany({
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

  async getDetailedStats(id: string): Promise<TopicDetailedStats | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [subtopicCount, mcqCount, cqCount] = await Promise.all([
        this.db.academicSubTopic.count({ where: { topicId: validatedId } }),
        this.db.mcq.count({ where: { topicId: validatedId } }),
        this.db.cq.count({ where: { topicId: validatedId } }),
      ]);

      const [totalSubTopics, activeSubTopics] = await Promise.all([
        this.db.academicSubTopic.count({ where: { topicId: validatedId } }),
        this.db.academicSubTopic.count({
          where: { topicId: validatedId, isActive: true },
        }),
      ]);

      const completionRate =
        totalSubTopics > 0 ? (activeSubTopics / totalSubTopics) * 100 : 0;

      return {
        overview: {
          totalSubTopics: subtopicCount,
          activeSubTopics,
          totalMcqs: mcqCount,
          totalCqs: cqCount,
          totalQuestions: mcqCount + cqCount,
          completionRate,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getRecentSubTopics(input: {
    topicId: string;
    limit: number;
  }): Promise<RecentSubTopic[] | undefined> {
    try {
      const validatedTopicId = uuidSchema.parse(input.topicId);
      return await this.db.academicSubTopic.findMany({
        where: { topicId: validatedTopicId },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        include: {
          _count: {
            select: { mcqs: true, cqs: true },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStatisticsData(
    id: string,
  ): Promise<TopicStatisticsData | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [subtopics, mcqCount, cqCount] = await Promise.all([
        this.db.academicSubTopic.findMany({
          where: { topicId: validatedId },
          select: {
            id: true,
            displayName: true,
            _count: {
              select: {
                mcqs: true,
                cqs: true,
              },
            },
          },
          orderBy: { position: "asc" },
        }),
        this.db.mcq.count({ where: { topicId: validatedId } }),
        this.db.cq.count({ where: { topicId: validatedId } }),
      ]);

      const totalQuestions = mcqCount + cqCount;

      return {
        contentDistribution: subtopics.map((st) => {
          const stQuestions = st._count.mcqs + st._count.cqs;
          const percentage =
            totalQuestions > 0
              ? Math.round((stQuestions / totalQuestions) * 100)
              : 0;

          return {
            id: st.id,
            name: st.displayName,
            questions: stQuestions,
            percentage,
          };
        }),
        questionBank: {
          mcqs: mcqCount,
          cqs: cqCount,
          total: totalQuestions,
        },
        hierarchy: {
          subTopics: subtopics.length,
          questions: totalQuestions,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
