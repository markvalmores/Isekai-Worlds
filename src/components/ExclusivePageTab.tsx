import React, { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Globe,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  Flame,
  Zap,
  CheckCircle2,
  Info
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { trackHistory } from "../lib/historyService";

interface ExclusiveDestination {
  id: string;
  name: string;
  shortName: string;
  url: string;
  description: string;
  badge: string;
  gradient: string;
  borderColor: string;
  iconColor: string;
}

const EXCLUSIVE_DESTINATIONS: ExclusiveDestination[] = [
  {
    id: "isekai-1",
    name: "Isekai Worlds 1",
    shortName: "Wix Portal",
    url: "https://markitext.wixsite.com/isekaiworlds",
    description: "Original Isekai Worlds flagship multiverse universe on Wix with exclusive galleries and anime lore.",
    badge: "FLAGSHIP",
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    borderColor: "border-purple-500/40",
    iconColor: "text-purple-400"
  },
  {
    id: "isekai-2",
    name: "Isekai Worlds 2",
    shortName: "Google Sites Portal",
    url: "https://sites.google.com/view/isekaiworlds/home",
    description: "Official Google Sites edition featuring curated dimensions, portal archives, and cloud resources.",
    badge: "GOOGLE SITES",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    borderColor: "border-cyan-500/40",
    iconColor: "text-cyan-400"
  },
  {
    id: "zero-zone",
    name: "Zero Zone",
    shortName: "01Tune Hub",
    url: "https://markitext.wixsite.com/01tune",
    description: "Zero Zone 01Tune portal featuring verified apps, media projects, soundtracks, and futuristic tools.",
    badge: "01TUNE",
    gradient: "from-emerald-600 via-teal-600 to-green-600",
    borderColor: "border-emerald-500/40",
    iconColor: "text-emerald-400"
  }
];

export const ExclusivePageTab: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("isekai-1");
  const [inputUrl, setInputUrl] = useState<string>(EXCLUSIVE_DESTINATIONS[0].url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeDestination = EXCLUSIVE_DESTINATIONS.find((d) => d.id === selectedId) || EXCLUSIVE_DESTINATIONS[0];

  useEffect(() => {
    trackHistory("browse", activeDestination.url, activeDestination.name);
  }, [activeDestination]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleSelect = (dest: ExclusiveDestination) => {
    sfx.playClick();
    setSelectedId(dest.id);
    setInputUrl(dest.url);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = (url?: string) => {
    sfx.playWarp();
    window.open(url || activeDestination.url, "_blank", "noopener,noreferrer");
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
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-mono text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ISEKAI WORLDS EXCLUSIVE NETWORK</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
              <span>Exclusive Page</span>
              <Globe className="w-6 h-6 text-amber-400 inline" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Official connected realms of the Isekai ecosystem: <strong className="text-purple-300 font-semibold">Isekai Worlds 1</strong>, <strong className="text-cyan-300 font-semibold">Isekai Worlds 2</strong>, and <strong className="text-emerald-300 font-semibold">Zero Zone</strong>.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenExternal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-105 cursor-pointer"
              title="Open current exclusive site in a new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open External Website</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </button>

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

            <button
              onClick={handleReload}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Reload Frame"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Exclusive Destination Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXCLUSIVE_DESTINATIONS.map((dest) => {
          const isSelected = dest.id === selectedId;
          return (
            <div
              key={dest.id}
              onClick={() => handleSelect(dest)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-900/90 ${dest.borderColor} ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/10 scale-[1.02]`
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950 border ${
                    isSelected ? "text-amber-300 border-amber-400/40" : "text-slate-400 border-slate-800"
                  }`}>
                    {dest.badge}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenExternal(dest.url);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title={`Open ${dest.name} in new tab`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${
                    isSelected ? "text-white" : "text-slate-300"
                  }`}>
                    <Layers className={`w-4 h-4 ${dest.iconColor}`} />
                    <span>{dest.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className={isSelected ? "text-amber-300 font-bold" : "text-slate-500"}>
                  {isSelected ? "ACTIVE VIEW" : "CLICK TO VIEW"}
                </span>
                <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                  {dest.url.replace("https://", "")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* URL Bar & Quick Open */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => handleOpenExternal(inputUrl)}
            className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch External</span>
          </button>
          <button
            onClick={handleReload}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl transition-all cursor-pointer"
            title="Reload Frame"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Interactive Frame Viewer Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300 ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen border-none" : "h-[78vh] min-h-[580px]"
        }`}
      >
        {/* Floating Top Frame Bar */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
          <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1 hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeDestination.name}</span>
          </span>

          <button
            onClick={() => handleOpenExternal()}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors cursor-pointer"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title="Reload web page"
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
          src={inputUrl}
          title={activeDestination.name}
          className="w-full h-full border-none bg-slate-950"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Helpful Tip */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-300">Viewing Tip:</span>
          <p>
            You can view each exclusive portal right inside the frame above or use the <strong className="text-amber-300">Open External Website</strong> button to launch directly. Some portal elements with cross-domain scripts render best in a dedicated tab.
          </p>
        </div>
      </div>
    </div>
  );
};
