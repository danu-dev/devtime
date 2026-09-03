"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "id" | "en";

export const translations = {
  id: {
    // Navigation
    overview: "Ringkasan",
    liveActivity: "Aktivitas Live",
    projects: "Proyek",
    languages: "Bahasa",
    downloadExt: "Unduh Extension",
    settings: "Pengaturan",
    apiKeys: "Kunci API",
    dashboard: "Dashboard",
    system: "Sistem",
    signOut: "Keluar",
    developer: "Pengembang",

    // Auth
    signInTitle: "Masuk ke akun Anda.",
    registerTitle: "Buat akun baru.",
    email: "Email",
    password: "Kata Sandi",
    name: "Nama Lengkap",
    continue: "Lanjutkan",
    registerBtn: "Daftar Akun",
    alreadyHaveAccount: "Sudah punya akun? Masuk",
    dontHaveAccount: "Belum punya akun? Daftar",
    processing: "Memproses...",
    authFailed: "Autentikasi gagal",

    // Modals
    confirmLogoutTitle: "Konfirmasi Keluar",
    confirmLogoutDesc: "Apakah Anda yakin ingin logout dari akun DevTime?",
    cancel: "Batal",
    yesLogout: "Ya, Logout",
    loggingOut: "Keluar...",
    deleteApiKeyTitle: "Hapus API Key?",
    deleteApiKeyDesc: (name: string) => `Apakah Anda yakin ingin menghapus key "${name}"? Extension VS Code yang menggunakan key ini tidak akan bisa mengirim data lagi.`,
    yesDeleteKey: "Ya, Hapus Key",
    deleting: "Menghapus...",

    // Overview
    overviewTitle: "Dashboard Ringkasan",
    overviewSubtitle: "Gambaran aktivitas ngoding & metrik durasi waktu.",
    today: "Hari Ini",
    last7Days: "7 Hari Terakhir",
    allTime: "Sepanjang Waktu",
    live: "Live",
    codingDurationHeader: (rangeStr: string) => `Lama Waktu Ngoding (${rangeStr})`,
    codingDurationSub: "Total durasi aktif ngoding terdeteksi oleh extension VS Code.",
    periodDuration: "Durasi Periode",
    activeWorkspaces: "Workspace aktif",
    techStack: "Bahasa pemrograman",
    frameworksCount: "Framework terdeteksi",
    emptyLanguages: "Belum ada aktivitas bahasa koding tercatat.",
    emptyFrameworks: "Belum ada framework yang terdeteksi.",
    emptyProjects: "Belum ada proyek yang tercatat.",

    // Live Activity
    activityTitle: "Aktivitas Live",
    activitySubtitle: "Aliran heartbeat pengetikan kode secara langsung.",
    syncing: "Sinkronisasi",
    totalHeartbeats: "Total Heartbeat",
    sessions: "Sesi",
    fileLogs: "Log Berkas",
    time: "Waktu",
    noActivity: "Belum ada aktivitas koding terdeteksi.",
    loadingLogs: "Memuat log aktivitas...",

    // Projects
    projectsTitle: "Daftar Proyek",
    projectsSubtitle: "Proyek & workspace yang sedang dikerjakan.",
    noProjects: "Belum ada proyek yang tercatat.",
    loadingProjects: "Memuat proyek...",

    // Languages
    languagesTitle: "Bahasa Pemrograman",
    languagesSubtitle: "Statistik penggunaan bahasa koding.",
    noLanguages: "Belum ada aktivitas bahasa yang tercatat.",
    loadingLanguages: "Memuat bahasa...",

    // Download & Extension
    downloadTitle: "Unduh Extension & Panduan Instalasi",
    downloadSubtitle: "Pantau waktu koding Anda secara otomatis dan aman langsung dari editor VS Code.",
    availableVersions: "Pilihan Versi Extension (.vsix)",
    howToInstall: "Cara Instalasi & Penggunaan di VS Code",
    step1Title: "Install VSIX di VS Code",
    step1Desc: "Buka VS Code, tekan Ctrl+Shift+P (atau Cmd+Shift+P di Mac), ketik:",
    step1Sub: "Pilih file .vsix yang telah diunduh.",
    step2Title: "Generate & Hubungkan API Key",
    step2Desc: "Buka menu Pengaturan > Kunci API di dashboard ini. Buat API Key baru lalu di VS Code tekan Ctrl+Shift+P:",
    step2Sub: "Paste API key Anda. Selesai! Statistik ngoding langsung sinkron realtime.",
    githubTitle: "Repository GitHub & Pembaruan",
    githubDesc: "Source code, issue tracker, pull requests, serta rilis versi terbaru akan selalu di-update di GitHub resmi.",

    // Settings
    settingsTitle: "Pengaturan & Privasi",
    settingsSubtitle: "Atur konfigurasi akun & intip cara sistem ngelacak jam ngoding lo secara aman.",
    trackingAlgoTitle: "Gimana Cara Ngitung Waktu Ngoding? (Algoritma)",
    trackingAlgoDesc: "DevTime ngitung durasi koding lo dari heartbeat pengetikan di editor dengan batas jeda nganggur (idle timeout) 5 menit. Kalau lo tinggal ngopi atau scroll medsos lebih dari 5 menit, hitungannya otomatis disetop biar datanya tetep jujur, akurat, dan gak overcount.",
    trackingIntervalLabel: "Interval Kirim Heartbeat",
    privacyTitle: "Privasi Aman 100% (No Cap & Anti Bocor)",
    privacyDesc: "DevTime GAK AKAN PERNAH ngunggah atau ngintip source code / file lo sama sekali. Extension cuma ngirim metadata dasar yang emang dibutuhin buat dashboard:",
    privacyPoints: [
      "Nama & ekstensi file yang lagi dibuka (cth: page.tsx)",
      "Nama workspace / folder proyek yang lagi aktif",
      "Bahasa koding & framework yang kedeteksi di lokal",
      "Timestamp waktu aktif ngetik (Unix timestamp)",
    ],

    // API Keys
    apiKeysTitle: "Kunci API (API Keys)",
    apiKeysSubtitle: "Buat dan kelola token autentikasi untuk editor Anda.",
    newKeyGenerated: "Kunci API Baru Berhasil Dibuat",
    copied: "Tersalin",
    copy: "Salin",
    placeholderKeyName: "cth. VS Code Laptop Utama",
    generating: "Membuat...",
    generateKey: "Buat Key",
    activeKeys: (count: number) => `Kunci Aktif (${count})`,
    noKeysFound: "Belum ada API key. Buat key pertama Anda di atas.",
    created: "Dibuat",
    lastUsed: "Terakhir dipakai",
    never: "Belum pernah",
    delete: "Hapus",
  },
  en: {
    // Navigation
    overview: "Overview",
    liveActivity: "Live Activity",
    projects: "Projects",
    languages: "Languages",
    downloadExt: "Download Ext",
    settings: "Settings",
    apiKeys: "API Keys",
    dashboard: "Dashboard",
    system: "System",
    signOut: "Sign Out",
    developer: "Developer",

    // Auth
    signInTitle: "Sign in to your account.",
    registerTitle: "Create a new account.",
    email: "Email",
    password: "Password",
    name: "Full Name",
    continue: "Continue",
    registerBtn: "Register",
    alreadyHaveAccount: "Already have an account? Sign In",
    dontHaveAccount: "Don't have an account? Register",
    processing: "Processing...",
    authFailed: "Authentication failed",

    // Modals
    confirmLogoutTitle: "Confirm Sign Out",
    confirmLogoutDesc: "Are you sure you want to sign out of your DevTime account?",
    cancel: "Cancel",
    yesLogout: "Yes, Sign Out",
    loggingOut: "Signing out...",
    deleteApiKeyTitle: "Delete API Key?",
    deleteApiKeyDesc: (name: string) => `Are you sure you want to delete the key "${name}"? VS Code extensions using this key will no longer be able to push metrics.`,
    yesDeleteKey: "Yes, Delete Key",
    deleting: "Deleting...",

    // Overview
    overviewTitle: "Overview Dashboard",
    overviewSubtitle: "Coding activity metrics and duration breakdown.",
    today: "Today",
    last7Days: "Last 7 Days",
    allTime: "All Time",
    live: "Live",
    codingDurationHeader: (rangeStr: string) => `Coding Time (${rangeStr})`,
    codingDurationSub: "Total active coding duration captured by the VS Code extension.",
    periodDuration: "Period Duration",
    activeWorkspaces: "Active workspaces",
    techStack: "Tech stack",
    frameworksCount: "Detected stacks",
    emptyLanguages: "No language activity recorded yet.",
    emptyFrameworks: "No frameworks auto-detected yet.",
    emptyProjects: "No projects recorded yet.",

    // Live Activity
    activityTitle: "Live Activity",
    activitySubtitle: "Real-time keystroke and heartbeat stream.",
    syncing: "Syncing",
    totalHeartbeats: "Total Heartbeats",
    sessions: "Sessions",
    fileLogs: "File Logs",
    time: "Time",
    noActivity: "No activity detected yet.",
    loadingLogs: "Loading logs...",

    // Projects
    projectsTitle: "Projects",
    projectsSubtitle: "Tracked projects & workspaces.",
    noProjects: "No projects tracked yet.",
    loadingProjects: "Loading projects...",

    // Languages
    languagesTitle: "Programming Languages",
    languagesSubtitle: "Programming language usage metrics.",
    noLanguages: "No language activity recorded.",
    loadingLanguages: "Loading languages...",

    // Download & Extension
    downloadTitle: "Download Extension & Quick Setup",
    downloadSubtitle: "Track your coding activity automatically and securely from VS Code.",
    availableVersions: "Extension Releases (.vsix)",
    howToInstall: "Installation & Usage Guide",
    step1Title: "Install VSIX in VS Code",
    step1Desc: "Open VS Code, press Ctrl+Shift+P (or Cmd+Shift+P on Mac), type:",
    step1Sub: "Select the downloaded .vsix file.",
    step2Title: "Generate & Connect API Key",
    step2Desc: "Navigate to Settings > API Keys in this dashboard. Generate a new key and in VS Code press Ctrl+Shift+P:",
    step2Sub: "Paste your API key. Done! Your metrics will stream immediately in real time.",
    githubTitle: "GitHub Repository & Updates",
    githubDesc: "Source code, issue tracker, pull requests, and automated new builds will always be updated on official GitHub.",

    // Settings
    settingsTitle: "Settings & Privacy",
    settingsSubtitle: "Manage configuration and see how your coding hours are securely tracked.",
    trackingAlgoTitle: "How We Calculate Coding Time? (Algorithm)",
    trackingAlgoDesc: "DevTime calculates your active coding time from heartbeat timestamps with a 5-minute inactivity gap threshold. If you step away for more than 5 minutes, counting pauses automatically to keep your metrics accurate and honest.",
    trackingIntervalLabel: "Heartbeat Push Interval",
    privacyTitle: "100% Privacy-First Architecture",
    privacyDesc: "DevTime NEVER uploads or reads your source code files. The extension only pushes essential lightweight metadata:",
    privacyPoints: [
      "Active file name & path metadata (e.g. page.tsx)",
      "Project & workspace folder name",
      "Locally detected language & framework",
      "Keystroke Unix timestamp",
    ],

    // API Keys
    apiKeysTitle: "API Keys",
    apiKeysSubtitle: "Generate and manage access tokens for your editor.",
    newKeyGenerated: "New Key Generated",
    copied: "Copied",
    copy: "Copy",
    placeholderKeyName: "e.g. Primary Work Laptop",
    generating: "Generating...",
    generateKey: "Generate Key",
    activeKeys: (count: number) => `Active Keys (${count})`,
    noKeysFound: "No API keys found. Generate your first key above.",
    created: "Created",
    lastUsed: "Last used",
    never: "Never",
    delete: "Delete",
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)["id"];
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "id",
  setLang: () => {},
  t: translations.id,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const saved = localStorage.getItem("devtime_lang") as Language;
    if (saved === "id" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("devtime_lang", newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
