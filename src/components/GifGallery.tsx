import React, { useEffect, useState } from "react";
import { AnimeGif } from "../types";
import { sfx } from "../utils/sfx";
import {
  Film,
  Search,
  Sparkles,
  Download,
  Copy,
  Check,
  Heart,
  Share2,
  RefreshCw,
  ExternalLink,
  Layers,
  History,
  Clock,
  Trash2,
  X,
  Flame,
  Zap,
  Play,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from "lucide-react";

const CATEGORIES = [
  "ALL",
  "ACTION",
  "DANCE",
  "KAWAII",
  "HUG",
  "LAUGH",
  "SMILE",
  "MAGIC",
  "SAD",
  "BLUSH"
];

const POPULAR_TAGS = [
  "Gojo Satoru",
  "Solo Leveling",
  "Megumin Explosion",
  "Demon Slayer",
  "Spy x Family Anya",
  "Naruto Rasengan",
  "Chainsaw Man",
  "Kawaii Dance"
];

// High-reliability 100% working fallback anime GIFs from Nekos.best & Waifu.pics
const FALLBACK_GIFS: AnimeGif[] = [
  {
    id: "fb-dance",
    title: "Kawaii Anime Dance Routine",
    url: "https://nekos.best/api/v2/dance/0001.gif",
    previewUrl: "https://nekos.best/api/v2/dance/0001.gif",
    category: "DANCE",
    character: "Anime Idol",
    source: "Nekos.best Engine"
  },
  {
    id: "fb-hug",
    title: "Warm Anime Hug Embrace",
    url: "https://nekos.best/api/v2/hug/0002.gif",
    previewUrl: "https://nekos.best/api/v2/hug/0002.gif",
    category: "HUG",
    character: "Anime Scene",
    source: "Nekos.best Engine"
  },
  {
    id: "fb-smile",
    title: "Bright Anime Smile Greeting",
    url: "https://nekos.best/api/v2/smile/0003.gif",
    previewUrl: "https://nekos.best/api/v2/smile/0003.gif",
    category: "SMILE",
    character: "Kawaii Girl",
    source: "Nekos.best Engine"
  },
  {
    id: "fb-pat",
    title: "Gentle Headpat Reaction",
    url: "https://nekos.best/api/v2/pat/0004.gif",
    previewUrl: "https://nekos.best/api/v2/pat/0004.gif",
    category: "KAWAII",
    character: "Anime Waifu",
    source: "Nekos.best Engine"
  }
];

export const GifGallery: React.FC = () => {
  const [gifs, setGifs] = useState<AnimeGif[]>([]);
  const [failedGifIds, setFailedGifIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("anime");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedGif, setSelectedGif] = useState<AnimeGif | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  // LocalStorage Search History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("gif_search_history");
      return saved ? JSON.parse(saved) : ["Gojo Satoru", "Solo Leveling", "Megumin", "Demon Slayer", "Anime Dance"];
    } catch {
      return ["Gojo Satoru", "Solo Leveling", "Megumin", "Demon Slayer", "Anime Dance"];
    }
  });

  const saveSearchToHistory = (queryStr: string) => {
    const trimmed = queryStr.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("gif_search_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed saving GIF history", e);
      }
      return updated;
    });
  };

  const removeHistoryItem = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playClick();
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove);
      try {
        localStorage.setItem("gif_search_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed updating GIF history", e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    sfx.playClick();
    setSearchHistory([]);
    try {
      localStorage.removeItem("gif_search_history");
    } catch (e) {
      console.warn("Failed clearing GIF history", e);
    }
  };

  // Fetch GIFs from multi-source backend endpoint with pagination
  const fetchGifs = async (queryStr: string, pageNum = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setFailedGifIds(new Set());
    }

    try {
      const res = await fetch(`/api/gifs?q=${encodeURIComponent(queryStr)}&page=${pageNum}`);
      if (res.ok) {
        const data = await res.json();
        if (data.gifs && data.gifs.length > 0) {
          if (append) {
            setGifs((prev) => {
              const existingIds = new Set(prev.map((g) => g.id));
              const newItems = data.gifs.filter((g: AnimeGif) => !existingIds.has(g.id));
              return [...prev, ...newItems];
            });
          } else {
            setGifs(data.gifs);
          }
          setHasMorePages(data.hasMore !== false);
        } else {
          if (!append) setGifs(FALLBACK_GIFS);
          setHasMorePages(false);
        }
      } else {
        if (!append) setGifs(FALLBACK_GIFS);
      }
    } catch (err) {
      console.error("Error fetching GIFs:", err);
      if (!append) setGifs(FALLBACK_GIFS);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchGifs(searchQuery, 1, false);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleNextPage = () => {
    sfx.playWarp();
    const nextP = currentPage + 1;
    setCurrentPage(nextP);
    fetchGifs(searchQuery, nextP, false);
    scrollToTop();
  };

  const handlePrevPage = () => {
    sfx.playClick();
    const prevP = Math.max(1, currentPage - 1);
    setCurrentPage(prevP);
    fetchGifs(searchQuery, prevP, false);
    scrollToTop();
  };

  const handleJumpToPage = (p: number) => {
    sfx.playClick();
    setCurrentPage(p);
    fetchGifs(searchQuery, p, false);
    scrollToTop();
  };

  const handleLoadMoreAppend = () => {
    sfx.playClick();
    const nextP = currentPage + 1;
    setCurrentPage(nextP);
    fetchGifs(searchQuery, nextP, true);
  };

  const handleResetFeed = () => {
    sfx.playClick();
    setSearchQuery("anime");
    setActiveCategory("ALL");
    setCurrentPage(1);
    setFailedGifIds(new Set());
    fetchGifs("anime", 1, false);
    scrollToTop();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playClick();
    if (!searchQuery.trim()) return;
    setCurrentPage(1);
    saveSearchToHistory(searchQuery);
    fetchGifs(searchQuery, 1, false);
  };

  const handleTagClick = (tag: string) => {
    sfx.playClick();
    setSearchQuery(tag);
    setActiveCategory("ALL");
    setCurrentPage(1);
    saveSearchToHistory(tag);
    fetchGifs(tag, 1, false);
  };

  const handleCategoryClick = (cat: string) => {
    sfx.playClick();
    setActiveCategory(cat);
    setCurrentPage(1);
    const query = cat === "ALL" ? searchQuery : `${cat} anime`;
    fetchGifs(query, 1, false);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playClick();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyUrl = (url: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner / Intro Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-rose-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
            <Film className="w-4 h-4 text-rose-400" />
            <span>DIRECT TENOR, NEKOS.BEST & OTAKUGIFS API ENGINE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span>Endless Anime GIFs & Reaction Explorer</span>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Search, discover, copy, and stream thousands of high-definition animated action clips, spell casts, and reaction GIFs across endless pages!
          </p>
        </div>
      </div>

      {/* Controls Bar: Search Form, History Drawer Button & Category Chips */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anime GIFs (e.g., Gojo, Fight, Dance, Hug)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-rose-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-rose-900/30"
            >
              Search
            </button>
          </form>

          {/* Reset Feed Button */}
          <button
            onClick={handleResetFeed}
            disabled={loading}
            className="px-4 py-3 rounded-2xl border border-rose-500/30 bg-slate-900/80 hover:bg-rose-950/40 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            title="Reset Search and Refresh Dynamic Live Anime GIFs"
          >
            <RotateCcw className={`w-4 h-4 text-rose-400 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden xs:inline">Reset Feed</span>
          </button>

          {/* Search History Drawer Toggle Button */}
          <button
            onClick={() => {
              sfx.playClick();
              setIsHistoryOpen(!isHistoryOpen);
            }}
            className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
              isHistoryOpen || searchHistory.length > 0
                ? "bg-purple-900/60 border-purple-400 text-purple-200 shadow-lg shadow-purple-900/30"
                : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title="Open Recent GIF Search History Drawer"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>History</span>
            {searchHistory.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-[10px] text-white font-bold">
                {searchHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* Recent Search History Drawer */}
        {isHistoryOpen && (
          <div className="p-5 rounded-2xl bg-slate-900/95 border border-purple-500/30 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Recent GIF Searches (Saved in LocalStorage)
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {searchHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-mono flex items-center gap-1 transition-colors"
                    title="Clear All History"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}

                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {searchHistory.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono italic">No recent GIF searches saved yet.</p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {searchHistory.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      sfx.playClick();
                      setSearchQuery(item);
                      setIsHistoryOpen(false);
                      setCurrentPage(1);
                      fetchGifs(item, 1, false);
                    }}
                    className="group cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-900/60 border border-indigo-500/20 hover:border-rose-400 text-xs font-mono text-slate-200 hover:text-white transition-all shadow"
                  >
                    <Search className="w-3 h-3 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>{item}</span>
                    <button
                      onClick={(e) => removeHistoryItem(item, e)}
                      className="p-0.5 rounded-md hover:bg-rose-500/30 text-slate-400 hover:text-rose-300"
                      title="Remove search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular Tags Quick Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Trending:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-rose-900/40 border border-rose-500/20 text-[11px] font-mono text-slate-300 hover:text-rose-200 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-rose-500/20">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            Page <span className="text-rose-400">{currentPage}</span> • Endless Anime GIF Vault
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
            <button
              key={p}
              onClick={() => handleJumpToPage(p)}
              className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all ${
                currentPage === p
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={loading || !hasMorePages}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>

      {/* GIF Grid Display */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading animated GIFs from Tenor, Waifu.pics & Nekos.best API...</p>
        </div>
      ) : gifs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">No GIFs found for "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery("anime");
              setCurrentPage(1);
              fetchGifs("anime", 1, false);
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-mono font-bold"
          >
            Reset Search
          </button>
        </div>
      ) : (
        (() => {
          const visibleGifs = gifs;
          if (visibleGifs.length === 0) {
            return (
              <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
                <Film className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">No active GIFs available for "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery("anime");
                    setCurrentPage(1);
                    setFailedGifIds(new Set());
                    fetchGifs("anime", 1, false);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-mono font-bold"
                >
                  Reset Search
                </button>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleGifs.map((gif) => {
                const isFav = favorites.includes(gif.id);
                return (
                  <div
                    key={gif.id}
                    onClick={() => {
                      sfx.playClick();
                      setSelectedGif(gif);
                    }}
                    className="group relative bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    {/* GIF Image Container */}
                    <div className="relative aspect-square bg-slate-950 overflow-hidden">
                      <img
                        src={gif.previewUrl || gif.url}
                        alt={gif.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          if (e.currentTarget.src !== "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80") {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80";
                          }
                        }}
                      />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={(e) => toggleFavorite(gif.id, e)}
                        className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                          isFav
                            ? "bg-rose-500 text-white border-rose-400"
                            : "bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white"
                        }`}
                        title="Favorite GIF"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={(e) => handleCopyUrl(gif.url, gif.id, e)}
                        className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md"
                        title="Copy Direct Link"
                      >
                        {copiedId === gif.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-300">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Click to view full preview</span>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3 bg-slate-900/90 flex flex-col gap-1 flex-1 justify-between">
                  <h3 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-rose-300 transition-colors">
                    {gif.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-purple-300">
                      {gif.category || "ANIME"}
                    </span>
                    <span className="text-slate-500">{gif.source || "Anime Engine"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          );
        })()
      )}

      {/* Endless Load More & Bottom Pagination Bar */}
      <div className="space-y-4 pt-4">
        {hasMorePages && (
          <div className="text-center">
            <button
              onClick={handleLoadMoreAppend}
              disabled={loadingMore}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-rose-900/30 flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Loading More Anime GIFs...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Load More GIFs (Continuous Append)</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-rose-500/20">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Layers className="w-4 h-4 text-rose-400" />
            <span>Currently on Page {currentPage} • Loaded {gifs.length} Anime GIFs</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono text-slate-200 flex items-center gap-1 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <button
              onClick={handleNextPage}
              disabled={loading || !hasMorePages}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-mono font-bold text-white flex items-center gap-1 shadow-lg shadow-rose-900/40"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen GIF Lightbox Modal */}
      {selectedGif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {selectedGif.title}
                </h3>
                <p className="text-xs font-mono text-rose-400">
                  Category: {selectedGif.category || "ANIME"} • Source: {selectedGif.source || "Anime Engine"}
                </p>
              </div>

              <button
                onClick={() => setSelectedGif(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main GIF View */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[250px] max-h-[450px]">
              <img
                src={selectedGif.url}
                alt={selectedGif.title}
                className="max-w-full max-h-[450px] object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={(e) => handleCopyUrl(selectedGif.url, selectedGif.id, e)}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all"
              >
                {copiedId === selectedGif.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied Direct URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Direct GIF URL</span>
                  </>
                )}
              </button>

              <a
                href={selectedGif.url}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold flex items-center gap-2 border border-slate-700"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Open Full GIF</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
