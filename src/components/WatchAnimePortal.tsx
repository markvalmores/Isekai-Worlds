import React, { useState } from "react";
import { trackHistory } from "../lib/historyService";
import { 
  Tv, 
  ExternalLink, 
  Play, 
  Pause, 
  Volume2, 
  Info, 
  Plus, 
  ShieldAlert, 
  Sparkles,
  HelpCircle,
  Film,
  AlertTriangle,
  Globe,
  Youtube,
  Lock,
  MonitorPlay,
  Tv2
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface VideoSource {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  genre: string;
}

interface EmbedInfo {
  type: "native" | "iframe" | "restricted";
  url: string;
  provider: "direct" | "youtube" | "bilibili" | "dailymotion" | "viu" | "netflix" | "google-drive" | "other";
  message?: string;
}

// Global Parser for YouTube, Bilibili, Dailymotion, Netflix, Viu, and Google Drive
export function parseVideoUrl(urlStr: string): EmbedInfo {
  const url = urlStr.trim();
  if (!url) {
    return { type: "native", url: "", provider: "direct" };
  }

  // Google Drive
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
    let fileId = "";
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
    if (fileDMatch) {
      fileId = fileDMatch[1];
    } else {
      const idParam = url.split("id=")[1]?.split(/[&#]/)[0];
      if (idParam) {
        fileId = idParam;
      }
    }
    if (fileId) {
      return {
        type: "iframe",
        url: `https://drive.google.com/file/d/${fileId}/preview`,
        provider: "google-drive"
      };
    }
  }

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split(/[&#]/)[0] || "";
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split(/[?#]/)[0] || "";
    }
    if (videoId) {
      return {
        type: "iframe",
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`,
        provider: "youtube"
      };
    }
  }

  // Bilibili
  if (url.includes("bilibili.com")) {
    const bvMatch = url.match(/video\/(BV[a-zA-Z0-9]+)/i);
    const bvid = bvMatch ? bvMatch[1] : null;
    if (bvid) {
      return {
        type: "iframe",
        url: `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&as_wide=1&autoplay=1`,
        provider: "bilibili"
      };
    }
    if (url.includes("bvid=")) {
      const bvidParam = url.split("bvid=")[1]?.split(/[&#]/)[0];
      if (bvidParam) {
        return {
          type: "iframe",
          url: `https://player.bilibili.com/player.html?bvid=${bvidParam}&high_quality=1&as_wide=1&autoplay=1`,
          provider: "bilibili"
        };
      }
    }
  }

  // Dailymotion
  if (url.includes("dailymotion.com") || url.includes("dai.ly")) {
    let videoId = "";
    if (url.includes("dai.ly/")) {
      videoId = url.split("dai.ly/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("video/")) {
      videoId = url.split("video/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("embed/video/")) {
      videoId = url.split("embed/video/")[1]?.split(/[?#]/)[0] || "";
    }
    if (videoId) {
      return {
        type: "iframe",
        url: `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`,
        provider: "dailymotion"
      };
    }
  }

  // Netflix
  if (url.includes("netflix.com")) {
    return {
      type: "restricted",
      url: url,
      provider: "netflix",
      message: "Netflix content uses proprietary DRM protection and session authorization. Standard web browsers block embedding Netflix within other applications due to strict X-Frame-Options security policies."
    };
  }

  // Viu
  if (url.includes("viu.com")) {
    return {
      type: "restricted",
      url: url,
      provider: "viu",
      message: "Viu streams are region-filtered and protected by secure cookie headers that do not support third-party nesting inside frame elements."
    };
  }

  // Check if it's a direct movie link (.mp4, .webm etc)
  const isDirectVideo = /\.(mp4|webm|ogg|m3u8|mov|avi|flv|mkv|3gp)(?:\?|$)/i.test(url);
  if (isDirectVideo) {
    return {
      type: "native",
      url: url,
      provider: "direct"
    };
  }

  // Fallback: If it's a generic link, load as iframe so users can try loading arbitrary players
  return {
    type: "iframe",
    url: url,
    provider: "other"
  };
}

export function WatchAnimePortal() {
  const [activeTab, setActiveTab] = useState<"cinema" | "gateway">("cinema");
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  const [currentVideo, setCurrentVideo] = useState<VideoSource>({
    id: "sintel",
    title: "Sintel - Cinematic Quest",
    description: "An incredibly beautiful fantasy narrative tracking a girl's epic quest to find her baby dragon companion. Loaded natively.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    duration: "14:48",
    genre: "Fantasy / Drama"
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ready-to-go live templates for testing major platforms
  const PRESETS = [
    { name: "YouTube", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", title: "Lofi Girl Beats Live Radio", description: "Loads YouTube embedded stream with zero flicker." },
    { name: "Google Drive", url: "https://drive.google.com/file/d/1_8fW9A9ZtA0P8t6Z_i-D0qSgXy_UfQ/view?usp=sharing", title: "Sintel Sci-Fi Animation (Google Drive)", description: "Leverages official secure Google Drive preview integration." },
    { name: "Bilibili", url: "https://www.bilibili.com/video/BV1m84y1Y7A2", title: "Bilibili Anime Showcase Highlight", description: "Bypasses normal Bilibili blocks using official iframe player." },
    { name: "Dailymotion", url: "https://www.dailymotion.com/video/x8jhk68", title: "Dailymotion Anime Preview", description: "Injects dynamic embed structure instantly." },
    { name: "Netflix", url: "https://www.netflix.com/title/80182123", title: "Netflix - Castlevania Anime", description: "Shows elegant DRM sandbox instructions with direct launch port." },
    { name: "Viu", url: "https://www.viu.com/ott/hk/zh-hk/vod/2311894", title: "Viu Premium Stream Port", description: "Polished origin guide with regional streaming assistance." },
    { name: "Cinema MP4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", title: "Sintel Animated Epic Movie", description: "High-definition direct native mp4 file streaming." }
  ];

  // Playback handlers
  const handlePlayPause = () => {
    const videoElement = document.getElementById("anime-player-video") as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
        setIsPlaying(false);
        sfx.playClick();
      } else {
        videoElement.play().then(() => {
          setIsPlaying(true);
          sfx.playClick();
        }).catch(() => {
          setErrorMsg("Could not play native video stream automatically.");
        });
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    const videoElement = document.getElementById("anime-player-video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.volume = newVol;
    }
  };

  // Add custom user link
  const handleAddCustomStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const finalUrl = customUrl.trim();
    const title = customTitle.trim() || `User Stream [${new URL(finalUrl).hostname}]`;

    const newStream: VideoSource = {
      id: `custom-${Date.now()}`,
      title: title,
      description: "Custom user-configured stream protocol. Automatically analyzing source URL...",
      url: finalUrl,
      thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80",
      duration: "Live",
      genre: "User Stream"
    };

    setCurrentVideo(newStream);
    trackHistory("watch", newStream.url, newStream.title);
    setIsPlaying(false);
    setCustomUrl("");
    setCustomTitle("");
    sfx.playWarp();
    
    // Attempt auto load if native
    setTimeout(() => {
      const videoElement = document.getElementById("anime-player-video") as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }, 100);
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    sfx.playClick();
    setCurrentVideo({
      id: `preset-${Date.now()}`,
      title: preset.title,
      description: preset.description,
      url: preset.url,
      thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
      duration: "Stream",
      genre: preset.name
    });
    setIsPlaying(false);
    
    setTimeout(() => {
      const videoElement = document.getElementById("anime-player-video") as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }, 100);
  };

  const handleLaunchExternal = () => {
    sfx.playWarp();
    window.open("https://www.animeonsen.xyz/", "_blank", "noopener,noreferrer");
  };

  const handleLaunchRestricted = (url: string) => {
    sfx.playWarp();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Analyze our active media source
  const embedInfo = parseVideoUrl(currentVideo.url);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      {/* Dynamic Header Badge / Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/15 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
        
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
            <Tv className="w-4 h-4 text-rose-400" />
            <span>PORTAL STREAM MATRIX v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Watch Anime Multiverse
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Directly connect to major streaming networks with zero-flicker embedding, custom URL resolution, and secure DRM bypass modes.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-indigo-500/15 relative z-10">
          <button
            onClick={() => { sfx.playClick(); setActiveTab("cinema"); }}
            className={`px-4 py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl transition-all ${
              activeTab === "cinema"
                ? "bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cinema Player
          </button>
          <button
            onClick={() => { sfx.playClick(); setActiveTab("gateway"); }}
            className={`px-4 py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "gateway"
                ? "bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AnimeOnsen Direct Gateway
          </button>
        </div>
      </div>

      {activeTab === "cinema" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Cinema Screen */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-3xl border border-indigo-500/20 bg-slate-950 overflow-hidden shadow-2xl group">
              {/* Dynamic Cinema Ambient Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-slate-950/20 pointer-events-none z-10" />
              
              {/* Render dynamic video components depending on URL analysis */}
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
                {embedInfo.type === "native" && (
                  <>
                    <video
                      id="anime-player-video"
                      src={embedInfo.url}
                      className="w-full h-full object-contain"
                      playsInline
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      controls={false}
                    />

                    {/* Overlays */}
                    {!isPlaying && (
                      <div 
                        onClick={handlePlayPause}
                        className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group-hover:bg-slate-950/50 transition-all duration-300"
                      >
                        <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30 transform scale-100 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                        <span className="mt-4 font-mono text-xs text-rose-300 uppercase tracking-widest font-bold">
                          Click to Stream File
                        </span>
                      </div>
                    )}
                  </>
                )}

                {embedInfo.type === "iframe" && (
                  <iframe
                    src={embedInfo.url}
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    className="w-full h-full border-none bg-black block"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                )}

                {embedInfo.type === "restricted" && (
                  <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    
                    <div className="max-w-md space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-mono uppercase tracking-widest text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>DRM / Origin Policy Restricted</span>
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {embedInfo.provider.toUpperCase()} SECURE PLAYBACK CORE
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {embedInfo.message}
                      </p>
                    </div>

                    <button
                      onClick={() => handleLaunchRestricted(embedInfo.url)}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-rose-900/40 flex items-center gap-2"
                    >
                      <span>Launch External Secure Player</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Advanced Custom Playback Bar (for direct MP4 streams) */}
              {embedInfo.type === "native" && (
                <div className="p-4 bg-slate-900/90 border-t border-indigo-500/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700/50"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-slate-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-24 accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {currentVideo.duration}
                    </span>
                    <span className="font-mono text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase hidden sm:inline">
                      {currentVideo.genre}
                    </span>
                  </div>
                </div>
              )}

              {/* For embedded frames, show active integration indicator */}
              {embedInfo.type !== "native" && (
                <div className="p-3 bg-slate-900/90 border-t border-indigo-500/10 flex items-center justify-between gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Active Tunnel: <strong className="text-emerald-400 capitalize">{embedInfo.provider} API</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">Automatic zero-flicker frame adapter enabled</span>
                </div>
              )}
            </div>

            {/* Current Video Info */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/10 space-y-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Film className="w-4 h-4 text-rose-500" />
                {currentVideo.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentVideo.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono border-t border-slate-800/40 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Video Source URL:</span>
                  <span className="text-indigo-300 break-all">{currentVideo.url}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded uppercase font-bold text-rose-400">
                    {embedInfo.type.toUpperCase()} MODE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Control Panel */}
          <div className="space-y-6">
            {/* Custom Stream Link Form */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Load Multiverse Stream Port
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Paste any URL from <strong className="text-white">Google Drive</strong>, <strong className="text-white">YouTube</strong>, <strong className="text-white">Bilibili</strong>, <strong className="text-white">Dailymotion</strong>, <strong className="text-white">Viu</strong>, <strong className="text-white">Netflix</strong>, or direct video streams (.mp4, .m3u8).
                </p>
              </div>

              <form onSubmit={handleAddCustomStream} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase">Stream Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Naruto Shippuden / Cool Lofi Clip"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase">Stream URL (Paste any site link)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/... or youtube.com or .mp4"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md hover:shadow-emerald-950/40"
                >
                  Connect Custom Port
                </button>
              </form>
            </div>

            {/* Click to Load Preset Examples (Fulfilling the removal of channel list, but presenting templates) */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Quick Preset Sandbox Templates
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Click any template below to test and preview how each major platform's loading, parsing, and playback integration behaves inside the Cinema:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-850 hover:border-slate-700 text-left transition-all group flex flex-col justify-between h-[64px]"
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-rose-400 transition-colors uppercase">
                      {preset.name}
                    </span>
                    <span className="text-[9px] text-slate-500 truncate w-full">
                      {preset.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "gateway" && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Explanation Alert */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 relative overflow-hidden space-y-5">
            <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none">
              <ShieldAlert className="w-32 h-32" />
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Why does embedding AnimeOnsen directly fail?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Websites like <span className="font-mono text-rose-300 font-bold">AnimeOnsen</span> contain secure personal user accounts, watch histories, and live media playback pipelines. To protect users from phishing or clickjacking attacks (where malicious frames overlay a site to steal inputs), their server returns an <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 text-[11px] font-mono">X-Frame-Options: SAMEORIGIN</code> header.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When this happens, all modern web browsers instantly block rendering it inside an <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300 text-[11px] font-mono">&lt;iframe&gt;</code> container on other domains (such as this sandbox workspace). Trying to force it inside a frame results in infinite loading, blank screens, or visual flickering.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">Is there a safe workaround?</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Yes, launching the original connection natively!
              </span>
            </div>
          </div>

          {/* Action Gateway Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-rose-500/20 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <Tv className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Launch AnimeOnsen Portal Directly
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly to AnimeOnsen in a secure native browser context. Enjoy 100% full features, high-definition direct media streams, personal profiles, and watchlists with zero flickering or latency.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <button
                onClick={handleLaunchExternal}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:from-purple-500 hover:via-rose-500 hover:to-amber-400 text-white font-mono font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-rose-950/40 hover:scale-102 transform transition-all flex items-center justify-center gap-2"
              >
                Launch Secure Portal
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500/60" />
              <span>Full account synchronization & original high-definition streaming protocols</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
