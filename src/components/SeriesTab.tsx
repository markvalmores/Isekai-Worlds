import React, { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Film,
  Sparkles,
  Info,
  Tv,
  CheckCircle2,
  Play,
  Lock,
  Compass,
  AlertCircle
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { trackHistory } from "../lib/historyService";

export const SeriesTab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const defaultUrl = "https://smashystream.xyz/";
  const [streamUrl, setStreamUrl] = useState(defaultUrl);
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isStrictShield, setIsStrictShield] = useState(true);
  const [blockedPopupAttempts, setBlockedPopupAttempts] = useState(0);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  // Track history once on mount
  useEffect(() => {
    trackHistory("watch", defaultUrl, "SmashyStream Series");
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

  // Intercept any rogue pop-up attempts triggered in the parent window context
  useEffect(() => {
    const originalOpen = window.open;

    // Custom window.open handler that suppresses popup ads
    window.open = function (
      url?: string | URL,
      target?: string,
      features?: string
    ) {
      if (typeof url === "string") {
        // If it's explicitly user-initiated to smashystream or isekai, allow it
        if (
          url === "https://smashystream.xyz/" ||
          url.includes("smashystream.xyz") ||
          url.includes("isekai")
        ) {
          return originalOpen.call(window, url, target, features);
        }
      }

      console.warn("🛡️ Popup Ad Blocked:", url);
      setBlockedPopupAttempts((prev) => prev + 1);
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

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-mono text-amber-300 font-bold">
              <Tv className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>SMASHYSTREAM SERIES PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
              <span>Series & Shows Multiverse</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Stream top TV shows, drama, anime episodes, and cinematic series directly from{" "}
              <strong className="text-amber-300 font-mono">SmashyStream</strong> with built-in popup ad neutralization.
            </p>
          </div>

          {/* Quick Action Buttons Header */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Open External Site Button */}
            <button
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
              title="Open SmashyStream directly in a new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open External Site</span>
            </button>

            {/* Full Screen Button */}
            <button
              onClick={toggleFullScreen}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all hover:scale-105"
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
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
              title="Reload / Refresh Stream Embed"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* AdBlock Shield Status Pill */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>POPUP AD SHIELD: ACTIVE</span>
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Sandboxed isolation blocks pop-up ads and new tab redirects to proceed straight to the original video.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {blockedPopupAttempts > 0 && (
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                🛡️ {blockedPopupAttempts} Pop-up ads prevented
              </span>
            )}
            <button
              onClick={() => setIsStrictShield(!isStrictShield)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                isStrictShield
                  ? "bg-purple-950/60 border-purple-500/50 text-purple-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title="Toggle strict sandbox restrictions"
            >
              {isStrictShield ? "Mode: Strict Shield" : "Mode: Standard"}
            </button>
          </div>
        </div>
      </div>

      {/* Info Tip for Smooth Video Playback */}
      {showInfoBanner && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start justify-between gap-3 text-xs text-indigo-200">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-white">How Popup Ad Shielding Works:</p>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Video players on streaming services occasionally attach pop-up ads to the first click on the play button.
                Because the sandbox blocks all pop-up windows and tab redirects, simply click play on your episode — the pop-up is silenced,
                and the original video loads seamlessly without spam tabs opening!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfoBanner(false)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* URL Navigation & Quick Links Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-3">
        <form onSubmit={handleNavigate} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://smashystream.xyz/"
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
            >
              Load Stream
            </button>
            <button
              type="button"
              onClick={() => handleQuickLink(defaultUrl)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl transition-all"
              title="Reset to SmashyStream Home"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-mono">Quick Access:</span>
          <button
            onClick={() => handleQuickLink("https://smashystream.xyz/")}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border ${
              streamUrl === "https://smashystream.xyz/"
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            SmashyStream Home
          </button>
          <button
            onClick={() => handleQuickLink("https://smashystream.xyz/series")}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border ${
              streamUrl.includes("/series")
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Series List
          </button>
          <button
            onClick={() => handleQuickLink("https://smashystream.xyz/movies")}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border ${
              streamUrl.includes("/movies")
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Movies
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
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Reload video player"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullScreen}
            className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Embedded Iframe */}
        {/* 
          STRICT SANDBOX PROTECTION:
          - allow-scripts: enables JavaScript for player controls, streaming decoders, and episode lists
          - allow-same-origin: allows player cookies, storage, and video source fetching
          - allow-forms: allows form submissions and search
          - allow-presentation: allows video presentation
          - allow-downloads: enables media downloads if offered
          CRITICAL:
          - DOES NOT have 'allow-popups' -> ALL popups, new tabs, and pop-unders are strictly blocked!
          - DOES NOT have 'allow-popups-to-escape-sandbox'
          - DOES NOT have 'allow-top-navigation' -> prevents redirecting the parent app!
        */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={streamUrl}
          title="SmashyStream Series Player"
          className="w-full h-full border-none bg-slate-950"
          sandbox={
            isStrictShield
              ? "allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads"
              : "allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads allow-popups"
          }
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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
            Click the <strong className="text-slate-200">Open External Site</strong> button at any time to launch SmashyStream in a dedicated tab if you want native browser bookmarks or external casting.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Maximize2 className="w-4 h-4" />
            <span>Full Screen Mode</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the <strong className="text-slate-200">Full Screen</strong> button on the header or floating controls to maximize the video canvas for a theater experience.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Direct Video Playback</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The active popup shield suppresses unwanted redirect loops and pop-under ads. You can directly browse seasons, select episodes, and start video playback uninterrupted.
          </p>
        </div>
      </div>
    </div>
  );
};
