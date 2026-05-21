import { prisma } from "@/lib/prisma";

interface CreateSessionParams {
  userId: string;
  deviceId: string;
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

/**
 * 创建 Session
 */
export async function createSession(
  params: CreateSessionParams
) {
  return prisma.session.create({
    data: params,
  });
}