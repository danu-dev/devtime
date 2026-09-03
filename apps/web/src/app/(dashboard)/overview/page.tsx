"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BreakdownList } from "@/components/dashboard/BreakdownList";
import { Clock8, FolderGit2, Code2, Cpu, Flame } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface AggregatedStats {
  totalSeconds: number;
  projects: { name: string; time: number }[];
  languages: { name: string; time: number }[];
  frameworks: { name: string; time: number }[];
}

function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function OverviewPage() {
  const { t } = useLanguage();
  const [dataToday, setDataToday] = useState<AggregatedStats | null>(null);
  const [dataWeek, setDataWeek] = useState<AggregatedStats | null>(null);
  const [dataAll, setDataAll] = useState<AggregatedStats | null>(null);
  const [range, setRange] = useState<"today" | "7d" | "all">("today");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [resToday, resWeek, resAll] = await Promise.all([
        fetch("/api/stats?range=today"),
        fetch("/api/stats?range=7d"),
        fetch("/api/stats?range=all"),
      ]);

      if (resToday.ok) setDataToday(await resToday.json());
      if (resWeek.ok) setDataWeek(await resWeek.json());
      if (resAll.ok) setDataAll(await resAll.json());
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentData = range === "today" ? dataToday : range === "7d" ? dataWeek : dataAll;
  const currentRangeLabel = range === "today" ? t.today : range === "7d" ? t.last7Days : t.allTime;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4 sm:pb-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {t.overviewTitle}
          </h1>
          <p className="text-neutral-400 text-xs mt-0.5">
            {t.overviewSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Range Switcher */}
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setRange("today")}
              className={`px-2.5 py-1 rounded transition-colors ${
                range === "today" ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.today}
            </button>
            <button
              onClick={() => setRange("7d")}
              className={`px-2.5 py-1 rounded transition-colors ${
                range === "7d" ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.last7Days}
            </button>
            <button
              onClick={() => setRange("all")}
              className={`px-2.5 py-1 rounded transition-colors ${
                range === "all" ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.allTime}
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-neutral-800 bg-neutral-950 text-neutral-300 text-[11px] font-mono shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t.live}
          </div>
        </div>
      </div>

      {/* Hero Duration Summary Card */}
      <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-950 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              {t.codingDurationHeader(currentRangeLabel)}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {loading ? "..." : formatTotalTime(currentData?.totalSeconds || 0)}
            </div>
            <div className="text-xs text-neutral-500">
              {t.codingDurationSub}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 bg-black border border-neutral-800/80 rounded-md">
              <div className="text-[10px] text-neutral-400 uppercase">{t.today}</div>
              <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                {formatTotalTime(dataToday?.totalSeconds || 0)}
              </div>
            </div>
            <div className="p-3 bg-black border border-neutral-800/80 rounded-md">
              <div className="text-[10px] text-neutral-400 uppercase">{t.last7Days}</div>
              <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                {formatTotalTime(dataWeek?.totalSeconds || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Metric Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label={t.periodDuration}
          value={loading ? "..." : formatTotalTime(currentData?.totalSeconds || 0)}
          subtitle="Coding time"
          icon={Clock8}
        />
        <StatCard
          label={t.projects}
          value={loading ? "..." : currentData?.projects.length || 0}
          subtitle={t.activeWorkspaces}
          icon={FolderGit2}
        />
        <StatCard
          label={t.languages}
          value={loading ? "..." : currentData?.languages.length || 0}
          subtitle={t.techStack}
          icon={Code2}
        />
        <StatCard
          label="Frameworks"
          value={loading ? "..." : currentData?.frameworks.length || 0}
          subtitle={t.frameworksCount}
          icon={Cpu}
        />
      </div>

      {/* Breakdown Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <BreakdownList
          title={t.languages}
          items={currentData?.languages}
          emptyMessage={t.emptyLanguages}
          icon={Code2}
        />
        <BreakdownList
          title="Frameworks"
          items={currentData?.frameworks}
          emptyMessage={t.emptyFrameworks}
          icon={Cpu}
        />
        <BreakdownList
          title={t.projects}
          items={currentData?.projects}
          emptyMessage={t.emptyProjects}
          icon={FolderGit2}
        />
      </div>
    </div>
  );
}
