import React, { useState, useEffect } from "react";
import { sfx } from "../utils/sfx";
import { fetchRealTimeAnimeList, RealTimeAnimeItem } from "../utils/animeApi";
import {
  Eye,
  Sparkles,
  Compass,
  Maximize2,
  Shield,
  Radio,
  RotateCcw,
  Vibrate,
  Zap,
  Activity,
  Box,
  Disc,
  Layers,
  Crosshair
} from "lucide-react";

type HapticIntensity = "soft" | "medium" | "heavy" | "ultra";

export const VrViewPortal: React.FC = () => {
  const [rotationY, setRotationY] = useState(0);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Simulated Haptic Feedback State
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [hapticIntensity, setHapticIntensity] = useState<HapticIntensity>("medium");
  const [isVibrating, setIsVibrating] = useState(false);
  const [lastHapticEvent, setLastHapticEvent] = useState<string>("System Ready • Touch or Interact");
  const [hapticWaveform, setHapticWaveform] = useState<number[]>([15, 40, 20, 85, 45, 10, 95, 30, 60, 20]);
  const [activeObject, setActiveObject] = useState<string | null>(null);

  // Visual Haptic Click Ripple State
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; label: string; pattern: number[] }[]>([]);

  // Haptic pulse trigger function
  const triggerHaptic = (
    pattern: number[],
    eventLabel: string,
    sfxType: "click" | "warp" | "badge" = "click",
    clickEvent?: React.MouseEvent<HTMLElement>
  ) => {
    if (!hapticEnabled) return;

    // Capture click position relative to target or container
    if (clickEvent) {
      const rect = clickEvent.currentTarget.getBoundingClientRect();
      const x = clickEvent.clientX - rect.left;
      const y = clickEvent.clientY - rect.top;
      const newRipple = { id: Date.now() + Math.random(), x, y, label: eventLabel, pattern };
      setRipples((prev) => [...prev.slice(-4), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 800);
    }

    // Web Haptic API vibration call
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {
        // Fallback for browsers without physical motor permissions
      }
    }

    // Play tactile sound effect
    if (sfxType === "warp") sfx.playWarp();
    else if (sfxType === "badge") sfx.playBadgeUnlock();
    else sfx.playClick();

    // Visual Haptic Impulse
    setIsVibrating(true);
    setLastHapticEvent(`${eventLabel} [${pattern.join("ms, ")}ms Impulse]`);

    // Dynamic Waveform Animation
    const newWave = pattern.map((p) => Math.min(100, p * 1.2));
    while (newWave.length < 10) newWave.push(Math.floor(Math.random() * 50));
    setHapticWaveform(newWave.slice(0, 10));

    setTimeout(() => {
      setIsVibrating(false);
    }, pattern.reduce((a, b) => a + b, 0) || 300);
  };

  const [realTimeAnime, setRealTimeAnime] = useState<RealTimeAnimeItem[]>([]);

  useEffect(() => {
    fetchRealTimeAnimeList().then((data) => {
      if (data && data.length > 0) {
        setRealTimeAnime(data);
      }
    });
  }, []);

  const vrCards = [
    {
      id: "portal-1",
      title: realTimeAnime[0]?.title || "Solo Leveling Shadow Realm",
      image: realTimeAnime[0]?.bannerImage || realTimeAnime[0]?.coverImage || "https://cdn.myanimelist.net/images/anime/1090/140954.jpg",
      desc: "4K High Dimension Shadow Realm",
      category: realTimeAnime[0]?.category || "Action Isekai",
      vibePattern: [40, 30, 80]
    },
    {
      id: "portal-2",
      title: realTimeAnime[1]?.title || "Frieren Celestial Magic Sanctum",
      image: realTimeAnime[1]?.bannerImage || realTimeAnime[1]?.coverImage || "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
      desc: "360° Spatial Mana Gateway",
      category: realTimeAnime[1]?.category || "Fantasy Nexus",
      vibePattern: [60, 20, 120]
    },
    {
      id: "portal-3",
      title: realTimeAnime[2]?.title || "Jujutsu Shibuya Matrix",
      image: realTimeAnime[2]?.bannerImage || realTimeAnime[2]?.coverImage || "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
      desc: "Domain Expansion Matrix",
      category: realTimeAnime[2]?.category || "Supernatural",
      vibePattern: [30, 30, 30, 30, 90]
    },
    {
      id: "portal-4",
      title: realTimeAnime[3]?.title || "Demon Slayer Hashira Temple",
      image: realTimeAnime[3]?.bannerImage || realTimeAnime[3]?.coverImage || "https://cdn.myanimelist.net/images/anime/1898/142349.jpg",
      desc: "Flame Katana Sanctuary",
      category: realTimeAnime[3]?.category || "Dark Fantasy",
      vibePattern: [100, 40, 150]
    }
  ];

  // Interactive 3D Objects in VR Space
  const vrObjects = [
    {
      id: "obj-mana",
      name: "Arcane Mana Core",
      type: "Resonance Crystal",
      icon: <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" />,
      color: "from-cyan-500/30 to-blue-600/30",
      border: "border-cyan-400/50",
      pattern: [50, 30, 50, 30, 120]
    },
    {
      id: "obj-katana",
      name: "Atomic Blade Artifact",
      type: "Legendary Weapon",
      icon: <Zap className="w-5 h-5 text-rose-400" />,
      color: "from-rose-500/30 to-purple-600/30",
      border: "border-rose-400/50",
      pattern: [20, 20, 100, 20, 180]
    },
    {
      id: "obj-gateway",
      name: "Quantum Stargate Ring",
      type: "Dimensional Anchor",
      icon: <Disc className="w-5 h-5 text-amber-300 animate-pulse" />,
      color: "from-amber-500/30 to-yellow-600/30",
      border: "border-amber-400/50",
      pattern: [80, 40, 80, 40, 200]
    }
  ];

  const handleRotateLeft = (e?: React.MouseEvent<HTMLElement>) => {
    const pattern = hapticIntensity === "soft" ? [30] : hapticIntensity === "heavy" ? [60, 30, 60] : [45, 20, 45];
    triggerHaptic(pattern, "Spatial Rotation Left ←", "click", e);
    setRotationY((prev) => prev - 45);
  };

  const handleRotateRight = (e?: React.MouseEvent<HTMLElement>) => {
    const pattern = hapticIntensity === "soft" ? [30] : hapticIntensity === "heavy" ? [60, 30, 60] : [45, 20, 45];
    triggerHaptic(pattern, "Spatial Rotation Right →", "click", e);
    setRotationY((prev) => prev + 45);
  };

  return (
    <div className={`space-y-8 transition-transform duration-100 ${isVibrating ? "translate-x-0.5 translate-y-0.5 scale-[0.998]" : ""}`}>
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300">
            <Eye className="w-4 h-4" />
            <span>3D VR HEADSET & SPATIAL HAPTICS ENGINE</span>
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Immersive 3D VR Portal Space</span>
            {isVibrating && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono animate-pulse flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                HAPTIC PULSE
              </span>
            )}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Experience Isekai Worlds in 360° virtual reality with simulated tactile haptic force feedback. Interact with VR menu nodes, spatial cards, and arcane artifacts to trigger controller vibrations & shockwaves.
          </p>
        </div>
      </div>

      {/* VR Haptic Controller & Engine Control Dashboard */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/80 border border-violet-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-violet-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-400 p-0.5 shadow-lg ${isVibrating ? "ring-2 ring-rose-400 animate-ping" : ""}`}>
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-violet-300">
                <Vibrate className={`w-5 h-5 ${isVibrating ? "text-rose-400 animate-bounce" : ""}`} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
                <span>Tactile Haptic Feedback Matrix</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                  hapticEnabled ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {hapticEnabled ? "Active (Dual-Motor)" : "Disabled"}
                </span>
              </h4>
              <p className="text-[11px] font-mono text-purple-300/80">{lastHapticEvent}</p>
            </div>
          </div>

          {/* Controls: Haptic Toggle & Intensity Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setHapticEnabled(!hapticEnabled);
                if (!hapticEnabled) triggerHaptic([50, 50, 100], "Haptic Engine Initialized");
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                hapticEnabled
                  ? "bg-violet-900/60 border-violet-400 text-violet-200"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              Haptics: {hapticEnabled ? "ON" : "OFF"}
            </button>

            <div className="flex items-center bg-slate-900 border border-violet-500/30 rounded-xl p-1 gap-1">
              {(["soft", "medium", "heavy", "ultra"] as HapticIntensity[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setHapticIntensity(mode);
                    const mult = mode === "soft" ? [20] : mode === "medium" ? [50, 30] : mode === "heavy" ? [100, 50, 100] : [150, 50, 150, 50, 200];
                    triggerHaptic(mult, `Haptic Intensity Set: ${mode.toUpperCase()}`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                    hapticIntensity === mode
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Waveform Pulse Visualizer */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Vibration Frequency Impulse Spectrum:
          </span>

          <div className="flex items-end gap-1.5 h-8 px-3 py-1 rounded-xl bg-slate-950 border border-violet-500/20 flex-1 max-w-xs justify-center">
            {hapticWaveform.map((val, idx) => (
              <div
                key={idx}
                className={`w-2 rounded-t transition-all duration-150 ${
                  isVibrating ? "bg-gradient-to-t from-violet-500 to-rose-400 animate-pulse" : "bg-violet-600/40"
                }`}
                style={{ height: `${Math.max(15, Math.min(100, val))}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3D Interactive Spatial Environment */}
      <div
        onClick={(e) => {
          // Trigger a ambient canvas tap haptic pulse if clicked directly on canvas background
          if (e.target === e.currentTarget) {
            triggerHaptic([30, 20, 30], "VR Canvas Touch Impulse", "click", e);
          }
        }}
        className={`relative rounded-3xl bg-slate-950 border border-indigo-500/30 p-8 sm:p-12 overflow-hidden shadow-[0_0_80px_rgba(124,58,237,0.2)] min-h-[480px] flex flex-col justify-between transition-all ${
          isVibrating ? "ring-2 ring-rose-500/50 shadow-[0_0_100px_rgba(244,63,94,0.4)]" : ""
        }`}
      >
        {/* Visual Haptic Shockwave Overlay & Grid Pulse */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 pointer-events-none" />

        {/* Global Haptic Vibration Flash Overlay */}
        {isVibrating && (
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-violet-500/10 animate-pulse pointer-events-none rounded-3xl border-2 border-rose-400/40" />
        )}

        {/* Dynamic Tactile Ripple Animations overlaid at click position */}
        {ripples.map((r) => (
          <div
            key={r.id}
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
            style={{ left: r.x, top: r.y }}
          >
            {/* Outer expanding shockwave ring */}
            <div className="w-16 h-16 rounded-full border-2 border-rose-400 bg-rose-500/20 animate-ping absolute" />
            {/* Inner glowing pulse circle */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse" />
            {/* Tactile impulse label tag */}
            <span className="mt-6 px-2 py-0.5 rounded bg-slate-950/90 border border-rose-400 text-[9px] font-mono font-bold text-rose-300 shadow-xl whitespace-nowrap">
              ⚡ HAPTIC FORCE: {r.pattern.reduce((a, b) => a + b, 0)}ms
            </span>
          </div>
        ))}

        {/* VR Controls Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-purple-300">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>SPATIAL HEADSET ANGLE: {rotationY}°</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleRotateLeft(e)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/40 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-violet-400" />
              <span>Rotate Left ←</span>
            </button>
            <button
              onClick={(e) => handleRotateRight(e)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/40 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <span>Rotate Right →</span>
            </button>
          </div>
        </div>

        {/* Floating 3D Cards Carousel with Haptic Clicks */}
        <div className="relative z-10 py-8 flex items-center justify-center">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-transform duration-700 ease-out w-full"
            style={{ transform: `rotateY(${rotationY}deg)` }}
          >
            {vrCards.map((card) => (
              <div
                key={card.id}
                onClick={(e) => {
                  triggerHaptic(card.vibePattern, `Portal Selected: ${card.title}`, "warp", e);
                  setSelectedCard(card.title);
                }}
                onMouseEnter={(e) => {
                  triggerHaptic([20], `Hovering Portal: ${card.title}`, "click", e);
                }}
                className="group cursor-pointer p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all duration-300 space-y-3 relative overflow-hidden"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 border border-violet-500/30 text-[9px] font-mono text-cyan-300 flex items-center gap-1">
                    <Vibrate className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
                    <span>Haptic Touch</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-purple-300 uppercase block">{card.category}</span>
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">{card.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive 3D Objects Menu in VR Space */}
        <div className="relative z-10 pt-4 border-t border-violet-500/20">
          <div className="text-[11px] font-mono text-slate-400 mb-3 flex items-center gap-2">
            <Box className="w-4 h-4 text-rose-400" />
            <span>Interactive 3D Spatial Objects (Click to trigger haptic feedback overlay & shockwaves):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {vrObjects.map((obj) => {
              const isSelected = activeObject === obj.id;
              return (
                <button
                  key={obj.id}
                  onClick={(e) => {
                    setActiveObject(obj.id);
                    triggerHaptic(obj.pattern, `Interacted with ${obj.name}`, "badge", e);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-95 ${
                    isSelected
                      ? `bg-gradient-to-r ${obj.color} ${obj.border} ring-2 ring-purple-400 shadow-lg scale-105`
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-violet-500/40"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {obj.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{obj.name}</h5>
                    <span className="text-[10px] font-mono text-purple-300/80 block">{obj.type}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected VR Modal Info */}
        {selectedCard && (
          <div className="relative z-10 mt-4 p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-center text-xs font-mono text-purple-200 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Selected Portal: <strong>{selectedCard}</strong> — VR Stream & Haptic Controllers Synchronized!</span>
          </div>
        )}
      </div>
    </div>
  );
};

