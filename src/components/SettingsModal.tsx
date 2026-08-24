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
  Download,
  CheckCircle2
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
  const [localSyncKey, setLocalSyncKey] = useState(syncKey || "isekai-default");
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
          setSyncStatus({ type: "success", message: "All profiles & data hardcode synchronized successfully!" });
          if (setSyncKey) setSyncKey(localSyncKey);
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
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-4 text-xs font-mono">
          {/* Cloud Sync & Multi-Profile Synchronization */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-purple-400 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="text-slate-200 font-bold block">Universal Multi-Profile Cloud Sync</span>
                  <span className="text-slate-400 text-[10px]">Hardcode synchronized every time, everything & anywhere</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>ACTIVE</span>
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Custom Universal Sync Key</label>
                <input
                  type="text"
                  placeholder="Enter a unique sync key (e.g. isekai-multiverse)"
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
                <div className="text-[10px] text-slate-400 font-mono text-right">
                  Last Synced Everywhere: {new Date(lastSyncedTime).toLocaleString()}
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
                  <span>{isSyncing ? "Syncing..." : "Sync All Profiles"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoad}
                  disabled={isSyncing || !localSyncKey.trim()}
                  className="py-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isSyncing ? "Loading..." : "Restore All State"}</span>
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
              className={`p-2 rounded-xl border cursor-pointer ${
                settings.sfxEnabled
                  ? "bg-purple-950 border-purple-500 text-purple-300"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              {settings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-bold block">Reduced Motion</span>
              <span className="text-slate-400 text-[10px]">Disable background particle mesh animations</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateSettings({ reducedMotion: !settings.reducedMotion });
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer ${
                settings.reducedMotion
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-slate-900 text-slate-400 border-slate-800"
              }`}
            >
              {settings.reducedMotion ? "ON" : "OFF"}
            </button>
          </div>

          {/* Smart TV Navigation Mode */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-bold block flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                <span>Smart TV Remote D-Pad Navigation</span>
              </span>
              <span className="text-slate-400 text-[10px]">Optimize focus boxes for Android TV & FireTV</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateSettings({ tvRemoteNavigationMode: !settings.tvRemoteNavigationMode });
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer ${
                settings.tvRemoteNavigationMode
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-slate-900 text-slate-400 border-slate-800"
              }`}
            >
              {settings.tvRemoteNavigationMode ? "ON" : "OFF"}
            </button>
          </div>

          {/* System Cache Purge & Hard Reset */}
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-red-400 font-bold block">Purge Local Cache</span>
              <span className="text-slate-500 text-[10px]">Reset session data and local state</span>
            </div>
            <button
              onClick={() => {
                sfx.playWarp();
                clearCache();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold flex items-center gap-1 text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Purge Cache</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs uppercase cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
