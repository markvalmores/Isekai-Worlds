import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Play,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Star,
  Heart,
  Info,
  Activity,
  Flame,
  Share2,
  CheckCircle2,
  Monitor,
  HelpCircle,
  Coins,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { sfx } from "../utils/sfx";

export interface ExtraGameItem {
  id: string;
  title: string;
  nameAlias: string;
  category: "Happy Meal Games";
  url: string;
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

// Strictly only the Happy Meal Game as requested
const HAPPY_MEAL_GAME: ExtraGameItem = {
  id: "spiderman-happymeal",
  title: "Spider-Man: Brand New Day McDonald's Happy Meal Game",
  nameAlias: "Spider-Man: Brand New Day McDonald's Happy Meal Game",
  category: "Happy Meal Games",
  url: "https://spm30776.happymealdigital.com/?locale=en-PH",
  coverUrl: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800&auto=format&fit=crop&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=1200&auto=format&fit=crop&q=80",
  description: "Official McDonald's Happy Meal digital game experience for Spider-Man: Brand New Day! Web-sling through city rooftops, dodge obstacles, collect spider power tokens, and complete superhero challenges directly in your browser with responsive touch and keyboard controls.",
  developer: "McDonald's Happy Meal Digital / Marvel",
  releaseYear: "2024",
  rating: 5.0,
  tags: ["Happy Meal", "Spider-Man", "Marvel", "McDonald's", "Action", "Web-Slinger", "HTML5", "Brand New Day"],
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
  // State
  const game = HAPPY_MEAL_GAME;
  const [isPlayerActive, setIsPlayerActive] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFillScreen, setIsFillScreen] = useState<boolean>(true); // Fill screen active by default
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);
  const [gamingSeconds, setGamingSeconds] = useState<number>(0);
  const [coinsClaimed, setCoinsClaimed] = useState<number>(0);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Native Fullscreen API Handler
  const toggleNativeFullscreen = () => {
    sfx.playClick();
    if (!document.fullscreenElement) {
      if (gameContainerRef.current?.requestFullscreen) {
        gameContainerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Sync fullscreen change event from browser escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Passive Coin Reward Tracker Loop (20 coins every 45s of active game session)
  const secondsRef = useRef(0);
  const onAddCoinsRef = useRef(onAddCoins);

  useEffect(() => {
    onAddCoinsRef.current = onAddCoins;
  }, [onAddCoins]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayerActive) {
      interval = setInterval(() => {
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
    } else {
      secondsRef.current = 0;
      setGamingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayerActive]);

  // Back Button handler
  const handleBack = () => {
    sfx.playClick();
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
    setIsPlayerActive((prev) => !prev);
  };

  // Refresh Game Iframe
  const handleRefreshIframe = () => {
    sfx.playClick();
    setIsLoadingIframe(true);
    setIframeKey(Date.now());
  };

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
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner & Header Hub */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all shadow-2xl ${
        isGoldMode
          ? "bg-gradient-to-br from-amber-950/60 via-slate-950 to-amber-950/40 border-amber-500/40 shadow-[0_8px_32px_rgba(245,158,11,0.2)]"
          : "bg-gradient-to-br from-red-950/50 via-slate-950 to-amber-950/40 border-red-500/30 shadow-[0_8px_32px_rgba(239,68,68,0.2)]"
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-600/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600/25 border border-red-500/50 text-red-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-pulse" />
                Happy Meal Games
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Spider-Man: Brand New Day
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" /> +20 Coins / 45s
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              {game.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Official McDonald&apos;s Happy Meal digital web experience. Embedded in full fill-screen responsive mode with instant touch and keyboard gameplay.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                sfx.playWarp();
                setIsPlayerActive(true);
                handleRefreshIframe();
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPlayerActive ? "RELOAD GAME" : "PLAY GAME"}</span>
            </button>

            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playWarp()}
              className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-750 hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"
              title="Open Official Happy Meal Digital in New Window"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Direct Link</span>
            </a>
          </div>
        </div>
      </div>

      {/* EMBEDDED FILL SCREEN GAME CONTAINER & CONTROLS */}
      {isPlayerActive ? (
        <div className="space-y-4">
          {/* Controls & Navigation Top Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-red-950/40 hover:border-red-500/40 text-slate-200 hover:text-white font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-md active:scale-95"
                title="Toggle View / Back"
              >
                <ChevronLeft className="w-4 h-4 text-red-400" />
                <span>BACK</span>
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 font-mono font-bold text-[9px] uppercase border border-red-500/30">
                    Happy Meal Games
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {game.rating}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-white uppercase truncate max-w-[280px] sm:max-w-md">
                  {game.title}
                </h2>
              </div>
            </div>

            {/* Center: Live Session Playtime & Coins Indicator */}
            <div className="hidden md:flex items-center gap-3 font-mono text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>PLAYTIME: <strong className="text-emerald-400">{formatSessionTime(gamingSeconds)}</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>+{coinsClaimed} COINS</span>
              </div>
            </div>

            {/* Right: Fill Screen, Fullscreen, Reload, Guide, Direct Link */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Fill Screen Mode Toggle */}
              <button
                onClick={() => {
                  sfx.playClick();
                  setIsFillScreen((prev) => !prev);
                }}
                className={`px-3 py-2 rounded-xl border font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all shadow-sm ${
                  isFillScreen
                    ? "bg-red-600/20 border-red-500/50 text-red-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
                title="Toggle Fill Screen Viewport Mode"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fill Screen: {isFillScreen ? "ON" : "OFF"}</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleNativeFullscreen}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="Toggle True Full Screen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? "EXIT FULLSCREEN" : "FULL SCREEN"}</span>
              </button>

              {/* Reload / Refresh Game */}
              <button
                onClick={handleRefreshIframe}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                title="Restart & Reload Game"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingIframe ? "animate-spin text-amber-400" : ""}`} />
              </button>

              {/* Controls Guide Drawer */}
              <button
                onClick={() => {
                  sfx.playClick();
                  setShowControlsGuide((prev) => !prev);
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                title="Game Controls & Touch Guide"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              {/* Open in New Tab Button */}
              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sfx.playWarp()}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all inline-flex items-center"
                title="Open Game in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Controls Guide Drawer */}
          {showControlsGuide && (
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/30 text-xs text-slate-200 space-y-2 animate-fadeIn shadow-xl">
              <div className="flex items-center justify-between font-mono font-bold text-cyan-400 uppercase text-xs border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" /> Spider-Man Controls & Gameplay Guide
                </span>
                <button
                  onClick={() => setShowControlsGuide(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-1">🎮 Desktop Keyboard</strong>
                  <span>Use <strong>Arrow Keys / WASD</strong> to steer Spider-Man, <strong>Spacebar</strong> to shoot web-lines & swing, and <strong>Mouse Click</strong> to select items.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-1">📱 Mobile & Touch</strong>
                  <span>Tap and hold on the screen to sling webs across buildings and release to jump over obstacles.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-1">⚡ Sound & Audio</strong>
                  <span>Click or tap once inside the game frame to activate sound effects and superhero music.</span>
                </div>
              </div>
            </div>
          )}

          {/* EMBEDDED FILL SCREEN GAME IFRAME */}
          <div
            ref={gameContainerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all duration-300 ${
              isFullscreen
                ? "fixed inset-0 z-50 rounded-none w-screen h-screen"
                : isFillScreen
                ? "w-full h-[78vh] min-h-[580px] max-h-[920px]"
                : "w-full aspect-[16/9] min-h-[480px]"
            }`}
          >
            {/* Top Fullscreen Floating Overlay HUD (When Fullscreen Active) */}
            {isFullscreen && (
              <div className="absolute top-4 left-4 z-40 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 text-xs font-mono backdrop-blur-md shadow-2xl flex items-center gap-4">
                <button
                  onClick={toggleNativeFullscreen}
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>EXIT FULLSCREEN</span>
                </button>
                <span className="text-slate-300">{game.title}</span>
                <span className="text-emerald-400 font-bold">{formatSessionTime(gamingSeconds)}</span>
              </div>
            )}

            {/* Iframe Loading Placeholder */}
            {isLoadingIframe && (
              <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                  <Gamepad2 className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
                    LOADING SPIDER-MAN HAPPY MEAL GAME...
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Connecting to {game.url} ...
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Direct Launch Tab
                  </a>
                </div>
              </div>
            )}

            {/* THE GAME IFRAME */}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={game.url}
              title={game.title}
              onLoad={() => setIsLoadingIframe(false)}
              className="w-full h-full border-0 bg-slate-950"
              allow="fullscreen; autoplay; encrypted-media; camera; microphone; payment; display-capture; clipboard-read; clipboard-write; web-share"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads allow-pointer-lock"
            />
          </div>

          {/* Game Details & Social Action Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                    {game.developer}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-400">Release: {game.releaseYear}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Difficulty: {game.difficulty}</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {game.description}
                </p>
              </div>

              {/* Action Buttons: Favorite, Like, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLikeGame}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    hasLiked
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:text-rose-400 hover:border-rose-500/30"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{likesCount}</span>
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
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
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  title="Copy Game URL"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? "COPIED!" : "SHARE"}</span>
                </button>
              </div>
            </div>

            {/* Tags list */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Standby Card when Back is toggled */
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/30 mx-auto">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase">{game.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{game.description}</p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                sfx.playWarp();
                setIsPlayerActive(true);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs uppercase flex items-center gap-2 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>LAUNCH FILL SCREEN</span>
            </button>
            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>
      )}

      {/* Official Notice */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Happy Meal Digital Game Notice:</strong> The official McDonald&apos;s Happy Meal game is directly loaded from <code>https://spm30776.happymealdigital.com/?locale=en-PH</code>. You can play directly inside the fill-screen container or click Full Screen to expand to true fullscreen mode.
        </p>
      </div>
    </div>
  );
};
