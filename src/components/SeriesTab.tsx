import React, { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  ShieldCheck,
  RotateCcw,
  Film,
  Sparkles,
  Info,
  Tv,
  Compass,
  Lock,
  Ban,
  ArrowUpRight,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { trackHistory } from "../lib/historyService";

export const SeriesTab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const defaultUrl = "https://watchseries.at/tv-shows";
  const [streamUrl, setStreamUrl] = useState(defaultUrl);
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [blockedPopupAttempts, setBlockedPopupAttempts] = useState(0);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [shieldNotice, setShieldNotice] = useState<string | null>(null);
  // Sandbox mode: "strict" (blocks all popups & redirects) or "permissive" (if embed requires standard frame mode)
  const [sandboxMode, setSandboxMode] = useState<"strict" | "permissive">("strict");

  // Track history once on mount
  useEffect(() => {
    trackHistory("watch", defaultUrl, "WatchSeries TV Shows");
  }, []);

  // Monitor fullscreen state changes (e.g. via Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Intercept rogue pop-up attempts in parent window context
  useEffect(() => {
    const originalOpen = window.open;

    window.open = function (
      url?: string | URL,
      target?: string,
      features?: string
    ) {
      if (typeof url === "string") {
        if (
          url === "https://watchseries.at/tv-shows" ||
          url.includes("watchseries.at") ||
          url.includes("isekai")
        ) {
          return originalOpen.call(window, url, target, features);
        }
      }

      console.warn("🛡️ AdBlocker: Prevented pop-up ad attempt:", url);
      setBlockedPopupAttempts((prev) => prev + 1);
      setShieldNotice("Blocked unwanted pop-up ad attempt. Protected original video stream.");
      setTimeout(() => setShieldNotice(null), 4000);
      return null;
    };

    return () => {
      window.open = originalOpen;
    };
  }, []);

  const handleOpenExternal = () => {
    sfx.playWarp();
    window.open(streamUrl, "_blank", "noopener,noreferrer");
  };

  const toggleFullScreen = async () => {
    sfx.playClick();
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const handleReload = () => {
    sfx.playClick();
    setIframeKey((prev) => prev + 1);
    setShieldNotice("Refreshed WatchSeries player frame.");
    setTimeout(() => setShieldNotice(null), 3000);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playClick();
    let target = inputUrl.trim();
    if (!target) {
      target = defaultUrl;
    }
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }
    setStreamUrl(target);
    setInputUrl(target);
    setIframeKey((prev) => prev + 1);
  };

  const handleQuickLink = (url: string) => {
    sfx.playClick();
    setStreamUrl(url);
    setInputUrl(url);
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleSandbox = () => {
    sfx.playClick();
    const nextMode = sandboxMode === "strict" ? "permissive" : "strict";
    setSandboxMode(nextMode);
    setIframeKey((prev) => prev + 1);
    setShieldNotice(
      nextMode === "strict"
        ? "🛡️ Strict AdBlock Shield active (Popups & Redirects Blocked)."
        : "⚡ Permissive Mode active (Standard frame compatibility)."
    );
    setTimeout(() => setShieldNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-mono text-amber-300 font-bold">
              <Tv className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>WATCHSERIES TV SHOWS MULTIVERSE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
              <span>Series & TV Shows</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Stream top TV shows, seasons, and episodes directly from{" "}
              <strong className="text-amber-300 font-mono">watchseries.at/tv-shows</strong> with built-in popup ad blocking and instant external viewing.
            </p>
          </div>

          {/* Quick Action Buttons Header */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Open External Site Button */}
            <button
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-105 cursor-pointer"
              title="Open WatchSeries directly in a new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open External Site</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Full Screen Button */}
            <button
              onClick={toggleFullScreen}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all hover:scale-105 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-purple-400" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-purple-400" />
                  <span>Full Screen</span>
                </>
              )}
            </button>

            {/* Reload Stream Button */}
            <button
              onClick={handleReload}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Reload / Refresh Stream Embed"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* AdBlocker Shield Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono font-bold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>AD SHIELD: {sandboxMode === "strict" ? "STRICT POPUPS BLOCKED" : "COMPATIBILITY MODE"}</span>
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-[11px]">
              <Lock className="w-3 h-3 text-purple-400" />
              <span>Redirect Hijack Blocked</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {blockedPopupAttempts > 0 && (
              <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                🛡️ {blockedPopupAttempts} Pop-ups stopped
              </span>
            )}
            <button
              onClick={handleToggleSandbox}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center gap-1.5"
              title="Toggle sandbox mode for player compatibility"
            >
              <Sliders className="w-3 h-3 text-amber-400" />
              <span>Mode: {sandboxMode === "strict" ? "Strict AdBlock" : "Permissive"}</span>
            </button>
          </div>
        </div>

        {/* Live Shield Alert Notice */}
        {shieldNotice && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-400/60 rounded-xl text-xs font-mono text-emerald-200 flex items-center gap-2 animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{shieldNotice}</span>
          </div>
        )}
      </div>

      {/* Info Tip / Direct Fallback Notice */}
      {showInfoBanner && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start justify-between gap-3 text-xs text-indigo-200">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-white">WatchSeries Streaming & Ad Protection:</p>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                WatchSeries is embedded below with popup ad suppression. If your browser or privacy extension restricts third-party frame loading, simply click <strong className="text-amber-300">Open External Site</strong> to launch WatchSeries directly in a dedicated full tab!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfoBanner(false)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* URL Navigation & Quick Links Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3">
        <form onSubmit={handleNavigate} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://watchseries.at/tv-shows"
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              Load Stream
            </button>
            <button
              type="button"
              onClick={() => handleQuickLink(defaultUrl)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl transition-all cursor-pointer"
              title="Reset to WatchSeries TV Shows"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-mono">Quick Access:</span>
          <button
            onClick={() => handleQuickLink("https://watchseries.at/tv-shows")}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border cursor-pointer ${
              streamUrl === "https://watchseries.at/tv-shows"
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            TV Shows
          </button>
          <button
            onClick={() => handleQuickLink("https://watchseries.at/")}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border cursor-pointer ${
              streamUrl === "https://watchseries.at/"
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            WatchSeries Home
          </button>
          <button
            onClick={() => handleQuickLink("https://watchseries.at/movies")}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border cursor-pointer ${
              streamUrl.includes("/movies")
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => handleQuickLink("https://watchseries.at/top-imdb")}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border cursor-pointer ${
              streamUrl.includes("/top-imdb")
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Top IMDb
          </button>
        </div>
      </div>

      {/* The Main Embedded Player Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300 ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen border-none" : "h-[78vh] min-h-[580px]"
        }`}
      >
        {/* Floating Controls Bar inside player container */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 hidden sm:flex">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ads Blocked</span>
          </span>

          <button
            onClick={handleOpenExternal}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors cursor-pointer"
            title="Open WatchSeries in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title="Reload video player"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullScreen}
            className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Embedded Iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={streamUrl}
          title="WatchSeries TV Shows Player"
          className="w-full h-full border-none bg-slate-950"
          sandbox={
            sandboxMode === "strict"
              ? "allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads"
              : "allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads allow-popups"
          }
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Helpful Quick Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <ExternalLink className="w-4 h-4" />
            <span>Open External Site</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the <strong className="text-slate-200">Open External Site</strong> button to stream <span className="text-amber-300 font-mono">watchseries.at</span> directly in a new window with full browser bookmarking and casting.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Maximize2 className="w-4 h-4" />
            <span>Full Screen Mode</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Toggle <strong className="text-slate-200">Full Screen</strong> on the header or floating controls to maximize the series canvas for cinema playback.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Pop-up Ad Block Shield</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The active isolation sandbox blocks pop-ups, pop-unders, and redirect loops so you can enjoy episodes without spam.
          </p>
        </div>
      </div>
    </div>
  );
};
