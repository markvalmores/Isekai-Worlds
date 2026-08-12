import React, { useState } from "react";
import {
  Monitor,
  X,
  Check,
  Upload,
  Link as LinkIcon,
  Sparkles,
  RefreshCw,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Sliders
} from "lucide-react";
import { AppSettings } from "../types";
import { sfx } from "../utils/sfx";
import { PRESET_WALLPAPERS } from "./CommandPaletteModal";

interface LiveWallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export function LiveWallpaperModal({
  isOpen,
  onClose,
  settings,
  updateSettings
}: LiveWallpaperModalProps) {
  const [customInput, setCustomInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleApplyUrl = (url: string, type: "video" | "image") => {
    if (!url.trim()) return;
    sfx.playBadgeUnlock();
    updateSettings({
      webAppWallpaperEnabled: true,
      webAppWallpaperUrl: url.trim(),
      webAppWallpaperType: type
    });
    setSuccessMsg("Wallpaper applied successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".webm");
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleApplyUrl(dataUrl, isVideo ? "video" : "image");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCycleNextPreset = () => {
    sfx.playWarp();
    const currentIndex = PRESET_WALLPAPERS.findIndex(
      (p) => p.url === settings.webAppWallpaperUrl
    );
    const nextIndex = (currentIndex + 1) % PRESET_WALLPAPERS.length;
    const nextPreset = PRESET_WALLPAPERS[nextIndex];
    updateSettings({
      webAppWallpaperEnabled: true,
      webAppWallpaperUrl: nextPreset.url,
      webAppWallpaperType: nextPreset.type
    });
    setSuccessMsg(`Switched to ${nextPreset.name}!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl shadow-purple-950/60 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Web App Custom & Live Wallpaper Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
                  4K / MP4 / GIF
                </span>
              </h2>
              <p className="text-xs text-slate-400">Customize the live background running behind your web app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Main Enable / Disable Toggle & Quick Cycle Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>Live Background Status</span>
                {settings.webAppWallpaperEnabled ? (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-500 font-bold">DISABLED</span>
                )}
              </p>
              <p className="text-xs text-slate-400">Looping video (MP4) or animated GIF/JPG custom wallpaper</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCycleNextPreset}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-purple-500/30 text-xs font-bold font-mono text-purple-300 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                title="Shuffle through preset live wallpapers"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Cycle Live Wallpapers</span>
              </button>

              <button
                onClick={() => {
                  sfx.playWarp();
                  updateSettings({
                    webAppWallpaperEnabled: !settings.webAppWallpaperEnabled,
                    webAppWallpaperUrl: settings.webAppWallpaperUrl || PRESET_WALLPAPERS[0].url,
                    webAppWallpaperType: settings.webAppWallpaperType || PRESET_WALLPAPERS[0].type
                  });
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-md ${
                  settings.webAppWallpaperEnabled
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                {settings.webAppWallpaperEnabled ? "ENABLED" : "ENABLE"}
              </button>
            </div>
          </div>

          {/* Success Notification */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Presets Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Preset 4K Live Wallpapers & Loops</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_WALLPAPERS.map((preset) => {
                const isSelected = settings.webAppWallpaperUrl === preset.url && settings.webAppWallpaperEnabled;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyUrl(preset.url, preset.type)}
                    className={`group relative rounded-2xl overflow-hidden border text-left transition-all aspect-video flex flex-col justify-end p-2.5 ${
                      isSelected
                        ? "border-purple-500 ring-2 ring-purple-500/60 shadow-lg shadow-purple-500/30"
                        : "border-slate-800 hover:border-purple-500/50 hover:scale-[1.02]"
                    }`}
                  >
                    <img
                      src={preset.preview}
                      alt={preset.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="relative z-10">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold uppercase">
                        {preset.format}
                      </span>
                      <p className="text-xs font-bold text-white line-clamp-1 mt-1">{preset.name}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-1 bg-purple-600 rounded-full text-white shadow-md">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input & File Upload */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Upload or Paste Custom Wallpaper (MP4, GIF, JPG, PNG)</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Paste direct MP4 video, GIF animation, or 4K JPG/PNG URL..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => {
                  const isVideo = customInput.includes(".mp4") || customInput.includes(".webm");
                  handleApplyUrl(customInput, isVideo ? "video" : "image");
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all whitespace-nowrap shadow-md"
              >
                Apply Custom URL
              </button>
            </div>

            <label className="flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-850 border border-dashed border-slate-800 hover:border-purple-500/60 rounded-2xl cursor-pointer transition-all text-xs font-bold text-purple-300">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Upload Local MP4, GIF, JPG, or PNG File from Device</span>
              <input
                type="file"
                accept="image/gif, image/jpeg, image/png, video/mp4, video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Supported: .mp4, .webm, .gif, .jpg, .png</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
