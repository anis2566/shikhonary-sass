import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "node:path";

import { PrismaClient } from "../master-client-types/client";
import { auditExtension } from "./extensions/audit";

// Load environment variables
config({ path: resolve(process.cwd(), "../../.env") });

const getBasePrisma = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined. Please check your .env file.",
    );
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  return new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });
};

const basePrisma = getBasePrisma();

const getExtendedPrisma = () => {
  return basePrisma.$extends(auditExtension(basePrisma));
};

const globalForUserDBPrismaClient = global as unknown as {
  userDBPrismaClient: ReturnType<typeof getExtendedPrisma>;
};

export const userDBPrismaClient =
  globalForUserDBPrismaClient.userDBPrismaClient || getExtendedPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForUserDBPrismaClient.userDBPrismaClient = userDBPrismaClient;
}

export const prisma = userDBPrismaClient;

/**
 * Health check for the master database
 */
export const pingMasterDb = async () => {
  try {
    await basePrisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Master DB Health Check Failed:", error);
    return false;
  }
};
