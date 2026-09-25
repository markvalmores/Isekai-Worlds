import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Search,
  Sparkles,
  Gamepad2,
  Globe,
  Copy,
  Check,
  Play,
  Layers,
  Heart,
  Flame,
  Shield,
  Radio,
  Tv,
  Star,
  X,
  Crown,
  Share2,
  TrendingUp,
  Smartphone,
  Download,
  QrCode,
  Info,
  SlidersHorizontal,
  ThumbsUp,
  Activity,
  Cpu,
  BookOpen,
  Cloud,
  Zap,
  CheckCircle2,
  Send,
  MessageSquare
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { UserProfile } from "../types";

export interface ZeroZoneAppItem {
  id: string;
  packageId: string;
  title: string;
  url: string;
  category: "Visual Novels & RPG" | "Isekai Games" | "Utilities & AI Health" | "Mobile Portals" | "Cloud Gaming";
  tagline: string;
  description: string;
  highlights: string[];
  tags: string[];
  rating: number;
  reviewsCount: number;
  version: string;
  developer: string;
  iconBg: string;
  badge: string;
  accentColor: string;
  featured?: boolean;
}

export const ZERO_ZONE_MARK_APPS: ZeroZoneAppItem[] = [
  {
    id: "co-median-android-rdonnon",
    packageId: "co.median.android.rdonnon",
    title: "Zero Zone Anime Gateway",
    url: "https://play.google.com/store/apps/details?id=co.median.android.rdonnon",
    category: "Mobile Portals",
    tagline: "High-performance native Android gateway for Zero Zone & Isekai multiverse feeds.",
    description: "Experience ultra-fast loading, smooth touch gestures, push notifications, and offline caching for the Zero Zone and Isekai web multiverse. Optimized for modern Android smartphones and tablets.",
    highlights: [
      "Hardware-accelerated native WebView rendering",
      "Instant push notifications for live streams & events",
      "Offline caching engine for zero-lag wallpaper viewing",
      "Lightweight footprint (<15MB) with full tablet optimization"
    ],
    tags: ["ZeroZone", "Portal", "NativeApp", "Android", "WebView"],
    rating: 4.9,
    reviewsCount: 1420,
    version: "3.2.0",
    developer: "Zero Zone Mark Studio",
    iconBg: "from-emerald-500 to-teal-700",
    badge: "OFFICIAL GATEWAY",
    accentColor: "emerald",
    featured: true
  },
  {
    id: "isekai-world-vn",
    packageId: "isekai.world.vn",
    title: "Isekai World: Visual Novel",
    url: "https://play.google.com/store/apps/details?id=isekai.world.vn",
    category: "Visual Novels & RPG",
    tagline: "Epic interactive anime visual novel adventure with deep branching storylines.",
    description: "Awaken in a fantasy realm ruled by magical guilds, mystical spirits, and fierce rivals. Make fateful choices, unlock stunning HD CG artwork, and navigate romance and combat routes across multiple gripping endings.",
    highlights: [
      "Over 40+ hours of rich branching story paths",
      "High-definition anime character CG galleries",
      "Fully orchestrated fantasy OST soundtrack",
      "Multiple romance and action routes with secret endings"
    ],
    tags: ["VisualNovel", "Anime", "Fantasy", "StoryRich", "RPG"],
    rating: 4.8,
    reviewsCount: 2890,
    version: "2.4.1",
    developer: "Isekai Worlds Devs",
    iconBg: "from-pink-500 to-rose-700",
    badge: "BEST STORY",
    accentColor: "pink",
    featured: true
  },
  {
    id: "com-isekaiworldvn-part2",
    packageId: "com.isekaiworldvn.part2",
    title: "Isekai World VN: Part 2",
    url: "https://play.google.com/store/apps/details?id=com.isekaiworldvn.part2",
    category: "Visual Novels & RPG",
    tagline: "The climactic sequel featuring new companion routes, battle choices, and legendary lore.",
    description: "The journey continues in Part 2! Face greater perils as the multiverse rift widens. Unlock new companions, master mystical spells, unlock animated event sequences, and determine the fate of the parallel dimensions.",
    highlights: [
      "Expanded Chapter 2 narrative continuation",
      "New companion routes & interactive battle mechanics",
      "Enhanced full-screen CG artwork and audio voice lines",
      "Direct save transfer and legacy decision carrying"
    ],
    tags: ["VisualNovel", "Sequel", "AnimeRPG", "StoryChoices", "HDArt"],
    rating: 4.9,
    reviewsCount: 1980,
    version: "2.0.0",
    developer: "Isekai Worlds Devs",
    iconBg: "from-purple-600 to-indigo-800",
    badge: "NEW EXPANSION",
    accentColor: "purple",
    featured: true
  },
  {
    id: "com-aistudio-bioscan-weightheight",
    packageId: "com.aistudio.bioscan.weightheight",
    title: "BioScan AI: Weight & Height",
    url: "https://play.google.com/store/apps/details?id=com.aistudio.bioscan.weightheight",
    category: "Utilities & AI Health",
    tagline: "AI-assisted biometric scanner, BMI tracker, and gamified health companion.",
    description: "Empower your daily wellness with AI-driven biometric analysis! Track height, weight, BMI progression, hydration, and posture with gamified RPG quests and health level-ups.",
    highlights: [
      "Smart camera & sensor-assisted BMI calculations",
      "Gamified RPG wellness quests and daily XP rewards",
      "Visual growth & weight trend charts with goal tracking",
      "Privacy-focused 100% on-device health telemetry"
    ],
    tags: ["AIHealth", "BioScan", "Fitness", "BMITracker", "Wellness"],
    rating: 4.7,
    reviewsCount: 860,
    version: "1.5.8",
    developer: "AI Studio Health Labs",
    iconBg: "from-cyan-500 to-blue-700",
    badge: "AI POWERED",
    accentColor: "cyan"
  },
  {
    id: "isekai-worlds",
    packageId: "isekai.worlds",
    title: "Isekai Worlds: Multiverse Portal",
    url: "https://play.google.com/store/apps/details?id=isekai.worlds",
    category: "Mobile Portals",
    tagline: "The flagship official Android app connecting all Isekai multiverse stations.",
    description: "All-in-one companion for anime streaming feeds, 4K wallpapers, lofi radio, community chat, global leaderboards, and mini-games. Your pocket portal to the entire Isekai ecosystem.",
    highlights: [
      "Unified access to 25+ integrated Isekai portals",
      "Real-time synchronized global leaderboard & profile",
      "Built-in audio player with background playback support",
      "Customizable live wallpapers & theme accents"
    ],
    tags: ["IsekaiWorlds", "Multiverse", "AllInOne", "AnimeHub", "Radio"],
    rating: 5.0,
    reviewsCount: 3450,
    version: "4.1.0",
    developer: "Isekai Worlds Devs",
    iconBg: "from-violet-600 to-fuchsia-700",
    badge: "FLAGSHIP",
    accentColor: "violet",
    featured: true
  },
  {
    id: "io-gonative-android-bpjeky",
    packageId: "io.gonative.android.bpjeky",
    title: "Zero Zone GoNative Client",
    url: "https://play.google.com/store/apps/details?id=io.gonative.android.bpjeky",
    category: "Mobile Portals",
    tagline: "Ultra-low latency mobile engine with hardware graphics acceleration.",
    description: "Engineered for maximum frame rates and touch responsiveness. Features native shell execution, reduced memory consumption, and deep integration with mobile display refresh rates (up to 120Hz).",
    highlights: [
      "120Hz high refresh rate screen compatibility",
      "Ultra-low RAM consumption and battery conservation",
      "Instant offline shell fallback for zero connectivity drops",
      "Smooth hardware gesture navigation"
    ],
    tags: ["GoNative", "Performance", "LowLatency", "120Hz", "Mobile"],
    rating: 4.8,
    reviewsCount: 920,
    version: "2.1.4",
    developer: "Zero Zone Mark Studio",
    iconBg: "from-amber-500 to-orange-700",
    badge: "120HZ READY",
    accentColor: "amber"
  },
  {
    id: "com-isekaibunny-usagyuuunfantasy",
    packageId: "com.isekaibunny.usagyuuunfantasy",
    title: "Usagyuuun Fantasy: Isekai Bunny",
    url: "https://play.google.com/store/apps/details?id=com.isekaibunny.usagyuuunfantasy",
    category: "Isekai Games",
    tagline: "Chaotic high-energy arcade fantasy RPG starring the bouncy Usagyuuun bunny!",
    description: "Dash, bounce, and blast through hordes of comical fantasy monsters! Collect hilarious costumes, unleash over-the-top ultimate moves, and defeat quirky dungeon bosses in this chaotic arcade adventure.",
    highlights: [
      "Fast-paced bouncy arcade action & crazy boss encounters",
      "Dozens of collectible anime bunny outfits & accessories",
      "Combo multipliers and screen-clearing special attacks",
      "Offline play support with zero micro-transactions required"
    ],
    tags: ["Usagyuuun", "Arcade", "ActionRPG", "AnimeBunny", "Casual"],
    rating: 4.9,
    reviewsCount: 4120,
    version: "1.9.2",
    developer: "Isekai Bunny Interactive",
    iconBg: "from-yellow-400 to-amber-600",
    badge: "TOP FUN",
    accentColor: "yellow",
    featured: true
  },
  {
    id: "appinventor-ai-mdv4244-cloud-gaming-syrup",
    packageId: "appinventor.ai_mdv4244.Cloud_Gaming_Syrup",
    title: "Cloud Gaming Syrup",
    url: "https://play.google.com/store/apps/details?id=appinventor.ai_mdv4244.Cloud_Gaming_Syrup",
    category: "Cloud Gaming",
    tagline: "Fluid cloud gaming launcher, virtual controller overlay & game streamer.",
    description: "Stream and play retro ROMs, PC titles, and web-based games smoothly on any Android device. Features on-screen virtual gamepads, Bluetooth controller mapping, and ultra-responsive low-lag streaming.",
    highlights: [
      "Virtual customizable gamepad touch overlay",
      "Full Bluetooth and USB controller gamepad support",
      "Low-lag streaming engine with adaptive bitrate",
      "Multi-platform game launcher library"
    ],
    tags: ["CloudGaming", "Streamer", "Gamepad", "Retro", "Syrup"],
    rating: 4.8,
    reviewsCount: 1650,
    version: "2.3.0",
    developer: "Syrup Cloud Lab",
    iconBg: "from-red-500 to-rose-700",
    badge: "CLOUD READY",
    accentColor: "rose"
  }
];

interface ZeroZoneMarkAppsProps {
  onAddCoins?: (amount: number) => void;
  isGoldMode?: boolean;
  userProfile?: UserProfile;
}

export const ZeroZoneMarkApps: React.FC<ZeroZoneMarkAppsProps> = ({
  onAddCoins,
  isGoldMode = false,
  userProfile
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewApp, setPreviewApp] = useState<ZeroZoneAppItem | null>(null);
  const [qrApp, setQrApp] = useState<ZeroZoneAppItem | null>(null);
  const [likedApps, setLikedApps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("zero_zone_liked_apps");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("zero_zone_user_ratings");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [customReviews, setCustomReviews] = useState<Record<string, Array<{ author: string; text: string; date: string; stars: number }>>>(() => {
    try {
      const saved = localStorage.getItem("zero_zone_custom_reviews");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [reviewInput, setReviewInput] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const [exploredApps, setExploredApps] = useState<Record<string, boolean>>({});

  const categories = [
    "All",
    "Visual Novels & RPG",
    "Isekai Games",
    "Utilities & AI Health",
    "Mobile Portals",
    "Cloud Gaming"
  ];

  const handleCopyLink = (app: ZeroZoneAppItem) => {
    sfx.playClick();
    navigator.clipboard.writeText(app.url);
    setCopiedId(app.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleLike = (appId: string) => {
    sfx.playClick();
    const isNowLiked = !likedApps[appId];
    const updated = { ...likedApps, [appId]: isNowLiked };
    setLikedApps(updated);
    try {
      localStorage.setItem("zero_zone_liked_apps", JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (isNowLiked && onAddCoins) {
      onAddCoins(25);
    }
  };

  const handleRate = (appId: string, stars: number) => {
    sfx.playWarp();
    const updated = { ...userRatings, [appId]: stars };
    setUserRatings(updated);
    try {
      localStorage.setItem("zero_zone_user_ratings", JSON.stringify(updated));
    } catch {
      // Ignore
    }
    if (onAddCoins) {
      onAddCoins(30);
    }
  };

  const handleOpenPreview = (app: ZeroZoneAppItem) => {
    sfx.playWarp();
    setPreviewApp(app);
    if (!exploredApps[app.id]) {
      setExploredApps((prev) => ({ ...prev, [app.id]: true }));
      if (onAddCoins) {
        onAddCoins(50);
      }
    }
  };

  const handleOpenQr = (app: ZeroZoneAppItem) => {
    sfx.playClick();
    setQrApp(app);
  };

  const handleAddReview = (appId: string) => {
    if (!reviewInput.trim()) return;
    sfx.playClick();
    const newRev = {
      author: userProfile?.username || "Isekai Traveler",
      text: reviewInput.trim(),
      date: "Just now",
      stars: reviewStars
    };
    const currentList = customReviews[appId] || [];
    const updated = {
      ...customReviews,
      [appId]: [newRev, ...currentList]
    };
    setCustomReviews(updated);
    try {
      localStorage.setItem("zero_zone_custom_reviews", JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setReviewInput("");
    if (onAddCoins) {
      onAddCoins(100);
    }
  };

  const filteredApps = ZERO_ZONE_MARK_APPS.filter((app) => {
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.title.toLowerCase().includes(q) ||
      app.packageId.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.tagline.toLowerCase().includes(q) ||
      app.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-6 md:p-10 shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Official Android App Ecosystem</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300">
              Zero Zone Mark Apps
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Explore and launch verified Google Play Android applications and games from the Zero Zone Mark universe. Install directly on your smartphone, scan QR codes, or test app features in interactive sandbox mode.
            </p>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-3.5 text-center backdrop-blur-md shadow-lg">
              <div className="text-2xl font-black text-emerald-400">8 Apps</div>
              <div className="text-xs text-slate-400 font-medium">Google Play Store</div>
            </div>
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-3.5 text-center backdrop-blur-md shadow-lg">
              <div className="text-2xl font-black text-cyan-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Android Verified</div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-900/80 border border-purple-500/30 rounded-2xl p-3.5 text-center backdrop-blur-md shadow-lg">
              <div className="text-2xl font-black text-purple-400">+50 Coins</div>
              <div className="text-xs text-slate-400 font-medium">Per App Explored</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sfx.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps, package ID, tags..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 focus:border-cyan-400 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredApps.map((app) => {
          const isLiked = !!likedApps[app.id];
          const userStar = userRatings[app.id] || 0;
          const displayRating = userStar > 0 ? ((app.rating * 10 + userStar) / 11).toFixed(1) : app.rating.toFixed(1);

          return (
            <div
              key={app.id}
              className="group relative bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 hover:-translate-y-1 overflow-hidden"
            >
              {/* Glow Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all duration-500 pointer-events-none" />

              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* App Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.iconBg} p-0.5 shadow-lg shadow-black/40 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-slate-950/40 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                      <Smartphone className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                    {app.featured && (
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md">
                        <Crown className="w-3 h-3 fill-slate-950" />
                      </span>
                    )}
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleLike(app.id)}
                      title="Favorite App"
                      className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        isLiked
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleOpenQr(app)}
                      title="Scan QR Code"
                      className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Category & Badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 uppercase tracking-wider">
                    {app.badge}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {app.category}
                  </span>
                </div>

                {/* App Title */}
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors duration-200 line-clamp-1">
                  {app.title}
                </h3>

                {/* Package ID Chip */}
                <div className="mt-1.5 flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-400">
                  <span className="truncate max-w-[170px]" title={app.packageId}>
                    {app.packageId}
                  </span>
                  <button
                    onClick={() => handleCopyLink(app)}
                    title="Copy Package ID / URL"
                    className="ml-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer flex-shrink-0"
                  >
                    {copiedId === app.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Tagline / Description */}
                <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {app.tagline}
                </p>

                {/* Rating & Reviews */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="ml-1 font-bold text-slate-200">{displayRating}</span>
                    </div>
                    <span className="text-slate-500">({app.reviewsCount.toLocaleString()})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">v{app.version}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2 pt-2 border-t border-slate-800/80">
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sfx.playClick()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get on Google Play</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </a>

                <button
                  onClick={() => handleOpenPreview(app)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/50 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview & Info</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
          <Smartphone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Apps Found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or selecting a different category.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 hover:bg-emerald-500/30 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Interactive App Preview & Details Modal */}
      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/60 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                sfx.playClick();
                setPreviewApp(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${previewApp.iconBg} p-0.5 shadow-xl flex items-center justify-center flex-shrink-0`}>
                <div className="w-full h-full bg-slate-950/40 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {previewApp.badge}
                  </span>
                  <span className="text-xs text-slate-400">{previewApp.category}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{previewApp.title}</h2>
                <div className="text-xs font-mono text-cyan-400">{previewApp.packageId}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  App Overview
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{previewApp.description}</p>
              </div>

              {/* Highlights */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Key Features & Highlights
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {previewApp.highlights.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Version</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{previewApp.version}</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Rating</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">★ {previewApp.rating} / 5.0</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Reviews</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{previewApp.reviewsCount.toLocaleString()}+</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Developer</div>
                  <div className="text-xs font-bold text-cyan-300 truncate mt-0.5">{previewApp.developer}</div>
                </div>
              </div>

              {/* Interactive Rate This App */}
              <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">Rate this App:</span>
                  <span className="text-xs text-amber-400 font-medium">+30 Isekai Coins per rating</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(previewApp.id, star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (userRatings[previewApp.id] || 0) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  {userRatings[previewApp.id] && (
                    <span className="text-xs font-bold text-emerald-400 ml-2">
                      Rated {userRatings[previewApp.id]} / 5 Stars!
                    </span>
                  )}
                </div>
              </div>

              {/* Community Reviews Section */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  Leave a Traveler Review (+100 Coins)
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reviewInput}
                    onChange={(e) => setReviewInput(e.target.value)}
                    placeholder="Write your feedback or recommendation for this app..."
                    className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddReview(previewApp.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddReview(previewApp.id)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>

                {customReviews[previewApp.id] && customReviews[previewApp.id].length > 0 && (
                  <div className="mt-3 space-y-2 max-h-36 overflow-y-auto">
                    {customReviews[previewApp.id].map((rev, i) => (
                      <div key={i} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-bold text-cyan-300">{rev.author}</span>
                          <span className="text-amber-400">{"★".repeat(rev.stars)}</span>
                        </div>
                        <p className="text-slate-300">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
              <a
                href={previewApp.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sfx.playClick()}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Open in Google Play Store</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <button
                onClick={() => handleCopyLink(previewApp)}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === previewApp.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share App Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Scanner Modal */}
      {qrApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl shadow-emerald-950/60 text-center">
            <button
              onClick={() => {
                sfx.playClick();
                setQrApp(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
              <QrCode className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Scan to Install on Mobile</h3>
            <p className="text-xs text-slate-400 mb-4">{qrApp.title}</p>

            {/* QR Code Image Generation */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrApp.url)}`}
                alt={`QR Code for ${qrApp.title}`}
                className="w-44 h-44 object-contain"
              />
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Point your smartphone camera at this QR code to open the Google Play Store page directly on your device.
            </p>

            <a
              href={qrApp.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playClick()}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Direct Link to Store</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
