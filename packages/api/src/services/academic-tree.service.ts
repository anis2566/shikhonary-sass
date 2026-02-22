import { type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";

// ============================================================================
// Return Types
// ============================================================================

export interface AcademicTreeSummary {
  totalClasses: number;
  totalSubjects: number;
  totalChapters: number;
  totalTopics: number;
  totalsubtopics: number;
}

export interface AcademicTreeCounts {
  classes: number;
  subjects: number;
  chapters: number;
  topics: number;
  subtopics: number;
}

export interface AcademicTreeSearchResults {
  classes: { id: string; name: string; displayName: string }[];
  subjects: {
    id: string;
    name: string;
    displayName: string;
    classSubjects?: { academicClass: { id: string; displayName: string } }[];
    class: { id: string; displayName: string };
  }[];
  chapters: {
    id: string;
    name: string;
    displayName: string;
    subject: {
      id: string;
      displayName: string;
      classSubjects?: { academicClass: { id: string; displayName: string } }[];
      class: { id: string; displayName: string };
    };
  }[];
  topics: {
    id: string;
    name: string;
    displayName: string;
    chapter: {
      id: string;
      displayName: string;
      subject: {
        id: string;
        displayName: string;
        classSubjects?: {
          academicClass: { id: string; displayName: string };
        }[];
        class: { id: string; displayName: string };
      };
    };
  }[];
  subtopics: {
    id: string;
    name: string;
    displayName: string;
    topic: {
      id: string;
      displayName: string;
      chapter: {
        id: string;
        displayName: string;
        subject: {
          id: string;
          displayName: string;
          classSubjects?: {
            academicClass: { id: string; displayName: string };
          }[];
          class: { id: string; displayName: string };
        };
      };
    };
  }[];
}

/**
 * Service for querying the full academic hierarchy tree.
 * Provides three operations:
 *  - getHierarchy: nested tree with optional class/subject/search filters
 *  - getCounts:    flat counts for each level (fast, parallel)
 *  - searchHierarchy: cross-level search returning results grouped by type
 */
export class AcademicTreeService {
  constructor(private db: PrismaClient) {}

  /**
   * Fetch the complete nested hierarchy.
   * Optionally scoped to a single class or subject, or filtered by a search term.
   */
  async getHierarchy(input?: {
    classId?: string;
    subjectId?: string;
    search?: string;
  }) {
    try {
      const { classId, subjectId, search } = input ?? {};

      const classWhere: Record<string, unknown> = {};
      if (classId) classWhere.id = classId;
      if (search) {
        classWhere.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { displayName: { contains: search, mode: "insensitive" } },
        ];
      }

      const hierarchy = await this.db.academicClass.findMany({
        where: classWhere,
        orderBy: { position: "asc" },
        include: {
          classSubjects: {
            where: subjectId ? { subjectId } : {},
            orderBy: { position: "asc" },
            include: {
              academicSubject: {
                include: {
                  chapters: {
                    orderBy: { position: "asc" },
                    include: {
                      topics: {
                        orderBy: { position: "asc" },
                        include: {
                          subtopics: { orderBy: { position: "asc" } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Map back to expected structure for internal processing
      const mappedHierarchy = hierarchy.map((cls) => ({
        ...cls,
        subjects: cls.classSubjects.map((cs) => cs.academicSubject),
      }));

      // Compute summary counts from the already-fetched data
      let totalSubjects = 0;
      let totalChapters = 0;
      let totalTopics = 0;
      let totalsubtopics = 0;

      for (const cls of mappedHierarchy) {
        totalSubjects += cls.subjects.length;
        for (const subject of cls.subjects) {
          totalChapters += subject.chapters.length;
          for (const chapter of subject.chapters) {
            totalTopics += chapter.topics.length;
            for (const topic of chapter.topics) {
              totalsubtopics += topic.subtopics.length;
            }
          }
        }
      }

      return {
        hierarchy: mappedHierarchy,
        summary: {
          totalClasses: hierarchy.length,
          totalSubjects,
          totalChapters,
          totalTopics,
          totalsubtopics,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Return flat counts for every level of the hierarchy.
   * Uses parallel queries for maximum speed.
   */
  async getCounts(): Promise<AcademicTreeCounts | undefined> {
    try {
      const [classes, subjects, chapters, topics, subtopics] =
        await Promise.all([
          this.db.academicClass.count(),
          this.db.academicSubject.count(),
          this.db.academicChapter.count(),
          this.db.academicTopic.count(),
          this.db.academicSubTopic.count(),
        ]);

      return { classes, subjects, chapters, topics, subtopics };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Search across all five levels simultaneously.
   * Returns results grouped by entity type, each entry including its
   * full breadcrumb path back to the class.
   */
  async searchHierarchy(
    query: string,
  ): Promise<
    { results: AcademicTreeSearchResults; totalResults: number } | undefined
  > {
    try {
      const mode = "insensitive" as const;
      const contains = query;

      const nameOrDisplay = (term: string) => [
        { name: { contains: term, mode } },
        { displayName: { contains: term, mode } },
      ];

      const [classes, subjects, chapters, topics, subtopics] =
        await Promise.all([
          this.db.academicClass.findMany({
            where: { OR: nameOrDisplay(contains) },
            select: { id: true, name: true, displayName: true },
            orderBy: { position: "asc" },
          }),
          this.db.academicSubject.findMany({
            where: { OR: nameOrDisplay(contains) },
            select: {
              id: true,
              name: true,
              displayName: true,
              classSubjects: {
                select: {
                  academicClass: { select: { id: true, displayName: true } },
                },
              },
            },
            orderBy: { position: "asc" },
          }),
          this.db.academicChapter.findMany({
            where: { OR: nameOrDisplay(contains) },
            select: {
              id: true,
              name: true,
              displayName: true,
              subject: {
                select: {
                  id: true,
                  displayName: true,
                  classSubjects: {
                    select: {
                      academicClass: {
                        select: { id: true, displayName: true },
                      },
                    },
                  },
                },
              },
            },
            orderBy: { position: "asc" },
          }),
          this.db.academicTopic.findMany({
            where: { OR: nameOrDisplay(contains) },
            select: {
              id: true,
              name: true,
              displayName: true,
              chapter: {
                select: {
                  id: true,
                  displayName: true,
                  subject: {
                    select: {
                      id: true,
                      displayName: true,
                      classSubjects: {
                        select: {
                          academicClass: {
                            select: { id: true, displayName: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: { position: "asc" },
          }),
          this.db.academicSubTopic.findMany({
            where: { OR: nameOrDisplay(contains) },
            select: {
              id: true,
              name: true,
              displayName: true,
              topic: {
                select: {
                  id: true,
                  displayName: true,
                  chapter: {
                    select: {
                      id: true,
                      displayName: true,
                      subject: {
                        select: {
                          id: true,
                          displayName: true,
                          classSubjects: {
                            select: {
                              academicClass: {
                                select: { id: true, displayName: true },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: { position: "asc" },
          }),
        ]);

      // Map for breadcrumbs
      const results: AcademicTreeSearchResults = {
        classes,
        subjects: subjects.map((s) => ({
          ...s,
          class: s.classSubjects?.[0]?.academicClass || {
            id: "N/A",
            displayName: "N/A",
          },
        })),
        chapters: chapters.map((c) => ({
          ...c,
          subject: {
            ...c.subject,
            class: c.subject.classSubjects?.[0]?.academicClass || {
              id: "N/A",
              displayName: "N/A",
            },
          },
        })),
        topics: topics.map((t) => ({
          ...t,
          chapter: {
            ...t.chapter,
            subject: {
              ...t.chapter.subject,
              class: t.chapter.subject.classSubjects?.[0]?.academicClass || {
                id: "N/A",
                displayName: "N/A",
              },
            },
          },
        })),
        subtopics: subtopics.map((st) => ({
          ...st,
          topic: {
            ...st.topic,
            chapter: {
              ...st.topic.chapter,
              subject: {
                ...st.topic.chapter.subject,
                class: st.topic.chapter.subject.classSubjects?.[0]
                  ?.academicClass || { id: "N/A", displayName: "N/A" },
              },
            },
          },
        })),
      };

      return {
        results,
        totalResults:
          classes.length +
          subjects.length +
          chapters.length +
          topics.length +
          subtopics.length,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
