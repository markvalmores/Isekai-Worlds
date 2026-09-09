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
  Shield,
  Activity,
  Flame,
  Search,
  Layers,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Smartphone,
  Monitor,
  HelpCircle,
  Coins
} from "lucide-react";
import { sfx } from "../utils/sfx";

export interface ExtraGameItem {
  id: string;
  title: string;
  nameAlias?: string;
  category: "Happy Meal Games" | "Marvel & Superheroes" | "Arcade & Action" | "Anime Mini-Games";
  url: string;
  coverUrl: string;
  bannerUrl?: string;
  description: string;
  developer: string;
  releaseYear: string;
  rating: number;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Superhero";
  featured?: boolean;
  isHappyMeal?: boolean;
}

const EXTRA_GAMES_CATALOG: ExtraGameItem[] = [
  {
    id: "spiderman-happymeal",
    title: "Spide-Man Brand New Day McDonald's Happy Meal Game",
    nameAlias: "Spider-Man Brand New Day McDonald's Happy Meal Game",
    category: "Happy Meal Games",
    url: "https://www.happymeal.com/en-ph/digital/spm30776/",
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
  },
  {
    id: "happymeal-digital-hub",
    title: "McDonald's Happy Meal Digital World Portal",
    category: "Happy Meal Games",
    url: "https://www.happymeal.com/en-ph/",
    coverUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    description: "Explore the complete official McDonald's Happy Meal digital hub featuring rotating mini-games, creative activity stations, digital toy scanner interactions, and interactive educational adventures.",
    developer: "McDonald's Global Digital",
    releaseYear: "2024",
    rating: 4.8,
    tags: ["Happy Meal", "McDonald's", "Mini-Games", "Digital Hub", "Family"],
    difficulty: "Easy",
    featured: false,
    isHappyMeal: true
  },
  {
    id: "marvel-avengers-arena",
    title: "Marvel Super Hero Squad Web Challenge",
    category: "Marvel & Superheroes",
    url: "https://playtomax.com/games/spider-solitaire/",
    coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
    description: "High-octane superhero puzzle and reflex challenge inspired by iconic comic book champions. Fast-paced browser experience optimized for instant desktop & tablet play.",
    developer: "Heroic Web Arcade",
    releaseYear: "2023",
    rating: 4.7,
    tags: ["Marvel", "Heroes", "Action", "Puzzle", "Arcade"],
    difficulty: "Medium",
    featured: false,
    isHappyMeal: false
  },
  {
    id: "sonic-speed-rush",
    title: "Sonic Dash Happy Meal Web Challenge",
    category: "Happy Meal Games",
    url: "https://www.happymeal.com/en-ph/digital/",
    coverUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    description: "Sonic the Hedgehog official Happy Meal digital companion runner. Dash through loop-de-loops, collect golden rings, and test your reaction speeds in high-velocity obstacle courses.",
    developer: "SEGA & McDonald's Digital",
    releaseYear: "2024",
    rating: 4.9,
    tags: ["Happy Meal", "Sonic", "Runner", "SEGA", "Speed"],
    difficulty: "Medium",
    featured: false,
    isHappyMeal: true
  },
  {
    id: "anime-cyber-runner",
    title: "Isekai Cyber Blade Neo Runner",
    category: "Anime Mini-Games",
    url: "https://playtomax.com/games",
    coverUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    description: "Fast-paced cybernetic anime action mini-game. Slash through neon drones, dash across hyper-speed highways, and trigger bullet-time abilities with fluid browser controls.",
    developer: "Isekai Studio",
    releaseYear: "2024",
    rating: 4.8,
    tags: ["Anime", "Cyberpunk", "Action", "HTML5", "Fast-Paced"],
    difficulty: "Hard",
    featured: false,
    isHappyMeal: false
  },
  {
    id: "pokemon-safari-quest",
    title: "Pocket Monster Safari Happy Meal Quest",
    category: "Happy Meal Games",
    url: "https://www.happymeal.com/en-ph/",
    coverUrl: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80",
    description: "Discover, track, and photograph legendary pocket monsters in lush interactive biomes. Explore secret islands, solve habitat puzzles, and unlock digital badge rewards.",
    developer: "Creatures & McDonald's",
    releaseYear: "2024",
    rating: 4.9,
    tags: ["Happy Meal", "Pokémon", "Adventure", "Creatures", "Interactive"],
    difficulty: "Easy",
    featured: false,
    isHappyMeal: true
  }
];

interface ExtraGamesDashboardProps {
  onAddCoins?: (amount: number) => void;
  isGoldMode?: boolean;
}

export const ExtraGamesDashboard: React.FC<ExtraGamesDashboardProps> = ({
  onAddCoins,
  isGoldMode = false
}) => {
  // State
  const [selectedGame, setSelectedGame] = useState<ExtraGameItem>(EXTRA_GAMES_CATALOG[0]);
  const [isPlayerActive, setIsPlayerActive] = useState<boolean>(true); // Start directly with the featured game ready to play
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFillScreen, setIsFillScreen] = useState<boolean>(true); // Default to Fill Screen as requested
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);
  const [gamingSeconds, setGamingSeconds] = useState<number>(0);
  const [coinsClaimed, setCoinsClaimed] = useState<number>(0);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Favorites & Likes
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("isekai_extra_games_favs");
      return saved ? JSON.parse(saved) : { "spiderman-happymeal": true };
    } catch {
      return { "spiderman-happymeal": true };
    }
  });

  const [likes, setLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("isekai_extra_games_likes");
      return saved ? JSON.parse(saved) : { "spiderman-happymeal": 1420 };
    } catch {
      return { "spiderman-happymeal": 1420 };
    }
  });

  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Categories list
  const categories = [
    "All",
    "Happy Meal Games",
    "Marvel & Superheroes",
    "Arcade & Action",
    "Anime Mini-Games"
  ];

  // Filter games
  const filteredGames = EXTRA_GAMES_CATALOG.filter((game) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Happy Meal Games" && (game.category === "Happy Meal Games" || game.isHappyMeal)) ||
      game.category === selectedCategory;

    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.nameAlias && game.nameAlias.toLowerCase().includes(searchQuery.toLowerCase())) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

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
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayerActive && selectedGame) {
      interval = setInterval(() => {
        setGamingSeconds((prev) => {
          const next = prev + 1;
          if (next % 45 === 0) {
            const reward = 20;
            if (onAddCoins) onAddCoins(reward);
            setCoinsClaimed((curr) => curr + reward);
            sfx.playBadgeUnlock();
          }
          return next;
        });
      }, 1000);
    } else {
      setGamingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayerActive, selectedGame, onAddCoins]);

  // Launch Game
  const handleLaunchGame = (game: ExtraGameItem) => {
    sfx.playWarp();
    setSelectedGame(game);
    setIsPlayerActive(true);
    setIsLoadingIframe(true);
    setIframeKey(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Back Button handler
  const handleBackToCatalog = () => {
    sfx.playClick();
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
    setIsPlayerActive(false);
  };

  // Refresh Game Iframe
  const handleRefreshIframe = () => {
    sfx.playClick();
    setIsLoadingIframe(true);
    setIframeKey(Date.now());
  };

  // Toggle Favorite
  const handleToggleFavorite = (gameId: string) => {
    sfx.playClick();
    setFavorites((prev) => {
      const updated = { ...prev, [gameId]: !prev[gameId] };
      try {
        localStorage.setItem("isekai_extra_games_favs", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Like Game
  const handleLikeGame = (gameId: string) => {
    sfx.playClick();
    if (hasLiked[gameId]) return;
    setHasLiked((prev) => ({ ...prev, [gameId]: true }));
    setLikes((prev) => {
      const updated = { ...prev, [gameId]: (prev[gameId] || 0) + 1 };
      try {
        localStorage.setItem("isekai_extra_games_likes", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Copy Game Link
  const handleCopyLink = () => {
    sfx.playClick();
    if (selectedGame?.url) {
      navigator.clipboard.writeText(selectedGame.url);
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Top Banner & Header Hub */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all shadow-2xl ${
        isGoldMode
          ? "bg-gradient-to-br from-amber-950/60 via-slate-950 to-amber-950/40 border-amber-500/40 shadow-[0_8px_32px_rgba(245,158,11,0.2)]"
          : "bg-gradient-to-br from-red-950/40 via-slate-950 to-yellow-950/30 border-red-500/20 shadow-[0_8px_32px_rgba(239,68,68,0.15)]"
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-600/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-pulse" />
                Extra Games & Happy Meal
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Spider-Man: Brand New Day
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" /> +20 Coins / 45s
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              EXTRA GAMES & HAPPY MEAL PORTAL
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Play official McDonald&apos;s Happy Meal digital web games, Spider-Man Brand New Day web-slinging challenges, and instant browser games embedded in full fill screen mode with zero installs.
            </p>
          </div>

          {/* Quick Launch Button for Flagship Game */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleLaunchGame(EXTRA_GAMES_CATALOG[0])}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY SPIDER-MAN HAPPY MEAL</span>
            </button>

            {isPlayerActive && (
              <button
                onClick={handleBackToCatalog}
                className="px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-750 hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>All Games</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVE GAME PLAYER SCREEN (FILL SCREEN VIEWPORT) */}
      {isPlayerActive && selectedGame ? (
        <div className="space-y-4">
          {/* Controls & Nav Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
            {/* Left: Back Button & Game Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToCatalog}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-red-950/40 hover:border-red-500/40 text-slate-200 hover:text-white font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-md active:scale-95"
                title="Back to Extra Games Catalog"
              >
                <ChevronLeft className="w-4 h-4 text-red-400" />
                <span>BACK</span>
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 font-mono font-bold text-[9px] uppercase border border-red-500/30">
                    {selectedGame.category}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {selectedGame.rating}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-white uppercase truncate max-w-[280px] sm:max-w-md">
                  {selectedGame.title}
                </h2>
              </div>
            </div>

            {/* Center: Live Session & Coins Claimed Indicator */}
            <div className="hidden md:flex items-center gap-3 font-mono text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>PLAYTIME: <strong className="text-emerald-400">{formatSessionTime(gamingSeconds)}</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>+{coinsClaimed} COINS</span>
              </div>
            </div>

            {/* Right: Fill Screen, Fullscreen, Refresh & External Open Buttons */}
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

              {/* Native Fullscreen Button */}
              <button
                onClick={toggleNativeFullscreen}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="Toggle True Full Screen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? "EXIT FULLSCREEN" : "FULL SCREEN"}</span>
              </button>

              {/* Refresh Iframe */}
              <button
                onClick={handleRefreshIframe}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                title="Restart & Reload Game"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingIframe ? "animate-spin text-amber-400" : ""}`} />
              </button>

              {/* Controls Guide Drawer Button */}
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
                href={selectedGame.url}
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
                  <Gamepad2 className="w-4 h-4" /> Controls & Gameplay Guide
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
                  <strong className="text-white block mb-1">🎮 Desktop Controls</strong>
                  <span>Use <strong>Arrow Keys / WASD</strong> to move, <strong>Spacebar</strong> to shoot web / jump, and <strong>Mouse Click</strong> to interact with menu items.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-1">📱 Mobile & Touch</strong>
                  <span>Tap on-screen directional buttons and buttons to web-sling, jump, and collect tokens across rooftops.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-1">⚡ Sound & Audio</strong>
                  <span>Click once inside the game screen to enable browser audio autoplay.</span>
                </div>
              </div>
            </div>
          )}

          {/* EMBEDDED FILL SCREEN GAME CONTAINER */}
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
                <span className="text-slate-300">Spider-Man Happy Meal Game</span>
                <span className="text-emerald-400 font-bold">{formatSessionTime(gamingSeconds)}</span>
              </div>
            )}

            {/* Iframe Loading Placeholder */}
            {isLoadingIframe && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                  <Gamepad2 className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
                    LOADING HAPPY MEAL REALM...
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Connecting to {selectedGame.title} secure digital stream...
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedGame.url}
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
              src={selectedGame.url}
              title={selectedGame.title}
              onLoad={() => setIsLoadingIframe(false)}
              className="w-full h-full border-0 bg-slate-950"
              allow="fullscreen; autoplay; encrypted-media; camera; microphone; payment; display-capture; clipboard-read; clipboard-write; web-share"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads allow-pointer-lock"
            />
          </div>

          {/* Under-Player Metadata & Social Details */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                    {selectedGame.developer}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-400">Release: {selectedGame.releaseYear}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Difficulty: {selectedGame.difficulty}</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase">
                  {selectedGame.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {selectedGame.description}
                </p>
              </div>

              {/* Action Buttons: Favorite, Like, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLikeGame(selectedGame.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    hasLiked[selectedGame.id]
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:text-rose-400 hover:border-rose-500/30"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked[selectedGame.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{likes[selectedGame.id] || 1420}</span>
                </button>

                <button
                  onClick={() => handleToggleFavorite(selectedGame.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    favorites[selectedGame.id]
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:text-amber-400"
                  }`}
                >
                  <Star className={`w-4 h-4 ${favorites[selectedGame.id] ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span>{favorites[selectedGame.id] ? "FAVORITED" : "FAVORITE"}</span>
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
              {selectedGame.tags.map((tag) => (
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
      ) : null}

      {/* GAMES CATALOG & CATEGORY BROWSER */}
      <div className="space-y-6">
        {/* Section Title & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-red-500" />
              <span>EXTRA GAMES CATALOG & HAPPY MEAL COLLECTION</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select any game below to play immediately in fill screen mode.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extra & Happy Meal games..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 font-mono"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sfx.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-sm ${
                  isActive
                    ? "bg-red-600 text-white shadow-red-600/30 shadow-md scale-105"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const isCurrentActive = isPlayerActive && selectedGame?.id === game.id;
            return (
              <div
                key={game.id}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  isCurrentActive
                    ? "bg-slate-900/90 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.25)] ring-1 ring-red-500"
                    : "bg-slate-900/50 hover:bg-slate-900/90 border-slate-800/80 hover:border-red-500/40 hover:shadow-2xl hover:-translate-y-1"
                }`}
              >
                {/* Cover Image & Category Badges */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-slate-950/90 border border-red-500/40 text-red-400 font-mono font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur shadow-md">
                    {game.category}
                  </span>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/90 border border-amber-500/40 px-2.5 py-1 rounded-xl text-amber-400 font-bold text-[10px] font-mono backdrop-blur shadow-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{game.rating}</span>
                  </div>

                  {game.featured && (
                    <span className="absolute bottom-3 left-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-white" /> FEATURED GAME
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-white uppercase group-hover:text-red-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {game.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Dev: <strong className="text-slate-200">{game.developer}</strong></span>
                      <span>Difficulty: <strong className="text-red-400">{game.difficulty}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchGame(game)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY IN FILL SCREEN</span>
                  </button>

                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sfx.playWarp()}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <Info className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Happy Meal Digital Game Notice:</strong> The official McDonald&apos;s Happy Meal game links are hosted directly on McDonald&apos;s verified web endpoints. You can play directly inside the fill screen viewport above or launch in full screen with the dedicated Full Screen button.
          </p>
        </div>
      </div>
    </div>
  );
};
