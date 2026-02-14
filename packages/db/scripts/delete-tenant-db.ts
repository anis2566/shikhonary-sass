import "dotenv/config";
import pg from "pg";
import { prisma } from "../src/client";

/**
 * Deletes a tenant's database.
 * DANGER: This is destructive.
 */

const deleteTenantDb = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { slug: true, connectionString: true },
  });

  if (!tenant || !tenant.connectionString) {
    throw new Error(`Tenant with ID ${tenantId} not found or has no database.`);
  }

  const dbName = `tenant_${tenant.slug.replace(/-/g, "_")}`;

  const masterUrl = new URL(process.env.DATABASE_URL!);
  const pool = new pg.Pool({
    host: masterUrl.hostname,
    port: parseInt(masterUrl.port),
    user: masterUrl.username,
    password: masterUrl.password,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log(`Dropping database ${dbName}...`);

    // Terminate existing connections first
    await pool.query(
      `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
      AND pid <> pg_backend_pid();
    `,
      [dbName],
    );

    await pool.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`Database ${dbName} dropped.`);

    // Update tenant record
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        databaseName: null,
        connectionString: null,
        databaseStatus: "INACTIVE",
      },
    });
  } catch (error) {
    console.error(`Error deleting tenant DB:`, error);
    throw error;
  } finally {
    await pool.end();
  }
};

if (process.argv[2]) {
  deleteTenantDb(process.argv[2])
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { deleteTenantDb };
