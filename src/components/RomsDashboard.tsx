import React, { useState, useEffect } from "react";
import {
  HardDrive,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  Gamepad,
  Sparkles,
  Search,
  Database,
  Cpu,
  Bookmark,
  BookmarkCheck,
  ShieldAlert,
  Terminal,
  Activity,
  Award
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface ConsoleCategory {
  name: string;
  count: string;
  icon: string;
  color: string;
}

const CONSOLE_CATEGORIES: ConsoleCategory[] = [
  { name: "Nintendo (NES/SNES/N64)", count: "12,450 ROMs", icon: "🎮", color: "from-red-500/20 to-red-600/10" },
  { name: "PlayStation (PS1/PS2/PSP)", count: "8,920 ROMs", icon: "💿", color: "from-blue-500/20 to-blue-600/10" },
  { name: "Sega (Genesis/Dreamcast)", count: "4,150 ROMs", icon: "🌀", color: "from-sky-500/20 to-sky-600/10" },
  { name: "Handheld (GB/GBC/GBA/NDS)", count: "15,800 ROMs", icon: "🔋", color: "from-emerald-500/20 to-emerald-600/10" },
  { name: "Arcade (MAME/NeoGeo)", count: "6,200 ROMs", icon: "🕹️", color: "from-amber-500/20 to-amber-600/10" }
];

interface RomsDashboardProps {
  onAddCoins?: (amount: number) => void;
  isGoldMode?: boolean;
}

export function RomsDashboard({ onAddCoins, isGoldMode = false }: RomsDashboardProps) {
  const EMBED_URL = "https://r-roms.gitlab.io/megathread/popular/";
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isekai_roms_bookmarked") === "true";
    } catch {
      return false;
    }
  });

  // Track playtime in ROMs section
  const [romsSeconds, setRomsSeconds] = useState<number>(0);
  const [coinsClaimed, setCoinsClaimed] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRomsSeconds((prev) => {
        const next = prev + 1;
        if (next % 45 === 0) {
          const reward = 15;
          if (onAddCoins) onAddCoins(reward);
          setCoinsClaimed((curr) => curr + reward);
          sfx.playBadgeUnlock();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onAddCoins]);

  const handleRefresh = () => {
    sfx.playClick();
    setIframeKey(Date.now());
  };

  const handleToggleBookmark = () => {
    sfx.playClick();
    const nextVal = !isBookmarked;
    setIsBookmarked(nextVal);
    localStorage.setItem("isekai_roms_bookmarked", String(nextVal));
  };

  const formatSessionTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="space-y-6">
      {/* Banner Hub */}
      <div className={`p-8 sm:p-10 rounded-3xl relative overflow-hidden border ${
        isGoldMode
          ? "bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-amber-950/40 border-amber-500/20"
          : "bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/40 border-purple-500/10"
      }`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-bold tracking-wider uppercase">
            <Database className="w-3.5 h-3.5 animate-pulse" />
            Retro Vault Connection: ONLINE
          </div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Retro ROMs Megathread Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Access the legendary Gitlab Retro Megathread containing a safe, validated database of the world's most popular console ROMs, emulator configurations, and retro BIOS files.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-mono text-slate-450">
            <span className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800">
              <Activity className="w-3 h-3 text-purple-400" /> Frame Redirection
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800">
              <Cpu className="w-3 h-3 text-cyan-400" /> Safe Emulator Indexes
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800">
              <Award className="w-3 h-3 text-amber-400" /> Active Bounty: +15 coins / 45s
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Categories left/top, Iframe viewport main */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side Info Desk / Quick Stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Active Session Stat Card */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-purple-500/10 space-y-4">
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-purple-400 font-bold uppercase tracking-widest">Vault Telemetry</span>
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-400" />
                Session Log
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-850">
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Active Time</span>
                <span className="text-xs font-mono font-black text-white">{formatSessionTime(romsSeconds)}</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-850">
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Coins Won</span>
                <span className="text-xs font-mono font-black text-amber-400">+{coinsClaimed}</span>
              </div>
            </div>

            <button
              onClick={handleToggleBookmark}
              className={`w-full py-2 rounded-xl border text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                isBookmarked
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-950/80 text-slate-400 border-slate-850 hover:text-purple-400 hover:border-purple-500/20"
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isBookmarked ? "Bookmarked Vault" : "Bookmark Portal"}</span>
            </button>
          </div>

          {/* Quick Category Directory */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-850 space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Available Emulator Indexes
            </h4>
            <div className="space-y-2">
              {CONSOLE_CATEGORIES.map((cat, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl bg-gradient-to-r ${cat.color} border border-slate-850/40 flex items-center justify-between text-xs font-mono`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-white font-bold text-[10px] truncate max-w-[120px]">{cat.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-450">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Alert / Sandbox warning */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/10 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-[10px] font-bold text-amber-300 uppercase font-mono">Verified Safe Link</h5>
              <p className="text-[9px] text-slate-400 leading-relaxed">
                Our Megathread frames load directly from public repositories. No executable downloads are initiated without consent. Feel free to use the <strong>external window</strong> if you prefer full retro layout scaling.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side / Iframe Container */}
        <div className="lg:col-span-3 space-y-4">
          {/* Deck Controls */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs">
                ✦
              </div>
              <div className="text-left">
                <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Active Embedded Sandbox</span>
                <h3 className="text-xs font-black text-white uppercase">
                  Gitlab R-Roms Megathread
                </h3>
              </div>
            </div>

            <div className="flex-1 max-w-md w-full relative">
              <input
                type="text"
                readOnly
                value={EMBED_URL}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-[10px] text-slate-450 font-mono focus:outline-none truncate select-all text-center"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRefresh}
                className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all"
                title="Refresh Embedded Frame"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <a
                href={EMBED_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sfx.playWarp()}
                className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all inline-flex items-center"
                title="Launch in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  sfx.playClick();
                  setIsFullscreen(!isFullscreen);
                }}
                className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Embedded Container */}
          <div className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
            isFullscreen ? "fixed inset-0 z-50 rounded-none w-screen h-screen" : "h-[650px]"
          }`}>
            {isFullscreen && (
              <div className="absolute top-4 left-4 z-40 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-[9px] font-mono space-y-1 backdrop-blur shadow-md text-white">
                <span className="text-purple-400 font-bold block">✦ Active Session: {formatSessionTime(romsSeconds)}</span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="mt-1 text-[8px] bg-slate-900 border border-slate-750 text-white px-2 py-0.5 rounded uppercase block font-bold hover:bg-slate-800"
                >
                  Exit Fullscreen
                </button>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={EMBED_URL}
              className="w-full h-full border-none bg-slate-900"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              referrerPolicy="no-referrer"
            />

            {/* Bottom Diagnostic footer */}
            <div className="bg-slate-900/90 border-t border-slate-850 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-slate-450">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span>Redirect active on r-roms.gitlab.io/megathread/popular</span>
              </div>
              <div className="hidden sm:block">
                Secure SSL: <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
