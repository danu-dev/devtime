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

    const byProject: Record<string, ProjectGroup> = {};
    for (const curr of raw) {
      const p = this.sanitizeProject(curr.project);
      if (!byProject[p]) {
        byProject[p] = { heartbeats: [], languages: new Set<string>(), frameworks: new Set<string>(), lastActive: curr.activityAt };
      }
      byProject[p].heartbeats.push({ timestamp: Math.floor(curr.activityAt.getTime() / 1000) });
      const lang = this.sanitizeLanguage(curr.language, curr.entity);
      byProject[p].languages.add(lang);
      if (curr.framework && curr.framework !== "Unknown") byProject[p].frameworks.add(curr.framework);
      if (curr.activityAt > byProject[p].lastActive) byProject[p].lastActive = curr.activityAt;
    }

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

    const byLang: Record<string, LanguageGroup> = {};
    for (const curr of raw) {
      const l = this.sanitizeLanguage(curr.language, curr.entity);
      if (!byLang[l]) {
        byLang[l] = { heartbeats: [], projects: new Set<string>() };
      }
      byLang[l].heartbeats.push({ timestamp: Math.floor(curr.activityAt.getTime() / 1000) });
      const proj = this.sanitizeProject(curr.project);
      byLang[l].projects.add(proj);
    }

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
