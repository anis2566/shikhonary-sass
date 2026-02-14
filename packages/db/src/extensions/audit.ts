import { Prisma } from "../../master-client-types/client";
import { AsyncLocalStorage } from "node:async_hooks";

export interface AuditContext {
  userId?: string;
  tenantId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export const auditStorage = new AsyncLocalStorage<AuditContext>();

/**
 * Sensitive fields that should be masked in audit logs
 */
const SENSITIVE_FIELDS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "idToken",
  "connectionString",
];

/**
 * Mask sensitive fields in an object
 */
function maskSensitiveData(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  const masked = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in masked) {
    if (SENSITIVE_FIELDS.includes(key)) {
      masked[key] = "********";
    } else if (typeof masked[key] === "object") {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }

  return masked;
}

/**
 * Prisma extension for automatic auditing
 * @param masterPrisma - The master Prisma client used to write audit logs
 */
export const auditExtension = (masterPrisma: any) => {
  return Prisma.defineExtension((client) => {
    return client.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            // Prevent recursive auditing of the AuditLog model itself
            if (model === "AuditLog") {
              return query(args);
            }

            const writeOperations = [
              "create",
              "update",
              "delete",
              "upsert",
              "updateMany",
              "deleteMany",
              "createMany",
            ];

            if (!writeOperations.includes(operation)) {
              return query(args);
            }

            const ctx = auditStorage.getStore();

            // Execute the original query
            const result = await query(args);

            // Record audit log asynchronously
            if (ctx && masterPrisma) {
              const entityId = (args as any)?.where?.id || (result as any)?.id;

              masterPrisma.auditLog
                .create({
                  data: {
                    action: operation,
                    entity: model || "Unknown",
                    entityId:
                      typeof entityId === "string" ? entityId : undefined,
                    userId: ctx.userId,
                    tenantId: ctx.tenantId,
                    ipAddress: ctx.ipAddress,
                    userAgent: ctx.userAgent,
                    metadata: {
                      input: maskSensitiveData(args),
                    },
                    description: `Automatic audit for ${operation} on ${model}`,
                  },
                })
                .catch((err: any) => {
                  console.error(
                    "[AuditExtension Error] Failed to log audit:",
                    err,
                  );
                });
            }

            return result;
          },
        },
      },
    });
  });
};
