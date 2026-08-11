import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { CommentSection } from "./CommentSection";
import { LOCAL_IPTV_EMBED_HTML } from "../data/iptvWidget";
import { sfx } from "../utils/sfx";
import { fetchRealTimeAnimeList, RealTimeAnimeItem } from "../utils/animeApi";
import {
  Tv2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Flame,
  Music,
  Disc,
  Sparkles,
  Maximize2,
  TrendingUp,
  Star,
  RefreshCw,
  Layers,
  Search,
  X,
  Tag,
  Filter
} from "lucide-react";

interface MediaHubProps {
  userProfile: UserProfile;
  onAddCoins?: (amount: number) => void;
  isGoldMode?: boolean;
}

export const MediaHub: React.FC<MediaHubProps> = ({
  userProfile,
  onAddCoins,
  isGoldMode = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeStreamUrl, setActiveStreamUrl] = useState("https://freetv.studio/embed/AniplusAsia.sg");
  const [activeStreamTitle, setActiveStreamTitle] = useState("Aniplus Asia Live Channel");
  const [activeStreamDesc, setActiveStreamDesc] = useState("24/7 Live Broadcast Feed via FreeTV Studio");

  const [realTimeAnimeList, setRealTimeAnimeList] = useState<RealTimeAnimeItem[]>([]);
  const [loadingRealTime, setLoadingRealTime] = useState(true);
  const [selectedApiFilter, setSelectedApiFilter] = useState("all");
  const [thumbnailSearchQuery, setThumbnailSearchQuery] = useState("");
  const [selectedThumbnailModal, setSelectedThumbnailModal] = useState<RealTimeAnimeItem | null>(null);

  const loadAnimeThumbnails = async (force = false) => {
    setLoadingRealTime(true);
    try {
      const data = await fetchRealTimeAnimeList(force);
      if (data && data.length > 0) {
        setRealTimeAnimeList(data);
      }
    } finally {
      setLoadingRealTime(false);
    }
  };

  useEffect(() => {
    loadAnimeThumbnails(true); // Force fresh thumbnails on initial mount/refresh!
  }, []);

  const handleRefreshThumbnails = () => {
    sfx.playWarp();
    loadAnimeThumbnails(true);
  };

  const animeChannels = [
    {
      id: "aniplus",
      title: "Aniplus Asia Live TV",
      series: "Aniplus Asia 24/7 Live Stream",
      embedUrl: "https://freetv.studio/embed/AniplusAsia.sg",
      cover: realTimeAnimeList[0]?.coverImage || "https://cdn.myanimelist.net/images/anime/1090/140954.jpg",
      genre: "Anime • Simulcast • Action",
      rating: "9.9 / 10"
    },
    {
      id: "vtuber-news",
      title: "VTuber News Stream",
      series: "VTuber World News & Updates",
      embedUrl: "https://www.youtube.com/embed/Y1gTa-8-5eg",
      cover: realTimeAnimeList[1]?.coverImage || "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
      genre: "VTuber • News • Broadcast",
      rating: "9.9 / 10"
    },
    {
      id: "local-tv",
      title: "Local IPTV Channels",
      series: "Global & Local IPTV Channels Explorer & Directory",
      embedUrl: "iptv-embed-widget",
      cover: realTimeAnimeList[2]?.coverImage || "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
      genre: "IPTV • Directory • Channels",
      rating: "9.8 / 10"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`p-8 rounded-3xl border relative overflow-hidden ${
        isGoldMode
          ? "bg-amber-950/80 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          : "bg-slate-900/80 border-indigo-500/20"
      }`}>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold ${
            isGoldMode
              ? "bg-amber-500/20 border border-amber-400 text-amber-200"
              : "bg-amber-500/10 border border-amber-500/30 text-amber-300"
          }`}>
            <Tv2 className="w-4 h-4" />
            <span>LIVE ANIME MEDIA STREAM</span>
          </div>

          <h2 className={`text-3xl font-black uppercase tracking-tight ${isGoldMode ? "text-amber-200" : "text-white"}`}>
            Live Anime Feeds & Media Player
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Watch official Aniplus Asia live TV stream broadcasts and tune into ambient lofi soundtrack streams directly in high resolution.
          </p>
        </div>
      </div>

      {/* Main Video Stream Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)] aspect-video">
            {activeStreamUrl === "iptv-embed-widget" ? (
              <iframe
                srcDoc={LOCAL_IPTV_EMBED_HTML}
                title={activeStreamTitle}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : activeStreamUrl.includes(".m3u8") ? (
              <video
                src={activeStreamUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-slate-950"
              />
            ) : (
              <iframe
                src={activeStreamUrl}
                title={activeStreamTitle}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>LIVE STREAM • {activeStreamTitle.toUpperCase()}</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300">Live TV Channel • Embedded Broadcast</span>
              <span className="text-xs font-mono text-amber-400 font-bold">★ 9.9 / 10</span>
            </div>
            <h3 className="text-xl font-bold text-white">{activeStreamTitle}</h3>
            <p className="text-xs text-slate-400 font-mono">{activeStreamDesc}</p>
          </div>

          {/* Comment Section for Live Anime Stream */}
          <CommentSection
            targetId={`stream-${activeStreamTitle.replace(/\s+/g, "-").toLowerCase()}`}
            targetTitle={activeStreamTitle}
            userProfile={userProfile}
            onAddCommentCoins={onAddCoins}
            isGoldMode={isGoldMode}
          />
        </div>

        {/* Stream Playlist & Lofi Radio Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-4">
            <h4 className="text-xs font-bold font-mono tracking-wider text-purple-300 uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400" />
              <span>Anime TV Feeds & Channels</span>
            </h4>

            <div className="space-y-3">
              {animeChannels.map((item) => {
                const isSelected = activeStreamTitle === item.title;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      sfx.playClick();
                      setActiveStreamUrl(item.embedUrl);
                      setActiveStreamTitle(item.title);
                      setActiveStreamDesc(item.series);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-slate-800 border-purple-500 text-white shadow-md"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-16 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="overflow-hidden text-xs">
                      <h5 className="font-bold text-slate-200 truncate">{item.title}</h5>
                      <span className="text-[10px] text-purple-300 font-mono block">{item.genre}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Embedded YouTube Music Player */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-blue-950/60 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold">
                <Music className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>ISEKAI YOUTUBE MUSIC</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">YOUTUBE EMBED</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video border border-purple-500/30 shadow-lg">
              <iframe
                className="w-full h-full border-0"
                src="https://www.youtube.com/embed/MiKh4DobhTk"
                title="YouTube music player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME TRENDING ANIME FEED (DYNAMIC NEKOS.BEST, WAIFU.IM, WAIFU.PICS & ANILIST THUMBNAILS) */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-indigo-500/20 border border-rose-400/30 text-xs font-mono text-rose-300">
              <TrendingUp className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>LIVE ANIME MEDIA HIGHLIGHT • MULTI-API ENGINE</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Dynamic Live Anime Thumbnails
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Artwork & thumbnails dynamically populated from <strong className="text-rose-300">Nekos.best API v2</strong>, <strong className="text-purple-300">Waifu.im API</strong>, <strong className="text-indigo-300">Waifu.pics</strong> & <strong className="text-cyan-300">AniList GraphQL</strong>. Refreshing page or clicking button rotates thumbnails live.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshThumbnails}
              disabled={loadingRealTime}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingRealTime ? "animate-spin" : ""}`} />
              <span>{loadingRealTime ? "Refreshing..." : "🎲 Refresh Thumbnails"}</span>
            </button>

            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>MULTI-API LIVE</span>
            </span>
          </div>
        </div>

        {/* THUMBNAIL SEARCH BAR & API FILTER CHIPS */}
        <div className="space-y-3 pt-2">
          {/* Live Thumbnail Search Field */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-indigo-500/30">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search live anime thumbnails by title, category, or source API..."
                value={thumbnailSearchQuery}
                onChange={(e) => setThumbnailSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500/60 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
              {thumbnailSearchQuery && (
                <button
                  onClick={() => {
                    sfx.playClick();
                    setThumbnailSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Search Tag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {["Gojo", "Isekai", "Fantasy", "Action", "Solo Leveling"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    sfx.playClick();
                    setThumbnailSearchQuery(tag);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-[10px] font-mono text-slate-300 hover:text-rose-300 transition-all shrink-0 flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5 text-rose-400" />
                  <span>#{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* API Source Chips & Matching Counter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Source API:</span>
              </span>
              {[
                { id: "all", label: "All Combined" },
                { id: "Nekos.best API", label: "Nekos.best" },
                { id: "Waifu.im API", label: "Waifu.im" },
                { id: "Waifu.pics API", label: "Waifu.pics" },
                { id: "AniList GraphQL", label: "AniList" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sfx.playClick();
                    setSelectedApiFilter(cat.id);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    selectedApiFilter === cat.id
                      ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20 border border-purple-400"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Matching Result Count Badge */}
            {(() => {
              const matches = realTimeAnimeList.filter((item) => {
                const matchesApi = selectedApiFilter === "all" || item.sourceApi === selectedApiFilter;
                const matchesSearch = !thumbnailSearchQuery || 
                  item.title.toLowerCase().includes(thumbnailSearchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(thumbnailSearchQuery.toLowerCase()) ||
                  (item.sourceApi && item.sourceApi.toLowerCase().includes(thumbnailSearchQuery.toLowerCase()));
                return matchesApi && matchesSearch;
              });

              return (
                <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                  Showing <strong className="text-white">{matches.length}</strong> dynamic live thumbnails
                </span>
              );
            })()}
          </div>
        </div>

        {loadingRealTime ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-800" />
            ))}
          </div>
        ) : (
          (() => {
            const filteredThumbnails = realTimeAnimeList.filter((item) => {
              const matchesApi = selectedApiFilter === "all" || item.sourceApi === selectedApiFilter;
              const matchesSearch = !thumbnailSearchQuery || 
                item.title.toLowerCase().includes(thumbnailSearchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(thumbnailSearchQuery.toLowerCase()) ||
                (item.sourceApi && item.sourceApi.toLowerCase().includes(thumbnailSearchQuery.toLowerCase()));
              return matchesApi && matchesSearch;
            });

            if (filteredThumbnails.length === 0) {
              return (
                <div className="p-12 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <Search className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">No live thumbnails match "{thumbnailSearchQuery}"</p>
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setThumbnailSearchQuery("");
                      setSelectedApiFilter("all");
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all"
                  >
                    Clear Search Filter
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {filteredThumbnails.slice(0, 18).map((anime) => (
                  <div
                    key={anime.id}
                    onClick={() => {
                      sfx.playClick();
                      setSelectedThumbnailModal(anime);
                      if (anime.bannerImage) {
                        setActiveStreamTitle(anime.title);
                        setActiveStreamDesc(anime.description || "Live anime preview highlight.");
                      }
                    }}
                    className="group cursor-pointer rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-400 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                      <img
                        src={anime.coverImage}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                      {/* Source API Badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/85 border border-indigo-400/50 text-[9px] font-mono font-bold text-indigo-300 shadow">
                        {anime.sourceApi || "Nekos.best"}
                      </div>

                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/85 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{anime.score}</span>
                      </div>
                    </div>

                    <div className="p-3 space-y-1">
                      <h4 className="font-bold text-xs text-white truncate group-hover:text-purple-300 transition-colors">
                        {anime.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-indigo-400 font-semibold truncate max-w-[80px]">{anime.category}</span>
                        <span className="text-slate-400">{anime.artist ? "Artist" : "Live"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>

      {/* THUMBNAIL LIGHTBOX PREVIEW MODAL */}
      {selectedThumbnailModal && (
        <div
          onClick={() => setSelectedThumbnailModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative overflow-hidden"
          >
            <button
              onClick={() => setSelectedThumbnailModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={selectedThumbnailModal.coverImage}
                alt={selectedThumbnailModal.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-mono text-purple-300">
                  {selectedThumbnailModal.sourceApi} • {selectedThumbnailModal.category}
                </span>
                <span className="text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {selectedThumbnailModal.score}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedThumbnailModal.title}</h3>
              {selectedThumbnailModal.description && (
                <p className="text-xs text-slate-400 leading-relaxed max-h-24 overflow-y-auto font-mono">
                  {selectedThumbnailModal.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sfx.playClick();
                  navigator.clipboard.writeText(selectedThumbnailModal.coverImage);
                  alert("Thumbnail image URL copied to clipboard!");
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all text-center"
              >
                Copy Thumbnail Link
              </button>
              <button
                onClick={() => setSelectedThumbnailModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
