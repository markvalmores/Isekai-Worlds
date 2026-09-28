import React, { useState, useMemo } from "react";
import { 
  Tv2, 
  Search, 
  Play, 
  Sparkles, 
  Star, 
  Film, 
  Layers, 
  Bookmark, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Volume2,
  X,
  Radio,
  Video,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { EXCLUSIVE_ANIMES_DATA, ExclusiveAnimeItem } from "../data/exclusiveAnimesData";
import { sfx } from "../utils/sfx";

export function ExclusiveAnimesTab() {
  const [selectedPublisher, setSelectedPublisher] = useState<"All" | "Muse Asia">("Muse Asia");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"a-z" | "z-a" | "rating" | "episodes">("a-z");
  const spotlightDefaultItem = useMemo(() => {
    return EXCLUSIVE_ANIMES_DATA.find(item => item.playlistId === "PLwLSw1_eDZl1G_FbMxbzZY5Ut5RWO4bUv") || EXCLUSIVE_ANIMES_DATA[0];
  }, []);
  const [activeVideo, setActiveVideo] = useState<ExclusiveAnimeItem | null>(spotlightDefaultItem);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("isekai_exclusive_anime_favs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [visibleCount, setVisibleCount] = useState(36);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem("isekai_exclusive_anime_favs", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Filter & Sort items
  const filteredItems = useMemo(() => {
    let result = [...EXCLUSIVE_ANIMES_DATA];

    if (selectedPublisher !== "All") {
      result = result.filter(item => item.publisher === selectedPublisher);
    }

    if (activeTag === "Favorites") {
      result = result.filter(item => favorites.includes(item.id));
    } else if (activeTag !== "All") {
      result = result.filter(item => item.tags.includes(activeTag as any));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true });
      } else if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title, undefined, { sensitivity: "base", numeric: true });
      } else if (sortOrder === "rating") {
        return parseFloat(b.rating) - parseFloat(a.rating);
      } else if (sortOrder === "episodes") {
        return b.episodesCount - a.episodesCount;
      }
      return 0;
    });

    return result;
  }, [selectedPublisher, activeTag, searchQuery, favorites, sortOrder]);

  const categories = [
    { id: "All", label: "All Catalog" },
    { id: "SUB", label: "SUB (Subtitled)" },
    { id: "DUB", label: "DUB (English / Regional)" },
    { id: "Seasons", label: "Seasons" },
    { id: "Full Series", label: "Full Series" },
    { id: "Movies", label: "Movies" },
    { id: "OVA", label: "OVA" },
    { id: "OAD", label: "OAD" },
    { id: "Limited-Time", label: "Limited-Time" },
    { id: "Extras", label: "Extras & Promotions" },
    { id: "Favorites", label: `Favorites (${favorites.length})` }
  ];

  const handlePlayAnime = (item: ExclusiveAnimeItem) => {
    sfx.playWarp();
    setActiveVideo(item);
    setIsPlayingModalOpen(true);
  };

  const getEmbedUrl = (item: ExclusiveAnimeItem) => {
    if (item.playlistId) {
      return `https://www.youtube.com/embed/videoseries?list=${item.playlistId}&autoplay=1&enablejsapi=1`;
    }
    return `https://www.youtube.com/embed/${item.videoId}?autoplay=1&enablejsapi=1`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl border border-rose-500/20 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 p-6 sm:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-bold tracking-wider uppercase">EXCLUSIVE ANIMES PORTAL</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                OFFICIAL MUSE ASIA
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              Exclusive Animes <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400">Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore 300+ official legal anime series, movies, OVAs, OADs, and limited-time marathon streams provided by <strong className="text-rose-400">Muse Asia</strong>. Fully categorized by SUB, DUB, Full Series, and Promotional Specials.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Legal & Free
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                {EXCLUSIVE_ANIMES_DATA.length} Exclusive Titles
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                Official HD Playlists
              </span>
            </div>
          </div>

          {/* Muse Asia Publisher Card */}
          <div className="w-full md:w-auto p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-xl space-y-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                M
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Muse Asia Official</h3>
                <p className="text-[10px] font-mono text-slate-400">Licensed Anime Streaming Partner</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono text-xs">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <span className="text-rose-400 font-bold block">{EXCLUSIVE_ANIMES_DATA.length}</span>
                <span className="text-[9px] text-slate-400 uppercase">Playlists</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block">1080p HD</span>
                <span className="text-[9px] text-slate-400 uppercase">Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Anime Spotlight Player (If Video Active) */}
      {activeVideo && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-rose-500/20 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">
                  NOW PLAYING SPOTLIGHT
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {activeVideo.publisher}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                {activeVideo.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleFavorite(activeVideo.id, e)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  favorites.includes(activeVideo.id)
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${favorites.includes(activeVideo.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                <span>{favorites.includes(activeVideo.id) ? "Bookmarked" : "Favorite"}</span>
              </button>

              <a
                href={activeVideo.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Embedded iFrame */}
            <div className="lg:col-span-2 aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl relative">
              <iframe
                src={getEmbedUrl(activeVideo)}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Details & Meta */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Title Overview</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeVideo.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeVideo.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Release Era:</span>
                  <span className="text-white font-bold">{activeVideo.year}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Legal Rating:</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> {activeVideo.rating} / 5.0
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Episodes / Playlist:</span>
                  <span className="text-emerald-400 font-bold">{activeVideo.episodesCount}+ Episodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Section */}
      <div className="space-y-4 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/15 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Realtime Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search anime title, tag, season..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Alphabetical & Sorting Selector */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => { sfx.playClick(); setSortOrder(e.target.value as any); }}
                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="a-z" className="bg-slate-900 text-white">A-Z (Alphabetical)</option>
                <option value="z-a" className="bg-slate-900 text-white">Z-A (Reverse)</option>
                <option value="rating" className="bg-slate-900 text-white">Highest Rating</option>
                <option value="episodes" className="bg-slate-900 text-white">Most Episodes</option>
              </select>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-bold">
              {filteredItems.length} Titles Found
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-indigo-400 hover:underline text-[11px]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (SUB, DUB, Seasons, Movies, OVA, OAD, Full Series, Limited-Time, Extras) */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { sfx.playClick(); setActiveTag(cat.id); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTag === cat.id
                  ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-900/30"
                  : "bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <Film className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-mono font-bold text-slate-300">No Exclusive Anime Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No items matched your current filter "{activeTag}" or search query. Try resetting filters.
          </p>
          <button
            onClick={() => { setActiveTag("All"); setSearchQuery(""); }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.slice(0, visibleCount).map((item) => {
              const isFav = favorites.includes(item.id);
              const isSelected = activeVideo?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handlePlayAnime(item)}
                  className={`group relative rounded-2xl overflow-hidden bg-slate-950 border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 ${
                    isSelected
                      ? "border-rose-500 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/50"
                      : "border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-purple-950/20"
                  }`}
                >
                  {/* Poster Thumbnail */}
                  <div className="aspect-video w-full bg-slate-900 relative overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[9px] font-mono font-bold text-rose-400">
                        {item.publisher}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
                      title="Favorite"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.episodesCount}+ Episodes
                        </span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {item.rating}
                        </span>
                      </div>

                      {/* Tag Badges */}
                      <div className="flex flex-wrap items-center gap-1">
                        {item.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border ${
                              tag === "SUB" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300" :
                              tag === "DUB" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" :
                              tag === "Movies" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" :
                              tag === "Limited-Time" ? "bg-pink-500/10 border-pink-500/30 text-pink-300" :
                              "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredItems.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 36)}
                className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-white transition-all shadow-lg hover:border-slate-700"
              >
                Load More Exclusive Animes ({filteredItems.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
