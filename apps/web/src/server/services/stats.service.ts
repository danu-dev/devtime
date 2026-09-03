import { HeartbeatRepository } from "../repositories/heartbeat.repository";
import { calculateCodingDuration } from "@devtime/shared";
import { AggregatedStats, ItemStat } from "../domain/types";

export class StatsService {
  static async getAggregatedStats(userId: string, range: string): Promise<AggregatedStats> {
    const startDate = this.resolveStartDate(range);
    const rawHeartbeats = await HeartbeatRepository.getByDateRange(userId, startDate);

    const mapped = rawHeartbeats.map((h) => {
      let lang = h.language || "General File";
      if (lang === "typescript" || lang === "TypeScript") lang = "TypeScript";
      else if (lang === "javascript" || lang === "JavaScript") lang = "JavaScript";
      else if (lang.toLowerCase() === "unknown" || lang.toLowerCase() === "plaintext" || lang.toLowerCase() === "ignore") {
        if (h.entity.endsWith(".vsix")) lang = "VSIX Package";
        else if (h.entity.endsWith(".map")) lang = "Source Map";
        else lang = "Config / Data";
      }

      return {
        timestamp: Math.floor(h.activityAt.getTime() / 1000),
        project: h.project && h.project !== "Unknown" ? h.project : "General Project",
        language: lang,
        framework: h.framework && h.framework !== "Unknown" ? h.framework : "Vanilla",
      };
    });

    const totalSeconds = calculateCodingDuration(mapped);

    return {
      totalSeconds,
      languages: this.calculateGroupDurations(mapped, "language"),
      projects: this.calculateGroupDurations(mapped, "project"),
      frameworks: this.calculateGroupDurations(mapped, "framework"),
    };
  }

  private static resolveStartDate(range: string): Date {
    if (range === "all") {
      return new Date(0);
    }
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    if (range === "7d") {
      date.setDate(date.getDate() - 7);
    } else if (range === "30d") {
      date.setDate(date.getDate() - 30);
    }

    return date;
  }

  private static calculateGroupDurations(
    items: Array<{ timestamp: number; language?: string | null; project?: string | null; framework?: string | null }>,
    key: "language" | "project" | "framework"
  ): ItemStat[] {
    const groups = items.reduce((acc, curr) => {
      const val = curr[key];
      if (!val) return acc;
      if (!acc[val]) acc[val] = [];
      acc[val].push({ timestamp: curr.timestamp });
      return acc;
    }, {} as Record<string, Array<{ timestamp: number }>>);

    return Object.entries(groups)
      .map(([name, hbs]) => ({
        name,
        time: calculateCodingDuration(hbs),
      }))
      .sort((a, b) => b.time - a.time);
  }
}
