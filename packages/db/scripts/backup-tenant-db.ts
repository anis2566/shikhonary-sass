import "dotenv/config";
import { execSync } from "child_process";
import { prisma } from "../src/client";
import { resolve } from "node:path";
import { mkdirSync } from "node:fs";

/**
 * Backs up a tenant database using pg_dump.
 * Requires pg_dump to be installed on the system.
 */

const backupTenantDb = async (tenantId: string) => {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { name: true, slug: true, connectionString: true },
    });

    if (!tenant || !tenant.connectionString) {
        throw new Error(`Tenant with ID ${tenantId} not found or has no database.`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = resolve(process.cwd(), "backups");
    const fileName = `${tenant.slug}-${timestamp}.sql`;
    const filePath = resolve(backupDir, fileName);

    try {
        mkdirSync(backupDir, { recursive: true });
        console.log(`Backing up ${tenant.name} to ${filePath}...`);

        // Note: We pass the connection string directly to pg_dump
        execSync(`pg_dump "${tenant.connectionString}" > "${filePath}"`, {
            stdio: "inherit",
        });

        console.log(`Backup completed successfully.`);
    } catch (error) {
        console.error(`Backup failed for ${tenant.name}:`, error);
        throw error;
    }
};

if (process.argv[2]) {
    backupTenantDb(process.argv[2])
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

export { backupTenantDb };
