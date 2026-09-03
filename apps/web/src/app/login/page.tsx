"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Download, Languages } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/overview";
      } else {
        setError(data.error || t.authFailed);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4 flex-col gap-4">
      {/* Language Switcher Bar */}
      <div className="w-full max-w-sm flex items-center justify-between px-1 text-xs text-neutral-400">
        <div className="flex items-center gap-1">
          <Languages className="w-3.5 h-3.5" />
          <span>Bahasa / Language</span>
        </div>
        <div className="flex gap-1.5 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setLang("id")}
            className={`px-2 py-0.5 rounded transition-colors ${
              lang === "id" ? "bg-white text-black font-bold" : "text-neutral-500 hover:text-white"
            }`}
          >
            Bahasa Indonesia
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-2 py-0.5 rounded transition-colors ${
              lang === "en" ? "bg-white text-black font-bold" : "text-neutral-500 hover:text-white"
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm p-6 border border-neutral-800 rounded-lg bg-neutral-950 space-y-5">
        <div className="space-y-1">
          <div className="w-6 h-6 bg-white text-black flex items-center justify-center rounded font-bold mb-3">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            DevTime
          </h1>
          <p className="text-neutral-500 text-xs">
            {isRegister ? t.registerTitle : t.signInTitle}
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded bg-red-950/50 border border-red-800/50 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-neutral-400">{t.name}</label>
              <input
                type="text"
                placeholder="Danu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-neutral-800 focus:border-neutral-500 rounded px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none"
                required={isRegister}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-neutral-400">{t.email}</label>
            <input
              type="email"
              placeholder="dev@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-neutral-800 focus:border-neutral-500 rounded px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-neutral-400">{t.password}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 focus:border-neutral-500 rounded px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? t.processing : isRegister ? t.registerBtn : t.continue}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-900">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            {isRegister ? t.alreadyHaveAccount : t.dontHaveAccount}
          </button>
        </div>
      </div>

      {/* VSCode Extension Download Card */}
      <div className="w-full max-w-sm p-4 border border-neutral-900 rounded-lg bg-neutral-950 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white">VS Code Extension</div>
          <div className="text-[11px] text-neutral-500">{t.downloadSubtitle}</div>
        </div>
        <a
          href="/downloads/devtime-vscode-0.1.3.vsix"
          download
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded border border-neutral-800 text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </a>
      </div>
    </div>
  );
}
