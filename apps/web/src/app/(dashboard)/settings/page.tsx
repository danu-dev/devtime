"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { ShieldCheck, Cpu, Zap, Lock } from "lucide-react";

export default function SettingsPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-neutral-300" />
          {t.settingsTitle}
        </h1>
        <p className="text-neutral-400 text-xs mt-0.5">{t.settingsSubtitle}</p>
      </header>

      <div className="space-y-4">
        {/* Tracking Algorithm Card */}
        <div className="p-5 border border-neutral-800 rounded-lg bg-neutral-950 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu className="w-4 h-4 text-neutral-400" />
            <h2>{t.trackingAlgoTitle}</h2>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.trackingAlgoDesc}
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1 border-t border-neutral-900">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {t.trackingIntervalLabel}:{" "}
              <span className="text-neutral-300 font-mono font-medium">
                {lang === "id" ? "Setiap 30 detik (saat ngetik)" : "Every 30 seconds (when active)"}
              </span>
            </span>
          </div>
        </div>

        {/* Privacy First Card */}
        <div className="p-5 border border-emerald-950/70 border-l-4 border-l-emerald-500 rounded-lg bg-emerald-950/15 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Lock className="w-4 h-4" />
            <h2>{t.privacyTitle}</h2>
          </div>
          <p className="text-xs text-neutral-300/90 leading-relaxed">
            {t.privacyDesc}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400 pt-1">
            {t.privacyPoints.map((pt, i) => (
              <li key={i} className="flex items-center gap-2 bg-neutral-900/60 p-2 rounded border border-neutral-850">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

