import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            {label}
          </span>
          <div className="text-2xl font-bold tracking-tight text-white mt-1.5 font-mono">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="p-2 rounded border border-neutral-800 bg-black text-neutral-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-3 text-xs text-neutral-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}
