import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Tv,
  Share2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Headphones,
  Radio,
  Check,
  Search,
  Flame,
  Star,
  ListMusic,
  Disc3,
  Layers,
  Volume2,
  VolumeX,
  Plus
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface VocaloidTrack {
  id: string;
  title: string;
  artist: string;
  producer: string;
  vocalist: string;
  videoId: string;
  thumb: string;
  tag: string;
  views?: string;
  year?: string;
}

const DEFAULT_VIDEO_ID = "h4hy2Gn-FVE";

const CURATED_VOCALOID_TRACKS: VocaloidTrack[] = [
  {
    id: "v-featured",
    title: "Vocaloid Official Showcase (Featured)",
    artist: "Hatsune Miku & Vocaloid All-Stars",
    producer: "Crypton Future Media",
    vocalist: "Hatsune Miku",
    videoId: "h4hy2Gn-FVE",
    thumb: "https://img.youtube.com/vi/h4hy2Gn-FVE/hqdefault.jpg",
    tag: "🔥 Featured Concert",
    views: "Featured Masterpiece",
    year: "2024"
  },
  {
    id: "v-senbonzakura",
    title: "Senbonzakura (千本桜)",
    artist: "Kurousa-P feat. Hatsune Miku",
    producer: "WhiteFlame / Kurousa-P",
    vocalist: "Hatsune Miku",
    videoId: "shs0rAiwsGQ",
    thumb: "https://img.youtube.com/vi/shs0rAiwsGQ/hqdefault.jpg",
    tag: "👑 Legendary Classic",
    views: "100M+ Views",
    year: "Classic"
  },
  {
    id: "v-world-is-mine",
    title: "The World is Mine (ワールドイズマイン)",
    artist: "ryo (supercell) feat. Hatsune Miku",
    producer: "ryo (supercell)",
    vocalist: "Hatsune Miku",
    videoId: "EuJ6UR_p40A",
    thumb: "https://img.youtube.com/vi/EuJ6UR_p40A/hqdefault.jpg",
    tag: "✨ Diva Anthem",
    views: "50M+ Views",
    year: "Classic"
  },
  {
    id: "v-ghost-rule",
    title: "Ghost Rule (ゴーストルール)",
    artist: "DECO*27 feat. Hatsune Miku",
    producer: "DECO*27",
    vocalist: "Hatsune Miku",
    videoId: "KushW63GWAo",
    thumb: "https://img.youtube.com/vi/KushW63GWAo/hqdefault.jpg",
    tag: "⚡ High Energy Rock",
    views: "40M+ Views",
    year: "Iconic"
  },
  {
    id: "v-god-ish",
    title: "God-ish (神っぽいな / Kamippoina)",
    artist: "PinocchioP feat. Hatsune Miku",
    producer: "PinocchioP",
    vocalist: "Hatsune Miku",
    videoId: "EHBFKhLUVig",
    thumb: "https://img.youtube.com/vi/EHBFKhLUVig/hqdefault.jpg",
    tag: "🌟 Modern Sensation",
    views: "60M+ Views",
    year: "Modern"
  },
  {
    id: "v-sand-planet",
    title: "Sand Planet / Dune (砂の惑星)",
    artist: "Hachi (Kenshi Yonezu) feat. Hatsune Miku",
    producer: "Hachi (Kenshi Yonezu)",
    vocalist: "Hatsune Miku",
    videoId: "AS4q9yaWJkI",
    thumb: "https://img.youtube.com/vi/AS4q9yaWJkI/hqdefault.jpg",
    tag: "🪐 Magical Mirai Theme",
    views: "70M+ Views",
    year: "Magical Mirai"
  },
  {
    id: "v-melt",
    title: "Melt (メルト)",
    artist: "ryo (supercell) feat. Hatsune Miku",
    producer: "ryo (supercell)",
    vocalist: "Hatsune Miku",
    videoId: "o1jAMSQQ458",
    thumb: "https://img.youtube.com/vi/o1jAMSQQ458/hqdefault.jpg",
    tag: "🌸 Original Origin",
    views: "Hall of Fame",
    year: "First Era"
  },
  {
    id: "v-rolling-girl",
    title: "Rolling Girl (ローリンガール)",
    artist: "wowaka feat. Hatsune Miku",
    producer: "wowaka",
    vocalist: "Hatsune Miku",
    videoId: "vnw8zUR114o",
    thumb: "https://img.youtube.com/vi/vnw8zUR114o/hqdefault.jpg",
    tag: "🎸 Eternal Masterpiece",
    views: "Historic",
    year: "wowaka Legacy"
  },
  {
    id: "v-popipo",
    title: "PoPiPo (ぽっぴっぽー Vegetable Juice)",
    artist: "LamazeP feat. Hatsune Miku",
    producer: "LamazeP",
    vocalist: "Hatsune Miku",
    videoId: "T0-2lFd7S3A",
    thumb: "https://img.youtube.com/vi/T0-2lFd7S3A/hqdefault.jpg",
    tag: "🥤 Viral Anthem",
    views: "Pop Icon",
    year: "Fun"
  }
];

export function VocaloidPortal() {
  const [currentVideoId, setCurrentVideoId] = useState<string>(() => {
    try {
      return localStorage.getItem("isekai_vocaloid_video_id") || DEFAULT_VIDEO_ID;
    } catch {
      return DEFAULT_VIDEO_ID;
    }
  });

  const [customInput, setCustomInput] = useState<string>("");
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Helper to extract YouTube Video ID from various link formats
  const extractVideoId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return DEFAULT_VIDEO_ID;

    // Direct ID check (standard 11 characters or typical YouTube ID pattern)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    try {
      // Handles https://www.youtube.com/watch?v=h4hy2Gn-FVE or https://youtu.be/h4hy2Gn-FVE
      if (trimmed.includes("youtu.be/")) {
        const parts = trimmed.split("youtu.be/");
        const after = parts[1]?.split("?")[0]?.split("&")[0];
        if (after) return after;
      }
      if (trimmed.includes("watch?v=")) {
        const parts = trimmed.split("watch?v=");
        const after = parts[1]?.split("&")[0]?.split("?")[0];
        if (after) return after;
      }
      if (trimmed.includes("/embed/")) {
        const parts = trimmed.split("/embed/");
        const after = parts[1]?.split("?")[0]?.split("&")[0];
        if (after) return after;
      }
    } catch (e) {
      console.warn("Failed to parse YouTube URL:", e);
    }

    return trimmed;
  };

  const handleSelectTrack = (track: VocaloidTrack) => {
    sfx.playClick();
    setCurrentVideoId(track.videoId);
    try {
      localStorage.setItem("isekai_vocaloid_video_id", track.videoId);
    } catch {}
  };

  const handleApplyCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInput.trim()) return;

    sfx.playBadgeUnlock();
    const resolvedId = extractVideoId(customInput);
    setCurrentVideoId(resolvedId);
    try {
      localStorage.setItem("isekai_vocaloid_video_id", resolvedId);
    } catch {}
    setCustomInput("");
  };

  const handleToggleFullscreen = () => {
    sfx.playClick();
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {
        // Fallback for iframe fullscreen
        if (iframeRef.current?.requestFullscreen) {
          iframeRef.current.requestFullscreen();
        }
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleShare = () => {
    sfx.playClick();
    const url = `https://www.youtube.com/watch?v=${currentVideoId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const currentTrackInfo = CURATED_VOCALOID_TRACKS.find(
    (t) => t.videoId === currentVideoId
  ) || {
    id: "custom",
    title: "Custom Vocaloid Concert Stream",
    artist: "Vocaloid Synthesizer Engine",
    producer: "Custom URL Player",
    vocalist: "Virtual Singer",
    videoId: currentVideoId,
    thumb: `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`,
    tag: "✨ Custom Track",
    views: "Active Stream",
    year: "Live"
  };

  const embedUrl = `https://www.youtube.com/embed/${currentVideoId}?autoplay=${isAutoplay ? "1" : "0"}&rel=0&enablejsapi=1&modestbranding=1&playsinline=1`;

  return (
    <div className="space-y-6 pb-16 animate-fadeIn text-slate-100">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-slate-900/90 border border-teal-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Glow Spheres */}
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-400/40 rounded-full text-teal-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Disc3 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
              <span>01 // Vocaloid Synthetic Soundstage</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(20,184,166,0.4)]">
                Vocaloid Multiverse
              </span>
              <Sparkles className="w-6 h-6 text-pink-400 shrink-0 hidden sm:inline" />
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience electrifying Hatsune Miku concerts, original producer synthesizers (Kagamine Rin/Len, Megurine Luka, MEIKO, KAITO), iconic live MV edits, and community stage performances.
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => {
                  sfx.playClick();
                  setCurrentVideoId(DEFAULT_VIDEO_ID);
                  try {
                    localStorage.setItem("isekai_vocaloid_video_id", DEFAULT_VIDEO_ID);
                  } catch {}
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  currentVideoId === DEFAULT_VIDEO_ID
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30"
                    : "bg-slate-950/70 border border-teal-500/30 text-teal-300 hover:bg-slate-800"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-pink-400" />
                <span>Default Feature (h4hy2Gn-FVE)</span>
              </button>

              <button
                onClick={() => {
                  sfx.playClick();
                  setIsTheaterMode(!isTheaterMode);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                  isTheaterMode
                    ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30"
                    : "bg-slate-950/70 border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                <span>{isTheaterMode ? "Standard View" : "Theater Mode"}</span>
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-950/70 border border-slate-750 hover:border-teal-400 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                title="Full Screen Player"
              >
                <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Fill Screen</span>
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${currentVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white transition-all flex items-center gap-1.5"
                title="Open directly on YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in YouTube</span>
              </a>
            </div>
          </div>

          {/* Holographic Vocaloid Badge / Now Playing Card */}
          <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-4 md:w-80 shrink-0 shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                Now Playing Live
              </span>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                ID: {currentVideoId}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-teal-300 transition-colors">
                {currentTrackInfo.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{currentTrackInfo.artist}</p>
            </div>

            {/* Neon Sound Bars Animation */}
            <div className="flex items-end gap-1 h-6 pt-1">
              {[60, 100, 45, 80, 95, 30, 70, 85, 40, 90, 65, 100, 50, 75, 85, 40].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-teal-500 to-pink-400 rounded-t-sm animate-pulse"
                  style={{
                    height: `${height}%`,
                    animationDuration: `${0.6 + (i % 5) * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Stage & Embed Viewport */}
      <div
        ref={playerContainerRef}
        className={`relative transition-all duration-500 rounded-3xl overflow-hidden border border-teal-500/30 shadow-2xl bg-slate-950 ${
          isTheaterMode
            ? "w-full max-w-full h-[75vh] sm:h-[82vh]"
            : "w-full aspect-video max-h-[78vh]"
        }`}
      >
        {/* Floating In-Player Controls Overlay Header */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-teal-500/40 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={handleShare}
            className="p-2 bg-slate-900 hover:bg-teal-600 text-slate-200 hover:text-white rounded-xl transition-all text-xs font-mono flex items-center gap-1.5"
            title="Copy Video Link"
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedNotification ? "Copied!" : "Share"}</span>
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              // Force iframe refresh
              if (iframeRef.current) {
                iframeRef.current.src = embedUrl;
              }
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all text-xs"
            title="Reload Video Player"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setIsTheaterMode(!isTheaterMode);
            }}
            className="p-2 bg-slate-900 hover:bg-purple-600 text-slate-300 hover:text-white rounded-xl transition-all text-xs"
            title="Toggle Theater Mode"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center gap-1"
            title="Expand Full Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] uppercase font-mono font-bold">Full Screen</span>
          </button>
        </div>

        {/* YouTube Iframe Player */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Vocaloid Master Video Stream"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />
      </div>

      {/* URL Customizer & Video Switcher Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-400" />
              <span>Load Any Vocaloid Song or YouTube Link</span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste any YouTube Video URL (e.g. https://www.youtube.com/watch?v=...) or 11-digit Video ID.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleApplyCustomUrl} className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Paste YouTube Video URL or Video ID (e.g. h4hy2Gn-FVE)..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-teal-400 rounded-2xl py-2.5 pl-4 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs rounded-2xl transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-teal-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Load Video</span>
            </button>
          </form>
        </div>

        {/* Curated Vocaloid Hall of Fame Playlist Grid */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-pink-400" />
              <span>Hall of Fame Vocaloid Classics & Live Stage Tracks</span>
            </h3>
            <span className="text-[11px] font-mono text-teal-400">
              {CURATED_VOCALOID_TRACKS.length} Legendary Tracks Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CURATED_VOCALOID_TRACKS.map((track) => {
              const isSelected = currentVideoId === track.videoId;
              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track)}
                  className={`group relative rounded-2xl p-3 border transition-all cursor-pointer flex gap-3 select-none ${
                    isSelected
                      ? "bg-teal-950/60 border-teal-400 ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/20"
                      : "bg-slate-950/70 border-slate-800 hover:border-teal-500/50 hover:bg-slate-850"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src={track.thumb}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-transparent transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-teal-400 text-slate-950 scale-110 shadow-md"
                            : "bg-slate-950/80 text-white group-hover:bg-teal-500 group-hover:text-slate-950"
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold truncate">
                          {track.tag}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-bold truncate transition-colors ${
                          isSelected ? "text-teal-300" : "text-slate-200 group-hover:text-white"
                        }`}
                      >
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>{track.vocalist}</span>
                      <span>{track.views}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
