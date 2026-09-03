"use client";

import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface LanguageItem {
  name: string;
  totalSeconds: number;
  projects: string[];
  percentage: number;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export default function LanguagesPage() {
  const { t } = useLanguage();
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/detailed?type=languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          {t.languagesTitle}
        </h1>
        <p className="text-neutral-400 text-xs mt-0.5">
          {t.languagesSubtitle}
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-neutral-600 text-xs">{t.loadingLanguages}</div>
      ) : languages.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-lg bg-neutral-950 text-center text-neutral-600 text-xs">
          {t.noLanguages}
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {languages.map((l) => (
            <div
              key={l.name}
              className="p-4 border border-neutral-800 rounded-lg bg-neutral-950 space-y-2.5"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-white">{l.name}</span>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                    {l.percentage}%
                  </span>
                </div>
                <span className="font-mono text-neutral-300">
                  {formatDuration(l.totalSeconds)}
                </span>
              </div>

              {/* Monochromatic Solid Bar */}
              <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full"
                  style={{ width: `${Math.max(l.percentage, 2)}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-0.5">
                <span>{t.projects}:</span>
                <div className="flex flex-wrap gap-1">
                  {l.projects.map((p) => (
                    <span
                      key={p}
                      className="bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded text-[10px] border border-neutral-850"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
