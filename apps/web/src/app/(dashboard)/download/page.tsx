"use client";

import { Download, Github, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const RELEASES = [
  {
    version: "v0.1.3",
    name: "DevTime VS Code Extension 0.1.3 (Production Fixed)",
    date: "Sep 2026",
    fileName: "devtime-vscode-0.1.3.vsix",
    downloadUrl: "/downloads/devtime-vscode-0.1.3.vsix",
    githubReleaseUrl: "https://github.com/danu-dev/devtime/releases/tag/v0.1.3",
    isLatest: true,
    size: "70 KB",
    changes: [
      "Auto chunking batch upload untuk offline queue ribuan heartbeats",
      "Perluasan payload schema max heartbeats dari 100 ke 5000",
      "Fitur DevTime: Show Debug Output Logs di VS Code",
      "Auto-migration setting apiUrl localhost ke production endpoint Vercel",
      "Pelacakan heartbeat coding otomatis berbasis keystroke & buffer focus",
    ],
  },
  {
    version: "v0.1.2",
    name: "DevTime VS Code Extension 0.1.2",
    date: "Sep 2026",
    fileName: "devtime-vscode-0.1.2.vsix",
    downloadUrl: "https://github.com/danu-dev/devtime/releases/tag/v0.1.2",
    githubReleaseUrl: "https://github.com/danu-dev/devtime/releases/tag/v0.1.2",
    isLatest: false,
    size: "70 KB",
    changes: [
      "Fix sync status bar dan durasi coding realtime via API Key",
      "Default cloud endpoint integration",
    ],
  },
  {
    version: "v0.1.1",
    name: "DevTime VS Code Extension 0.1.1",
    date: "Sep 2026",
    fileName: "devtime-vscode-0.1.1.vsix",
    downloadUrl: "https://github.com/danu-dev/devtime/releases/tag/v0.1.2",
    githubReleaseUrl: "https://github.com/danu-dev/devtime/releases/tag/v0.1.2",
    isLatest: false,
    size: "70 KB",
    changes: [
      "Perubahan setting default apiUrl ke cloud",
    ],
  },
];

export default function DownloadPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            VS Code Official Extension
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
          {t.downloadTitle}
        </h1>
        <p className="text-neutral-400 text-xs mt-1">
          {t.downloadSubtitle}
        </p>
      </div>

      {/* Release List */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-white" />
          {t.availableVersions}
        </h2>

        {RELEASES.map((rel) => (
          <div
            key={rel.version}
            className="p-5 border border-neutral-800 rounded-lg bg-neutral-950 space-y-4 hover:border-neutral-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-base">
                    {rel.version}
                  </span>
                  {rel.isLatest && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-white text-black rounded font-mono">
                      LATEST
                    </span>
                  )}
                  <span className="text-xs text-neutral-500">{rel.date}</span>
                </div>
                <div className="text-xs text-neutral-400">{rel.name}</div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={rel.downloadUrl}
                  download={rel.isLatest}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download VSIX ({rel.size})
                </a>
                <a
                  href={rel.githubReleaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white rounded transition-colors"
                  title="View on GitHub Release"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="border-t border-neutral-900 pt-3">
              <div className="text-[11px] font-medium text-neutral-400 mb-2">Changelog & Fitur:</div>
              <ul className="space-y-1">
                {rel.changes.map((change, idx) => (
                  <li key={idx} className="text-xs text-neutral-400 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 mt-0.5 shrink-0" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Panduan Cara Pakai */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-white" />
          {t.howToInstall}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-800 rounded-lg bg-neutral-950 space-y-3">
            <div className="flex items-center gap-2 text-white font-medium text-xs">
              <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono text-[11px]">
                1
              </span>
              Install Extension
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Buka VS Code, tekan Ctrl+Shift+P lalu pilih:
            </p>
            <div className="p-2.5 bg-black border border-neutral-800 rounded font-mono text-xs text-neutral-300">
              Extensions: Install from VSIX...
            </div>
            <p className="text-xs text-neutral-500">Pilih file devtime-vscode-0.1.3.vsix</p>
          </div>

          <div className="p-4 border border-neutral-800 rounded-lg bg-neutral-950 space-y-3">
            <div className="flex items-center gap-2 text-white font-medium text-xs">
              <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono text-[11px]">
                2
              </span>
              Set API Key
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tekan Ctrl+Shift+P di VS Code lalu masukkan API Key Anda:
            </p>
            <div className="p-2.5 bg-black border border-neutral-800 rounded font-mono text-xs text-neutral-300">
              DevTime: Set API Key
            </div>
            <p className="text-xs text-neutral-500">Ambil key dari menu Settings &rarr; API Keys</p>
          </div>

          <div className="p-4 border border-neutral-800 rounded-lg bg-neutral-950 space-y-3">
            <div className="flex items-center gap-2 text-white font-medium text-xs">
              <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono text-[11px]">
                3
              </span>
              Cek Endpoint API
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Secara default sudah otomatis ke cloud. Jika ingin ubah:
            </p>
            <div className="p-2.5 bg-black border border-neutral-800 rounded font-mono text-xs text-neutral-300">
              DevTime: Set API URL
            </div>
            <p className="text-xs text-neutral-500 font-mono text-[10px]">https://wakatime-devtime.vercel.app</p>
          </div>
        </div>
      </div>

      {/* GitHub Section */}
      <div className="p-5 border border-neutral-800 rounded-lg bg-neutral-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Github className="w-4 h-4" />
            {t.githubTitle}
          </div>
          <p className="text-xs text-neutral-400">
            {t.githubDesc}
          </p>
        </div>

        <a
          href="https://github.com/danu-dev/devtime"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 rounded text-xs font-medium transition-colors shrink-0"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </a>
      </div>
    </div>
  );
}
