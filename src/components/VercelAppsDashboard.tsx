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
  ThumbsUp
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { db } from "../lib/firebase";
import { UTubePlatform } from "./UTubePlatform";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

interface VercelAppItem {
  id: string;
  title: string;
  url: string;
  category: "Games" | "Rhythm" | "Gacha" | "Media & VTuber" | "Utilities";
  description: string;
  tags: string[];
  thumbnail: string;
  featured?: boolean;
}

const VERCEL_APPS: VercelAppItem[] = [
  {
    id: "kawaii-dash",
    title: "Kawaii Dash",
    url: "https://kawaiidash.vercel.app/",
    category: "Games",
    description: "Fast-paced rhythm-infused runner game featuring colorful anime aesthetic and high-speed obstacle dodging.",
    tags: ["Runner", "Anime", "Action"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fkawaiidash.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  },
  {
    id: "idol-diva",
    title: "Idol DIVA",
    url: "https://idoldiva.vercel.app/",
    category: "Rhythm",
    description: "Virtual idol stage performance and music rhythm game where you guide top pop stars to stardom.",
    tags: ["Idol", "Music", "Rhythm"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fidoldiva.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  },
  {
    id: "elfe-health",
    title: "Elfe Game",
    url: "https://elfegame.vercel.app/",
    category: "Utilities",
    description: "Interactive health and wellness RPG companion tracking daily vitality, hydration, and fitness quests.",
    tags: ["Health", "RPG", "Wellness"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Felfegame.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "bullet-gyuuun-party",
    title: "Bullet Gyuuun Party",
    url: "https://bulletgyuuunparty.vercel.app/",
    category: "Games",
    description: "Intense bullet-hell party arcade action with chaotic bullet patterns and multiplayer arcade flair.",
    tags: ["Arcade", "Bullet Hell", "Action"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fbulletgyuuunparty.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "fat-prince-gyuuun",
    title: "Fat Prince Gyuuun",
    url: "https://fatprincegyuuun.vercel.app/",
    category: "Games",
    description: "Whimsical royalty adventure game featuring humorous physics, castle escapades, and puzzle platforming.",
    tags: ["Platformer", "Adventure", "Comedy"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Ffatprincegyuuun.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "otk-realms",
    title: "OTK Realms",
    url: "https://otkrealms.vercel.app/",
    category: "Games",
    description: "Immersive fantasy tactical realm strategy game with guild management, dungeon raids, and epic loot.",
    tags: ["Fantasy", "Strategy", "RPG"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fotkrealms.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  },
  {
    id: "digital-circus-rl",
    title: "The Amazing Digital Circus RL",
    url: "https://theamazingdigitalcircusrl.vercel.app/",
    category: "Media & VTuber",
    description: "Surreal digital circus simulation and interactive mini-game world inspired by virtual madness.",
    tags: ["Simulation", "Circus", "Interactive"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Ftheamazingdigitalcircusrl.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  },
  {
    id: "stickman-world-fighters",
    title: "Stickman World Fighters",
    url: "https://stickmanwf.vercel.app/",
    category: "Games",
    description: "Action-packed stickman martial arts fighting tournament with combo strikes and special super moves.",
    tags: ["Fighting", "Stickman", "Action"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fstickmanwf.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "anime-card-gacha-battle",
    title: "Anime Card Gacha Battle",
    url: "https://mobile-anime-card-gacha-battle.vercel.app/",
    category: "Gacha",
    description: "Mobile-optimized anime card summoner and deck builder with legendary hero gacha pulls.",
    tags: ["Gacha", "Cards", "Anime"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fmobile-anime-card-gacha-battle.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  },
  {
    id: "3-cups-1-rice",
    title: "3 Cups 1 Rice",
    url: "https://3cups1rice.vercel.app/",
    category: "Games",
    description: "Deceptively challenging cup-swapping puzzle game with culinary speed runs and logic challenges.",
    tags: ["Puzzle", "Strategy", "Casual"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2F3cups1rice.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "cortisol-gacha",
    title: "Cortisol Gacha",
    url: "https://cortisolgacha.vercel.app/",
    category: "Gacha",
    description: "Stress-relief gacha simulator and emotional soothing pull machine for mental relaxation.",
    tags: ["Relax", "Gacha", "Casual"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fcortisolgacha.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "uma-station",
    title: "Uma Station",
    url: "https://umastation.vercel.app/",
    category: "Games",
    description: "Uma Musume trainer hub and stat optimization station for championship race preparation.",
    tags: ["Uma Musume", "Hub", "Training"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fumastation.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "astra-cinema",
    title: "Astra Cinema",
    url: "https://astracinema.vercel.app/",
    category: "Media & VTuber",
    description: "Cinematic anime movie and video streaming portal with synchronized playback rooms.",
    tags: ["Streaming", "Cinema", "Anime"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fastracinema.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "uma-derby-slots",
    title: "Uma Derby Slots",
    url: "https://umaderbyslot.vercel.app/",
    category: "Games",
    description: "High-stakes horse racing themed slot machine and arcade mini-game center.",
    tags: ["Slots", "Arcade", "Uma Derby"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fumaderbyslot.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "space-invaders-3d",
    title: "Space Invaders Extreme 3D",
    url: "https://spaceinvadersextreme3d.vercel.app/",
    category: "Games",
    description: "Immersive 3D modernized retro space shooter with neon particle explosions and boss battles.",
    tags: ["Retro", "3D", "Shooter"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fspaceinvadersextreme3d.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "beatstation",
    title: "BeatStation",
    url: "https://beatstation-eta.vercel.app/",
    category: "Rhythm",
    description: "Electronic music beatmaker and live DJ studio for creating infectious rhythm loops.",
    tags: ["Music", "DJ", "Beatmaker"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fbeatstation-eta.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  },
  {
    id: "miku-diva-explorer",
    title: "Miku DIVA ExploReR",
    url: "https://miku-diva-explorer.vercel.app/",
    category: "Media & VTuber",
    description: "Comprehensive Hatsune Miku song module and concert model viewer explorer.",
    tags: ["Miku", "Vocaloid", "Explorer"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fmiku-diva-explorer.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "anime-battle-frontier",
    title: "ANIME Battle FRONTIER",
    url: "https://animebattlefrontier.vercel.app/",
    category: "Games",
    description: "All-star anime crossover fighting arena with legendary shonen combatants.",
    tags: ["Crossover", "Fighting", "Action"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fanimebattlefrontier.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "djmix-love-v",
    title: "DJMIX Love V",
    url: "https://djmixlovev.vercel.app/",
    category: "Rhythm",
    description: "Romantic visual novel and love-themed DJ audio mixing experience.",
    tags: ["DJ", "Romance", "Audio"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fdjmixlovev.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "djmix-replica",
    title: "DJMIX REPLICA",
    url: "https://djmixreplica.vercel.app/",
    category: "Rhythm",
    description: "Professional turntable and audio crossfader simulator for live DJ mixing sets.",
    tags: ["DJ", "Turntable", "Music"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fdjmixreplica.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "aether3",
    title: "AETHER3 a Millenia Tic-tac-Toe",
    url: "https://aether3.vercel.app/",
    category: "Games",
    description: "Futuristic sci-fi multi-dimensional Tic-tac-toe puzzle strategy game.",
    tags: ["Puzzle", "Strategy", "Sci-Fi"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Faether3.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "tamagotchi-usagyuun",
    title: "TAMAGOTCHI ft. UsagyuunVTuber",
    url: "https://tamagotchiuvt.vercel.app/",
    category: "Media & VTuber",
    description: "Interactive virtual pet companion featuring the energetic Usagyuun VTuber mascot.",
    tags: ["Tamagotchi", "VTuber", "Pet"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Ftamagotchiuvt.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  },
  {
    id: "celestial-bible-reader",
    title: "Celestial BIBLE Reader",
    url: "https://celestialbiblereader.vercel.app/",
    category: "Utilities",
    description: "Beautiful ethereal digital Scripture reader with celestial ambiance and daily devotionals.",
    tags: ["Reader", "Spiritual", "Utility"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fcelestialbiblereader.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "usagyuuun-movie-1",
    title: "Usagyuuun Story Telling Movie 1",
    url: "https://usagyuuunmovie1.vercel.app/",
    category: "Media & VTuber",
    description: "Animated short story and interactive cinematic movie starring Usagyuuun.",
    tags: ["Movie", "Animation", "Usagyuuun"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fusagyuuunmovie1.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url"
  },
  {
    id: "anime-master-duelist",
    title: "ANIME MASTER DUELIST",
    url: "https://animemasterduelist.vercel.app/",
    category: "Games",
    description: "Ultimate trading card game duelist arena for supreme anime card battles.",
    tags: ["TCG", "Cards", "Duel"],
    thumbnail: "https://api.microlink.io/?url=https%3A%2F%2Fanimemasterduelist.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
    featured: true
  }
];

interface VercelAppsDashboardProps {
  userProfile?: any;
  onAddCoins?: (amount: number, reason: string) => void;
  isGoldMode?: boolean;
}

export const VercelAppsDashboard: React.FC<VercelAppsDashboardProps> = ({
  userProfile,
  onAddCoins,
  isGoldMode = false
}) => {
  const [activeTab, setActiveTab] = useState<"Apps" | "Favorites" | "UTube">("Apps");
  
  // Separate search fields for high-fidelity searching of games and general apps
  const [gameSearchQuery, setGameSearchQuery] = useState("");
  const [appSearchQuery, setAppSearchQuery] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewApp, setPreviewApp] = useState<VercelAppItem | null>(null);
  
  // Real-time Firestore-synced Favorites
  const [favorites, setFavorites] = useState<string[]>([]);
  // Real-time Firestore-synced Global star popularity rankings
  const [globalFavCounts, setGlobalFavCounts] = useState<Record<string, number>>({});

  // Dynamic state fallback for userProfile
  const [localProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("isekai_user_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: "u-anon-" + Math.random().toString(36).substring(2, 8),
      username: "Isekai Voyager",
      avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=voyager"
    };
  });
  
  const activeProfile = userProfile || localProfile;

  // Real-time user favorites subscription
  useEffect(() => {
    if (!activeProfile?.id) return;
    
    const favsRef = collection(db, "favorites");
    const qFavs = query(favsRef, where("userId", "==", activeProfile.id));

    const unsubscribe = onSnapshot(qFavs, (snapshot) => {
      const list: string[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        if (d.appId) list.push(d.appId);
      });
      setFavorites(list);
    }, (err) => {
      console.warn("Firestore favorites fetch error:", err);
    });

    return () => unsubscribe();
  }, [activeProfile?.id]);

  // Real-time global app stars sync for all profiles and users
  useEffect(() => {
    const favsRef = collection(db, "favorites");
    const unsubscribe = onSnapshot(favsRef, (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.forEach((doc) => {
        const d = doc.data();
        if (d.appId) {
          counts[d.appId] = (counts[d.appId] || 0) + 1;
        }
      });
      setGlobalFavCounts(counts);
    }, (err) => {
      console.warn("Firestore global favorites sync error:", err);
    });

    return () => unsubscribe();
  }, []);

  const categories = ["All", "Games", "Rhythm", "Gacha", "Media & VTuber", "Utilities"];

  // Toggle favorite in Firestore
  const toggleFavorite = async (app: VercelAppItem) => {
    sfx.playClick();
    if (!activeProfile?.id) return;

    const favoriteDocId = `${activeProfile.id}_${app.id}`;
    const docRef = doc(db, "favorites", favoriteDocId);

    const isFav = favorites.includes(app.id);

    try {
      if (isFav) {
        // Remove favorite
        await deleteDoc(docRef);
      } else {
        // Add favorite
        await setDoc(docRef, {
          userId: activeProfile.id,
          username: activeProfile.username,
          appId: app.id,
          appTitle: app.title,
          createdAt: serverTimestamp()
        });
        if (onAddCoins) onAddCoins(15, `Starred App: ${app.title} (+15 Coins)`);
      }
    } catch (err) {
      console.error("Failed to sync favorite with Firestore:", err);
      // Fallback local toggle to ensure user interaction succeeds
      setFavorites(prev => 
        prev.includes(app.id) ? prev.filter(id => id !== app.id) : [...prev, app.id]
      );
    }
  };

  const handleCopyLink = (app: VercelAppItem) => {
    sfx.playClick();
    navigator.clipboard.writeText(app.url);
    setCopiedId(app.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Build high quality search filtering for separate games and apps
  const getFilteredApps = () => {
    return VERCEL_APPS.filter((app) => {
      // 1. Category check
      const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;

      // 2. Tab condition
      const isFavoriteTab = activeTab === "Favorites";
      const matchesTab = !isFavoriteTab || favorites.includes(app.id);

      // 3. Search query depending on whether the app is a Game (Games, Rhythm, Gacha) or a General App
      const isGame = ["Games", "Rhythm", "Gacha"].includes(app.category);
      const queryText = isGame ? gameSearchQuery : appSearchQuery;
      
      const matchesSearch =
        !queryText.trim() ||
        app.title.toLowerCase().includes(queryText.toLowerCase()) ||
        app.description.toLowerCase().includes(queryText.toLowerCase()) ||
        app.tags.some((t) => t.toLowerCase().includes(queryText.toLowerCase()));

      return matchesCategory && matchesTab && matchesSearch;
    });
  };

  // Create real-time dynamic global popularity rankings list
  const getRankedApps = () => {
    return [...VERCEL_APPS]
      .map(app => ({
        ...app,
        stars: globalFavCounts[app.id] || 0
      }))
      .filter(app => app.stars > 0)
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 5);
  };

  const filteredApps = getFilteredApps();
  const rankedApps = getRankedApps();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Globe className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "10s" }} />
              <span>Verified Ecosystem Hub ({VERCEL_APPS.length} Vercel Apps)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-2">
              Vercel APPs & Games Library
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore and launch connected Vercel applications, rhythm games, and gacha simulators. Real-time stars and synced favorites are active for all creators!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl backdrop-blur-md">
            <div className="p-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black text-white block font-mono">{VERCEL_APPS.length}</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Active Deployments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        {(["Apps", "Favorites", "UTube"] as const).map(tab => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                sfx.playClick();
                setActiveTab(tab);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 scale-105"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab === "UTube" ? "📡 UTube Platform" : tab === "Favorites" ? "⭐ My Favorites" : "🎮 All Apps & Games"}
            </button>
          );
        })}
      </div>

      {activeTab === "UTube" ? (
        /* Real UTube platform seamlessly rendered inside this tab! */
        <UTubePlatform userProfile={activeProfile} onAddCoins={onAddCoins} isGoldMode={isGoldMode} />
      ) : (
        <>
          {/* Controls & Search Bar & Live Star Rankings Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left 3 Columns: Grid and Filters */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        sfx.playClick();
                        setSelectedCategory(cat);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/40 scale-105"
                          : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Highly High-Quality Search inputs separated by Games and Apps */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Game-specific Search */}
                  <div className="relative min-w-[200px]">
                    <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      placeholder="Search games..."
                      value={gameSearchQuery}
                      onChange={(e) => setGameSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  {/* General App Search */}
                  <div className="relative min-w-[200px]">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      placeholder="Search utilities..."
                      value={appSearchQuery}
                      onChange={(e) => setAppSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Apps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApps.map((app) => {
                  const isFav = favorites.includes(app.id);
                  const totalStars = globalFavCounts[app.id] || 0;

                  return (
                    <div
                      key={app.id}
                      className="group relative bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-400/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                    >
                      {/* Thumbnail Header */}
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <iframe
                          src={app.url}
                          title={app.title}
                          className="w-[133.33%] h-[133.33%] border-0 pointer-events-none scale-75 origin-top-left opacity-80 group-hover:opacity-100 transition-opacity"
                          sandbox="allow-scripts allow-same-origin"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>

                        {/* Star/Favorite Trigger */}
                        <button
                          onClick={() => toggleFavorite(app)}
                          className={`absolute top-3 left-3 p-2 rounded-xl bg-slate-950/85 hover:scale-110 active:scale-95 text-slate-300 hover:text-amber-400 z-20 transition-all flex items-center gap-1.5 border border-slate-800 ${
                            isFav ? "text-amber-400 border-amber-500/30" : ""
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                          <span className="text-[10px] font-mono font-bold text-white">{totalStars}</span>
                        </button>

                        {app.featured && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[9px] tracking-wider uppercase shadow-lg flex items-center gap-1 font-mono z-10 border border-amber-600">
                            <Sparkles className="w-3 h-3 fill-slate-950" />
                            Featured
                          </span>
                        )}

                        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-indigo-400/30 text-indigo-300 font-mono text-[9px] uppercase font-bold tracking-wider z-10">
                          {app.category}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                            {app.title}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {app.description}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {app.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700/60 text-[9px] font-mono text-slate-300"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-850 flex items-center gap-2">
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => sfx.playClick()}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-1.5 transition-all text-center"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Launch App</span>
                          </a>

                          <button
                            onClick={() => handleCopyLink(app)}
                            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
                            title="Copy Vercel Link"
                          >
                            {copiedId === app.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              sfx.playClick();
                              setPreviewApp(app);
                            }}
                            className="p-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40 transition-all cursor-pointer"
                            title="Quick Embed Preview"
                          >
                            <Tv className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredApps.length === 0 && (
                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
                  <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-white">No Vercel Apps Found</h3>
                  <p className="text-xs text-slate-400">Try searching for a different keyword or category filter.</p>
                </div>
              )}
            </div>

            {/* Right Column: Global Popularity Rankings Sync Board */}
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-indigo-500/30 p-5 rounded-3xl space-y-4 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                    Global Star Rankings
                  </h3>
                </div>
                
                <p className="text-[10px] text-slate-400 leading-normal font-sans">
                  The most starred Vercel games and utilities across all isekai travelers and creator profiles!
                </p>

                <div className="space-y-3 pt-1">
                  {rankedApps.length === 0 ? (
                    <p className="text-center text-[10px] text-slate-600 font-mono py-6">
                      No stars logged yet. Be the first to star an app!
                    </p>
                  ) : (
                    rankedApps.map((app, index) => {
                      const medalColors = ["text-amber-400", "text-slate-300", "text-amber-600"];
                      return (
                        <div key={app.id} className="flex items-center justify-between gap-2 p-2 bg-slate-950/60 rounded-xl border border-slate-850">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`font-mono text-xs font-black w-5 text-center ${medalColors[index] || "text-slate-500"}`}>
                              #{index + 1}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-[11px] font-bold text-white truncate">{app.title}</h4>
                              <span className="text-[9px] text-indigo-400 font-mono uppercase font-bold">{app.category}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{app.stars}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bible Quote Accent Box */}
              <div className="p-5 bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-slate-850 rounded-3xl space-y-2">
                <h4 className="text-[10px] font-mono text-rose-300 font-black uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Celestial Word
                </h4>
                <p className="text-[10px] text-slate-300 leading-relaxed font-sans italic">
                  "Delight yourself also in the Lord, and He shall give you the desires of your heart." — Psalm 37:4
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Embedded Iframe Preview Modal */}
      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-indigo-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎮</span>
                <div>
                  <h3 className="text-sm font-black text-white">{previewApp.title}</h3>
                  <span className="text-[10px] font-mono text-cyan-400 truncate block max-w-md">{previewApp.url}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Tab</span>
                </a>
                <button
                  onClick={() => {
                    sfx.playClick();
                    setPreviewApp(null);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 relative bg-black">
              <iframe
                src={previewApp.url}
                title={previewApp.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
