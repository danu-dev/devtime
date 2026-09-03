import { NextResponse } from "next/server";

export interface ExtensionRelease {
  version: string;
  releaseDate: string;
  fileName: string;
  downloadUrl: string;
  changelog: string[];
  isLatest: boolean;
  minVscodeVersion: string;
}

const RELEASES: ExtensionRelease[] = [
  {
    version: "v0.1.2",
    releaseDate: "2026-09-03",
    fileName: "devtime-vscode-0.1.2.vsix",
    downloadUrl: "/downloads/devtime-vscode-0.1.2.vsix",
    changelog: [
      "Fix sync status bar dan durasi coding realtime via API Key",
      "Auto-migration setting apiUrl localhost ke production endpoint Vercel",
      "Default cloud endpoint: https://wakatime-devtime.vercel.app",
      "Real-time keystroke and active file heartbeat tracker",
      "Automatic framework detection (Next.js, React, Express, Vue, Angular)",
      "Smart branch detection and heartbeat deduplication",
      "Offline heartbeat caching & retry queue",
    ],
    isLatest: true,
    minVscodeVersion: ">=1.85.0",
  },
];

export async function GET() {
  return NextResponse.json({
    latest: RELEASES[0],
    releases: RELEASES,
    githubRepo: "https://github.com/danu/devtime",
    installInstructions: [
      "Download file extension (.vsix) dari website DevTime.",
      "Buka Visual Studio Code.",
      "Tekan Ctrl+Shift+P (atau Cmd+Shift+P di Mac), ketik 'Extensions: Install from VSIX...'.",
      "Pilih file devtime-vscode-0.1.1.vsix yang baru diunduh.",
      "Buat API Key di menu Dashboard DevTime -> Settings -> API Keys.",
      "Di VS Code, tekan Ctrl+Shift+P, ketik 'DevTime: Set API Key' dan paste API key Anda.",
      "Mulai coding, data aktivitas Anda otomatis tercatat secara real-time!",
    ],
  });
}
