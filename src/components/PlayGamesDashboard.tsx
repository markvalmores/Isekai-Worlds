import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Gamepad,
  Play,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Star,
  Send,
  Clock,
  Heart,
  Info,
  Shield,
  Activity,
  Award,
  Terminal,
  ArrowRight,
  Tv
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface GameDetail {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  coverUrl: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Legendary";
  releaseYear: string;
  rating: number;
}

const GAME_CATALOG: GameDetail[] = [
  {
    id: "granblue",
    title: "Granblue Fantasy",
    url: "https://game.granbluefantasy.jp/",
    description: "An epic mobile RPG playable directly on modern desktop & mobile browsers. Features spectacular hand-drawn art, legendary turn-based gacha systems, and a majestic score composed by Nobuo Uematsu.",
    category: "JRPG & Gacha",
    coverUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=80",
    tags: ["Turn-Based", "Fantasy", "Multiplayer", "RPG"],
    difficulty: "Hard",
    releaseYear: "2014",
    rating: 4.8
  },
  {
    id: "y8",
    title: "Y8 Classic Arcade",
    url: "https://www.y8.com/",
    description: "The legendary internet classic gaming destination. Explore hundreds of thousands of flash-style casual games, high-score retro battles, and community-hosted mini-games across every genre.",
    category: "Arcade & Casual",
    coverUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    tags: ["Retro", "Casual", "Mini-Games", "Action"],
    difficulty: "Easy",
    releaseYear: "2006",
    rating: 4.5
  },
  {
    id: "cloudmoon",
    title: "CloudMoon Cloud Emulator",
    url: "https://web.cloudmoonapp.com/",
    description: "An ultra-low-latency, high-performance cloud gaming virtual machine emulator. Run complex Android RPGs and heavy mobile action titles directly inside your web browser without lag.",
    category: "Cloud Gaming",
    coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    tags: ["Emulator", "Virtual Machine", "Low Latency", "Mobile"],
    difficulty: "Medium",
    releaseYear: "2023",
    rating: 4.7
  }
];

const PREPOPULATED_COMMENTS: Record<string, { user: string; text: string; time: string; rating: number }[]> = {
  granblue: [
    { user: "DjeetaFan99", text: "Finally! No separate client download needed. Just logged in via chrome and my save file loaded instantly!", time: "2 hours ago", rating: 5 },
    { user: "GachaSlayer", text: "Been grinding Bahamut raids for 6 hours straight. Frame rate on the web edition is super crisp.", time: "1 day ago", rating: 4 },
    { user: "VyrnLover", text: "Is there any way to turn on English audio? Yes, click Settings inside game menu!", time: "3 days ago", rating: 5 }
  ],
  y8: [
    { user: "RetroKid", text: "Ah, the absolute nostalgia. Slope game is still the best on Y8!", time: "45 mins ago", rating: 5 },
    { user: "CasualGamer", text: "I can spend days playing puzzle mini games here. Some games might prompt flash warning, but most are updated to HTML5 now.", time: "5 hours ago", rating: 4 }
  ],
  cloudmoon: [
    { user: "MobileHacker", text: "Wow, playing Genshin on a low-end Chromebook through CloudMoon with zero lag is black magic.", time: "1 hour ago", rating: 5 },
    { user: "CloudKnight", text: "Saves so much battery and phone storage. The virtual Android controller layout works seamlessly.", time: "12 hours ago", rating: 5 }
  ]
};

interface PlayGamesProps {
  onAddCoins?: (amount: number) => void;
  isGoldMode?: boolean;
}

export function PlayGamesDashboard({ onAddCoins, isGoldMode = false }: PlayGamesProps) {
  const [selectedGame, setSelectedGame] = useState<GameDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"catalog" | "play">("catalog");
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [customGameUrl, setCustomGameUrl] = useState<string>("");
  const [customUrlError, setCustomUrlError] = useState<string | null>(null);

  // Active gaming session stats
  const [gamingSeconds, setGamingSeconds] = useState<number>(0);
  const [activeMultiplier, setActiveMultiplier] = useState<number>(1);
  const [coinsClaimed, setCoinsClaimed] = useState<number>(0);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({
    granblue: 342,
    y8: 1205,
    cloudmoon: 419
  });
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  // Dynamic comments state
  const [comments, setComments] = useState<Record<string, { user: string; text: string; time: string; rating: number }[]>>(() => {
    try {
      const saved = localStorage.getItem("isekai_game_comments");
      return saved ? JSON.parse(saved) : PREPOPULATED_COMMENTS;
    } catch {
      return PREPOPULATED_COMMENTS;
    }
  });

  const [newCommentText, setNewCommentText] = useState<string>("");
  const [newCommentRating, setNewCommentRating] = useState<number>(5);

  // Controller simulator states
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [lastButtonAction, setLastButtonAction] = useState<string>("Ready");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Game tracking loop - grants +15 coins every 45s of active page session
  useEffect(() => {
    let interval: any = null;
    if (activeTab === "play" && selectedGame) {
      interval = setInterval(() => {
        setGamingSeconds((prev) => {
          const next = prev + 1;
          if (next % 45 === 0) {
            const reward = 15 * activeMultiplier;
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
    return () => clearInterval(interval);
  }, [activeTab, selectedGame, activeMultiplier]);

  // Persist comments
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedGame) return;

    sfx.playClick();
    const newComm = {
      user: "IsekaiTraveler",
      text: newCommentText.trim(),
      time: "Just now",
      rating: newCommentRating
    };

    const updated = {
      ...comments,
      [selectedGame.id]: [newComm, ...(comments[selectedGame.id] || [])]
    };
    setComments(updated);
    localStorage.setItem("isekai_game_comments", JSON.stringify(updated));
    setNewCommentText("");
  };

  const handleLaunchGame = (game: GameDetail) => {
    sfx.playWarp();
    setSelectedGame(game);
    setActiveTab("play");
    setIframeKey(Date.now());
  };

  const handleCustomGameLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGameUrl.trim()) return;

    // Validate absolute URL format
    let finalUrl = customGameUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    try {
      new URL(finalUrl); // check validity
      setCustomUrlError(null);
      
      const customGame: GameDetail = {
        id: "custom",
        title: "Web Browser Viewport",
        url: finalUrl,
        description: "Custom user-provided website running in the sandboxed viewport container.",
        category: "Custom Web App",
        coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        tags: ["Custom", "Web", "Simulator"],
        difficulty: "Easy",
        releaseYear: "N/A",
        rating: 5.0
      };

      handleLaunchGame(customGame);
    } catch (err) {
      setCustomUrlError("Please enter a valid web URL format (e.g. google.com, itch.io)");
    }
  };

  const handleLikeGame = (gameId: string) => {
    sfx.playClick();
    if (hasLiked[gameId]) {
      setLikesCount((prev) => ({ ...prev, [gameId]: prev[gameId] - 1 }));
      setHasLiked((prev) => ({ ...prev, [gameId]: false }));
    } else {
      setLikesCount((prev) => ({ ...prev, [gameId]: prev[gameId] + 1 }));
      setHasLiked((prev) => ({ ...prev, [gameId]: true }));
      // Reward 5 coins for showing appreciation
      if (onAddCoins) onAddCoins(5);
    }
  };

  const handleRefreshIframe = () => {
    sfx.playClick();
    setIframeKey(Date.now());
  };

  const formatSessionTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Safe controller press simulator triggers audio feedback
  const triggerButtonFeedback = (btnName: string) => {
    sfx.playClick();
    setLastButtonAction(`Pressed Button ${btnName}`);
    setTimeout(() => {
      setLastButtonAction("Ready");
    }, 1200);
  };

  const handleCalibrateController = () => {
    sfx.playWarp();
    setIsCalibrated(true);
    setLastButtonAction("Calibration Successful!");
    if (onAddCoins) onAddCoins(15);
    setTimeout(() => {
      setLastButtonAction("Ready");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner Hub */}
      <div className={`p-8 sm:p-10 rounded-3xl relative overflow-hidden border ${
        isGoldMode 
          ? "bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-amber-950/40 border-amber-500/20" 
          : "bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-indigo-950/40 border-emerald-500/10"
      }`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wider uppercase">
            <Gamepad className="w-3.5 h-3.5 animate-bounce" />
            Arcade Station Active
          </div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Multiverse Game Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Play fully loaded high-performance web-compatible anime games, arcades, and full-scale virtual machine mobile simulators directly inside our custom browser sandbox.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-mono text-slate-450">
            <span className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800">
              <Activity className="w-3 h-3 text-emerald-400" /> Web-Frame Streaming
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800">
              <Shield className="w-3 h-3 text-cyan-400" /> Secure Sandboxing
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-800">
              <Award className="w-3 h-3 text-amber-400" /> Gaming Coins: +15 coins / 45s
            </span>
          </div>
        </div>
      </div>

      {activeTab === "catalog" ? (
        <div className="space-y-8">
          {/* Custom Web Url Loader Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-emerald-500/10 space-y-3">
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-500" />
                Custom Game Browser Loader
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Paste any external web game URL (e.g., itch.io games, custom html5 titles) to stream and run inside our dedicated frame.
              </p>
            </div>
            
            <form onSubmit={handleCustomGameLaunch} className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Paste Game Address (e.g. game.com/play or https://...)"
                  value={customGameUrl}
                  onChange={(e) => setCustomGameUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Launch Address</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {customUrlError && (
              <p className="text-[10px] font-mono text-red-400">{customUrlError}</p>
            )}
          </div>

          {/* Core Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAME_CATALOG.map((game) => (
              <div
                key={game.id}
                className="group rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg relative"
              >
                {/* Header Image Cover */}
                <div className="h-44 overflow-hidden bg-slate-950 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-slate-950/90 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider z-20">
                    {game.category}
                  </span>

                  {/* Rating block */}
                  <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-slate-950/90 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-400 font-bold text-[10px] font-mono z-20">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{game.rating}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white uppercase group-hover:text-emerald-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-relaxed line-clamp-3">
                      {game.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-slate-850/50">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {game.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-850">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats List */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-450 pb-2">
                      <div>
                        Difficulty: <span className="text-white font-semibold">{game.difficulty}</span>
                      </div>
                      <div>
                        Year: <span className="text-white font-semibold">{game.releaseYear}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="p-6 pt-0 flex gap-2 border-t border-slate-850/20 bg-slate-950/20">
                  <button
                    onClick={() => handleLaunchGame(game)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" /> Play Game
                  </button>

                  <button
                    onClick={() => handleLikeGame(game.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                      hasLiked[game.id]
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        : "bg-slate-950/80 text-slate-400 border-slate-800 hover:text-rose-400 hover:border-rose-500/20"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked[game.id] ? "fill-rose-500" : ""}`} />
                    <span>{likesCount[game.id]}</span>
                  </button>

                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sfx.playWarp()}
                    className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs transition-all hover:bg-slate-800"
                    title="Launch external browser tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice Card */}
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 flex items-center gap-3">
            <Info className="w-5 h-5 text-indigo-400 shrink-0" />
            <p className="text-[11px] text-indigo-300 leading-relaxed">
              <strong>Iframe Compatibility Note:</strong> These are official sandbox portals. If an external game's server has strict iframe restrictions, they might prompt a blank page or secure connection wall. In those cases, click the <strong>Launch external tab</strong> button to open them natively in a separate tab!
            </p>
          </div>
        </div>
      ) : (
        selectedGame && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Viewport Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Simulator Deck Controls */}
              <div className="p-4 rounded-3xl bg-slate-900/80 border border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setActiveTab("catalog");
                    }}
                    className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all"
                    title="Back to Catalog"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="text-left min-w-0">
                    <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">Active Station</span>
                    <h3 className="text-xs font-black text-white uppercase truncate max-w-[200px]">
                      {selectedGame.title}
                    </h3>
                  </div>
                </div>

                {/* Simulated URL input bar */}
                <div className="flex-1 max-w-md w-full relative">
                  <input
                    type="text"
                    readOnly
                    value={selectedGame.url}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-[10px] text-slate-450 font-mono focus:outline-none truncate select-all text-center"
                    title="Active streaming stream URL"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Coins multiplier badge */}
                  <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[9px] font-bold flex items-center gap-1 uppercase">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Coins 1.5x</span>
                  </div>

                  <button
                    onClick={handleRefreshIframe}
                    className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all"
                    title="Reboot System Stream"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={selectedGame.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sfx.playWarp()}
                    className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all inline-flex items-center"
                    title="Launch external browser tab"
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

              {/* Simulated Monitor Frame */}
              <div className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
                isFullscreen ? "fixed inset-0 z-50 rounded-none w-screen h-screen" : "h-[620px]"
              }`}>
                {/* Floating telemetry HUD (Only if fullscreen) */}
                {isFullscreen && (
                  <div className="absolute top-4 left-4 z-40 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-[9px] font-mono space-y-1 backdrop-blur shadow-md">
                    <span className="text-emerald-400 font-bold uppercase block">✦ Active Session: {formatSessionTime(gamingSeconds)}</span>
                    <span className="text-amber-400 font-bold block">★ Coins Claimed: +{coinsClaimed}</span>
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="mt-1 text-[8px] bg-slate-900 border border-slate-750 text-white px-2 py-0.5 rounded uppercase block"
                    >
                      Exit Fullscreen
                    </button>
                  </div>
                )}

                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={selectedGame.url}
                  className="w-full h-full border-none bg-slate-900"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                  referrerPolicy="no-referrer"
                />

                {/* Sub-bar showing stream diagnostic */}
                <div className="bg-slate-900/90 border-t border-slate-850 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-450">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Diagnostics: Running (1080p, 60fps frame bypass)</span>
                  </div>
                  <div>
                    Iframe sandbox: <span className="text-amber-400 font-bold">STRICT_ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Game Metadata Description */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-850/60 space-y-3">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Game Lore & Details
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedGame.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedGame.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Controller Calibration Deck & Feedback Reviews */}
            <div className="space-y-6">
              {/* Telemetry statistics */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-emerald-500/10 space-y-3 relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Live Telemetry</span>
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Session Activity
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-850">
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">Active Playtime</span>
                    <span className="text-base font-mono font-black text-white">{formatSessionTime(gamingSeconds)}</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-850">
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">Claimed Coins</span>
                    <span className="text-base font-mono font-black text-amber-400">+{coinsClaimed}</span>
                  </div>
                </div>

                <p className="text-[9px] font-mono text-slate-500 text-center leading-relaxed">
                  Every 45 seconds of continuous gameplay logs earns you <strong className="text-amber-400">+15 Isekai Coins</strong>!
                </p>
              </div>

              {/* Virtual Gamepad Controller calibrator */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Interface Bridge</span>
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-indigo-400" />
                    Gamepad Simulator
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-2xl text-[10px] font-mono text-slate-400 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={isCalibrated ? "text-emerald-400 font-bold" : "text-amber-400 font-bold animate-pulse"}>
                        {isCalibrated ? "Calibrated (CONNECTED)" : "Not Calibrated"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Action:</span>
                      <span className="text-white font-bold">{lastButtonAction}</span>
                    </div>
                  </div>

                  {/* Controller D-PAD & XYAB layout */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 flex items-center justify-around gap-2 relative">
                    {/* Simulated D-Pad */}
                    <div className="relative w-16 h-16 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
                      <button
                        onClick={() => triggerButtonFeedback("UP")}
                        className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rounded hover:bg-slate-700 font-mono text-[6px] text-slate-500 font-bold"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => triggerButtonFeedback("LEFT")}
                        className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded hover:bg-slate-700 font-mono text-[6px] text-slate-500 font-bold"
                      >
                        ◀
                      </button>
                      <button
                        onClick={() => triggerButtonFeedback("RIGHT")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded hover:bg-slate-700 font-mono text-[6px] text-slate-500 font-bold"
                      >
                        ▶
                      </button>
                      <button
                        onClick={() => triggerButtonFeedback("DOWN")}
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rounded hover:bg-slate-700 font-mono text-[6px] text-slate-500 font-bold"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => triggerButtonFeedback("X")}
                        className="w-6 h-6 rounded-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-bold text-[8px] font-mono flex items-center justify-center shadow-sm"
                      >
                        X
                      </button>
                      <button
                        onClick={() => triggerButtonFeedback("Y")}
                        className="w-6 h-6 rounded-full bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/30 text-yellow-300 font-bold text-[8px] font-mono flex items-center justify-center shadow-sm"
                      >
                        Y
                      </button>
                      <button
                        onClick={() => triggerButtonFeedback("A")}
                        className="w-6 h-6 rounded-full bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 font-bold text-[8px] font-mono flex items-center justify-center shadow-sm"
                      >
                        A
                      </button>
                      <button
                        onClick={() => triggerButtonFeedback("B")}
                        className="w-6 h-6 rounded-full bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 font-bold text-[8px] font-mono flex items-center justify-center shadow-sm"
                      >
                        B
                      </button>
                    </div>
                  </div>

                  {!isCalibrated ? (
                    <button
                      onClick={handleCalibrateController}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Calibrate Gamepad (+15 Coins)
                    </button>
                  ) : (
                    <span className="text-[8px] font-mono text-slate-500 uppercase text-center block">
                      ★ Calibrated: Control simulation link mapped
                    </span>
                  )}
                </div>
              </div>

              {/* Comments & Reviews section */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-850 space-y-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-slate-550 font-bold uppercase tracking-widest">Portal Chat</span>
                  <h4 className="text-xs font-bold text-white uppercase">
                    Reviews & Comments
                  </h4>
                </div>

                {/* Form to submit comment */}
                <form onSubmit={handleAddComment} className="space-y-2">
                  <textarea
                    required
                    rows={2}
                    placeholder="Leave a review, hint, or gacha tip..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-[10px] text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] font-mono text-slate-500 uppercase">Rating:</span>
                      <select
                        value={newCommentRating}
                        onChange={(e) => setNewCommentRating(parseInt(e.target.value, 10))}
                        className="bg-slate-950 border border-slate-850 rounded-lg text-[9px] text-amber-400 font-bold px-1.5 py-0.5 focus:outline-none"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4)</option>
                        <option value={3}>⭐⭐⭐ (3)</option>
                        <option value={2}>⭐⭐ (2)</option>
                        <option value={1}>⭐ (1)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-mono font-bold uppercase flex items-center gap-1 transition-all"
                    >
                      <span>Post</span>
                      <Send className="w-3 h-3 text-emerald-400" />
                    </button>
                  </div>
                </form>

                {/* List of comments */}
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 select-none">
                  {(comments[selectedGame.id] || []).map((comm, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 rounded-2xl border border-slate-850/50 space-y-1 text-[11px] leading-relaxed"
                    >
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-emerald-400 font-bold">{comm.user}</span>
                        <span className="text-slate-550">{comm.time}</span>
                      </div>
                      <div className="text-slate-300 font-sans text-[10px]">
                        {comm.text}
                      </div>
                      <div className="text-[8px] text-amber-400 font-mono">
                        {"★".repeat(comm.rating)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
