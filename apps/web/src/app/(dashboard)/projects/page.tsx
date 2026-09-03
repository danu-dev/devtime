"use client";

import { useEffect, useState } from "react";
import { FolderGit2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ProjectItem {
  name: string;
  totalSeconds: number;
  languages: string[];
  frameworks: string[];
  lastActive: string;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/detailed?type=projects")
      .then((res) => res.json())
      .then((data) => setProjects(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4 sm:pb-5">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5" />
          {t.projectsTitle}
        </h1>
        <p className="text-neutral-400 text-xs mt-0.5">
          {t.projectsSubtitle}
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-neutral-600 text-xs">{t.loadingProjects}</div>
      ) : projects.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-lg bg-neutral-950 text-center text-neutral-600 text-xs">
          {t.noProjects}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {projects.map((p) => (
            <div
              key={p.name}
              className="p-4 border border-neutral-800 rounded-lg bg-neutral-950 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-white font-mono truncate">
                    {p.name}
                  </h3>
                  <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5">
                    {new Date(p.lastActive).toLocaleDateString()} {new Date(p.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-neutral-900 border border-neutral-800 text-white font-mono text-xs font-semibold shrink-0">
                  {formatDuration(p.totalSeconds)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1 border-t border-neutral-900">
                {p.languages.map((l) => (
                  <span
                    key={l}
                    className="text-[10px] bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800"
                  >
                    {l}
                  </span>
                ))}
                {p.frameworks.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] bg-neutral-900 text-neutral-300 border border-neutral-700 px-1.5 py-0.5 rounded"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
