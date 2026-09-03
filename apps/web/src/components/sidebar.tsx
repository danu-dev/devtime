"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  FolderGit2,
  Code2,
  Settings,
  KeyRound,
  Terminal,
  Download,
  LogOut,
  X,
  AlertTriangle,
  Languages,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const NAV_ITEMS = [
    { href: "/overview", label: t.overview, icon: LayoutDashboard },
    { href: "/activity", label: t.liveActivity, icon: Activity },
    { href: "/projects", label: t.projects, icon: FolderGit2 },
    { href: "/languages", label: t.languages, icon: Code2 },
    { href: "/download", label: t.downloadExt, icon: Download },
  ];

  const SETTINGS_ITEMS = [
    { href: "/settings", label: t.settings, icon: Settings },
    { href: "/settings/api-keys", label: t.apiKeys, icon: KeyRound },
  ];

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setShowLogoutModal(false);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-950 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t.confirmLogoutTitle}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {t.confirmLogoutDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-900">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="px-3 py-1.5 rounded text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? t.loggingOut : t.yesLogout}
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 md:w-60 border-r border-neutral-800 bg-black flex flex-col justify-between p-4 select-none transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white text-black flex items-center justify-center rounded font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm tracking-tight text-white">
                DevTime
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-1 text-neutral-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Language Selector Switcher */}
          <div className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
              <Languages className="w-3.5 h-3.5" />
              <span>Bahasa / Lang</span>
            </div>
            <div className="flex gap-1 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === "id" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === "en" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
              {t.dashboard}
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white border border-neutral-800"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1 pt-2">
            <div className="px-2 text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
              {t.system}
            </div>
            {SETTINGS_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white border border-neutral-800"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Status & Logout */}
        <div className="pt-3 border-t border-neutral-900 flex flex-col gap-2">
          <div className="px-2 py-1 flex items-center justify-between text-xs text-neutral-400">
            <span className="truncate max-w-[140px]" title={user?.email || t.developer}>
              {user?.name || user?.email || t.developer}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-neutral-500 hover:text-red-400 hover:bg-neutral-950 transition-colors w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.signOut}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
