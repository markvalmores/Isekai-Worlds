import React, { useState, useMemo, useEffect, useRef } from "react";
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
  ChevronRight,
  ListVideo,
  SkipForward,
  SkipBack,
  Grid,
  List,
  Eye,
  Check,
  CheckCheck,
  Shuffle,
  RefreshCw,
  Share2,
  Copy,
  Info
} from "lucide-react";
import { EXCLUSIVE_ANIMES_DATA, ExclusiveAnimeItem } from "../data/exclusiveAnimesData";
import { sfx } from "../utils/sfx";

export interface AnimeEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  embedUrl: string;
}

export function ExclusiveAnimesTab() {
  const [selectedPublisher, setSelectedPublisher] = useState<"All" | "Muse Asia">("Muse Asia");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"a-z" | "z-a" | "rating" | "episodes">("a-z");
  
  const spotlightDefaultItem = useMemo(() => {
    return EXCLUSIVE_ANIMES_DATA.find(item => item.playlistId === "PLwLSw1_eDZl1G_FbMxbzZY5Ut5RWO4bUv" || item.videoId === "mFfYe9ph7dQ") || EXCLUSIVE_ANIMES_DATA[0];
  }, []);

  const [activeVideo, setActiveVideo] = useState<ExclusiveAnimeItem>(spotlightDefaultItem);
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState<boolean>(false);
  const [episodeSearch, setEpisodeSearch] = useState<string>("");
  const [episodeViewMode, setEpisodeViewMode] = useState<"list" | "grid">("list");
  const [activeSidebarTab, setActiveSidebarTab] = useState<"episodes" | "playlists" | "info">("episodes");
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState<boolean>(false);
  const [playlistSearch, setPlaylistSearch] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("isekai_exclusive_anime_favs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Watched episodes tracker in localStorage
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("isekai_exclusive_watched_eps");
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
      } catch {}
      return updated;
    });
  };

  const toggleWatched = (episodeKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    setWatchedEpisodes(prev => {
      const updated = prev.includes(episodeKey) 
        ? prev.filter(k => k !== episodeKey) 
        : [...prev, episodeKey];
      try {
        localStorage.setItem("isekai_exclusive_watched_eps", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Fetch or generate episodes whenever active anime series changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingEpisodes(true);
    setCurrentEpisodeIndex(0);

    const loadEpisodes = async () => {
      try {
        const queryParams = new URLSearchParams({
          playlistId: activeVideo.playlistId || "",
          videoId: activeVideo.videoId || "",
          title: activeVideo.title,
          count: (activeVideo.episodesCount || 12).toString()
        });

        const res = await fetch(`/api/exclusive-animes/episodes?${queryParams.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!isCancelled && data && Array.isArray(data.episodes) && data.episodes.length > 0) {
          setEpisodes(data.episodes);
          setIsLoadingEpisodes(false);
          return;
        }
      } catch (err) {
        console.warn("[Exclusive Animes] Could not fetch remote episode list, using synthesized list:", err);
      }

      // Reliable offline fallback generator
      if (!isCancelled) {
        const total = Math.max(activeVideo.episodesCount || 12, 12);
        const fallback: AnimeEpisode[] = Array.from({ length: total }, (_, i) => {
          const epNum = (i + 1).toString().padStart(2, "0");
          return {
            id: i === 0 && activeVideo.videoId ? activeVideo.videoId : `ep-${activeVideo.id}-${i + 1}`,
            episodeNumber: i + 1,
            title: `${activeVideo.title} - Episode ${epNum}`,
            duration: "24:00",
            thumbnail: i === 0 && activeVideo.videoId
              ? `https://img.youtube.com/vi/${activeVideo.videoId}/mqdefault.jpg`
              : activeVideo.thumbnail || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
            url: `https://www.youtube.com/watch?v=${activeVideo.videoId}&list=${activeVideo.playlistId}&index=${i}`,
            embedUrl: activeVideo.playlistId
              ? `https://www.youtube.com/embed/videoseries?list=${activeVideo.playlistId}&index=${i}&autoplay=1&enablejsapi=1`
              : `https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&enablejsapi=1`
          };
        });
        setEpisodes(fallback);
        setIsLoadingEpisodes(false);
      }
    };

    loadEpisodes();

    return () => {
      isCancelled = true;
    };
  }, [activeVideo]);

  // Current active episode
  const activeEpisode = episodes[currentEpisodeIndex] || episodes[0] || null;

  // Calculate current embed URL for active episode
  const currentEmbedUrl = useMemo(() => {
    if (!activeVideo) return "";
    if (activeEpisode && activeEpisode.id && activeEpisode.id.length === 11 && !activeEpisode.id.startsWith("ep-")) {
      return `https://www.youtube.com/embed/${activeEpisode.id}?list=${activeVideo.playlistId}&autoplay=1&enablejsapi=1`;
    }
    if (activeVideo.playlistId) {
      return `https://www.youtube.com/embed/videoseries?list=${activeVideo.playlistId}&index=${currentEpisodeIndex}&autoplay=1&enablejsapi=1`;
    }
    return `https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&enablejsapi=1`;
  }, [activeVideo, activeEpisode, currentEpisodeIndex]);

  // Filter episodes by search inside the active anime
  const filteredEpisodes = useMemo(() => {
    if (!episodeSearch.trim()) return episodes;
    const q = episodeSearch.toLowerCase().trim();
    return episodes.filter(ep => 
      ep.title.toLowerCase().includes(q) ||
      ep.episodeNumber.toString() === q ||
      `ep ${ep.episodeNumber}`.includes(q) ||
      `episode ${ep.episodeNumber}`.includes(q)
    );
  }, [episodes, episodeSearch]);

  // Filter other playlists for playlist browser tab
  const relatedPlaylists = useMemo(() => {
    let list = EXCLUSIVE_ANIMES_DATA.filter(item => item.id !== activeVideo.id);
    if (playlistSearch.trim()) {
      const q = playlistSearch.toLowerCase().trim();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list.slice(0, 30);
  }, [activeVideo, playlistSearch]);

  // Filter & Sort catalog items
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

  const handleSelectAnime = (item: ExclusiveAnimeItem, scroll = true) => {
    sfx.playWarp();
    setActiveVideo(item);
    setCurrentEpisodeIndex(0);
    if (scroll && playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectEpisode = (index: number) => {
    sfx.playClick();
    setCurrentEpisodeIndex(index);
    // Mark as watched
    const ep = episodes[index];
    if (ep) {
      const key = `${activeVideo.id}_ep_${ep.episodeNumber}`;
      if (!watchedEpisodes.includes(key)) {
        setWatchedEpisodes(prev => [...prev, key]);
        try {
          localStorage.setItem("isekai_exclusive_watched_eps", JSON.stringify([...watchedEpisodes, key]));
        } catch {}
      }
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisodeIndex > 0) {
      handleSelectEpisode(currentEpisodeIndex - 1);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      handleSelectEpisode(currentEpisodeIndex + 1);
    }
  };

  const handleCopyLink = () => {
    sfx.playClick();
    const link = activeEpisode?.url || activeVideo.originalUrl;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
              <span className="font-bold tracking-wider uppercase">EXCLUSIVE ANIMES & PLAYLISTS</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                EPISODE BROWSER ACTIVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              Exclusive Animes <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400">Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Browse 300+ licensed legal anime series from <strong className="text-rose-400">Muse Asia</strong>. Select any anime to browse its full episode list, jump to specific episodes, track watched progress, or switch between official playlists directly.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Legal Streaming
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <ListVideo className="w-3.5 h-3.5 text-rose-400" />
                Episode & Playlist Selector
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                HD Multi-Season Playlists
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
                <span className="text-[9px] text-slate-400 uppercase">Series Playlists</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block">1080p HD</span>
                <span className="text-[9px] text-slate-400 uppercase">Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎬 SPOTLIGHT PLAYER WITH DEDICATED EPISODE LIST & PLAYLIST SELECTOR */}
      {/* ========================================================================= */}
      <div 
        ref={playerContainerRef} 
        className="p-4 sm:p-6 rounded-3xl bg-slate-950 border border-rose-500/30 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top Header of Player: Title, Current Episode, and Action Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <Film className="w-3 h-3 text-rose-400" />
                NOW PLAYING
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                EPISODE {currentEpisodeIndex + 1} OF {episodes.length || activeVideo.episodesCount}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                {activeVideo.publisher}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase line-clamp-1">
              {activeEpisode ? activeEpisode.title : activeVideo.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Series: <strong className="text-rose-300">{activeVideo.title}</strong>
            </p>
          </div>

          {/* Quick Actions: Favorite, Copy, YouTube Tab, Fullscreen Episode Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEpisodeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <ListVideo className="w-3.5 h-3.5" />
              <span>Browse All Episodes</span>
            </button>

            <button
              onClick={(e) => toggleFavorite(activeVideo.id, e)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                favorites.includes(activeVideo.id)
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favorites.includes(activeVideo.id) ? "fill-amber-400 text-amber-400" : ""}`} />
              <span>{favorites.includes(activeVideo.id) ? "Bookmarked" : "Favorite"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
              title="Copy Episode Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={activeEpisode?.url || activeVideo.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              title="Watch on Official YouTube Page"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
            </a>
          </div>
        </div>

        {/* Player Layout: Video Left (2 cols), Episode List Right (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Video & Navigation Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative group">
              <iframe
                key={currentEmbedUrl}
                src={currentEmbedUrl}
                title={activeEpisode ? activeEpisode.title : activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Episode Transport Bar (Previous, Progress, Next) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevEpisode}
                  disabled={currentEpisodeIndex === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                  <span>Prev Ep</span>
                </button>

                <button
                  onClick={handleNextEpisode}
                  disabled={currentEpisodeIndex >= episodes.length - 1}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <span>Next Ep</span>
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Episode Progress & Watched Status */}
              <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                <span className="hidden sm:inline">
                  Playing: <strong className="text-white">Episode {currentEpisodeIndex + 1}</strong> / {episodes.length}
                </span>

                {activeEpisode && (
                  <button
                    onClick={() => toggleWatched(`${activeVideo.id}_ep_${activeEpisode.episodeNumber}`)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
                      watchedEpisodes.includes(`${activeVideo.id}_ep_${activeEpisode.episodeNumber}`)
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {watchedEpisodes.includes(`${activeVideo.id}_ep_${activeEpisode.episodeNumber}`) ? "Watched" : "Mark Watched"}
                    </span>
                  </button>
                )}
              </div>

              {/* View Toggle (List vs Grid) */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setEpisodeViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    episodeViewMode === "list" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEpisodeViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    episodeViewMode === "grid" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="Grid Numbers View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Episode Numbers Scrollbar on Mobile / Desktop */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-rose-400 text-rose-400" />
                  Quick Episode Selector
                </span>
                <span>{episodes.length} Total Episodes</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {episodes.map((ep, idx) => {
                  const isCurrent = idx === currentEpisodeIndex;
                  const isWatched = watchedEpisodes.includes(`${activeVideo.id}_ep_${ep.episodeNumber}`);
                  return (
                    <button
                      key={ep.id || idx}
                      onClick={() => handleSelectEpisode(idx)}
                      className={`h-9 px-3 shrink-0 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1 ${
                        isCurrent
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40 ring-2 ring-rose-400"
                          : isWatched
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50"
                          : "bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white"
                      }`}
                      title={ep.title}
                    >
                      <span>EP {ep.episodeNumber}</span>
                      {isWatched && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Episode List, Playlist Switcher, and Series Info */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col h-[520px] lg:h-[620px]">
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => { sfx.playClick(); setActiveSidebarTab("episodes"); }}
                className={`flex-1 py-1.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSidebarTab === "episodes"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                <ListVideo className="w-3.5 h-3.5" />
                <span>Episodes ({episodes.length})</span>
              </button>

              <button
                onClick={() => { sfx.playClick(); setActiveSidebarTab("playlists"); }}
                className={`flex-1 py-1.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSidebarTab === "playlists"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Playlists</span>
              </button>

              <button
                onClick={() => { sfx.playClick(); setActiveSidebarTab("info"); }}
                className={`p-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  activeSidebarTab === "info"
                    ? "bg-rose-600 text-white"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
                title="Anime Details & Info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: EPISODES LIST / GRID */}
            {activeSidebarTab === "episodes" && (
              <div className="flex-1 flex flex-col min-h-0 pt-3 space-y-3">
                
                {/* Search within this anime episodes */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search episode title or number..."
                    value={episodeSearch}
                    onChange={(e) => setEpisodeSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  />
                  {episodeSearch && (
                    <button
                      onClick={() => setEpisodeSearch("")}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs font-mono"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isLoadingEpisodes ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
                    <span className="text-xs font-mono text-slate-400">Loading playlist episodes...</span>
                  </div>
                ) : filteredEpisodes.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs font-mono space-y-2">
                    <Film className="w-8 h-8 text-slate-600 mx-auto" />
                    <span>No episodes match "{episodeSearch}"</span>
                  </div>
                ) : episodeViewMode === "grid" ? (
                  /* Compact Grid Numbers View */
                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {filteredEpisodes.map((ep, idx) => {
                        const originalIdx = episodes.findIndex(e => e.id === ep.id);
                        const isCurrent = originalIdx === currentEpisodeIndex;
                        const isWatched = watchedEpisodes.includes(`${activeVideo.id}_ep_${ep.episodeNumber}`);
                        return (
                          <button
                            key={ep.id || idx}
                            onClick={() => handleSelectEpisode(originalIdx !== -1 ? originalIdx : idx)}
                            className={`p-2 rounded-xl text-center font-mono transition-all flex flex-col items-center justify-center gap-1 ${
                              isCurrent
                                ? "bg-rose-600 text-white font-black shadow-lg shadow-rose-900/40 ring-2 ring-rose-400"
                                : isWatched
                                ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold"
                                : "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                            }`}
                            title={ep.title}
                          >
                            <span className="text-xs">{ep.episodeNumber}</span>
                            {isWatched ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <span className="text-[9px] opacity-60">EP</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Detailed List View with Thumbnail, Duration & Watched State */
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                    {filteredEpisodes.map((ep, idx) => {
                      const originalIdx = episodes.findIndex(e => e.id === ep.id);
                      const isCurrent = originalIdx === currentEpisodeIndex;
                      const isWatched = watchedEpisodes.includes(`${activeVideo.id}_ep_${ep.episodeNumber}`);
                      return (
                        <div
                          key={ep.id || idx}
                          onClick={() => handleSelectEpisode(originalIdx !== -1 ? originalIdx : idx)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                            isCurrent
                              ? "bg-rose-950/40 border-rose-500 text-white shadow-md ring-1 ring-rose-500/50"
                              : "bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Thumbnail with overlay badge */}
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-black shrink-0 relative border border-slate-800">
                              <img
                                src={ep.thumbnail}
                                alt={ep.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.currentTarget.src = activeVideo.thumbnail;
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-3.5 h-3.5 fill-white text-white" />
                              </div>
                              <span className="absolute bottom-0.5 right-1 px-1 rounded bg-black/80 font-mono text-[8px] text-white">
                                {ep.duration}
                              </span>
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-black uppercase ${
                                  isCurrent ? "bg-rose-600 text-white" : "bg-slate-900 text-rose-300 border border-rose-500/30"
                                }`}>
                                  EP {ep.episodeNumber}
                                </span>
                                {isWatched && (
                                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs font-semibold line-clamp-1 group-hover:text-rose-300 transition-colors ${
                                isCurrent ? "text-white font-bold" : "text-slate-300"
                              }`}>
                                {ep.title}
                              </p>
                            </div>
                          </div>

                          {/* Quick Toggle Watched */}
                          <button
                            onClick={(e) => toggleWatched(`${activeVideo.id}_ep_${ep.episodeNumber}`, e)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-colors shrink-0"
                            title={isWatched ? "Mark Unwatched" : "Mark as Watched"}
                          >
                            <CheckCheck className={`w-3.5 h-3.5 ${isWatched ? "text-emerald-400" : ""}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Footer Info */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Watched: <strong className="text-emerald-400">
                    {episodes.filter(ep => watchedEpisodes.includes(`${activeVideo.id}_ep_${ep.episodeNumber}`)).length} / {episodes.length}
                  </strong></span>
                  <button
                    onClick={() => setIsEpisodeModalOpen(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-2"
                  >
                    Expand Browser ↗
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PLAYLISTS BROWSER */}
            {activeSidebarTab === "playlists" && (
              <div className="flex-1 flex flex-col min-h-0 pt-3 space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search other series playlists..."
                    value={playlistSearch}
                    onChange={(e) => setPlaylistSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {relatedPlaylists.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectAnime(item, false)}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-8 rounded-lg object-cover shrink-0 border border-slate-800"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs font-bold text-white group-hover:text-rose-300 line-clamp-1 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <span className="text-emerald-400 font-bold">{item.episodesCount}+ Eps</span>
                            <span>•</span>
                            <span className="text-amber-400">{item.rating} ★</span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="px-2.5 py-1 rounded-lg bg-slate-900 group-hover:bg-rose-600 text-[10px] font-mono font-bold text-white transition-colors shrink-0"
                      >
                        Play
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ANIME INFO & OVERVIEW */}
            {activeSidebarTab === "info" && (
              <div className="flex-1 overflow-y-auto pt-3 space-y-4 text-xs text-slate-300 pr-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">Series Synopsis</span>
                  <p className="leading-relaxed text-slate-300">
                    {activeVideo.description}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Episodes:</span>
                    <span className="text-emerald-400 font-bold">{activeVideo.episodesCount}+ Episodes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Release Era:</span>
                    <span className="text-white font-bold">{activeVideo.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Rating:</span>
                    <span className="text-amber-400 font-bold">{activeVideo.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Publisher:</span>
                    <span className="text-rose-400 font-bold">{activeVideo.publisher}</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-slate-800 pt-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Categories & Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {activeVideo.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🔍 SEARCH & CATEGORY FILTER SECTION */}
      {/* ========================================================================= */}
      <div className="space-y-4 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/15 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Search Bar & Sort Dropdown */}
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
              {filteredItems.length} Series Found
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

        {/* Category Pills */}
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

      {/* ========================================================================= */}
      {/* 📺 CATALOG GRID: CLICK ANY CARD TO BROWSE EPISODES */}
      {/* ========================================================================= */}
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
                  onClick={() => handleSelectAnime(item)}
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
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <ListVideo className="w-3 h-3" />
                          {item.episodesCount}+ Episodes
                        </span>
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
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

      {/* ========================================================================= */}
      {/* 🌟 FULLSCREEN / EXPANDED EPISODE BROWSER MODAL */}
      {/* ========================================================================= */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-rose-500/30 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase">
                    EPISODE BROWSER
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {episodes.length} Episodes Total
                  </span>
                </div>
                <h3 className="text-lg font-black text-white uppercase truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <button
                onClick={() => setIsEpisodeModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Mode Bar */}
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter episode..."
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">View:</span>
                <button
                  onClick={() => setEpisodeViewMode("list")}
                  className={`px-3 py-1 rounded-xl ${episodeViewMode === "list" ? "bg-rose-600 text-white font-bold" : "bg-slate-900 text-slate-300"}`}
                >
                  List
                </button>
                <button
                  onClick={() => setEpisodeViewMode("grid")}
                  className={`px-3 py-1 rounded-xl ${episodeViewMode === "grid" ? "bg-rose-600 text-white font-bold" : "bg-slate-900 text-slate-300"}`}
                >
                  Grid
                </button>
              </div>
            </div>

            {/* Modal Body: Episode Cards */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-800">
              {episodeViewMode === "grid" ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {filteredEpisodes.map((ep, idx) => {
                    const originalIdx = episodes.findIndex(e => e.id === ep.id);
                    const isCurrent = originalIdx === currentEpisodeIndex;
                    const isWatched = watchedEpisodes.includes(`${activeVideo.id}_ep_${ep.episodeNumber}`);
                    return (
                      <button
                        key={ep.id || idx}
                        onClick={() => {
                          handleSelectEpisode(originalIdx !== -1 ? originalIdx : idx);
                          setIsEpisodeModalOpen(false);
                          if (playerContainerRef.current) {
                            playerContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }}
                        className={`p-3 rounded-2xl text-center font-mono transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isCurrent
                            ? "bg-rose-600 text-white font-black shadow-lg shadow-rose-900/40 ring-2 ring-rose-400"
                            : isWatched
                            ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                            : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-sm font-bold">{ep.episodeNumber}</span>
                        {isWatched ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="text-[9px] text-slate-400">EP</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredEpisodes.map((ep, idx) => {
                    const originalIdx = episodes.findIndex(e => e.id === ep.id);
                    const isCurrent = originalIdx === currentEpisodeIndex;
                    const isWatched = watchedEpisodes.includes(`${activeVideo.id}_ep_${ep.episodeNumber}`);
                    return (
                      <div
                        key={ep.id || idx}
                        onClick={() => {
                          handleSelectEpisode(originalIdx !== -1 ? originalIdx : idx);
                          setIsEpisodeModalOpen(false);
                          if (playerContainerRef.current) {
                            playerContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                          isCurrent
                            ? "bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-500/40"
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-20 h-12 rounded-xl overflow-hidden bg-black shrink-0 relative border border-slate-800">
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src = activeVideo.thumbnail;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                            <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 font-mono text-[8px] text-white">
                              {ep.duration}
                            </span>
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase ${
                              isCurrent ? "bg-rose-600 text-white" : "bg-slate-950 text-rose-300 border border-rose-500/30"
                            }`}>
                              EPISODE {ep.episodeNumber}
                            </span>
                            <p className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                              {ep.title}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => toggleWatched(`${activeVideo.id}_ep_${ep.episodeNumber}`, e)}
                          className="p-2 rounded-xl text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-colors shrink-0"
                        >
                          <CheckCheck className={`w-4 h-4 ${isWatched ? "text-emerald-400" : ""}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Click any episode to start playing immediately in HD.</span>
              <button
                onClick={() => setIsEpisodeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
              >
                Close Browser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
