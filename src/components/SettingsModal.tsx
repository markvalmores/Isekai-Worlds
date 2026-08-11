import React, { useState } from "react";
import { AppSettings, LanguageCode } from "../types";
import { SUPPORTED_LANGUAGES, getTranslation } from "../utils/i18n";
import { sfx } from "../utils/sfx";
import {
  Settings,
  X,
  Cookie,
  RefreshCw,
  Volume2,
  VolumeX,
  Tv,
  Globe,
  Check,
  Moon,
  Sparkles,
  Gamepad2,
  Cloud,
  Upload,
  Download
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  clearCache: () => void;
  syncKey?: string;
  setSyncKey?: (val: string) => void;
  lastSyncedTime?: string;
  onCloudSave?: (key: string) => Promise<{ success: boolean; message: string; lastSynced?: string }>;
  onCloudLoad?: (key: string) => Promise<{ success: boolean; error?: string }>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
  clearCache,
  syncKey = "",
  setSyncKey,
  lastSyncedTime = "",
  onCloudSave,
  onCloudLoad,
}) => {
  const [localSyncKey, setLocalSyncKey] = useState(syncKey);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!localSyncKey.trim()) return;
    sfx.playClick();
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      if (onCloudSave) {
        const res = await onCloudSave(localSyncKey);
        if (res.success) {
          setSyncStatus({ type: "success", message: res.message });
          if (setSyncKey) setSyncKey(localSyncKey);
        } else {
          setSyncStatus({ type: "error", message: res.message });
        }
      }
    } catch {
      setSyncStatus({ type: "error", message: "An unexpected error occurred during sync." });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoad = async () => {
    if (!localSyncKey.trim()) return;
    sfx.playWarp();
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      if (onCloudLoad) {
        const res = await onCloudLoad(localSyncKey);
        if (res.success) {
          setSyncStatus({ type: "success", message: "State synchronized! Reloading page to apply changes..." });
          if (setSyncKey) setSyncKey(localSyncKey);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setSyncStatus({ type: "error", message: res.error || "Sync data not found." });
        }
      }
    } catch {
      setSyncStatus({ type: "error", message: "An unexpected error occurred during restore." });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <div className="relative max-w-lg w-full bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              System Settings
            </h3>
          </div>
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-4 text-xs font-mono">
          {/* Cloud Sync & PC-Mobile Synchronization */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-purple-400 animate-pulse" />
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold block">PC & Mobile Cloud Sync</span>
                <span className="text-slate-400 text-[10px]">Synchronize settings, profiles, and AMV playlists instantly</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Custom Sync Key</label>
                <input
                  type="text"
                  placeholder="Enter a unique code (e.g. isekai-mdv)"
                  value={localSyncKey}
                  onChange={(e) => setLocalSyncKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              {syncStatus && (
                <div className={`text-[11px] font-mono p-2.5 rounded-xl border ${
                  syncStatus.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}>
                  {syncStatus.message}
                </div>
              )}

              {lastSyncedTime && (
                <div className="text-[10px] text-slate-500 font-mono text-right">
                  Last Synced: {new Date(lastSyncedTime).toLocaleString()}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSyncing || !localSyncKey.trim()}
                  className="py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isSyncing ? "Saving..." : "Backup to Cloud"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoad}
                  disabled={isSyncing || !localSyncKey.trim()}
                  className="py-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isSyncing ? "Loading..." : "Restore State"}</span>
                </button>
              </div>
            </div>
          </div>
          {/* Language Selection */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>AI Language Translation</span>
              </span>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as LanguageCode })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Interface SFX Sound Effects */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-bold block">Anime Interface SFX</span>
              <span className="text-slate-400 text-[10px]">Laser ticks, click sounds & warp audio</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateSettings({ sfxEnabled: !settings.sfxEnabled });
              }}
              className={`p-2 rounded-xl border ${
                settings.sfxEnabled
                  ? "bg-purple-950 border-purple-500 text-purple-300"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              {settings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Smart TV / Controller Navigation Mode */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-bold flex items-center gap-2">
                <Tv className="w-4 h-4 text-rose-400" />
                <span>Smart TV / Controller Focus</span>
              </span>
              <span className="text-slate-400 text-[10px]">High contrast outline rings for TV remotes</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateSettings({ tvRemoteNavigationMode: !settings.tvRemoteNavigationMode });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.tvRemoteNavigationMode ? "bg-rose-500" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.tvRemoteNavigationMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Cookies Acceptance Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-bold flex items-center gap-2">
                <Cookie className="w-4 h-4 text-amber-400" />
                <span>Cookie Consent Status</span>
              </span>
              <span className="text-slate-400 text-[10px]">Store local active preferences & session cache</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateSettings({ cookiesAccepted: !settings.cookiesAccepted });
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                settings.cookiesAccepted
                  ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                  : "bg-amber-950 border-amber-500 text-amber-300"
              }`}
            >
              {settings.cookiesAccepted ? "Accepted" : "Accept"}
            </button>
          </div>

          {/* Gold Mode Premium Toggle */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-amber-200 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Gold Mode Premium Theme</span>
              </span>
              <span className="text-slate-400 text-[10px]">Transforms site color theme into radiant gold</span>
            </div>
            <button
              onClick={() => {
                sfx.playWarp();
                updateSettings({ isGoldMode: !settings.isGoldMode });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.isGoldMode ? "bg-amber-400" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  settings.isGoldMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Auto Reload & Auto Fix Website Button */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                sfx.playBadgeUnlock();
                try {
                  localStorage.removeItem("isekai_corrupted_state");
                } catch {}
                window.location.reload();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:scale-[1.02] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/40"
            >
              <RefreshCw className="w-4 h-4 text-emerald-200 animate-spin" />
              <span>Auto Reload & Self-Heal Website</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                clearCache();
              }}
              className="w-full py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{getTranslation(settings.language, "clearCache")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
