import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Film,
  Sparkles,
  Info,
  Tv,
  PlaySquare,
  ShieldCheck,
  Video,
  ArrowUpRight,
  Flame,
  Globe,
  Radio,
  CheckCircle2,
  Lock
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { trackHistory } from "../lib/historyService";

export const ReelsDramaTab: React.FC = () => {
  const defaultUrl = "https://www.mewatch.sg/series";
  const [customUrl, setCustomUrl] = useState(defaultUrl);

  // Track history once on mount
  useEffect(() => {
    trackHistory("watch", defaultUrl, "mewatch Reels Drama & Series");
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
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-pink-500/40 p-8 sm:p-12 shadow-[0_0_60px_rgba(236,72,153,0.2)] text-center flex flex-col items-center">
        {/* Glowing Background Light Aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-pink-500/20 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/50 text-xs font-mono text-pink-300 font-bold shadow-sm">
            <PlaySquare className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>OFFICIAL MEWATCH SERIES & REELS DRAMA</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-3">
            <span>Reels Drama Portal</span>
            <Sparkles className="w-6 h-6 text-pink-400 inline" />
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Due to strict security protocols and DRM protection (<code className="text-pink-300 bg-pink-950/60 px-1.5 py-0.5 rounded text-xs font-mono">X-Frame-Options: SAMEORIGIN</code>), mewatch series cannot be embedded directly in an iframe.
          </p>

          <p className="text-xs sm:text-sm text-slate-400">
            Launch the official website directly in a high-speed browser tab for uninterrupted 1080p full-screen streaming, subbed drama, and official episodes.
          </p>

          {/* Prominent Large Open External Website CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleOpenExternal(defaultUrl)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-xl shadow-pink-600/30 hover:shadow-pink-500/50 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              title="Open https://www.mewatch.sg/series in a new browser tab"
            >
              <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Open External Website</span>
              <ArrowUpRight className="w-5 h-5 opacity-75" />
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2 pt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target: <strong className="text-pink-300">https://www.mewatch.sg/series</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Launch Category Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-pink-400" />
            <span>Direct mewatch Launch Channels</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Instant One-Click Links</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: All Series */}
          <div
            onClick={() => handleOpenExternal("https://www.mewatch.sg/series")}
            className="group cursor-pointer p-6 rounded-2xl bg-slate-900/80 border border-pink-500/20 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-pink-300 transition-colors">
                  Series & Drama Catalog
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Full library of Chinese, Korean, English, Malay, and Tamil series.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-pink-400 font-semibold">
              <span>OPEN SERIES</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: mewatch Home */}
          <div
            onClick={() => handleOpenExternal("https://www.mewatch.sg/")}
            className="group cursor-pointer p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                  mewatch Home
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Featured highlights, trending shows, news, and originals homepage.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-indigo-400 font-semibold">
              <span>OPEN HOMEPAGE</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Live Channels */}
          <div
            onClick={() => handleOpenExternal("https://www.mewatch.sg/channels")}
            className="group cursor-pointer p-6 rounded-2xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                  Live TV Channels
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Stream live TV broadcast channels (Channel 5, Channel 8, Suria, Vasantham).
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-purple-400 font-semibold">
              <span>OPEN LIVE TV</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom URL Launch Form */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-pink-500/20 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-pink-400" />
            <span>Launch Specific mewatch Drama or Episode URL</span>
          </h4>
          <p className="text-xs text-slate-400">
            Paste any specific episode link or mewatch playlist to launch directly into an external window:
          </p>
        </div>

        <form onSubmit={handleNavigateCustom} className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://www.mewatch.sg/series"
            className="flex-1 w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 font-mono"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Link</span>
          </button>
        </form>
      </div>

      {/* Info explanation card */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-300">Why does this open externally?</span>
          <p>
            Major streaming platforms like mewatch enforce strict browser-level security policies (X-Frame-Options and Content Security Policy) to protect licensed content and DRM decoders. Opening directly on the official website provides you with full HD playback, zero loading errors, and uninterrupted access.
          </p>
        </div>
      </div>
    </div>
  );
};
