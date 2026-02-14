import "dotenv/config";
import { execSync } from "child_process";
import { prisma } from "../src/client";

/**
 * Runs migrations on all active tenant databases.
 */

const migrateAllTenants = async () => {
  const tenants = await prisma.tenant.findMany({
    where: {
      databaseStatus: "ACTIVE",
      connectionString: { not: null },
    },
    select: { id: true, name: true, connectionString: true },
  });

  console.log(`Found ${tenants.length} active tenants to migrate.`);

  for (const tenant of tenants) {
    console.log(`\n--- Migrating Tenant: ${tenant.name} (${tenant.id}) ---`);
    try {
      // Use 'db push' or 'migrate deploy'
      execSync(
        `npx prisma db push --schema=./packages/db/prisma-tenant/schema.prisma --accept-data-loss`,
        {
          env: {
            ...process.env,
            TENANT_DATABASE_URL: tenant.connectionString!,
          },
          stdio: "inherit",
        },
      );
      console.log(`Successfully migrated ${tenant.name}`);
    } catch (error) {
      console.error(`Failed to migrate ${tenant.name}:`, error);
    }
  }

  console.log("\nBatch migration complete.");
};

migrateAllTenants()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
