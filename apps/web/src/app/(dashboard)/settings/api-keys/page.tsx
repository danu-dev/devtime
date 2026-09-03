"use client";

import { useState, useEffect } from "react";
import { Key, Plus, Copy, Check, Trash2, ShieldCheck, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ApiKeyItem {
  id: string;
  name: string;
  rawKey?: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export default function ApiKeysPage() {
  const { t } = useLanguage();
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyName, setKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [deletingKey, setDeletingKey] = useState<ApiKeyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewKey(data.rawKey);
        setKeyName("");
        fetchKeys();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmDelete = async () => {
    if (!deletingKey) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/keys/${deletingKey.id}`, { method: "DELETE" });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== deletingKey.id));
        setDeletingKey(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Delete Confirmation Modal */}
      {deletingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-950 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t.deleteApiKeyTitle}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {t.deleteApiKeyDesc(deletingKey.name)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-900">
              <button
                type="button"
                onClick={() => setDeletingKey(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? t.deleting : t.yesDeleteKey}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-neutral-800 pb-4 sm:pb-5">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Key className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
          {t.apiKeysTitle}
        </h1>
        <p className="text-neutral-400 text-xs mt-0.5">
          {t.apiKeysSubtitle}
        </p>
      </header>

      {/* Warning Box for Newly Created Key */}
      {newKey && (
        <div className="p-4 border border-neutral-700 bg-neutral-950 rounded-lg space-y-2.5">
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {t.newKeyGenerated}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 bg-black border border-neutral-800 rounded px-3 py-2 font-mono text-xs text-white select-all break-all overflow-x-auto">
              {newKey}
            </div>
            <button
              onClick={() => copyToClipboard(newKey, "banner")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-black font-semibold text-xs rounded transition-colors shrink-0"
            >
              {copiedId === "banner" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === "banner" ? t.copied : t.copy}
            </button>
          </div>
        </div>
      )}

      {/* Create New Key Section */}
      <div className="p-4 border border-neutral-800 rounded-lg bg-neutral-950">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder={t.placeholderKeyName}
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="flex-1 bg-black border border-neutral-800 focus:border-neutral-500 rounded px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none"
            required
          />
          <button
            type="submit"
            disabled={isCreating}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded transition-colors disabled:opacity-50 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            {isCreating ? t.generating : t.generateKey}
          </button>
        </form>
      </div>

      {/* Active Keys List */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider px-1">
          {t.activeKeys(keys.length)}
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-600">Loading keys...</div>
        ) : keys.length === 0 ? (
          <div className="p-8 border border-neutral-800 rounded-lg bg-neutral-950 text-center text-xs text-neutral-600">
            {t.noKeysFound}
          </div>
        ) : (
          <div className="grid gap-2.5">
            {keys.map((k) => {
              const isRevoked = Boolean(k.revokedAt);
              const isVisible = visibleKeyIds[k.id];

              return (
                <div
                  key={k.id}
                  className="p-3.5 border border-neutral-800 rounded-lg bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{k.name}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                        Active
                      </span>
                    </div>

                    {/* Key View & Copy Row */}
                    {!isRevoked && (
                      <div className="flex items-center gap-1.5 max-w-full">
                        <div className="bg-black border border-neutral-800 rounded px-2 py-0.5 font-mono text-[11px] text-neutral-300 truncate max-w-[200px] sm:max-w-xs">
                          {k.rawKey
                            ? isVisible
                              ? k.rawKey
                              : `${k.rawKey.slice(0, 10)}••••••••••••••••••••••••`
                            : "devtime_••••••••••••••••••••••••"}
                        </div>
                        {k.rawKey && (
                          <>
                            <button
                              onClick={() => toggleVisibility(k.id)}
                              className="p-1 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded"
                              title={isVisible ? "Hide API Key" : "Show API Key"}
                            >
                              {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(k.rawKey!, k.id)}
                              className="flex items-center gap-1 text-[10px] text-neutral-300 hover:text-white px-1.5 py-0.5 bg-neutral-900 hover:bg-neutral-850 rounded border border-neutral-800 transition-colors"
                            >
                              {copiedId === k.id ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                              {copiedId === k.id ? t.copied : t.copy}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                      <span>{t.created}: {new Date(k.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>
                        {t.lastUsed}:{" "}
                        {k.lastUsedAt
                          ? new Date(k.lastUsedAt).toLocaleDateString()
                          : t.never}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeletingKey(k)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1 text-[11px] text-neutral-400 hover:text-red-400 hover:bg-neutral-900 border border-neutral-800 rounded transition-all self-end sm:self-center"
                    title="Delete key"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t.delete}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
