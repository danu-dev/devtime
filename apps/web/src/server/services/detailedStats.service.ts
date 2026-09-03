import { prisma } from "@/lib/db";
import { groupHeartbeatsIntoSessions } from "@devtime/shared";

type ProjectGroup = {
  heartbeats: { timestamp: number }[];
  languages: Set<string>;
  frameworks: Set<string>;
  lastActive: Date;
};

type LanguageGroup = {
  heartbeats: { timestamp: number }[];
  projects: Set<string>;
};

export class DetailedStatsService {
  private static sanitizeLanguage(lang?: string | null, entity?: string): string {
    if (!lang || lang.toLowerCase() === "unknown" || lang.toLowerCase() === "plaintext" || lang.toLowerCase() === "ignore") {
      if (entity?.endsWith(".vsix")) return "VSIX Package";
      if (entity?.endsWith(".map")) return "Source Map";
      if (entity?.includes("ignore")) return "Git / Config";
      return "General File";
    }
    // Normalize casing
    const map: Record<string, string> = {
      typescript: "TypeScript",
      javascript: "JavaScript",
      php: "PHP",
      dart: "Dart",
      vue: "Vue",
      python: "Python",
      json: "JSON",
    };
    return map[lang.toLowerCase()] || lang.charAt(0).toUpperCase() + lang.slice(1);
  }

  private static sanitizeProject(proj?: string | null): string {
    if (!proj || proj.toLowerCase() === "unknown") return "General Project";
    return proj;
  }

  static async getActivityTimeline(userId: string) {
    const raw = await prisma.heartbeat.findMany({
      where: { userId },
      orderBy: { activityAt: "desc" },
      take: 150,
    });

    const sessions = groupHeartbeatsIntoSessions(
      raw.map((h: { activityAt: Date }) => ({ timestamp: Math.floor(h.activityAt.getTime() / 1000) }))
    );

    return {
      heartbeats: raw.map((h: { id: string; entity: string; project: string | null; language: string | null; framework: string | null; activityAt: Date }) => ({
        id: h.id,
        entity: h.entity,
        project: this.sanitizeProject(h.project),
        language: this.sanitizeLanguage(h.language, h.entity),
        framework: h.framework && h.framework !== "Unknown" ? h.framework : "Vanilla",
        time: h.activityAt.toISOString(),
      })),
      totalSessions: sessions.length,
    };
  }

  static async getProjectsBreakdown(userId: string) {
    const raw = await prisma.heartbeat.findMany({
      where: { userId },
      orderBy: { activityAt: "asc" },
    });

    const byProject = raw.reduce<Record<string, ProjectGroup>>((acc, curr: { project: string | null; activityAt: Date; language: string | null; entity: string; framework: string | null }) => {
      const p = this.sanitizeProject(curr.project);
      if (!acc[p]) {
        acc[p] = { heartbeats: [], languages: new Set<string>(), frameworks: new Set<string>(), lastActive: curr.activityAt };
      }
      acc[p].heartbeats.push({ timestamp: Math.floor(curr.activityAt.getTime() / 1000) });
      const lang = this.sanitizeLanguage(curr.language, curr.entity);
      acc[p].languages.add(lang);
      if (curr.framework && curr.framework !== "Unknown") acc[p].frameworks.add(curr.framework);
      if (curr.activityAt > acc[p].lastActive) acc[p].lastActive = curr.activityAt;
      return acc;
    }, {});

    return Object.entries(byProject).map(([name, data]) => {
      let totalSeconds = 0;
      for (let i = 1; i < data.heartbeats.length; i++) {
        const diff = data.heartbeats[i].timestamp - data.heartbeats[i - 1].timestamp;
        if (diff > 0 && diff <= 300) totalSeconds += diff;
      }
      return {
        name,
        totalSeconds,
        languages: Array.from(data.languages),
        frameworks: Array.from(data.frameworks),
        lastActive: data.lastActive.toISOString(),
      };
    }).sort((a, b) => b.totalSeconds - a.totalSeconds);
  }

  static async getLanguagesBreakdown(userId: string) {
    const raw = await prisma.heartbeat.findMany({
      where: { userId },
      orderBy: { activityAt: "asc" },
    });

    const byLang = raw.reduce<Record<string, LanguageGroup>>((acc, curr: { language: string | null; entity: string; activityAt: Date; project: string | null }) => {
      const l = this.sanitizeLanguage(curr.language, curr.entity);
      if (!acc[l]) {
        acc[l] = { heartbeats: [], projects: new Set<string>() };
      }
      acc[l].heartbeats.push({ timestamp: Math.floor(curr.activityAt.getTime() / 1000) });
      const proj = this.sanitizeProject(curr.project);
      acc[l].projects.add(proj);
      return acc;
    }, {});

    let grandTotal = 0;
    const list = Object.entries(byLang).map(([name, data]) => {
      let totalSeconds = 0;
      for (let i = 1; i < data.heartbeats.length; i++) {
        const diff = data.heartbeats[i].timestamp - data.heartbeats[i - 1].timestamp;
        if (diff > 0 && diff <= 300) totalSeconds += diff;
      }
      grandTotal += totalSeconds;
      return {
        name,
        totalSeconds,
        projects: Array.from(data.projects),
      };
    });

    return list.map((item) => ({
      ...item,
      percentage: grandTotal > 0 ? Math.round((item.totalSeconds / grandTotal) * 100) : 0,
    })).sort((a, b) => b.totalSeconds - a.totalSeconds);
  }
}
