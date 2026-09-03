import { prisma } from "@/lib/db";
import { HeartbeatEntity } from "../domain/types";

export class HeartbeatRepository {
  static async createMany(heartbeats: HeartbeatEntity[]): Promise<number> {
    const res = await prisma.heartbeat.createMany({
      data: heartbeats.map((hb) => ({
        userId: hb.userId,
        entity: hb.entity,
        project: hb.project ?? null,
        language: hb.language ?? null,
        framework: hb.framework ?? null,
        editor: hb.editor ?? null,
        branch: hb.branch ?? null,
        operatingSystem: hb.operatingSystem ?? null,
        machine: hb.machine ?? null,
        isWrite: hb.isWrite,
        activityAt: hb.activityAt,
      })),
    });
    return res.count;
  }

  static async getByDateRange(userId: string, startDate: Date) {
    return prisma.heartbeat.findMany({
      where: {
        userId,
        activityAt: { gte: startDate },
      },
      orderBy: { activityAt: "asc" },
      select: {
        entity: true,
        activityAt: true,
        project: true,
        language: true,
        framework: true,
      },
    });
  }
}
