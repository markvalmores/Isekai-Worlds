import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Command,
  Compass,
  Image as ImageIcon,
  Film,
  Sparkles,
  Tv,
  Gamepad2,
  Trophy,
  User,
  ShieldCheck,
  Moon,
  Sun,
  Crown,
  Volume2,
  VolumeX,
  Trash2,
  Gift,
  Settings,
  Radio,
  Video,
  Eye,
  Sliders,
  X,
  Upload,
  Link as LinkIcon,
  Check,
  Zap,
  Globe,
  Monitor
} from "lucide-react";
import { PageView, AppSettings } from "../types";
import { sfx } from "../utils/sfx";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearCache: () => void;
  openSettingsModal: () => void;
  openDailyModal: () => void;
  openAdminModal: () => void;
  openTvRemote: () => void;
}

interface CommandItem {
  id: string;
  category: "Navigation" | "Theme & Lighting" | "Live Wallpaper Engine" | "System Actions";
  label: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  action: () => void;
  badge?: string;
  active?: boolean;
}

// Preset Web App Live Wallpapers (MP4, GIF, JPG, PNG)
export const PRESET_WALLPAPERS = [
  {
    id: "cyber-neon-mp4",
    name: "Cyberpunk Neon City",
    type: "video" as const,
    url: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-with-neon-lights-41560-large.mp4",
    preview: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80",
    format: "MP4 Video"
  },
  {
    id: "sakura-petals-gif",
    name: "Falling Sakura Blossom",
    type: "image" as const,
    url: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
    preview: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
    format: "Animated GIF"
  },
  {
    id: "galaxy-nebula-mp4",
    name: "Deep Space Cosmic Nebula",
    type: "video" as const,
    url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4",
    preview: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80",
    format: "MP4 Video"
  },
  {
    id: "anime-rain-gif",
    name: "Lo-Fi Anime Rain Night",
    type: "image" as const,
    url: "https://media.giphy.com/media/l41K3o5TzDQ5A7RTO/giphy.gif",
    preview: "https://media.giphy.com/media/l41K3o5TzDQ5A7RTO/giphy.gif",
    format: "Animated GIF"
  },
  {
    id: "fantasy-castle-jpg",
    name: "Isekai High Fantasy Castle",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&auto=format&fit=crop&q=80",
    preview: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80",
    format: "4K JPG"
  },
  {
    id: "aurora-lights-mp4",
    name: "Nordic Celestial Aurora",
    type: "video" as const,
    url: "https://assets.mixkit.co/videos/preview/mixkit-northern-lights-in-the-night-sky-40813-large.mp4",
    preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80",
    format: "MP4 Video"
  }
];

export function CommandPaletteModal({
  isOpen,
  onClose,
  currentPage,
  setCurrentPage,
  settings,
  updateSettings,
  onClearCache,
  openSettingsModal,
  openDailyModal,
  openAdminModal,
  openTvRemote
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showWallpaperSubmenu, setShowWallpaperSubmenu] = useState(false);
  const [customWallpaperInput, setCustomWallpaperInput] = useState("");
  const [customSuccessMsg, setCustomSuccessMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setShowWallpaperSubmenu(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build command list
  const commands: CommandItem[] = [
    // --- NAVIGATION ---
    {
      id: "nav-home",
      category: "Navigation",
      label: "Go to Portal Hub",
      description: "Main dashboard, features showcase & quick actions",
      icon: <Compass className="w-4 h-4 text-purple-400" />,
      keywords: ["home", "portal", "hub", "main", "start"],
      action: () => { setCurrentPage("home"); onClose(); }
    },
    {
      id: "nav-wallpapers",
      category: "Navigation",
      label: "Go to 4K Anime Wallpapers",
      description: "Browse & download ultra-HD wallpapers",
      icon: <ImageIcon className="w-4 h-4 text-pink-400" />,
      keywords: ["wallpaper", "4k", "background", "image", "art"],
      action: () => { setCurrentPage("wallpapers"); onClose(); }
    },
    {
      id: "nav-gifs",
      category: "Navigation",
      label: "Go to Anime GIFs & Reactions",
      description: "Search trending reaction GIFs and anime moments",
      icon: <Film className="w-4 h-4 text-emerald-400" />,
      keywords: ["gif", "gifs", "animation", "reaction", "tenor"],
      action: () => { setCurrentPage("gifs"); onClose(); }
    },
    {
      id: "nav-cosplay",
      category: "Navigation",
      label: "Go to Cosplay & Costume Vault",
      description: "Explore community cosplay photography & creators",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      keywords: ["cosplay", "costume", "dress", "photo", "vault"],
      action: () => { setCurrentPage("cosplay"); onClose(); }
    },
    {
      id: "nav-media",
      category: "Navigation",
      label: "Go to Live Anime Streams & Feeds",
      description: "Watch live anime broadcasts and community video feeds",
      icon: <Tv className="w-4 h-4 text-blue-400" />,
      keywords: ["live", "stream", "tv", "feed", "broadcast"],
      action: () => { setCurrentPage("media"); onClose(); }
    },
    {
      id: "nav-watch",
      category: "Navigation",
      label: "Go to Watch Anime Online",
      description: "Stream full subbed and dubbed anime episodes",
      icon: <Video className="w-4 h-4 text-red-400" />,
      keywords: ["watch", "anime", "stream", "episodes", "video"],
      action: () => { setCurrentPage("watch"); onClose(); }
    },
    {
      id: "nav-radio",
      category: "Navigation",
      label: "Go to Radio Gaga J-Pop Broadcast",
      description: "Listen to live 24/7 anime soundtracks & J-Pop radio",
      icon: <Radio className="w-4 h-4 text-cyan-400" />,
      keywords: ["radio", "music", "jpop", "soundtrack", "song", "audio"],
      action: () => { setCurrentPage("radio"); onClose(); }
    },
    {
      id: "nav-amv",
      category: "Navigation",
      label: "Go to Anime Music Videos (AMVs)",
      description: "Watch high-octane fan-made music videos",
      icon: <Film className="w-4 h-4 text-violet-400" />,
      keywords: ["amv", "music video", "edit", "clip"],
      action: () => { setCurrentPage("amv"); onClose(); }
    },
    {
      id: "nav-games",
      category: "Navigation",
      label: "Go to Arcade Games Portal",
      description: "Play built-in retro anime arcade games",
      icon: <Gamepad2 className="w-4 h-4 text-indigo-400" />,
      keywords: ["game", "arcade", "play", "retro", "minigame"],
      action: () => { setCurrentPage("games"); onClose(); }
    },
    {
      id: "nav-roms",
      category: "Navigation",
      label: "Go to Retro ROMs Vault",
      description: "GBA, SNES & Genesis emulator games",
      icon: <Gamepad2 className="w-4 h-4 text-yellow-400" />,
      keywords: ["roms", "emulator", "gba", "snes", "retro"],
      action: () => { setCurrentPage("roms"); onClose(); }
    },
    {
      id: "nav-cards",
      category: "Navigation",
      label: "Go to Anime Cards Arena",
      description: "Gacha card battle arena & binder collection",
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      keywords: ["cards", "card", "arena", "gacha", "battle", "binder"],
      action: () => { setCurrentPage("cards"); onClose(); }
    },
    {
      id: "nav-leaderboard",
      category: "Navigation",
      label: "Go to Global Leaderboards",
      description: "Top active adventurers and level rankings",
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      keywords: ["leaderboard", "rank", "top", "leader"],
      action: () => { setCurrentPage("leaderboard"); onClose(); }
    },
    {
      id: "nav-profile",
      category: "Navigation",
      label: "Go to Profile Dashboard",
      description: "Manage avatar, title, badges and persona",
      icon: <User className="w-4 h-4 text-teal-400" />,
      keywords: ["profile", "user", "account", "persona", "badge"],
      action: () => { setCurrentPage("profile"); onClose(); }
    },

    // --- THEME & LIGHTING ---
    {
      id: "toggle-dark-mode",
      category: "Theme & Lighting",
      label: settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: "Toggle ambient dark or bright UI background theme",
      icon: settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />,
      keywords: ["dark", "light", "mode", "theme", "color", "sun", "moon"],
      badge: settings.darkMode ? "Dark Active" : "Light Active",
      action: () => {
        sfx.playClick();
        updateSettings({ darkMode: !settings.darkMode });
      }
    },
    {
      id: "toggle-gold-mode",
      category: "Theme & Lighting",
      label: settings.isGoldMode ? "Disable Gold VIP Mode" : "Enable Gold VIP Mode",
      description: "Activate luxurious golden ambient border aura",
      icon: <Crown className="w-4 h-4 text-amber-400" />,
      keywords: ["gold", "vip", "theme", "amber", "crown"],
      badge: settings.isGoldMode ? "Gold Active" : "Standard",
      action: () => {
        sfx.playBadgeUnlock();
        updateSettings({ isGoldMode: !settings.isGoldMode });
      }
    },
    {
      id: "toggle-ambient-light-sync",
      category: "Theme & Lighting",
      label: settings.ambientLightSync !== false ? "Disable Ambient Light Sync" : "Enable Ambient Light Sync",
      description: "Dynamic glowing ambient light halos behind the web application",
      icon: <Zap className="w-4 h-4 text-yellow-300" />,
      keywords: ["ambient", "light", "glow", "halo", "sync", "lighting", "aura"],
      badge: settings.ambientLightSync !== false ? "Sync ON" : "Sync OFF",
      action: () => {
        sfx.playClick();
        const next = settings.ambientLightSync === false ? true : false;
        updateSettings({ ambientLightSync: next });
      }
    },

    // --- LIVE WALLPAPER ENGINE ---
    {
      id: "toggle-web-wallpaper",
      category: "Live Wallpaper Engine",
      label: settings.webAppWallpaperEnabled ? "Disable Web App Custom Wallpaper" : "Enable Web App Custom Wallpaper",
      description: "Run custom MP4, GIF, JPG, or PNG video/image looping background",
      icon: <Monitor className="w-4 h-4 text-cyan-400" />,
      keywords: ["wallpaper", "bg", "background", "live", "mp4", "gif", "video", "loop"],
      badge: settings.webAppWallpaperEnabled ? "Wallpaper ON" : "Wallpaper OFF",
      action: () => {
        sfx.playWarp();
        const next = !settings.webAppWallpaperEnabled;
        updateSettings({
          webAppWallpaperEnabled: next,
          webAppWallpaperUrl: settings.webAppWallpaperUrl || PRESET_WALLPAPERS[0].url,
          webAppWallpaperType: settings.webAppWallpaperType || PRESET_WALLPAPERS[0].type
        });
      }
    },
    {
      id: "open-wallpaper-selector",
      category: "Live Wallpaper Engine",
      label: "Choose Custom Web App Wallpaper (MP4, GIF, JPG, PNG)",
      description: "Pick from 4K video loops or upload custom image/video URL",
      icon: <Sliders className="w-4 h-4 text-purple-400" />,
      keywords: ["change wallpaper", "set wallpaper", "mp4", "gif", "jpg", "png", "custom"],
      action: () => {
        setShowWallpaperSubmenu(true);
      }
    },

    // --- SYSTEM ACTIONS ---
    {
      id: "action-daily-rewards",
      category: "System Actions",
      label: "Claim Daily Login Rewards",
      description: "Open the 7-day reward calendar & starter bonus",
      icon: <Gift className="w-4 h-4 text-amber-400" />,
      keywords: ["daily", "login", "bonus", "claim", "coins", "reward"],
      action: () => { openDailyModal(); onClose(); }
    },
    {
      id: "action-tv-remote",
      category: "System Actions",
      label: "Toggle Smart TV Remote Control",
      description: "Open the on-screen navigation remote panel",
      icon: <Tv className="w-4 h-4 text-rose-400" />,
      keywords: ["remote", "tv", "control", "dpad", "smart"],
      action: () => { openTvRemote(); onClose(); }
    },
    {
      id: "action-admin-portal",
      category: "System Actions",
      label: "Open Executive Admin Portal",
      description: "Unlock God Mode, coins & all card inventory",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      keywords: ["admin", "god", "passcode", "cheat", "unlock"],
      action: () => { openAdminModal(); onClose(); }
    },
    {
      id: "action-settings",
      category: "System Actions",
      label: "Open System Preferences & Settings",
      description: "Configure sound volume, language, and display parameters",
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      keywords: ["settings", "preferences", "config", "volume", "sound"],
      action: () => { openSettingsModal(); onClose(); }
    },
    {
      id: "action-clear-cache",
      category: "System Actions",
      label: "Clear System Cache & Reset State",
      description: "Purge local storage, session data, and refresh application",
      icon: <Trash2 className="w-4 h-4 text-red-400" />,
      keywords: ["clear", "cache", "reset", "purge", "storage"],
      action: () => {
        onClearCache();
        onClose();
      }
    }
  ];

  // Filter commands by query
  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (showWallpaperSubmenu) {
        setShowWallpaperSubmenu(false);
      } else {
        onClose();
      }
    }
  };

  const handleApplyCustomWallpaperUrl = (url: string, type: "video" | "image") => {
    if (!url.trim()) return;
    sfx.playBadgeUnlock();
    updateSettings({
      webAppWallpaperEnabled: true,
      webAppWallpaperUrl: url.trim(),
      webAppWallpaperType: type
    });
    setCustomSuccessMsg("Custom Wallpaper Applied!");
    setTimeout(() => {
      setCustomSuccessMsg("");
      setShowWallpaperSubmenu(false);
      onClose();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".webm");
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleApplyCustomWallpaperUrl(dataUrl, isVideo ? "video" : "image");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl shadow-purple-900/40 overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Header & Search Bar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3 bg-slate-950/60">
          <Command className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, page name or search actions... (e.g. wallpaper, dark mode, cards)"
            className="w-full bg-transparent text-sm font-medium text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-1 rounded-lg">
            <span>Esc to close</span>
          </div>
        </div>

        {/* Wallpaper Submenu Customizer */}
        {showWallpaperSubmenu ? (
          <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh] bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Web App Live Wallpaper Engine
                </h3>
              </div>
              <button
                onClick={() => setShowWallpaperSubmenu(false)}
                className="text-xs text-purple-400 hover:text-purple-300 underline font-mono"
              >
                ← Back to Commands
              </button>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-200">Enable Custom Background Wallpaper</p>
                <p className="text-[11px] text-slate-400">Displays looping video or image wallpaper behind the entire web application</p>
              </div>
              <button
                onClick={() => {
                  sfx.playClick();
                  updateSettings({ webAppWallpaperEnabled: !settings.webAppWallpaperEnabled });
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  settings.webAppWallpaperEnabled
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {settings.webAppWallpaperEnabled ? "ENABLED" : "DISABLED"}
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Preset Live Wallpaper</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_WALLPAPERS.map((preset) => {
                  const isCurrent = settings.webAppWallpaperUrl === preset.url && settings.webAppWallpaperEnabled;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyCustomWallpaperUrl(preset.url, preset.type)}
                      className={`group relative rounded-2xl overflow-hidden border text-left transition-all aspect-video flex flex-col justify-end p-2.5 ${
                        isCurrent
                          ? "border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20"
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
                      {isCurrent && (
                        <div className="absolute top-2 right-2 p-1 bg-purple-600 rounded-full text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL or Local File Upload */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upload Local File or Enter Custom URL (MP4, GIF, JPG, PNG)</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={customWallpaperInput}
                    onChange={(e) => setCustomWallpaperInput(e.target.value)}
                    placeholder="Paste MP4, GIF, JPG, or PNG image/video URL..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={() => {
                    const isVideo = customWallpaperInput.includes(".mp4") || customWallpaperInput.includes(".webm");
                    handleApplyCustomWallpaperUrl(customWallpaperInput, isVideo ? "video" : "image");
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all whitespace-nowrap"
                >
                  Apply URL
                </button>
              </div>

              {/* Local File Upload Button */}
              <label className="flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-purple-500 rounded-2xl cursor-pointer transition-all text-xs font-bold text-purple-300">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Choose Local File from Computer (MP4, GIF, JPG, PNG)</span>
                <input
                  type="file"
                  accept="image/gif, image/jpeg, image/png, video/mp4, video/webm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {customSuccessMsg && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{customSuccessMsg}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Command List View */
          <div className="p-2 overflow-y-auto max-h-[60vh] space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Search className="w-8 h-8 mx-auto opacity-40 text-purple-400" />
                <p className="text-sm font-bold text-slate-400">No matching commands found</p>
                <p className="text-xs text-slate-600">Try searching for "wallpapers", "dark mode", or "cards"</p>
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      sfx.playClick();
                      cmd.action();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 group ${
                      isSelected
                        ? "bg-purple-600/20 border border-purple-500/40 shadow-md text-white"
                        : "hover:bg-slate-800/60 border border-transparent text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl transition-all ${
                          isSelected ? "bg-purple-600 text-white shadow-md shadow-purple-600/40" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {cmd.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold truncate text-slate-100 group-hover:text-purple-300 transition-colors">
                            {cmd.label}
                          </p>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-400 uppercase">
                            {cmd.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{cmd.description}</p>
                      </div>
                    </div>

                    {cmd.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 border ${
                          cmd.badge.includes("ON") || cmd.badge.includes("Active")
                            ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                      >
                        {cmd.badge}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Footer Shortcut Legend */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Isekai Command Palette v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
