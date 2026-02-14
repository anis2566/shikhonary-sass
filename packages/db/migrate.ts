import { MongoClient } from "mongodb";
import { prisma } from "./src";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), "../.env") });

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Helper to safely convert MongoDB ObjectId to string
function toStringId(id: any): string {
  if (!id) return "";
  return id.toString();
}

async function migrate() {
  let mongoClient: MongoClient | null = null;

  try {
    // Connect to MongoDB
    const mongoUrl = process.env.MONGO_DB_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_DB_URL is not defined in .env");
    }

    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    const mongoDb = mongoClient.db("main");

    console.log("✅ Connected to MongoDB");
    console.log("✅ Connected to PostgreSQL");
    console.log("Starting migration...\n");

    // Step 1: Migrate ClassNames → AcademicClass
    console.log("📚 Step 1/8: Migrating ClassNames to AcademicClass...");
    const classNames = await mongoDb.collection("ClassName").find({}).toArray();

    for (const cls of classNames) {
      await prisma.academicClass.upsert({
        where: { id: toStringId(cls._id) },
        update: {},
        create: {
          id: toStringId(cls._id),
          name: generateSlug(cls.name),
          displayName: cls.name,
          level: cls.level || "SECONDARY",
          position: cls.position || 0,
          isActive: true,
          createdAt: cls.createdAt || new Date(),
          updatedAt: cls.updatedAt || new Date(),
        },
      });
    }
    console.log(`✅ Migrated ${classNames.length} ClassNames\n`);

    // Step 2: Migrate Subjects → AcademicSubject
    console.log("📖 Step 2/8: Migrating Subjects to AcademicSubject...");
    const subjects = await mongoDb.collection("Subject").find({}).toArray();

    // Track which subjects belong to which classes
    const subjectClassMap = new Map<string, string[]>();

    for (const cls of classNames) {
      if (cls.subjectIds && Array.isArray(cls.subjectIds)) {
        for (const subjectId of cls.subjectIds) {
          const subjectIdStr = toStringId(subjectId);
          if (!subjectClassMap.has(subjectIdStr)) {
            subjectClassMap.set(subjectIdStr, []);
          }
          subjectClassMap.get(subjectIdStr)!.push(toStringId(cls._id));
        }
      }
    }

    let migratedSubjects = 0;
    for (const subject of subjects) {
      const subjectId = toStringId(subject._id);
      const classIds = subjectClassMap.get(subjectId) || [];

      // Use first class or skip if no class assigned
      if (classIds.length === 0) {
        console.log(`⚠️  Skipping subject ${subject.name} (no class assigned)`);
        continue;
      }

      const classId = classIds[0];

      await prisma.academicSubject.upsert({
        where: { id: subjectId },
        update: {},
        create: {
          id: subjectId,
          name: generateSlug(subject.name),
          displayName: subject.name,
          code: subject.code || null,
          group: subject.group || null,
          position: subject.position || 0,
          isActive: true,
          classId: classId || "",
          createdAt: subject.createdAt || new Date(),
          updatedAt: subject.updatedAt || new Date(),
        },
      });
      migratedSubjects++;
    }
    console.log(
      `✅ Migrated ${migratedSubjects} Subjects (${subjects.length - migratedSubjects} skipped)\n`,
    );

    // Step 3: Migrate Chapters → AcademicChapter
    console.log("📑 Step 3/8: Migrating Chapters to AcademicChapter...");
    const chapters = await mongoDb.collection("Chapter").find({}).toArray();

    let migratedChapters = 0;
    for (const chapter of chapters) {
      const subjectId = toStringId(chapter.subjectId);

      if (!subjectId) {
        console.log(`⚠️  Skipping chapter ${chapter.name} (no subject ID)`);
        continue;
      }

      // Verify subject exists
      const subjectExists = await prisma.academicSubject.findUnique({
        where: { id: subjectId },
      });

      if (!subjectExists) {
        console.log(`⚠️  Skipping chapter ${chapter.name} (subject not found)`);
        continue;
      }

      await prisma.academicChapter.upsert({
        where: { id: toStringId(chapter._id) },
        update: {},
        create: {
          id: toStringId(chapter._id),
          name: generateSlug(chapter.name),
          displayName: chapter.name,
          position: chapter.position || 0,
          isActive: true,
          subjectId: subjectId,
          createdAt: chapter.createdAt || new Date(),
          updatedAt: chapter.updatedAt || new Date(),
        },
      });
      migratedChapters++;
    }
    console.log(
      `✅ Migrated ${migratedChapters} Chapters (${chapters.length - migratedChapters} skipped)\n`,
    );

    // Step 4: Create default Topics for Chapters (if needed)
    console.log("📝 Step 4/8: Creating default Topics for Chapters...");
    let topicCount = 0;

    // Get only successfully migrated chapters
    const migratedChapterIds = (
      await prisma.academicChapter.findMany({
        select: { id: true },
      })
    ).map((ch) => ch.id);

    for (const chapter of chapters) {
      const chapterId = toStringId(chapter._id);

      if (!migratedChapterIds.includes(chapterId)) {
        continue;
      }

      // Create a default topic for migration
      const topicId = `${chapterId}-default-topic`;

      await prisma.academicTopic.upsert({
        where: { id: topicId },
        update: {},
        create: {
          id: topicId,
          name: "general",
          displayName: "General",
          position: 0,
          isActive: true,
          chapterId: chapterId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      topicCount++;
    }
    console.log(`✅ Created ${topicCount} default Topics\n`);

    // Step 5: Create default SubTopics for Topics
    console.log("📌 Step 5/8: Creating default SubTopics for Topics...");
    let subTopicCount = 0;

    const topics = await prisma.academicTopic.findMany();

    for (const topic of topics) {
      const subTopicId = `${topic.id}-default-subtopic`;

      await prisma.academicSubTopic.upsert({
        where: { id: subTopicId },
        update: {},
        create: {
          id: subTopicId,
          name: "general",
          displayName: "General",
          position: 0,
          isActive: true,
          topicId: topic.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      subTopicCount++;
    }
    console.log(`✅ Created ${subTopicCount} default SubTopics\n`);

    // Step 6: Migrate MCQs (with progress bar)
    const mcqCount = await mongoDb.collection("Mcq").countDocuments();
    console.log(`❓ Step 6/8: Migrating ${mcqCount} MCQs...`);
    console.log("This may take several minutes...\n");

    const batchSize = 500;
    let migratedMcqs = 0;
    let failedMcqs = 0;
    const startTime = Date.now();

    // Create a map of chapter to default topic and subtopic
    const chapterTopicMap = new Map<string, string>();
    const chapterSubTopicMap = new Map<string, string>();

    for (const chapterId of migratedChapterIds) {
      const topicId = `${chapterId}-default-topic`;
      const subTopicId = `${topicId}-default-subtopic`;
      chapterTopicMap.set(chapterId, topicId);
      chapterSubTopicMap.set(chapterId, subTopicId);
    }

    for (let i = 0; i < mcqCount; i += batchSize) {
      const batchStartTime = Date.now();
      const mcqs = await mongoDb
        .collection("Mcq")
        .find({})
        .skip(i)
        .limit(batchSize)
        .toArray();

      const mcqPromises = mcqs.map(async (mcq) => {
        try {
          const chapterId = toStringId(mcq.chapterId);
          const subjectId = toStringId(mcq.subjectId);

          if (!chapterId || !subjectId) {
            failedMcqs++;
            return;
          }

          const topicId = chapterTopicMap.get(chapterId);
          const subTopicId = chapterSubTopicMap.get(chapterId);

          if (!subTopicId || !topicId) {
            failedMcqs++;
            return;
          }

          // Verify relationships exist
          const [subjectExists, chapterExists, subTopicExists] =
            await Promise.all([
              prisma.academicSubject.findUnique({ where: { id: subjectId } }),
              prisma.academicChapter.findUnique({ where: { id: chapterId } }),
              prisma.academicSubTopic.findUnique({ where: { id: subTopicId } }),
            ]);

          if (!subjectExists || !chapterExists || !subTopicExists) {
            failedMcqs++;
            return;
          }

          await prisma.mcq.upsert({
            where: { id: toStringId(mcq._id) },
            update: {},
            create: {
              id: toStringId(mcq._id),
              question: mcq.question || "",
              options: Array.isArray(mcq.options) ? mcq.options : [],
              statements: Array.isArray(mcq.statements) ? mcq.statements : [],
              answer: mcq.answer || "",
              type: mcq.type || "SINGLE",
              reference: Array.isArray(mcq.reference) ? mcq.reference : [],
              explanation: mcq.explanation || null,
              isMath: Boolean(mcq.isMath),
              session: mcq.session || new Date().getFullYear(),
              source: mcq.source || null,
              questionUrl: mcq.questionUrl || null,
              context: mcq.context || null,
              contextUrl: mcq.contextUrl || null,
              subjectId: subjectId,
              chapterId: chapterId,
              topicId: topicId,
              subTopicId: subTopicId,
              createdAt: mcq.createdAt || new Date(),
              updatedAt: mcq.updatedAt || new Date(),
            },
          });
          migratedMcqs++;
        } catch (error: any) {
          failedMcqs++;
          if (failedMcqs <= 10) {
            console.error(`Failed MCQ ${mcq._id}:`, error.message);
          }
        }
      });

      await Promise.all(mcqPromises);

      const batchTime = ((Date.now() - batchStartTime) / 1000).toFixed(2);
      const progress = (((i + mcqs.length) / mcqCount) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      const estimatedTotal = (
        (((Date.now() - startTime) / (i + mcqs.length)) * mcqCount) /
        1000 /
        60
      ).toFixed(1);

      console.log(
        `📊 Progress: ${i + mcqs.length}/${mcqCount} (${progress}%) | ` +
          `Batch: ${batchTime}s | Elapsed: ${elapsed}m | ETA: ${estimatedTotal}m`,
      );
    }

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log(
      `\n✅ Migrated ${migratedMcqs} MCQs (${failedMcqs} failed) in ${totalTime} minutes\n`,
    );

    // Step 7: Count statistics
    console.log("📊 Step 7/8: Gathering statistics...");
    const stats = await prisma.$transaction([
      prisma.academicClass.count(),
      prisma.academicSubject.count(),
      prisma.academicChapter.count(),
      prisma.academicTopic.count(),
      prisma.academicSubTopic.count(),
      prisma.mcq.count(),
    ]);

    // Step 8: Verify data integrity
    console.log("🔍 Step 8/8: Verifying data integrity...");

    // Check for any potential issues
    const orphanedSubjects = await prisma.academicSubject.count({
      where: {
        class: undefined,
      },
    });

    const orphanedChapters = await prisma.academicChapter.count({
      where: {
        subject: undefined,
      },
    });

    console.log("\n═".repeat(60));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("═".repeat(60));
    console.log("\n📊 Final Statistics:");
    console.log(`  • Classes: ${stats[0]}`);
    console.log(`  • Subjects: ${stats[1]}`);
    console.log(`  • Chapters: ${stats[2]}`);
    console.log(`  • Topics: ${stats[3]}`);
    console.log(`  • SubTopics: ${stats[4]}`);
    console.log(`  • MCQs: ${stats[5]} (${failedMcqs} failed)`);
    console.log(`  • Total Time: ${totalTime} minutes`);

    if (orphanedSubjects > 0 || orphanedChapters > 0) {
      console.log("\n⚠️  Data Integrity Warnings:");
      if (orphanedSubjects > 0) {
        console.log(`  • ${orphanedSubjects} subjects without class`);
      }
      if (orphanedChapters > 0) {
        console.log(`  • ${orphanedChapters} chapters without subject`);
      }
    }

    console.log("\n");
  } catch (error) {
    console.error("\n❌ MIGRATION FAILED!");
    console.error(error);
    process.exit(1);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log("✅ MongoDB connection closed");
    }
    await prisma.$disconnect();
    console.log("✅ PostgreSQL connection closed");
  }
}

// Run migration
migrate().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
