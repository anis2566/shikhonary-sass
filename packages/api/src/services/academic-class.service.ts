import { type PrismaClient } from "@workspace/db";
import { type AcademicClass } from "@workspace/schema";
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

/**
 * Service for managing Academic Classes
 */
export class AcademicClassService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    level?: string;
  }): Promise<
    | PaginatedResponse<AcademicClass & { _count: { subjects: number } }>
    | undefined
  > {
    try {
      const where = buildWhere(input);
      if (input.level) where.level = input.level;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.academicClass.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            _count: {
              select: { subjects: true },
            },
          },
        }),
        this.db.academicClass.count({ where }),
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
      return await this.db.academicClass.findUnique({
        where: { id },
        include: {
          subjects: {
            orderBy: { position: "asc" },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(data: any): Promise<AcademicClass | undefined> {
    try {
      if (data.position === undefined) {
        const count = await this.db.academicClass.count();
        data.position = count;
      }
      const item = await this.db.academicClass.create({ data });
      return item as unknown as AcademicClass;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, data: any): Promise<AcademicClass | undefined> {
    try {
      const item = await this.db.academicClass.update({
        where: { id },
        data,
      });
      return item as unknown as AcademicClass;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<AcademicClass | undefined> {
    try {
      const item = await this.db.academicClass.delete({
        where: { id },
      });
      return item as unknown as AcademicClass;
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
          this.db.academicClass.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(): Promise<
    { total: number; active: number; inactive: number } | undefined
  > {
    console.log(
      "[AcademicClassService] getStats called. DB instance keys:",
      Object.keys(this.db).filter((k) => !k.startsWith("_")),
    );
    try {
      const [total, active] = await Promise.all([
        this.db.academicClass.count(),
        this.db.academicClass.count({ where: { isActive: true } }),
      ]);
      return { total, active, inactive: total - active };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
