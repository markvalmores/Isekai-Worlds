import React, { useState, useEffect } from "react";
import { Tv, Volume2, VolumeX, Maximize2, Minimize2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Power, Home, ArrowLeft, RefreshCw, Radio, X } from "lucide-react";
import { sfx } from "../utils/sfx";

interface SmartTvRemoteProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  tabsList: { id: string; label: string }[];
}

export function SmartTvRemote({ isOpen, onClose, activeTab, setActiveTab, tabsList }: SmartTvRemoteProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  // Global key listener for Smart TV remote buttons or Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Remote panel with 'r' key
      if (e.key === "r" || e.key === "R") {
        if (!isOpen) {
          sfx.playClick();
        }
      }

      if (!isOpen) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        window.scrollBy({ top: -200, behavior: "smooth" });
        sfx.playHover();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        window.scrollBy({ top: 200, behavior: "smooth" });
        sfx.playHover();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevTab();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextTab();
      } else if (e.key === "Enter") {
        sfx.playClick();
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key >= "1" && e.key <= "8") {
        const index = parseInt(e.key, 10) - 1;
        if (tabsList[index]) {
          sfx.playClick();
          setActiveTab(tabsList[index].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeTab, tabsList]);

  if (!isOpen) return null;

  const currentTabIdx = tabsList.findIndex((t) => t.id === activeTab);

  const handleNextTab = () => {
    sfx.playClick();
    const nextIdx = (currentTabIdx + 1) % tabsList.length;
    setActiveTab(tabsList[nextIdx].id);
  };

  const handlePrevTab = () => {
    sfx.playClick();
    const prevIdx = (currentTabIdx - 1 + tabsList.length) % tabsList.length;
    setActiveTab(tabsList[prevIdx].id);
  };

  const handleToggleFullscreen = () => {
    sfx.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="w-72 bg-slate-950/95 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              Isekai TV Remote
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Control Bar */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleToggleFullscreen}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 text-indigo-300 hover:text-white transition-all"
            title="Toggle TV Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="text-[9px]">FULLSCREEN</span>
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab("anime");
            }}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 text-amber-300 hover:text-white transition-all"
            title="Return Home"
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px]">HOME</span>
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setIsMuted(!isMuted);
            }}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 text-red-400 hover:text-white transition-all"
            title="Mute Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-[9px]">{isMuted ? "MUTED" : "MUTE"}</span>
          </button>
        </div>

        {/* Directional D-Pad */}
        <div className="relative w-40 h-40 mx-auto bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center p-2 shadow-inner">
          <button
            onClick={() => {
              window.scrollBy({ top: -250, behavior: "smooth" });
              sfx.playHover();
            }}
            className="absolute top-2 w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-t-xl flex items-center justify-center text-white transition-all"
            title="Scroll Up"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrevTab}
            className="absolute left-2 w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-l-xl flex items-center justify-center text-white transition-all"
            title="Previous Tab"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              sfx.playClick();
            }}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-xs uppercase shadow-md transition-all active:scale-95"
            title="Select OK"
          >
            OK
          </button>

          <button
            onClick={handleNextTab}
            className="absolute right-2 w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-r-xl flex items-center justify-center text-white transition-all"
            title="Next Tab"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              window.scrollBy({ top: 250, behavior: "smooth" });
              sfx.playHover();
            }}
            className="absolute bottom-2 w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-b-xl flex items-center justify-center text-white transition-all"
            title="Scroll Down"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Channel Buttons Grid */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
            Channel Shortcuts (1-8)
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {tabsList.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  sfx.playClick();
                  setActiveTab(t.id);
                }}
                className={`p-2 rounded-xl text-[10px] font-bold border transition-all truncate ${
                  activeTab === t.id
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-md"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                {idx + 1}. {t.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
