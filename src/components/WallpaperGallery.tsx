import React, { useEffect, useState } from "react";
import { AnimeWallpaper, UserProfile } from "../types";
import { CommentSection } from "./CommentSection";
import { InteractiveZoomPanImage } from "./InteractiveZoomPanImage";
import { sfx } from "../utils/sfx";
import { fetchWallpapersApi } from "../utils/api";
import { db } from "../lib/firebase";
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
import {
  Image as ImageIcon,
  Search,
  Download,
  Heart,
  Eye,
  Sparkles,
  Check,
  Tag,
  Maximize2,
  X,
  Compass,
  Layout,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Layers,
  History,
  Trash2,
  Clock,
  ArrowRight
} from "lucide-react";

interface WallpaperGalleryProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  onAddCoins?: (amount: number) => void;
  isGoldMode?: boolean;
}

export const WallpaperGallery: React.FC<WallpaperGalleryProps> = ({
  profile,
  updateProfile,
  onAddCoins,
  isGoldMode = false,
}) => {
  const [wallpapers, setWallpapers] = useState<AnimeWallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [activePreview, setActivePreview] = useState<AnimeWallpaper | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appliedBannerId, setAppliedBannerId] = useState<string | null>(null);

  // Real-time Firestore synchronization for saved wallpapers
  useEffect(() => {
    if (!profile?.id) return;
    const favsRef = collection(db, "saved_wallpapers");
    const qFavs = query(favsRef, where("userId", "==", profile.id));

    const unsubscribe = onSnapshot(qFavs, (snapshot) => {
      const list: string[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        if (d.wallpaperId) list.push(d.wallpaperId);
      });
      setFavorites(list);
    }, (err) => {
      console.warn("Firestore saved_wallpapers sync error:", err);
    });

    return () => unsubscribe();
  }, [profile?.id]);

  // Search History Drawer State & LocalStorage
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("wallpaper_search_history");
      return saved ? JSON.parse(saved) : ["Gojo 4K", "Solo Leveling", "Cyberpunk", "Isekai Fantasy", "Demon Slayer"];
    } catch {
      return ["Gojo 4K", "Solo Leveling", "Cyberpunk", "Isekai Fantasy", "Demon Slayer"];
    }
  });

  // Save history helper
  const addSearchToHistory = (queryStr: string) => {
    const trimmed = queryStr.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("wallpaper_search_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save search history to localStorage", e);
      }
      return updated;
    });
  };

  const removeSearchHistoryItem = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playClick();
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove);
      try {
        localStorage.setItem("wallpaper_search_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save search history to localStorage", e);
      }
      return updated;
    });
  };

  const clearAllSearchHistory = () => {
    sfx.playClick();
    setSearchHistory([]);
    try {
      localStorage.removeItem("wallpaper_search_history");
    } catch (e) {
      console.warn("Failed to clear search history from localStorage", e);
    }
  };

  // Pagination states for unlimited pages
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  const providers = [
    { id: "all", name: "All 4K Engines", icon: "🌌", desc: "nekos.best • waifu.im • waifu.pics • anilist" },
    { id: "nekos.best", name: "Nekos.best", icon: "🐾", desc: "High-res anime illustrations & neko art" },
    { id: "waifu.im", name: "Waifu.im (4K)", icon: "✨", desc: "Ultra-HD 4K Waifu & character visuals" },
    { id: "waifu.pics", name: "Waifu.pics", icon: "🌸", desc: "Anime aesthetics, reactions & characters" },
    { id: "anilist", name: "AniList", icon: "🎬", desc: "Official anime series 4K banners & key art" }
  ];

  const categories = ["all", "Waifu", "Neko", "Isekai", "Fantasy", "Sci-Fi", "Landscape", "Dark Fantasy"];

  useEffect(() => {
    // Reset page and queries to 1 on category or provider change
    setCurrentPage(1);
    fetchWallpapers(selectedCategory, 1, activeSearchTerm, selectedProvider, false);
  }, [selectedCategory, selectedProvider]);

  const fetchWallpapers = async (
    cat: string,
    pageNum: number,
    queryStr = "",
    providerStr = "all",
    append = false
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const wallpapersList = await fetchWallpapersApi(cat, pageNum, queryStr, providerStr);

      if (wallpapersList && wallpapersList.length > 0) {
        if (append) {
          // Filter out duplicates by id
          setWallpapers((prev) => {
            const existingIds = new Set(prev.map((w) => w.id));
            const newOnes = wallpapersList.filter((w: AnimeWallpaper) => !existingIds.has(w.id));
            return [...prev, ...newOnes];
          });
        } else {
          setWallpapers(wallpapersList);
        }
        setHasMorePages(true);
      } else if (!append) {
        setWallpapers([]);
      }
    } catch (err) {
      console.error("Error fetching wallpapers:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearchSubmit = (queryStr: string) => {
    const trimmed = queryStr.trim();
    setCurrentPage(1);
    setActiveSearchTerm(trimmed);
    addSearchToHistory(trimmed);
    fetchWallpapers(selectedCategory, 1, trimmed, selectedProvider, false);
  };

  const scrollToGalleryTop = () => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleNextPage = () => {
    sfx.playWarp();
    const nextP = currentPage + 1;
    setCurrentPage(nextP);
    fetchWallpapers(selectedCategory, nextP, activeSearchTerm, selectedProvider, false);
    scrollToGalleryTop();
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    sfx.playClick();
    const prevP = currentPage - 1;
    setCurrentPage(prevP);
    fetchWallpapers(selectedCategory, prevP, activeSearchTerm, selectedProvider, false);
    scrollToGalleryTop();
  };

  const handleJumpToPage = (p: number) => {
    sfx.playClick();
    setCurrentPage(p);
    fetchWallpapers(selectedCategory, p, activeSearchTerm, selectedProvider, false);
    scrollToGalleryTop();
  };

  const handleLoadMoreAppend = () => {
    sfx.playWarp();
    const nextP = currentPage + 1;
    setCurrentPage(nextP);
    fetchWallpapers(selectedCategory, nextP, activeSearchTerm, selectedProvider, true);
  };

  const getProviderBadge = (provider?: string) => {
    const p = (provider || "").toLowerCase();
    if (p.includes("nekos")) {
      return { label: "nekos.best", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    }
    if (p.includes("waifu.im") || p.includes("waifuim")) {
      return { label: "waifu.im 4K", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
    }
    if (p.includes("waifu.pics") || p.includes("waifupics")) {
      return { label: "waifu.pics", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    }
    if (p.includes("anilist")) {
      return { label: "AniList 4K", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
    }
    return { label: "Anime 4K", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" };
  };

  const toggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    if (!profile?.id) return;

    const wp = wallpapers.find((w) => w.id === id);
    if (!wp) return;

    const favoriteDocId = `${profile.id}_${wp.id}`;
    const docRef = doc(db, "saved_wallpapers", favoriteDocId);

    const isFav = favorites.includes(id);

    try {
      if (isFav) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          userId: profile.id,
          username: profile.username || "Voyager",
          wallpaperId: wp.id,
          wallpaperTitle: wp.title || "Anime Art",
          url: wp.url,
          thumb: wp.thumb || wp.url,
          createdAt: serverTimestamp()
        });
        if (onAddCoins) onAddCoins(10);
      }
    } catch (err) {
      console.error("Failed to sync wallpaper favorite with Firestore:", err);
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const handleSetAsBanner = (wallpaper: AnimeWallpaper, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.playBadgeUnlock();
    updateProfile({ bannerUrl: wallpaper.url });
    setAppliedBannerId(wallpaper.id);
    setTimeout(() => setAppliedBannerId(null), 2500);
  };

  const filtered = wallpapers;

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>UNLIMITED ANIME 4K WALLPAPER ENGINE • PAGE {currentPage}</span>
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            4K UHD Anime Wallpaper Gallery
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-source 4K Ultra-HD anime wallpapers aggregated directly from <strong className="text-emerald-300">nekos.best</strong>, <strong className="text-rose-300">waifu.im</strong>, <strong className="text-amber-300">waifu.pics</strong>, and <strong className="text-cyan-300">AniList GraphQL</strong> with infinite pagination and dynamic filtering.
          </p>
        </div>
      </div>

      {/* 4K Wallpaper API Provider Engine Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Select 4K Wallpaper Source Engine:
          </span>
          <span className="text-[11px] text-slate-500">Live API Feeds</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {providers.map((p) => {
            const isSelected = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  sfx.playClick();
                  setSelectedProvider(p.id);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-slate-900 border-purple-400 shadow-lg shadow-purple-950/60 ring-1 ring-purple-400/50"
                    : "bg-slate-900/80 border-indigo-500/20 hover:border-purple-500/40 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">{p.icon}</span>
                  {isSelected && (
                    <span className="px-1.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/60 text-[9px] font-mono text-purple-200 font-bold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-white tracking-wide">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                    {p.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar: Category Pills & Search & Pagination Quick Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sfx.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-md shadow-purple-900/50"
                    : "bg-slate-900/80 text-slate-400 hover:text-white border border-indigo-500/20"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Field & History Drawer Toggle Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              handleSearchSubmit(searchQuery);
            }
          }}
          className="flex flex-wrap items-center gap-2 min-w-[280px]"
        >
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anime, characters, waifus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-indigo-500/30 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-md shadow-purple-900/50 whitespace-nowrap"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setIsHistoryOpen(!isHistoryOpen);
            }}
            className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isHistoryOpen || searchHistory.length > 0
                ? "bg-purple-900/60 border-purple-400 text-purple-200 shadow-lg shadow-purple-900/30"
                : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title="Open Recent Search History Drawer"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">History</span>
            {searchHistory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500 text-[10px] text-white font-bold">
                {searchHistory.length}
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Recent Search History Drawer / Sidebar */}
      {isHistoryOpen && (
        <div className="p-5 rounded-2xl bg-slate-900/95 border border-purple-500/30 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Recent Wallpaper Searches (Saved in LocalStorage)
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {searchHistory.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllSearchHistory}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-mono flex items-center gap-1 transition-colors"
                  title="Clear All History"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {searchHistory.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono italic">No recent searches saved yet.</p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {searchHistory.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    sfx.playClick();
                    setSearchQuery(item);
                    setIsHistoryOpen(false);
                    handleSearchSubmit(item);
                  }}
                  className="group cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-purple-900/60 border border-indigo-500/20 hover:border-purple-400 text-xs font-mono text-slate-200 hover:text-white transition-all shadow"
                >
                  <Search className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={(e) => removeSearchHistoryItem(item, e)}
                    className="p-0.5 rounded-md hover:bg-rose-500/30 text-slate-400 hover:text-rose-300"
                    title="Remove item"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination Top Indicator Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Showing <strong className="text-cyan-300">{filtered.length}</strong> wallpapers on <strong className="text-rose-400">Page {currentPage}</strong></span>
        </div>

        {/* Endless Page Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
            <button
              key={p}
              onClick={() => handleJumpToPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                currentPage === p
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/30 border border-purple-400"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {p}
            </button>
          ))}

          <span className="text-slate-500 font-mono text-xs px-1">...</span>

          <button
            onClick={handleNextPage}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 px-2 text-xs font-mono font-bold"
            title="Next Page"
          >
            <span>Page {currentPage + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wallpapers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="aspect-video rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
          No wallpapers found matching "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((wp) => {
            const isFav = favorites.includes(wp.id);
            const isApplied = appliedBannerId === wp.id;

            return (
              <div
                key={wp.id}
                onClick={() => {
                  sfx.playClick();
                  setActivePreview(wp);
                }}
                onMouseEnter={() => sfx.playHover()}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900 border border-indigo-500/20 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={wp.thumb}
                    alt={wp.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (e.currentTarget.src !== "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80") {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Resolution & Source Badge */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10 max-w-[80%]">
                    {(() => {
                      const badge = getProviderBadge(wp.sourceProvider);
                      return (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border backdrop-blur-md shadow ${badge.color}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/85 border border-purple-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                      {wp.resolution}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(wp.id, e)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-950/80 border border-purple-500/30 text-rose-400 hover:scale-110 transition-transform"
                    title="Favorite Wallpaper"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {wp.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {wp.tags.slice(0, 3).map((t) => (
                        <button
                          key={t}
                          onClick={(e) => {
                            e.stopPropagation();
                            sfx.playClick();
                            setSearchQuery(t);
                            addSearchToHistory(t);
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-purple-950 border border-transparent hover:border-purple-500/40 text-[10px] font-mono text-slate-300 hover:text-purple-300 transition-all cursor-pointer"
                          title={`Search thumbnails tagged #${t}`}
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => handleSetAsBanner(wp, e)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-[11px] font-mono flex items-center gap-1 transition-colors"
                      title="Set as Profile Cover Banner"
                    >
                      <Layout className="w-3 h-3 text-purple-400" />
                      <span>{isApplied ? "Applied!" : "Set Banner"}</span>
                    </button>

                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-cyan-400" />
                      Preview
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll & Pagination Footer Controls */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl">
          <div className="text-xs font-mono text-slate-400">
            Current Page: <strong className="text-cyan-300">Page {currentPage}</strong> • Loaded: <strong className="text-purple-300">{filtered.length} wallpapers</strong>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLoadMoreAppend}
              disabled={loadingMore}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/40 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingMore ? "animate-spin" : ""}`} />
              <span>{loadingMore ? "Loading Page..." : `⚡ Load More Wallpapers (Append Page ${currentPage + 1})`}</span>
            </button>

            <button
              onClick={handleNextPage}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-indigo-500/30 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Next Page ({currentPage + 1})</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      )}

      {/* Wallpaper Fullscreen Modal Preview */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{activePreview.title}</h3>
                  {(() => {
                    const badge = getProviderBadge(activePreview.sourceProvider);
                    return (
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs font-mono text-cyan-400">
                  Category: {activePreview.category} • Resolution: {activePreview.resolution} • Source: {activePreview.author}
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playClick();
                  setActivePreview(null);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <InteractiveZoomPanImage
                src={activePreview.url}
                alt={activePreview.title}
                className="w-full aspect-video min-h-[280px] sm:min-h-[400px]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                {activePreview.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-purple-300">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSetAsBanner(activePreview)}
                  className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Layout className="w-4 h-4 text-purple-400" />
                  <span>Set Profile Banner</span>
                </button>

                <a
                  href={activePreview.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-900/50 hover:scale-105 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4K Art</span>
                </a>
              </div>
            </div>

            {/* Comment Section for specific Wallpaper */}
            <div className="pt-4 border-t border-slate-800">
              <CommentSection
                targetId={`wp-${activePreview.id}`}
                targetTitle={activePreview.title}
                userProfile={profile}
                onAddCommentCoins={onAddCoins}
                isGoldMode={isGoldMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Wallpapers Discussion Section */}
      <div className="pt-8 border-t border-indigo-500/20">
        <CommentSection
          targetId="gallery-wallpapers-general"
          targetTitle="4K UHD Anime Wallpapers Hub"
          userProfile={profile}
          onAddCommentCoins={onAddCoins}
          isGoldMode={isGoldMode}
        />
      </div>
    </div>
  );
};
