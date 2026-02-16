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
import {
  type AcademicChapter,
  type AcademicTopic,
  type PrismaClient,
} from "@workspace/db";
import { type AcademicChapterFormValues } from "@workspace/schema";

export interface ChapterWithRelations extends AcademicChapter {
  subject?: {
    id: string;
    displayName: string;
    class?: {
      id: string;
      displayName: string;
    } | null;
  } | null;
  topics?: (AcademicTopic & {
    _count?: {
      subtopics: number;
      mcqs: number;
      cqs: number;
    };
  })[];
  _count?: {
    topics: number;
    mcqs: number;
    cqs: number;
  };
}

export interface ChapterDetailedStats {
  stats: {
    overview: {
      totalTopics: number;
      activeTopics: number;
      totalSubTopics: number;
      totalMcqs: number;
      totalCqs: number;
      totalQuestions: number;
      completionRate: number;
    };
  };
}

export interface ChapterStatisticsData {
  contentDistribution: {
    id: string;
    name: string;
    subtopics: number;
    percentage: number;
  }[];
  questionBank: {
    mcqs: number;
    cqs: number;
    total: number;
  };
  hierarchy: {
    topics: number;
    subTopics: number;
    questions: number;
  };
}

export interface RecentTopicsResponse {
  topics: (AcademicTopic & {
    _count?: {
      subtopics: number;
    };
  })[];
}

export class AcademicChapterService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    subjectId?: string;
  }): Promise<PaginatedResponse<ChapterWithRelations> | undefined> {
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
              select: { topics: true, mcqs: true, cqs: true },
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

  async getById(id: string): Promise<ChapterWithRelations | null | undefined> {
    try {
      return await this.db.academicChapter.findUnique({
        where: { id },
        include: {
          subject: {
            include: {
              class: true,
            },
          },
          topics: {
            orderBy: { position: "asc" },
            include: {
              _count: {
                select: {
                  subtopics: true,
                  mcqs: true,
                  cqs: true,
                },
              },
            },
          },
          _count: {
            select: {
              topics: true,
              mcqs: true,
              cqs: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(
    data: AcademicChapterFormValues,
  ): Promise<AcademicChapter | undefined> {
    try {
      if (data.position === undefined) {
        const count = await this.db.academicChapter.count({
          where: { subjectId: data.subjectId },
        });
        data.position = count;
      }
      return await this.db.academicChapter.create({ data: data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    data: Partial<AcademicChapterFormValues>,
  ): Promise<AcademicChapter | undefined> {
    try {
      return await this.db.academicChapter.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<AcademicChapter | undefined> {
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
  ): Promise<AcademicChapter[] | undefined> {
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

  async bulkActive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      return await this.db.academicChapter.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDeactive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      return await this.db.academicChapter.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      return await this.db.academicChapter.deleteMany({
        where: { id: { in: ids } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(
    subjectId?: string,
  ): Promise<
    | { total: number; active: number; inactive: number; totalTopics: number }
    | undefined
  > {
    try {
      const where = subjectId ? { subjectId } : {};
      const [total, active, totalTopics] = await Promise.all([
        this.db.academicChapter.count({ where }),
        this.db.academicChapter.count({ where: { ...where, isActive: true } }),
        this.db.academicTopic.count({
          where: { chapter: where },
        }),
      ]);
      return { total, active, inactive: total - active, totalTopics };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getDetailedStats(
    id: string,
  ): Promise<ChapterDetailedStats | undefined> {
    try {
      const [topicCount, subtopicCount, mcqCount, cqCount] = await Promise.all([
        this.db.academicTopic.count({ where: { chapterId: id } }),
        this.db.academicSubTopic.count({
          where: { topic: { chapterId: id } },
        }),
        this.db.mcq.count({ where: { chapterId: id } }),
        this.db.cq.count({ where: { chapterId: id } }),
      ]);

      // Calculate completion rate based on active topics vs total topics
      const [totalTopics, activeTopics] = await Promise.all([
        this.db.academicTopic.count({ where: { chapterId: id } }),
        this.db.academicTopic.count({
          where: { chapterId: id, isActive: true },
        }),
      ]);

      const completionRate =
        totalTopics > 0 ? (activeTopics / totalTopics) * 100 : 0;

      return {
        stats: {
          overview: {
            totalTopics: topicCount,
            activeTopics,
            totalSubTopics: subtopicCount,
            totalMcqs: mcqCount,
            totalCqs: cqCount,
            totalQuestions: mcqCount + cqCount,
            completionRate,
          },
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStatisticsData(
    id: string,
  ): Promise<ChapterStatisticsData | undefined> {
    try {
      const [topics, subtopicCount] = await Promise.all([
        this.db.academicTopic.findMany({
          where: { chapterId: id },
          select: {
            id: true,
            displayName: true,
            _count: {
              select: {
                subtopics: true,
              },
            },
          },
          orderBy: { position: "asc" },
        }),
        this.db.academicSubTopic.count({
          where: { topic: { chapterId: id } },
        }),
      ]);

      const [mcqCount, cqCount] = await Promise.all([
        this.db.mcq.count({ where: { chapterId: id } }),
        this.db.cq.count({ where: { chapterId: id } }),
      ]);

      return {
        contentDistribution: topics.map((t) => ({
          id: t.id,
          name: t.displayName,
          subtopics: t._count.subtopics,
          percentage: 100 / (topics.length || 1), // Simple distribution for now
        })),
        questionBank: {
          mcqs: mcqCount,
          cqs: cqCount,
          total: mcqCount + cqCount,
        },
        hierarchy: {
          topics: topics.length,
          subTopics: subtopicCount,
          questions: mcqCount + cqCount,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getRecentTopics(input: {
    chapterId: string;
    limit: number;
  }): Promise<RecentTopicsResponse | undefined> {
    try {
      const topics = await this.db.academicTopic.findMany({
        where: { chapterId: input.chapterId },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        include: {
          _count: {
            select: { subtopics: true },
          },
        },
      });

      return {
        topics: topics.map((t) => ({
          ...t,
        })),
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
