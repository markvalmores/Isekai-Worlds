import React, { useState, useEffect } from "react";
import { sfx } from "../utils/sfx";
import {
  Box,
  Compass,
  Home,
  Maximize2,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RotateCw,
  Eye,
  Tv,
  Coffee,
  Bed,
  Palette,
  Flame,
  Shield,
  Zap,
  Vibrate,
  Layers,
  Gamepad2
} from "lucide-react";

interface VirtualRoom {
  id: string;
  name: string;
  theme: string;
  description: string;
  banner: string;
  ambientMusic: string;
  hotspots: {
    id: string;
    title: string;
    description: string;
    x: number; // percentage coordinate
    y: number;
    icon: string;
  }[];
}

const VIRTUAL_ROOMS: VirtualRoom[] = [
  {
    id: "solo-leveling-chamber",
    name: "Shadow Monarch's Citadel Sanctuary",
    theme: "Solo Leveling Dark Fantasy",
    description: "An obsidian throne chamber lit by azure mana flames and purple shadow energy. High-resolution AR portals display active quest status and shadow soldiers.",
    banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1600",
    ambientMusic: "Shadow Monarch Ambience",
    hotspots: [
      { id: "h1", title: "Shadow Monarch Throne", description: "Sit on the obsidian throne to command the shadow army.", x: 50, y: 45, icon: "👑" },
      { id: "h2", title: "System Quest Log", description: "Daily Quest: 100 Pushups, 100 Sit-ups, 10km Run.", x: 25, y: 35, icon: "📜" },
      { id: "h3", title: "Demon Castle Portal", description: "Warp directly to the 100th floor Demon Castle raid.", x: 75, y: 60, icon: "🚪" }
    ]
  },
  {
    id: "frieren-library",
    name: "Aura's Ancient Elven Grimoire Library",
    theme: "Frieren Magical Sanctum",
    description: "Towering bookshelves filled with forgotten spellbooks, gentle sunlight pouring through stained glass, and floating stardust motes.",
    banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b67?auto=format&fit=crop&q=80&w=1600",
    ambientMusic: "Elven Sanctuary Lullaby",
    hotspots: [
      { id: "h4", title: "Grimoire of Flight", description: "Learn the spell that makes flowers bloom around statues.", x: 30, y: 50, icon: "📖" },
      { id: "h5", title: "Starlight Tea Set", description: "Enjoy hot herbal tea brewed with celestial mana leaves.", x: 70, y: 65, icon: "☕" }
    ]
  },
  {
    id: "cyberpunk-loft",
    name: "Neo-Tokyo Cyberpunk High-Rise Loft",
    theme: "Cyberpunk 2077 / Edgerunners",
    description: "Overlooking neon skyscrapers of Neo-Tokyo in the rain. Holographic displays, glowing neon ramen bar, and high-end audio setup.",
    banner: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1600",
    ambientMusic: "Neon Rain Synthwave",
    hotspots: [
      { id: "h6", title: "Holographic Arcade Deck", description: "Play retro 3D arcade minigames in immersive VR.", x: 40, y: 55, icon: "🕹️" },
      { id: "h7", title: "Synthwave Vinyl Player", description: "Play high-fidelity lo-fi and synthwave soundtracks.", x: 80, y: 40, icon: "🎶" }
    ]
  },
  {
    id: "sakura-tea-garden",
    name: "Kyoto Sakura Blossom Tea House",
    theme: "Traditional Zen & Cherry Blossoms",
    description: "Peaceful traditional tatami room with sliding shoji screens opening onto a tranquil zen garden filled with falling pink cherry blossom petals.",
    banner: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600",
    ambientMusic: "Zen Flute & Wind Chimes",
    hotspots: [
      { id: "h8", title: "Matcha Tea Ceremony", description: "Whisk ceremonial grade matcha green tea.", x: 50, y: 60, icon: "🍵" },
      { id: "h9", title: "Zen Stone Garden", description: "Meditate peacefully while listening to bamboo water fountains.", x: 20, y: 70, icon: "🪨" }
    ]
  }
];

export const VrHomeTourModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [controllerMode, setControllerMode] = useState<"keyboard" | "vr" | "mouse">("keyboard");
  const [audioEnabled, setAudioEnabled] = useState(false);

  const room = VIRTUAL_ROOMS[currentRoomIndex];

  // Haptic feedback & sound trigger
  const triggerTactile = (pattern: number[], label: string) => {
    sfx.playClick();
    setIsVibrating(true);
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {}
    }
    setTimeout(() => setIsVibrating(false), pattern.reduce((a, b) => a + b, 0) || 300);
  };

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setRotationAngle(prev => prev - 15);
        triggerTactile([30], "Rotate Left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setRotationAngle(prev => prev + 15);
        triggerTactile([30], "Rotate Right");
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        setZoomLevel(prev => Math.min(1.4, prev + 0.1));
        triggerTactile([40], "Zoom In");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        setZoomLevel(prev => Math.max(0.9, prev - 0.1));
        triggerTactile([40], "Zoom Out");
      } else if (e.key === "q" || e.key === "Q") {
        setCurrentRoomIndex(prev => (prev - 1 + VIRTUAL_ROOMS.length) % VIRTUAL_ROOMS.length);
        triggerTactile([60, 30, 60], "Previous Room");
      } else if (e.key === "e" || e.key === "E") {
        setCurrentRoomIndex(prev => (prev + 1) % VIRTUAL_ROOMS.length);
        triggerTactile([60, 30, 60], "Next Room");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div className={`relative w-full max-w-6xl bg-slate-900 border-2 border-purple-500/50 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.4)] flex flex-col max-h-[92vh] transition-all ${
        isVibrating ? "ring-4 ring-rose-400 scale-[0.999]" : ""
      }`}>
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Compass className="w-6 h-6 text-purple-400 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  3D VIRTUAL HOME TOUR
                </span>
                <span className="text-xs font-mono text-purple-300">{room.theme}</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">{room.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                triggerTactile([40], audioEnabled ? "Audio Muted" : "Audio Enabled");
              }}
              className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 ${
                audioEnabled ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{room.ambientMusic}</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition-all"
            >
              Exit VR Tour
            </button>
          </div>
        </div>

        {/* Immersive 3D/360 Room Viewport Stage */}
        <div
          className="relative flex-1 min-h-[420px] overflow-hidden bg-slate-950 flex items-center justify-center select-none"
          style={{ perspective: "1200px" }}
        >
          {/* Panoramic Room Background with Rotation & Zoom */}
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center"
            style={{
              transform: `rotateY(${rotationAngle}deg) scale(${zoomLevel})`,
              transformStyle: "preserve-3d"
            }}
          >
            <img
              src={room.banner}
              alt={room.name}
              className="w-full h-full object-cover filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          </div>

          {/* Room Hotspots for Interactive Discovery */}
          {room.hotspots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => {
                setActiveHotspot(spot.id);
                triggerTactile([50, 30, 80], `Hotspot: ${spot.title}`);
              }}
              className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/80 border-2 border-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse group-hover:scale-125 transition-transform">
                <span className="text-lg">{spot.icon}</span>
                <div className="absolute inset-0 rounded-full border border-white animate-ping" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 border border-purple-500/50 px-3 py-1.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-30">
                <p className="text-xs font-bold text-white">{spot.title}</p>
                <p className="text-[10px] font-mono text-purple-300">{spot.description}</p>
              </div>
            </div>
          ))}

          {/* Active Hotspot Modal Popover */}
          {activeHotspot && (
            <div className="absolute bottom-6 left-6 right-6 z-30 bg-slate-900/95 border-2 border-purple-500/60 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4 animate-fadeIn">
              {(() => {
                const spot = room.hotspots.find(s => s.id === activeHotspot);
                if (!spot) return null;
                return (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-3 bg-purple-500/20 rounded-2xl border border-purple-500/40">{spot.icon}</div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{spot.title}</h4>
                        <p className="text-xs text-slate-300">{spot.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-colors shrink-0"
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* On-Screen VR Navigation Controls & HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/40 px-4 py-2 rounded-2xl pointer-events-auto flex items-center gap-3 text-xs font-mono text-purple-200">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Angle: {rotationAngle}°</span>
              </span>
              <span>•</span>
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/40 px-4 py-2 rounded-2xl pointer-events-auto flex items-center gap-2 text-xs font-mono text-purple-200">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Use A/D or Arrow keys to look around • Q/E to switch rooms</span>
            </div>
          </div>
        </div>

        {/* Bottom Control Deck: Room Switcher & Movement Buttons */}
        <div className="p-5 bg-slate-950 border-t border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {VIRTUAL_ROOMS.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => {
                  setCurrentRoomIndex(idx);
                  setRotationAngle(0);
                  setZoomLevel(1);
                  triggerTactile([50, 30], `Switched Room: ${r.name}`);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border flex items-center gap-2 ${
                  currentRoomIndex === idx
                    ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/40"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span>Room {idx + 1}:</span>
                <span className="truncate max-w-[120px]">{r.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setRotationAngle(prev => prev - 30);
                triggerTactile([25], "Rotate Left");
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-purple-500/40 text-xs font-mono flex items-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
              <span>Left ↺</span>
            </button>
            <button
              onClick={() => {
                setRotationAngle(prev => prev + 30);
                triggerTactile([25], "Rotate Right");
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-purple-500/40 text-xs font-mono flex items-center gap-1 active:scale-95"
            >
              <span>Right ↻</span>
              <RotateCw className="w-3.5 h-3.5 text-purple-400" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(prev => (prev === 1 ? 1.25 : 1));
                triggerTactile([35], "Toggle Zoom");
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-purple-500/40 text-xs font-mono active:scale-95"
              title="Toggle Zoom"
            >
              <Maximize2 className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
