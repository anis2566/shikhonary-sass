import type { PrismaClient } from "@workspace/db";

export interface AuditLogParams {
  db: PrismaClient;
  userId?: string | null;
  tenantId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  description?: string | null;
  metadata?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Utility to create an audit log entry
 * This is designed to be called within mutations or via middleware
 */
export async function recordAuditLog(params: AuditLogParams) {
  try {
    await params.db.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        description: params.description,
        metadata: params.metadata || {},
        userId: params.userId || undefined,
        tenantId: params.tenantId || undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    // We usually don't want to fail the main request if logging fails,
    // but we should log the failure itself to stdout/stderr
    console.error(
      `[AuditLog Error] Failed to record ${params.action} on ${params.entity}:`,
      error,
    );
  }
}

/**
 * Middleware helper to extract entity info from path
 * e.g., "academicClass.create" -> { entity: "academicClass", action: "create" }
 */
export function parseTRPCPath(path: string) {
  const parts = path.split(".");
  if (parts.length >= 2) {
    return {
      entity: parts[0] as string,
      action: parts[parts.length - 1] as string,
    };
  }
  return {
    entity: "unknown",
    action: path,
  };
}
