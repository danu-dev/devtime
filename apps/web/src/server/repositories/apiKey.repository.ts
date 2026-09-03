import { prisma } from "@/lib/db";
import crypto from "crypto";

export class ApiKeyRepository {
  static hashKey(rawKey: string): string {
    return crypto.createHash("sha256").update(rawKey).digest("hex");
  }

  static async findActiveByHashOrRaw(keyOrHash: string) {
    const hash = this.hashKey(keyOrHash);

    // Check by hash first, fallback to rawKey match
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        OR: [
          { keyHash: hash },
          { keyHash: keyOrHash },
          { rawKey: keyOrHash },
        ],
        revokedAt: null,
      },
      include: { user: true },
    });

    return apiKey;
  }

  static async touchLastUsed(id: string) {
    return prisma.apiKey.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }

  static async listByUser(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true, rawKey: true, createdAt: true, lastUsedAt: true, revokedAt: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(userId: string, name: string, keyHash: string, rawKey: string) {
    return prisma.apiKey.create({
      data: { userId, name, keyHash, rawKey },
    });
  }

  static async revoke(id: string, userId: string) {
    return prisma.apiKey.updateMany({
      where: { id, userId },
      data: { revokedAt: new Date() },
    });
  }

  static async delete(id: string, userId: string) {
    return prisma.apiKey.deleteMany({
      where: { id, userId },
    });
  }
}
