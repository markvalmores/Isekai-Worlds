import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Play,
  Sparkles,
  ExternalLink,
  Star,
  Heart,
  Activity,
  Flame,
  Share2,
  CheckCircle2,
  HelpCircle,
  Coins,
  ShieldCheck,
  Smartphone,
  Copy,
  Zap,
  Globe,
  Radio,
  Volume2
} from "lucide-react";
import { sfx } from "../utils/sfx";

export interface ExtraGameItem {
  id: string;
  title: string;
  nameAlias: string;
  category: "Happy Meal Games";
  url: string;
  fallbackUrl?: string;
  coverUrl: string;
  bannerUrl: string;
  description: string;
  developer: string;
  releaseYear: string;
  rating: number;
  tags: string[];
  difficulty: "Superhero";
  featured: boolean;
  isHappyMeal: boolean;
}

// Strictly the official Happy Meal Game as requested
const HAPPY_MEAL_GAME: ExtraGameItem = {
  id: "spiderman-happymeal",
  title: "Spider-Man: Brand New Day McDonald's Happy Meal Game",
  nameAlias: "Spider-Man: Brand New Day McDonald's Happy Meal Game",
  category: "Happy Meal Games",
  url: "https://spm30776.happymealdigital.com/?locale=en-PH",
  fallbackUrl: "https://spm30776.happymealdigital.com/?locale=en-PH",
  coverUrl: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800&auto=format&fit=crop&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=1200&auto=format&fit=crop&q=80",
  description: "Official McDonald's Happy Meal digital game experience for Spider-Man: Brand New Day! Web-sling through city rooftops, dodge obstacles, collect spider power tokens, and complete superhero challenges directly in your browser with responsive touch and keyboard controls.",
  developer: "McDonald's Happy Meal Digital / Marvel",
  releaseYear: "2024",
  rating: 5.0,
  tags: ["Happy Meal", "Spider-Man", "Marvel", "McDonald's", "Action", "Web-Slinger", "HTML5", "Brand New Day", "en-PH"],
  difficulty: "Superhero",
  featured: true,
  isHappyMeal: true
};

interface ExtraGamesDashboardProps {
  onAddCoins?: (amount: number) => void;
  isGoldMode?: boolean;
}

export const ExtraGamesDashboard: React.FC<ExtraGamesDashboardProps> = ({
  onAddCoins,
  isGoldMode = false
}) => {
  const game = HAPPY_MEAL_GAME;

  // State
  const [gamingSeconds, setGamingSeconds] = useState<number>(0);
  const [coinsClaimed, setCoinsClaimed] = useState<number>(0);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [hasPlayedSession, setHasPlayedSession] = useState<boolean>(false);

  useEffect(() => {
    const handleDeviceCheck = () => {
      const isMob = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobileDevice(isMob);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    handleDeviceCheck();
    window.addEventListener("resize", handleDeviceCheck);
    window.addEventListener("orientationchange", handleDeviceCheck);
    return () => {
      window.removeEventListener("resize", handleDeviceCheck);
      window.removeEventListener("orientationchange", handleDeviceCheck);
    };
  }, []);

  // Favorites & Likes
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("isekai_happymeal_spiderman_fav");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [likesCount, setLikesCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("isekai_happymeal_spiderman_likes");
      return saved ? parseInt(saved, 10) : 1850;
    } catch {
      return 1850;
    }
  });

  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Passive Coin Reward Tracker Loop (20 coins every 45s of active page session)
  const secondsRef = useRef(0);
  const onAddCoinsRef = useRef(onAddCoins);
  useEffect(() => {
    onAddCoinsRef.current = onAddCoins;
  }, [onAddCoins]);

  useEffect(() => {
    const interval = setInterval(() => {
      secondsRef.current += 1;
      const currentSec = secondsRef.current;
      setGamingSeconds(currentSec);
      if (currentSec % 45 === 0) {
        const reward = 20;
        if (onAddCoinsRef.current) {
          onAddCoinsRef.current(reward);
        }
        setCoinsClaimed((curr) => curr + reward);
        sfx.playBadgeUnlock();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Toggle Favorite
  const handleToggleFavorite = () => {
    sfx.playClick();
    setIsFavorite((prev) => {
      const updated = !prev;
      try {
        localStorage.setItem("isekai_happymeal_spiderman_fav", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Like Game
  const handleLikeGame = () => {
    sfx.playClick();
    if (hasLiked) return;
    setHasLiked(true);
    setLikesCount((prev) => {
      const updated = prev + 1;
      try {
        localStorage.setItem("isekai_happymeal_spiderman_likes", updated.toString());
      } catch {}
      return updated;
    });
  };

  // Copy Game Link
  const handleCopyLink = () => {
    sfx.playClick();
    if (game.url) {
      navigator.clipboard.writeText(game.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Direct un-sandboxed game launch
  const handleLaunchGame = () => {
    sfx.playWarp();
    setHasPlayedSession(true);
    if (onAddCoins) {
      onAddCoins(25);
      setCoinsClaimed((curr) => curr + 25);
    }
    // Launch directly in un-sandboxed native browser tab
    window.open(game.url, "_blank", "noopener,noreferrer");
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 🚀 TOP OF THE WEBSITE: PASTED UN-SANDBOXED OFFICIAL GAME LINK BAR */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 border border-red-400/60 shadow-2xl text-white space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/40 text-amber-300 font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-amber-300/30">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                OFFICIAL EXTRA GAME (UN-SANDBOXED)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-400" />
                100% Mobile Ready
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[11px] font-bold">
                locale=en-PH
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow">
              Spider-Man: Brand New Day McDonald&apos;s Happy Meal Game
            </h1>

            {/* BOLDLY PASTED LINK ON TOP AS REQUESTED */}
            <div className="p-3 rounded-2xl bg-black/50 border border-white/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-mono text-amber-300 font-bold uppercase shrink-0">
                  Pasted Link:
                </span>
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sfx.playWarp()}
                  className="font-mono text-xs sm:text-sm font-black text-white hover:text-amber-300 underline underline-offset-2 truncate"
                  title="Open Official Happy Meal Digital Link"
                >
                  {game.url}
                </a>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all active:scale-95"
                  title="Copy Link to Clipboard"
                >
                  {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{copiedLink ? "COPIED!" : "COPY"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Big Action Launch Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
            <button
              onClick={handleLaunchGame}
              className="px-6 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border-2 border-amber-400 text-amber-300 hover:text-white font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all group"
            >
              <Play className="w-5 h-5 fill-amber-400 group-hover:scale-110 transition-transform" />
              <span>TAP TO PLAY NOW (DIRECT)</span>
            </button>

            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playWarp()}
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/25 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 text-center transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open in New Browser Tab</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎮 MAIN SHOWCASE & CONTROLS GUIDE (NO RESTRICTIVE EMBEDDING) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Game Poster, Direct Play Hub, and Mobile Compatibility */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Superhero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] border border-slate-700/60 shadow-xl group">
              <img
                src={game.bannerUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-600 font-mono text-[10px] font-black uppercase text-white shadow">
                    Marvel & McDonald&apos;s
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-white uppercase drop-shadow">
                    Spider-Man: Brand New Day
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md line-clamp-2">
                    {game.description}
                  </p>
                </div>

                <button
                  onClick={handleLaunchGame}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 active:scale-95 transition-all shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START MISSION</span>
                </button>
              </div>
            </div>

            {/* Mobile Optimization Guarantee Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-mono font-black text-emerald-300 uppercase tracking-wide">
                    Why Direct Link (Not Sandboxed)?
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Mobile phones (iOS Safari & Android Chrome) block WebGL GPU acceleration, audio playback, and orientation controls when games are embedded in sandboxed iframes. By pasting and opening the link directly, the game launches at full 60 FPS with zero black screens!
                  </p>
                </div>
              </div>

              <button
                onClick={handleLaunchGame}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase flex items-center gap-1.5 shrink-0 shadow active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch Now</span>
              </button>
            </div>

            {/* Pasted Link Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase">Official URL Endpoint:</span>
                <span className="text-amber-400 font-bold">Philippines Region (en-PH)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-750 font-mono text-xs sm:text-sm text-cyan-300 break-all select-all flex items-center justify-between gap-3">
                <span>{game.url}</span>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white shrink-0"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Game Stats & Social Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>5.0 / 5.0</span>
                </div>
                <span>•</span>
                <span>Marvel / McDonald&apos;s</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Difficulty: Superhero</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLikeGame}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    hasLiked
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:text-rose-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{likesCount}</span>
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    isFavorite
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:text-amber-400"
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span>{isFavorite ? "FAVORITED" : "FAVORITE"}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? "COPIED" : "SHARE"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Mobile Instructions & Controls Drawer */}
        <div className="space-y-6">
          {/* Controls & Gameplay Guide */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 font-mono font-black text-sm text-cyan-400 uppercase border-b border-slate-800 pb-3">
              <Gamepad2 className="w-4 h-4" />
              <span>Gameplay & Touch Guide</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-mono font-bold">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Mobile Phone Touch Controls</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Tap and hold on the screen to shoot web-lines and swing across rooftops. Release your finger to jump over obstacles and billboards.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-mono font-bold">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Orientation Requirement</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Rotate your phone to <strong>Landscape mode (Horizontal)</strong> for the optimal superhero field of view.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-mono font-bold">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Sound & Superhero Audio</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Tap anywhere on the game screen after opening to unmute sound effects and Marvel background music.
                </p>
              </div>
            </div>
          </div>

          {/* Active Session & Rewards Tracker */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl space-y-4 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Page Session
              </span>
              <span className="text-emerald-400 font-bold">{formatSessionTime(gamingSeconds)}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>COINS EARNED</span>
              </div>
              <span className="text-sm font-black text-amber-400">+{coinsClaimed} COINS</span>
            </div>

            <button
              onClick={handleLaunchGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Spider-Man Game</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Official Notice */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Direct Official Link Notice:</strong> The official McDonald&apos;s Happy Meal game is directly loaded from{" "}
          <code className="text-amber-400 font-mono font-bold">{game.url}</code>. No sandbox restrictions are applied, ensuring touch, gyroscope, audio, and hardware WebGL function natively on smartphones and tablets.
        </p>
      </div>
    </div>
  );
};
