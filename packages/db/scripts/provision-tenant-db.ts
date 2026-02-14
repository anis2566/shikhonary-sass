import "dotenv/config";
import pg from "pg";
import { execSync } from "child_process";
import { prisma } from "../src/client";

/**
 * Provisions a new database for a tenant.
 *
 * Flow:
 * 1. Generate db name from slug.
 * 2. Create database in PostgreSQL.
 * 3. Update tenant.connectionString.
 * 4. Run prisma-tenant push/migrate on new DB.
 * 5. Update tenant status to ACTIVE.
 */

const provisionTenantDb = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error(`Tenant with ID ${tenantId} not found`);
  }

  const dbName = `tenant_${tenant.slug.replace(/-/g, "_")}`;

  // 1. Create Database
  const masterUrl = new URL(process.env.DATABASE_URL!);
  const pool = new pg.Pool({
    host: masterUrl.hostname,
    port: parseInt(masterUrl.port),
    user: masterUrl.username,
    password: masterUrl.password,
    database: "postgres", // Connect to system db to create new one
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log(`Creating database ${dbName}...`);
    // Check if exists
    const res = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName],
    );
    if (res.rowCount === 0) {
      // NOTE: CREATE DATABASE cannot be executed in a transaction block
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }

    // 2. Generate Connection String
    const tenantUrl = new URL(process.env.DATABASE_URL!);
    tenantUrl.pathname = `/${dbName}`;
    const connectionString = tenantUrl.toString();

    // 3. Update Tenant record with provisioning status
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        databaseName: dbName,
        connectionString,
        databaseStatus: "ACTIVE", // Using the correct field name from schema
      },
    });

    // 4. Run Migrations / Push Schema
    console.log(`Pushing tenant schema to ${dbName}...`);
    // We use 'db push' for now for simplicity, but in production we should use migrations
    try {
      execSync(
        `npx prisma db push --schema=./packages/db/prisma-tenant/schema.prisma --accept-data-loss`,
        {
          env: {
            ...process.env,
            TENANT_DATABASE_URL: connectionString,
          },
          stdio: "inherit",
        },
      );
      console.log(`Tenant schema pushed successfully.`);
    } catch (error) {
      console.error("Failed to push tenant schema:", error);
      // We don't throw here to allow manual recovery if needed, but in prod we might rollback
    }

    console.log(`Tenant ${tenant.name} provisioned successfully.`);
  } catch (error) {
    console.error(`Error provisioning tenant ${tenant.name}:`, error);
    throw error;
  } finally {
    await pool.end();
  }
};

// If run from CLI
if (process.argv[2]) {
  provisionTenantDb(process.argv[2])
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { provisionTenantDb };
