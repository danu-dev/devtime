import React from "react";
import { LucideIcon } from "lucide-react";

interface BreakdownItem {
  name: string;
  time: number;
}

interface BreakdownListProps {
  title: string;
  items?: BreakdownItem[];
  emptyMessage?: string;
  icon?: LucideIcon;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function BreakdownList({
  title,
  items = [],
  emptyMessage = "No data yet.",
  icon: Icon,
}: BreakdownListProps) {
  const totalCategorySeconds = items.reduce((acc, curr) => acc + curr.time, 0);

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-3.5 h-3.5 text-neutral-400" />}
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-300">{title}</h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-600">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const percentage =
                totalCategorySeconds > 0
                  ? Math.round((item.time / totalCategorySeconds) * 100)
                  : 0;

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-neutral-200 truncate max-w-[65%]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-neutral-400 text-[11px]">
                        {formatDuration(item.time)}
                      </span>
                      <span className="text-[10px] text-neutral-500 w-6 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Minimal solid line */}
                  <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
