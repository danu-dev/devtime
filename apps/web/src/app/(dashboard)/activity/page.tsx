"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ActivityItem {
  id: string;
  entity: string;
  project: string;
  language: string;
  framework: string;
  time: string;
}

export default function ActivityPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/stats/detailed?type=timeline");
      if (res.ok) {
        const data = await res.json();
        setItems(data.heartbeats || []);
        setTotalSessions(data.totalSessions || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-2 border-b border-neutral-800 pb-4 sm:pb-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            {t.activityTitle}
          </h1>
          <p className="text-neutral-400 text-xs mt-0.5">
            {t.activitySubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-neutral-800 bg-neutral-950 text-neutral-400 text-[11px] font-mono shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t.syncing}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 border border-neutral-800 rounded-lg bg-neutral-950">
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
            {t.totalHeartbeats}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono">
            {loading ? "..." : items.length}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 border border-neutral-800 rounded-lg bg-neutral-950">
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
            {t.sessions}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono">
            {loading ? "..." : totalSessions}
          </div>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          <span>{t.fileLogs}</span>
          <span>{t.time}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-neutral-600 text-xs">{t.loadingLogs}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-neutral-600 text-xs">
            {t.noActivity}
          </div>
        ) : (
          <div className="divide-y divide-neutral-900 max-h-[580px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-900/40 transition-colors"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="font-mono text-xs text-neutral-200 truncate max-w-full">
                    {item.entity}
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800">
                      {item.project}
                    </span>
                    <span className="bg-neutral-900 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-800">
                      {item.language}
                    </span>
                    {item.framework && item.framework !== "Vanilla" && (
                      <span className="bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800">
                        {item.framework}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[10px] sm:text-[11px] text-neutral-500 font-mono whitespace-nowrap self-end sm:self-center">
                  {new Date(item.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
