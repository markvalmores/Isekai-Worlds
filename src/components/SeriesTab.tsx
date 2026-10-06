import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Film,
  Sparkles,
  Info,
  Tv,
  ArrowUpRight,
  Flame,
  Globe,
  Lock,
  Video,
  ShieldCheck
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { trackHistory } from "../lib/historyService";

export const SeriesTab: React.FC = () => {
  const defaultUrl = "https://novahd.cc/shows";
  const [customUrl, setCustomUrl] = useState(defaultUrl);

  // Track history once on mount
  useEffect(() => {
    trackHistory("watch", defaultUrl, "NovaHD Series & TV Shows");
  }, []);

  const handleOpenExternal = (url: string = defaultUrl) => {
    sfx.playWarp();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNavigateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    let target = customUrl.trim();
    if (!target) {
      target = defaultUrl;
    }
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }
    handleOpenExternal(target);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Main Hero Card with Prominent Open External Website Action */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/40 p-8 sm:p-12 shadow-[0_0_60px_rgba(245,158,11,0.2)] text-center flex flex-col items-center">
        {/* Glowing Background Light Aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-xs font-mono text-amber-300 font-bold shadow-sm">
            <Tv className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>OFFICIAL NOVAHD SERIES & TV SHOWS</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-3">
            <span>Series & Shows Portal</span>
            <Sparkles className="w-6 h-6 text-amber-400 inline" />
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Streaming platforms like NovaHD employ anti-iframe security policies and video decoders that do not load properly within embedded frames.
          </p>

          <p className="text-xs sm:text-sm text-slate-400">
            Click below to open <strong className="text-amber-300 font-mono">novahd.cc/shows</strong> directly in an external high-speed window for flawless 1080p full-screen streaming, full episode selection, and pure video playback.
          </p>

          {/* Prominent Large Open External Website CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleOpenExternal(defaultUrl)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-base sm:text-lg rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-400/50 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              title="Open https://novahd.cc/shows in a new browser tab"
            >
              <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Open External Website</span>
              <ArrowUpRight className="w-5 h-5 opacity-75" />
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2 pt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target: <strong className="text-amber-300">https://novahd.cc/shows</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Launch Category Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Direct NovaHD Launch Channels</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Instant One-Click Links</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Card 1: All Shows */}
          <div
            onClick={() => handleOpenExternal("https://novahd.cc/shows")}
            className="group cursor-pointer p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                  TV Shows Catalog
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Full library of ongoing series, seasons, and episodes.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
              <span>OPEN SHOWS</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: NovaHD Home */}
          <div
            onClick={() => handleOpenExternal("https://novahd.cc/")}
            className="group cursor-pointer p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                  NovaHD Home
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Latest releases, featured titles, and main portal.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-indigo-400 font-semibold">
              <span>OPEN HOME</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Movies */}
          <div
            onClick={() => handleOpenExternal("https://novahd.cc/movies")}
            className="group cursor-pointer p-5 rounded-2xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                  Movies Hub
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Blockbuster cinema, 4K releases, and trending films.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-purple-400 font-semibold">
              <span>OPEN MOVIES</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Trending */}
          <div
            onClick={() => handleOpenExternal("https://novahd.cc/trending")}
            className="group cursor-pointer p-5 rounded-2xl bg-slate-900/80 border border-rose-500/20 hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-rose-300 transition-colors">
                  Trending Hits
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Most-watched series and viral TV episodes right now.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-rose-400 font-semibold">
              <span>OPEN TRENDING</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom URL Launch Form */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-400" />
            <span>Launch Specific NovaHD Show or Episode URL</span>
          </h4>
          <p className="text-xs text-slate-400">
            Paste any specific episode link or NovaHD playlist to open directly into a high-speed external window:
          </p>
        </div>

        <form onSubmit={handleNavigateCustom} className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://novahd.cc/shows"
            className="flex-1 w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Link</span>
          </button>
        </form>
      </div>

      {/* Info explanation card */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-300">Why does this open externally?</span>
          <p>
            Streaming services like NovaHD use specialized cross-origin media players and anti-nesting restrictions that fail or display blank screens inside iframes. Opening directly in an external tab allows your browser's native video player and adblock extensions to deliver full 1080p video without errors.
          </p>
        </div>
      </div>
    </div>
  );
};
