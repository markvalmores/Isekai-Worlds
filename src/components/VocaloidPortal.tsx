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
  Plus,
  Mic,
  Mic2,
  Globe,
  Languages,
  Copy,
  FastForward,
  Rewind,
  BookOpen,
  Info,
  Sliders,
  SlidersHorizontal,
  Type,
  PartyPopper,
  Zap,
  Activity,
  ChevronRight,
  ChevronLeft,
  Bot,
  Wand2,
  Timer,
  Gauge,
  RefreshCw,
  Cpu,
  Settings2,
  CheckCircle2,
  AlertCircle
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

interface KaraokeLine {
  id: string;
  section?: string;
  ja: string;
  romaji: string;
  en: string;
  timeOffsetSec?: number;
}

interface VocaloidLyricsData {
  songTitle: string;
  producer: string;
  vocalist: string;
  bpm?: number;
  recommendedSpeedSec?: number;
  romajiLyrics: string;
  japaneseLyrics: string;
  englishLyrics: string;
  lines: KaraokeLine[];
  trivia?: string;
  sources?: Array<{ title: string; uri: string }>;
}

interface AIDetectionResult {
  detectedSongTitle: string;
  producer: string;
  vocalist: string;
  vocalistColor?: string;
  genre: string;
  bpm: number;
  recommendedSpeedSec: number;
  confidence: number;
  mood: string;
  summary: string;
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
  const [copiedLyrics, setCopiedLyrics] = useState<boolean>(false);
  
  // Karaoke State
  const [lyricsData, setLyricsData] = useState<VocaloidLyricsData | null>(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState<boolean>(false);
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [isKaraokeAutoPlay, setIsKaraokeAutoPlay] = useState<boolean>(true);
  
  // Speed Adjustment & Tempo Sync Controls
  const [karaokeSpeedSec, setKaraokeSpeedSec] = useState<number>(5.5);
  const [syncOffsetSec, setSyncOffsetSec] = useState<number>(0.0);
  const [showSpeedPanel, setShowSpeedPanel] = useState<boolean>(false);
  const [beatPulse, setBeatPulse] = useState<boolean>(false);
  
  // AI Video Detection & Auto-Match State
  const [isDetectingAI, setIsDetectingAI] = useState<boolean>(false);
  const [aiDetection, setAiDetection] = useState<AIDetectionResult | null>(null);
  const [showAIDetectionCard, setShowAIDetectionCard] = useState<boolean>(false);
  const [autoDetectOnSwitch, setAutoDetectOnSwitch] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isekai_vocaloid_autodetect") !== "false";
    } catch {
      return true;
    }
  });

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);

  // Client-side Caches to prevent duplicate network calls & preserve API quota
  const lyricsCacheRef = useRef<Map<string, VocaloidLyricsData>>(new Map());
  const detectCacheRef = useRef<Map<string, AIDetectionResult>>(new Map());

  // Karaoke Mode: High Contrast, Extra-Large Typography & Dimmed Stage Focus (Disabled by default)
  const [isKaraokeMode, setIsKaraokeMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isekai_vocaloid_karaokemode") === "true";
    } catch {
      return false;
    }
  });

  // Live YouTube Sync & Tracing State
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [syncLiveStep, setSyncLiveStep] = useState<string>("");
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Toggle Karaoke Mode with SFX and persistence
  const toggleKaraokeMode = () => {
    sfx.playClick();
    const next = !isKaraokeMode;
    setIsKaraokeMode(next);
    try {
      localStorage.setItem("isekai_vocaloid_karaokemode", String(next));
    } catch {}
    if (next) {
      sfx.playBadgeUnlock();
    }
  };

  // Explicit enable / disable handlers
  const enableKaraokeMode = () => {
    if (!isKaraokeMode) {
      sfx.playBadgeUnlock();
      setIsKaraokeMode(true);
      try {
        localStorage.setItem("isekai_vocaloid_karaokemode", "true");
      } catch {}
    }
  };

  const disableKaraokeMode = () => {
    if (isKaraokeMode) {
      sfx.playClick();
      setIsKaraokeMode(false);
      try {
        localStorage.setItem("isekai_vocaloid_karaokemode", "false");
      } catch {}
    }
  };

  // Keyboard shortcut: Press 'K' to toggle Karaoke Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        toggleKaraokeMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isKaraokeMode]);

  // UI View Modes
  const [lyricsViewMode, setLyricsViewMode] = useState<"prompter" | "dual" | "romaji" | "japanese" | "english" | "fulltext">("prompter");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [manualSearchQuery, setManualSearchQuery] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [cheerEffect, setCheerEffect] = useState<boolean>(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);

  // Helper to extract YouTube Video ID from various link formats
  const extractVideoId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return DEFAULT_VIDEO_ID;

    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    try {
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

  const currentTrackInfo = CURATED_VOCALOID_TRACKS.find(
    (t) => t.videoId === currentVideoId
  ) || {
    id: "custom",
    title: aiDetection?.detectedSongTitle || "Custom Vocaloid Concert Stream",
    artist: aiDetection?.producer ? `${aiDetection.producer} feat. ${aiDetection.vocalist}` : "Vocaloid Synthesizer Engine",
    producer: aiDetection?.producer || "Custom URL Player",
    vocalist: aiDetection?.vocalist || "Virtual Singer",
    videoId: currentVideoId,
    thumb: `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`,
    tag: "✨ Custom Track",
    views: "Active Stream",
    year: "Live"
  };

  // Live YouTube Sync & AI Tracing Handler
  const handleSyncLiveYouTubeTrack = async () => {
    sfx.playClick();
    setIsSyncingLive(true);
    setSyncLiveStep("🎯 Tracing active YouTube stream & video ID...");

    try {
      await new Promise((r) => setTimeout(r, 400));
      setSyncLiveStep("⚡ Fast Gemini AI analyzing video cues, producer & vocalist...");

      const detectRes = await fetch("/api/vocaloid/ai-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: currentVideoId,
          userQuery: manualSearchQuery || undefined
        })
      });
      const detectData = await detectRes.json();

      setSyncLiveStep("✨ Aligning Romaji & Kanji lyrics & auto-calibrating tempo pace...");

      let songTitleToFetch = currentTrackInfo.title;
      if (detectData.success && detectData.detection) {
        setAiDetection(detectData.detection);
        setShowAIDetectionCard(true);
        if (detectData.detection.recommendedSpeedSec) {
          setKaraokeSpeedSec(Number(detectData.detection.recommendedSpeedSec));
        }
        songTitleToFetch = detectData.detection.detectedSongTitle;
      }

      const lyricsRes = await fetch("/api/vocaloid/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: currentVideoId,
          title: songTitleToFetch,
          artist: detectData.detection?.producer || currentTrackInfo.artist,
          producer: detectData.detection?.producer || currentTrackInfo.producer
        })
      });
      const lyricsJson = await lyricsRes.json();
      if (lyricsJson.success && lyricsJson.lyrics) {
        lyricsCacheRef.current.set(currentVideoId, lyricsJson.lyrics);
        setLyricsData(lyricsJson.lyrics);
        setActiveLineIndex(0);
        setIsKaraokeAutoPlay(true);
        if (lyricsJson.lyrics.recommendedSpeedSec && !detectData.detection?.recommendedSpeedSec) {
          setKaraokeSpeedSec(Number(lyricsJson.lyrics.recommendedSpeedSec));
        }
      }

      sfx.playBadgeUnlock();
      setSyncToastMessage(`🎯 Synced & Matched: ${songTitleToFetch}!`);
      setTimeout(() => setSyncToastMessage(null), 4500);
    } catch (err) {
      console.error("Live YouTube sync error:", err);
      fetchLyrics(undefined, currentVideoId);
    } finally {
      setIsSyncingLive(false);
      setSyncLiveStep("");
    }
  };

  // Run AI Video Detection & Metadata Extraction with Cache
  const runAIVideoDetection = async (videoIdToDetect: string = currentVideoId, queryOverride?: string) => {
    const cacheKey = `${videoIdToDetect}_${queryOverride || ""}`;
    if (detectCacheRef.current.has(cacheKey)) {
      const cached = detectCacheRef.current.get(cacheKey)!;
      setAiDetection(cached);
      setShowAIDetectionCard(true);
      if (cached.recommendedSpeedSec) {
        setKaraokeSpeedSec(Number(cached.recommendedSpeedSec));
      }
      fetchLyrics(cached.detectedSongTitle, videoIdToDetect);
      return;
    }

    setIsDetectingAI(true);
    try {
      const res = await fetch("/api/vocaloid/ai-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoIdToDetect,
          userQuery: queryOverride || undefined
        })
      });

      const data = await res.json();
      if (data.success && data.detection) {
        detectCacheRef.current.set(cacheKey, data.detection);
        setAiDetection(data.detection);
        setShowAIDetectionCard(true);

        // Auto-apply recommended speed if detected
        if (data.detection.recommendedSpeedSec) {
          setKaraokeSpeedSec(Number(data.detection.recommendedSpeedSec));
        }

        // Fetch matched lyrics using the newly detected title & producer
        fetchLyrics(data.detection.detectedSongTitle, videoIdToDetect);
        sfx.playBadgeUnlock();
      }
    } catch (err) {
      console.warn("AI Detection fallback:", err);
    } finally {
      setIsDetectingAI(false);
    }
  };

  // Fetch lyrics with client cache and fallback handling
  const fetchLyrics = async (customQuery?: string, videoIdToFetch: string = currentVideoId) => {
    const cacheKey = videoIdToFetch || (customQuery || manualSearchQuery || "").toLowerCase();
    if (lyricsCacheRef.current.has(cacheKey)) {
      const cached = lyricsCacheRef.current.get(cacheKey)!;
      setLyricsData(cached);
      setActiveLineIndex(0);
      setLyricsError(null);
      return;
    }

    setIsLoadingLyrics(true);
    setLyricsError(null);
    try {
      const res = await fetch("/api/vocaloid/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoIdToFetch,
          title: customQuery || currentTrackInfo.title,
          artist: currentTrackInfo.artist,
          producer: currentTrackInfo.producer,
          query: customQuery || manualSearchQuery || undefined
        })
      });

      const data = await res.json();
      if (data.success && data.lyrics) {
        lyricsCacheRef.current.set(cacheKey, data.lyrics);
        setLyricsData(data.lyrics);
        setActiveLineIndex(0);

        // Auto-calibrate speed if provided by lyrics response and not manually overridden
        if (data.lyrics.recommendedSpeedSec && !aiDetection) {
          setKaraokeSpeedSec(Number(data.lyrics.recommendedSpeedSec));
        }
      } else {
        setLyricsError(data.error || "Using offline lyrics archive mode.");
      }
    } catch (err: any) {
      console.warn("Vocaloid karaoke lyrics notice:", err);
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  // Trigger lyrics fetch and optional AI detection whenever video changes
  useEffect(() => {
    // If it's a curated track, prefill info
    const curated = CURATED_VOCALOID_TRACKS.find(t => t.videoId === currentVideoId);
    if (curated) {
      fetchLyrics(curated.title, currentVideoId);
    } else if (autoDetectOnSwitch) {
      runAIVideoDetection(currentVideoId);
    } else {
      fetchLyrics(undefined, currentVideoId);
    }
  }, [currentVideoId]);

  // Karaoke Auto-Advance Timer with Speed Calibration
  useEffect(() => {
    if (!isKaraokeAutoPlay || !lyricsData?.lines?.length) return;

    const intervalMs = Math.max(800, karaokeSpeedSec * 1000);
    const interval = setInterval(() => {
      setBeatPulse(true);
      setTimeout(() => setBeatPulse(false), 200);

      setActiveLineIndex((prev) => {
        if (prev >= lyricsData.lines.length - 1) {
          return 0; // Loop back to start of song
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isKaraokeAutoPlay, karaokeSpeedSec, lyricsData?.lines?.length]);

  // Scroll active line inside the internal lyrics container without jumping or auto-focusing the outer window
  useEffect(() => {
    if (lineContainerRef.current) {
      const activeEl = lineContainerRef.current.querySelector(`[data-line-idx="${activeLineIndex}"]`) as HTMLElement | null;
      if (activeEl) {
        const container = lineContainerRef.current;
        const offsetTop = activeEl.offsetTop - container.offsetTop;
        container.scrollTo({ top: Math.max(0, offsetTop - 40), behavior: "smooth" });
      }
    }
  }, [activeLineIndex]);

  const handleSelectTrack = (track: VocaloidTrack) => {
    sfx.playClick();
    setCurrentVideoId(track.videoId);
    setAiDetection(null);
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
    setAiDetection(null);
    try {
      localStorage.setItem("isekai_vocaloid_video_id", resolvedId);
    } catch {}
    setCustomInput("");
  };

  const handleManualSearchLyrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSearchQuery.trim()) return;
    sfx.playClick();
    runAIVideoDetection(currentVideoId, manualSearchQuery.trim());
  };

  const handleToggleFullscreen = () => {
    sfx.playClick();
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {
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

  const handleCopyFullLyrics = () => {
    sfx.playClick();
    if (!lyricsData) return;

    const fullText = `=== ${lyricsData.songTitle} ===\nVocalist: ${lyricsData.vocalist} | Producer: ${lyricsData.producer}\nTempo Pace: ${karaokeSpeedSec}s / verse\n\n[ROMAJI]\n${lyricsData.romajiLyrics}\n\n[JAPANESE]\n${lyricsData.japaneseLyrics}\n\n[ENGLISH]\n${lyricsData.englishLyrics}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopiedLyrics(true);
      setTimeout(() => setCopiedLyrics(false), 2000);
    }
  };

  const triggerCrowdCheer = () => {
    sfx.playBadgeUnlock();
    setCheerEffect(true);
    setTimeout(() => setCheerEffect(false), 2200);
  };

  // Tap tempo handler
  const handleTapTempo = () => {
    sfx.playClick();
    const now = Date.now();
    const taps = tapTimesRef.current.filter((t) => now - t < 3000);
    taps.push(now);
    tapTimesRef.current = taps;

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgIntervalMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      // Convert beat interval to verse scroll pace (approx 4-8 beats per verse)
      const measuredVerseSec = Math.max(1.5, Math.min(12.0, (avgIntervalMs * 4) / 1000));
      const rounded = Math.round(measuredVerseSec * 10) / 10;
      setKaraokeSpeedSec(rounded);
    }
  };

  const currentLine = lyricsData?.lines?.[activeLineIndex];
  const totalLines = lyricsData?.lines?.length || 1;
  const progressPercent = Math.round(((activeLineIndex + 1) / totalLines) * 100);

  // Approximate BPM estimation for the current verse pace
  const calculatedApproxBpm = Math.round((60 / karaokeSpeedSec) * 4);

  const embedUrl = `https://www.youtube.com/embed/${currentVideoId}?autoplay=${isAutoplay ? "1" : "0"}&rel=0&enablejsapi=1&modestbranding=1&playsinline=1`;

  const fontClasses = {
    sm: isKaraokeMode ? "text-base sm:text-xl font-bold" : "text-xs sm:text-sm",
    base: isKaraokeMode ? "text-xl sm:text-3xl font-black" : "text-sm sm:text-base",
    lg: isKaraokeMode ? "text-2xl sm:text-4xl font-black" : "text-base sm:text-lg",
    xl: isKaraokeMode ? "text-3xl sm:text-5xl font-black" : "text-lg sm:text-xl font-bold"
  };

  return (
    <div className={`space-y-6 pb-20 animate-fadeIn text-slate-100 relative transition-colors duration-500 ${
      isKaraokeMode ? "bg-slate-950/95" : ""
    }`}>
      {/* Live Sync Match Toast Notification */}
      {syncToastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-950/95 border-2 border-teal-400 text-white px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.5)] backdrop-blur-xl flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-teal-400 animate-spin shrink-0" />
          <div className="space-y-0.5">
            <div className="text-xs font-mono font-black text-teal-300 uppercase tracking-wide">Live YouTube Sync Complete</div>
            <p className="text-xs font-mono text-slate-200">{syncToastMessage}</p>
          </div>
        </div>
      )}

      {/* Dimmed Background Overlay in Karaoke Mode */}
      {isKaraokeMode && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-[2px] pointer-events-none z-10 transition-opacity duration-500" />
      )}

      {/* Hero Header Banner (Dimmed when in Karaoke Mode for laser focus on stage) */}
      <div className={`relative rounded-3xl bg-slate-900/95 border border-teal-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isKaraokeMode ? "opacity-35 hover:opacity-100 z-20" : "opacity-100"
      }`}>
        {/* Animated Background Glow Spheres */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-teal-500/10 border border-teal-400/40 rounded-full text-teal-300 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
              <Disc3 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
              <span>01 // Vocaloid Live Soundstage & AI Karaoke Prompter</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(20,184,166,0.4)]">
                Vocaloid Karaoke Multiverse
              </span>
              <Mic className="w-7 h-7 text-teal-400 shrink-0 hidden sm:inline animate-pulse" />
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sing along with synchronized live karaoke lyrics powered by real-time Google Search grounding. Features AI video tempo detection, continuous speed adjustment slider, Romaji, Kanji, and English translations!
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {/* Karaoke Mode Toggle Switch */}
              <button
                onClick={toggleKaraokeMode}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border shadow-lg active:scale-95 ${
                  isKaraokeMode
                    ? "bg-gradient-to-r from-teal-400 via-cyan-400 to-pink-400 text-slate-950 border-teal-300 ring-2 ring-teal-400/50 shadow-teal-500/40"
                    : "bg-slate-950/80 border-slate-700 text-slate-300 hover:text-white hover:border-teal-400"
                }`}
                title="Toggle Karaoke Mode (High contrast, large font display & dimmed background for focus) [Press 'K']"
              >
                <div className={`w-2 h-2 rounded-full ${isKaraokeMode ? "bg-slate-950 animate-ping" : "bg-slate-600"}`} />
                <Mic className={`w-3.5 h-3.5 ${isKaraokeMode ? "text-slate-950" : "text-teal-400"}`} />
                <span>{isKaraokeMode ? "Karaoke: Enabled (Click to Disable)" : "Karaoke: Disabled (Click to Enable)"}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-slate-900/40 border border-slate-700/50 text-slate-400 font-normal">
                  [K]
                </span>
              </button>

              {/* Dedicated Live YouTube Sync & AI Match Button */}
              <button
                onClick={handleSyncLiveYouTubeTrack}
                disabled={isSyncingLive || isDetectingAI}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 hover:from-pink-400 hover:to-teal-300 text-white hover:text-slate-950 shadow-lg shadow-pink-500/25 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                title="Trace currently playing YouTube song and match lyrics + tempo automatically using fast Gemini AI"
              >
                {isSyncingLive ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                )}
                <span>{isSyncingLive ? "Tracing YouTube Song..." : "⚡ Sync YouTube & Match Lyrics"}</span>
              </button>

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
                <span>Featured Showcase (h4hy2Gn-FVE)</span>
              </button>

              {/* AI Detect Button */}
              <button
                onClick={() => {
                  sfx.playClick();
                  runAIVideoDetection(currentVideoId);
                }}
                disabled={isDetectingAI || isSyncingLive}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-teal-500/30 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                title="Use Gemini AI to analyze the video and match synchronized lyrics + tempo"
              >
                {isDetectingAI ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Bot className="w-3.5 h-3.5 fill-slate-950" />
                )}
                <span>{isDetectingAI ? "AI Scanning Video..." : "AI Detect Video & Match"}</span>
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
                <span>{isTheaterMode ? "Standard View" : "Theater Stage"}</span>
              </button>

              <button
                onClick={triggerCrowdCheer}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                  cheerEffect
                    ? "bg-pink-500 text-slate-950 border-pink-400 animate-bounce shadow-lg shadow-pink-500/40"
                    : "bg-pink-950/40 border-pink-500/40 text-pink-300 hover:bg-pink-900/50"
                }`}
                title="Trigger Stage Crowd Cheer & Applause"
              >
                <PartyPopper className="w-3.5 h-3.5 text-pink-400" />
                <span>Crowd Cheer!</span>
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-950/70 border border-slate-750 hover:border-teal-400 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                title="Full Screen Player"
              >
                <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Fill Screen</span>
              </button>
            </div>
          </div>

          {/* Holographic Vocaloid Badge / Now Playing Card */}
          <div className="bg-slate-950/85 border border-teal-500/35 rounded-2xl p-4 md:w-84 shrink-0 shadow-xl space-y-3 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${beatPulse ? "scale-150 bg-pink-400" : "bg-teal-400"} transition-all`} />
                Now Playing Live
              </span>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                ID: {currentVideoId}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-teal-300 transition-colors">
                {aiDetection?.detectedSongTitle || lyricsData?.songTitle || currentTrackInfo.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">
                {aiDetection?.producer
                  ? `${aiDetection.producer} • ${aiDetection.vocalist}`
                  : lyricsData?.producer
                  ? `${lyricsData.producer} • ${lyricsData.vocalist}`
                  : currentTrackInfo.artist}
              </p>
            </div>

            {/* Neon Sound Bars Animation */}
            <div className="flex items-end gap-1 h-6 pt-1">
              {[60, 100, 45, 80, 95, 30, 70, 85, 40, 90, 65, 100, 50, 75, 85, 40].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-teal-500 via-cyan-300 to-pink-400 rounded-t-sm animate-pulse"
                  style={{
                    height: `${height}%`,
                    animationDuration: `${0.5 + (i % 6) * 0.15}s`
                  }}
                />
              ))}
            </div>

            {/* Google Search Grounding & Tempo Speed Badge */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-teal-300">
                <Gauge className="w-3 h-3 text-teal-400" />
                Tempo: {karaokeSpeedSec}s (~{calculatedApproxBpm} BPM)
              </span>
              <span className="text-pink-300 font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {aiDetection ? "AI Synced" : "Live Grounded"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live YouTube Tracing & Synchronization Modal / Status Banner */}
      {isSyncingLive && (
        <div className="relative z-30 rounded-3xl bg-slate-900/95 border-2 border-pink-500/50 p-5 shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn">
          <div className="absolute top-0 right-0 w-80 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-400/50 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-pink-400 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono font-black text-pink-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Fast Gemini AI Live Video & Song Sync Engine</span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                </div>
                <p className="text-sm font-bold text-white font-mono animate-pulse">{syncLiveStep}</p>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
              YouTube Video: {currentVideoId}
            </div>
          </div>
        </div>
      )}

      {/* AI Video Detection Summary Card (if analyzed) */}
      {showAIDetectionCard && aiDetection && (
        <div className={`rounded-3xl bg-slate-900/90 border border-teal-400/50 p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fadeIn transition-opacity duration-300 ${
          isKaraokeMode ? "opacity-75 hover:opacity-100 z-20" : "opacity-100"
        }`}>
          <div className="absolute top-0 right-0 w-64 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <Bot className="w-3 h-3 text-teal-400" />
                  AI Video Match Results ({aiDetection.confidence}% Match)
                </span>
                <span className="text-[10px] font-mono text-pink-300 px-2 py-0.5 rounded bg-pink-950/60 border border-pink-500/40">
                  {aiDetection.mood}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
                  {aiDetection.genre}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{aiDetection.detectedSongTitle}</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  by <strong className="text-teal-300">{aiDetection.producer}</strong> feat. <strong className="text-pink-300">{aiDetection.vocalist}</strong>
                </span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {aiDetection.summary}
              </p>
            </div>

            {/* Quick Auto-Calibration Stats & Button */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-center px-2">
                <div className="text-[10px] font-mono text-slate-400">Estimated BPM</div>
                <div className="text-sm font-mono font-bold text-teal-300">{aiDetection.bpm} BPM</div>
              </div>

              <div className="h-8 w-px bg-slate-800" />

              <div className="text-center px-2">
                <div className="text-[10px] font-mono text-slate-400">Optimal Pace</div>
                <div className="text-sm font-mono font-bold text-pink-300">{aiDetection.recommendedSpeedSec}s / verse</div>
              </div>

              <button
                onClick={() => {
                  sfx.playClick();
                  setKaraokeSpeedSec(aiDetection.recommendedSpeedSec);
                }}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1"
                title="Apply AI detected tempo pace to the speed slider"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply AI Tempo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dual Stage: Video Player + Interactive Karaoke Prompter Deck */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-30 transition-all duration-300 ${
        isKaraokeMode ? "ring-2 ring-teal-400/40 rounded-3xl p-2 bg-slate-950/80 shadow-[0_0_60px_rgba(20,184,166,0.25)]" : ""
      }`}>
        {/* Left Column: Video Stage (6 cols or 12 cols in theater mode) */}
        <div className={`space-y-4 ${isTheaterMode ? "lg:col-span-12" : "lg:col-span-7"}`}>
          {/* Main Video Viewport */}
          <div
            ref={playerContainerRef}
            className={`relative transition-all duration-500 rounded-3xl overflow-hidden border shadow-2xl bg-slate-950 ${
              isKaraokeMode
                ? "border-2 border-teal-400 shadow-[0_0_35px_rgba(20,184,166,0.35)]"
                : "border-teal-500/30"
            } ${
              isTheaterMode
                ? "w-full max-w-full h-[65vh] sm:h-[75vh]"
                : "w-full aspect-video max-h-[70vh]"
            }`}
          >
            {/* Floating In-Player Controls Overlay Header */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-teal-500/40 p-1.5 rounded-2xl shadow-xl">
              {/* Karaoke Mode Quick Switch on Player */}
              <button
                onClick={toggleKaraokeMode}
                className={`p-2 rounded-xl transition-all text-xs font-mono flex items-center gap-1.5 font-bold ${
                  isKaraokeMode
                    ? "bg-teal-400 text-slate-950 shadow-md shadow-teal-400/30 ring-1 ring-teal-300"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
                title="Toggle Karaoke Mode (Disabled by default) [Press 'K']"
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isKaraokeMode ? "Karaoke: ON" : "Enable Karaoke"}</span>
              </button>

              <button
                onClick={handleSyncLiveYouTubeTrack}
                disabled={isSyncingLive}
                className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl transition-all text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/20"
                title="Sync Live YouTube Video & Match Lyrics"
              >
                {isSyncingLive ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                )}
                <span className="hidden sm:inline">Sync Live</span>
              </button>

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

          {/* Quick Song Search & URL Switcher with Live Sync Button */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-slate-200">Load YouTube Video or Song</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSyncLiveYouTubeTrack}
                  disabled={isSyncingLive}
                  className="px-2.5 py-1 bg-gradient-to-r from-pink-500/20 to-teal-500/20 hover:from-pink-500/30 hover:to-teal-500/30 border border-pink-400/40 text-pink-300 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
                  title="Trace currently playing video and match lyrics"
                >
                  <Zap className="w-3 h-3 text-yellow-300" />
                  <span>Sync Current Song</span>
                </button>

                <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoDetectOnSwitch}
                    onChange={(e) => {
                      setAutoDetectOnSwitch(e.target.checked);
                      try {
                        localStorage.setItem("isekai_vocaloid_autodetect", String(e.target.checked));
                      } catch {}
                    }}
                    className="rounded border-slate-700 text-teal-500 focus:ring-teal-400 w-3.5 h-3.5"
                  />
                  <span>Auto-Detect on Load</span>
                </label>
              </div>
            </div>

            <form onSubmit={handleApplyCustomUrl} className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Paste YouTube URL (e.g. https://youtu.be/h4hy2Gn-FVE or song query)..."
                className="flex-1 bg-slate-950 border border-slate-750 focus:border-teal-400 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1 shadow-md shadow-teal-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Load</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Real-Time Karaoke Prompter Studio (5 cols or 12 cols in theater mode) */}
        <div className={`space-y-4 ${isTheaterMode ? "lg:col-span-12" : "lg:col-span-5"}`}>
          <div className={`bg-slate-900/95 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${
            isKaraokeMode
              ? "border-2 border-teal-400 shadow-[0_0_40px_rgba(20,184,166,0.3)] bg-slate-950"
              : "border border-teal-500/40"
          }`}>
            {/* Header / Mode Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isKaraokeMode ? "bg-teal-400 text-slate-950" : "bg-teal-500/10 border border-teal-400/30 text-teal-300"
                }`}>
                  <Mic2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                    <span>{isKaraokeMode ? "Karaoke Focus Prompter" : "Karaoke Lyrics Stage"}</span>
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  </h2>
                  <p className="text-[10px] font-mono text-teal-300">
                    {lyricsData?.songTitle || aiDetection?.detectedSongTitle ? `${lyricsData?.songTitle || aiDetection?.detectedSongTitle}` : "Live Synchronized Sing-Along"}
                  </p>
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => { sfx.playClick(); setLyricsViewMode("prompter"); }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lyricsViewMode === "prompter"
                      ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Stage Prompter: Focus on Current Singing Line"
                >
                  Stage
                </button>
                <button
                  onClick={() => { sfx.playClick(); setLyricsViewMode("dual"); }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lyricsViewMode === "dual"
                      ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Dual Kanji + Romaji + English Lines"
                >
                  Dual
                </button>
                <button
                  onClick={() => { sfx.playClick(); setLyricsViewMode("romaji"); }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lyricsViewMode === "romaji"
                      ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Romaji Pronunciation Guide"
                >
                  Romaji
                </button>
                <button
                  onClick={() => { sfx.playClick(); setLyricsViewMode("japanese"); }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lyricsViewMode === "japanese"
                      ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Japanese Kanji & Kana"
                >
                  日本語
                </button>
                <button
                  onClick={() => { sfx.playClick(); setLyricsViewMode("fulltext"); }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lyricsViewMode === "fulltext"
                      ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Full Text & Copy Options"
                >
                  Full
                </button>
              </div>
            </div>

            {/* Karaoke Mode Focus Notification Indicator */}
            {isKaraokeMode && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-teal-950/80 border border-teal-400/50 rounded-xl text-[11px] font-mono text-teal-300 shadow-sm animate-fadeIn">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  🎤 HIGH-CONTRAST KARAOKE MODE ACTIVE
                </span>
                <span className="text-[10px] text-slate-400">Press 'K' to toggle</span>
              </div>
            )}

            {/* Karaoke Prompter Toolbelt */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
              {/* Play / Pause Auto Progression */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    sfx.playClick();
                    setIsKaraokeAutoPlay(!isKaraokeAutoPlay);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isKaraokeAutoPlay
                      ? "bg-teal-500/20 border border-teal-400/40 text-teal-300"
                      : "bg-slate-900 border border-slate-750 text-slate-400 hover:text-white"
                  }`}
                >
                  {isKaraokeAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isKaraokeAutoPlay ? "Auto-Sync ON" : "Auto-Sync OFF"}</span>
                </button>

                {/* Step Line Prev / Next */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    setActiveLineIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={activeLineIndex === 0}
                  className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                  title="Previous Verse"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    sfx.playClick();
                    setActiveLineIndex((prev) => Math.min((lyricsData?.lines?.length || 1) - 1, prev + 1));
                  }}
                  disabled={!lyricsData?.lines || activeLineIndex >= lyricsData.lines.length - 1}
                  className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                  title="Next Verse"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] text-slate-400 pl-1">
                  Line {activeLineIndex + 1}/{totalLines}
                </span>
              </div>

              {/* Tempo & Speed Controls Toggle */}
              <div className="flex items-center gap-2">
                {/* Speed Slider Toggle Button */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    setShowSpeedPanel(!showSpeedPanel);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    showSpeedPanel
                      ? "bg-teal-500 text-slate-950 border-teal-400 shadow-sm"
                      : "bg-slate-900 border-slate-750 text-teal-300 hover:bg-slate-800"
                  }`}
                  title="Open Speed Adjustment Slider & Tempo Calibration"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Speed: {karaokeSpeedSec}s</span>
                </button>

                {/* Font Size */}
                <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-750">
                  <button
                    onClick={() => { sfx.playClick(); setFontSize("sm"); }}
                    className={`px-1 text-[10px] ${fontSize === "sm" ? "text-teal-300 font-bold" : "text-slate-500"}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => { sfx.playClick(); setFontSize("base"); }}
                    className={`px-1 text-xs ${fontSize === "base" ? "text-teal-300 font-bold" : "text-slate-500"}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => { sfx.playClick(); setFontSize("lg"); }}
                    className={`px-1 text-sm ${fontSize === "lg" ? "text-teal-300 font-bold" : "text-slate-500"}`}
                  >
                    A+
                  </button>
                </div>

                {/* Search Toggle */}
                <button
                  onClick={() => setShowSearchBox(!showSearchBox)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    showSearchBox ? "bg-teal-500 text-slate-950 border-teal-400" : "bg-slate-900 text-slate-300 border-slate-750 hover:text-white"
                  }`}
                  title="Search specific lyrics with Google Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dedicated Speed Adjustment & Tempo Sync Slider Panel */}
            {showSpeedPanel && (
              <div className="p-4 bg-slate-950/90 rounded-2xl border border-teal-500/40 space-y-3.5 animate-fadeIn shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold font-mono text-white">
                      Lyrics Scroll Tempo & Sync Speed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                      {karaokeSpeedSec} sec / verse (~{calculatedApproxBpm} BPM)
                    </span>
                  </div>
                </div>

                {/* Continuous Speed Adjustment Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>🚀 Fast / Rock (1.5s)</span>
                    <span>🎵 Standard (5.5s)</span>
                    <span>🌸 Ballad / Slow (12.0s)</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="15.0"
                    step="0.1"
                    value={karaokeSpeedSec}
                    onChange={(e) => setKaraokeSpeedSec(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400 focus:outline-none"
                  />
                </div>

                {/* Quick Tempo Presets & Fine Tuning Tools */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {/* Preset Pills */}
                  <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                    <span className="text-[10px] text-slate-500 mr-1">Presets:</span>
                    <button
                      onClick={() => { sfx.playClick(); setKaraokeSpeedSec(2.5); }}
                      className={`px-2 py-0.5 rounded-lg border transition-all ${
                        karaokeSpeedSec === 2.5
                          ? "bg-teal-500 text-slate-950 font-bold border-teal-400"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Presto (2.5s)
                    </button>
                    <button
                      onClick={() => { sfx.playClick(); setKaraokeSpeedSec(4.0); }}
                      className={`px-2 py-0.5 rounded-lg border transition-all ${
                        karaokeSpeedSec === 4.0
                          ? "bg-teal-500 text-slate-950 font-bold border-teal-400"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Allegro (4.0s)
                    </button>
                    <button
                      onClick={() => { sfx.playClick(); setKaraokeSpeedSec(5.5); }}
                      className={`px-2 py-0.5 rounded-lg border transition-all ${
                        karaokeSpeedSec === 5.5
                          ? "bg-teal-500 text-slate-950 font-bold border-teal-400"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Moderato (5.5s)
                    </button>
                    <button
                      onClick={() => { sfx.playClick(); setKaraokeSpeedSec(8.0); }}
                      className={`px-2 py-0.5 rounded-lg border transition-all ${
                        karaokeSpeedSec === 8.0
                          ? "bg-teal-500 text-slate-950 font-bold border-teal-400"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      Andante (8.0s)
                    </button>
                  </div>

                  {/* Tap Tempo & Step Calibrators */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setKaraokeSpeedSec((prev) => Math.max(1.0, Math.round((prev - 0.2) * 10) / 10))}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-300 rounded-lg text-xs font-mono"
                      title="Speed up (decrease seconds per line)"
                    >
                      -0.2s
                    </button>
                    <button
                      onClick={() => setKaraokeSpeedSec((prev) => Math.min(15.0, Math.round((prev + 0.2) * 10) / 10))}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-300 rounded-lg text-xs font-mono"
                      title="Slow down (increase seconds per line)"
                    >
                      +0.2s
                    </button>
                    <button
                      onClick={handleTapTempo}
                      className="px-2.5 py-0.5 bg-pink-950/60 hover:bg-pink-900/80 border border-pink-500/40 text-pink-300 rounded-lg text-xs font-mono font-bold active:scale-95 transition-all flex items-center gap-1"
                      title="Tap 3-4 times on the beat of the song to calculate speed"
                    >
                      <Zap className="w-3 h-3 text-pink-400" />
                      <span>Tap Tempo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Google Search Bar for Lyrics if expanded */}
            {showSearchBox && (
              <form onSubmit={handleManualSearchLyrics} className="flex items-center gap-2 p-2 bg-slate-950 rounded-2xl border border-teal-500/40 animate-fadeIn">
                <input
                  type="text"
                  value={manualSearchQuery}
                  onChange={(e) => setManualSearchQuery(e.target.value)}
                  placeholder="Search song lyrics (e.g. Miku Hibikase, Rin Meltdown)..."
                  className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none px-2 font-mono"
                />
                <button
                  type="submit"
                  disabled={isLoadingLyrics || isDetectingAI || isSyncingLive}
                  className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm font-mono disabled:opacity-50"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>AI Search</span>
                </button>
              </form>
            )}

            {/* Song Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-teal-400 via-cyan-300 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Loading State */}
            {(isLoadingLyrics || isDetectingAI) && (
              <div className="py-16 text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-teal-500/10 border border-teal-400/40 text-teal-400 animate-spin">
                  <Disc3 className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-teal-300 animate-pulse">
                  {isDetectingAI
                    ? "AI scanning video audio & matching Vocaloid producer tempo..."
                    : "Searching Google for official Vocaloid lyrics & karaoke cues..."}
                </p>
              </div>
            )}

            {/* Error Message */}
            {!isLoadingLyrics && !isDetectingAI && lyricsError && (
              <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-xs text-red-200 space-y-2">
                <p>{lyricsError}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchLyrics()}
                    className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-mono"
                  >
                    Retry Search
                  </button>
                  <button
                    onClick={() => runAIVideoDetection(currentVideoId)}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-lg text-xs font-mono"
                  >
                    Run AI Auto-Detection
                  </button>
                </div>
              </div>
            )}

            {/* 1. Stage Karaoke Prompter View Mode (Large Highlighted Prompter) */}
            {!isLoadingLyrics && !isDetectingAI && lyricsData && lyricsViewMode === "prompter" && (
              <div className="space-y-4">
                {/* Active Singing Card (High Contrast / Large Font when in Karaoke Mode) */}
                {currentLine && (
                  <div className={`relative rounded-2xl overflow-hidden animate-fadeIn transition-all duration-300 ${
                    isKaraokeMode
                      ? "bg-slate-950 border-2 border-teal-400 p-6 sm:p-8 shadow-[0_0_40px_rgba(20,184,166,0.4)]"
                      : "bg-gradient-to-br from-teal-950/70 via-slate-900/90 to-purple-950/70 border-2 border-teal-400/80 p-5 shadow-2xl"
                  }`}>
                    <div className="absolute top-2.5 right-3.5 flex items-center gap-1.5">
                      {currentLine.section && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          isKaraokeMode
                            ? "bg-pink-500 text-slate-950 border border-pink-300"
                            : "bg-pink-500/20 border border-pink-400/40 text-pink-300"
                        }`}>
                          {currentLine.section}
                        </span>
                      )}
                      <span className={`text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                        isKaraokeMode ? "text-teal-300 bg-teal-950 px-2 py-0.5 rounded-full border border-teal-400/60" : "text-teal-400"
                      }`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${beatPulse ? "bg-pink-400 scale-125" : "bg-teal-400"}`} />
                        SING NOW 🎤
                      </span>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      {/* Japanese Kanji/Kana - Extra Bold & Large in Karaoke Mode */}
                      <p className={`font-black tracking-wide text-white leading-tight ${
                        isKaraokeMode
                          ? "text-3xl sm:text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.95)]"
                          : `drop-shadow-[0_2px_8px_rgba(20,184,166,0.6)] ${fontClasses[fontSize]}`
                      }`}>
                        {currentLine.ja}
                      </p>

                      {/* Romaji Pronunciation - High Contrast Glowing Neon Cyan */}
                      <p className={`font-mono font-black tracking-wider ${
                        isKaraokeMode
                          ? "text-xl sm:text-3xl text-teal-300 drop-shadow-[0_0_15px_rgba(45,212,191,0.95)]"
                          : "text-sm sm:text-base text-teal-300"
                      }`}>
                        {currentLine.romaji}
                      </p>

                      {/* English Meaning Box */}
                      <p className={`italic border-t border-slate-800/80 pt-2 ${
                        isKaraokeMode
                          ? "text-sm sm:text-base font-semibold text-slate-100 bg-black/60 px-3.5 py-1.5 rounded-xl border border-teal-500/30 inline-block"
                          : "text-xs sm:text-sm text-slate-300"
                      }`}>
                        "{currentLine.en}"
                      </p>
                    </div>

                    {/* Glowing Audio Waves Indicator */}
                    <div className="flex items-center gap-1 pt-4">
                      {[40, 80, 100, 60, 90, 45, 75, 95, 50, 85, 70, 95, 45, 80].map((h, i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 bg-gradient-to-r from-teal-400 via-cyan-300 to-pink-400 rounded-full animate-pulse"
                          style={{ animationDuration: `${0.35 + (i % 5) * 0.12}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Lyrics Verse Stream with Click-to-Jump */}
                <div
                  ref={lineContainerRef}
                  className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-teal-500/30 scrollbar-track-slate-950"
                >
                  {lyricsData.lines.map((line, idx) => {
                    const isSelected = idx === activeLineIndex;
                    return (
                      <div
                        key={line.id || idx}
                        data-line-idx={idx}
                        onClick={() => {
                          sfx.playClick();
                          setActiveLineIndex(idx);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                          isSelected
                            ? isKaraokeMode
                              ? "bg-teal-950/90 border-2 border-teal-300 shadow-lg ring-2 ring-teal-400/60"
                              : "bg-teal-950/60 border-teal-400 shadow-md ring-1 ring-teal-400/50"
                            : isKaraokeMode
                            ? "bg-slate-950/90 border-slate-800 opacity-60 hover:opacity-100 hover:border-teal-500/40"
                            : "bg-slate-950/60 border-slate-800 hover:border-teal-500/40 hover:bg-slate-900"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-mono font-bold mt-0.5 shrink-0 px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-teal-400 text-slate-950" : "bg-slate-900 text-slate-500"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className={`font-bold truncate ${
                            isSelected
                              ? "text-teal-300 font-mono text-sm"
                              : "text-slate-300"
                          }`}>
                            {line.romaji}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{line.ja}</p>
                        </div>
                        {line.section && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                            {line.section}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Dual / Multi-line Karaoke View */}
            {!isLoadingLyrics && !isDetectingAI && lyricsData && (lyricsViewMode === "dual" || lyricsViewMode === "romaji" || lyricsViewMode === "japanese" || lyricsViewMode === "english") && (
              <div
                ref={lineContainerRef}
                className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-teal-500/30 scrollbar-track-slate-950"
              >
                {lyricsData.lines.map((line, idx) => {
                  const isSelected = idx === activeLineIndex;
                  return (
                    <div
                      key={line.id || idx}
                      data-line-idx={idx}
                      onClick={() => {
                        sfx.playClick();
                        setActiveLineIndex(idx);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none space-y-1 ${
                        isSelected
                          ? isKaraokeMode
                            ? "bg-teal-950/95 border-2 border-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.35)] ring-2 ring-teal-400/60"
                            : "bg-gradient-to-r from-teal-950/80 to-slate-900 border-teal-400 shadow-lg ring-1 ring-teal-400/50"
                          : isKaraokeMode
                          ? "bg-slate-950/90 border-slate-800 opacity-50 hover:opacity-100"
                          : "bg-slate-950/60 border-slate-800 hover:border-teal-500/30 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={isSelected ? "text-teal-300 font-bold" : "text-slate-500"}>
                          Line {idx + 1} {line.section ? `• ${line.section}` : ""}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded bg-teal-500 text-slate-950 font-bold text-[9px] uppercase">
                            Singing Active
                          </span>
                        )}
                      </div>

                      {/* Content based on selected mode */}
                      {(lyricsViewMode === "dual" || lyricsViewMode === "romaji") && (
                        <p className={`font-bold font-mono tracking-wide ${
                          isSelected
                            ? isKaraokeMode
                              ? "text-teal-300 text-xl sm:text-2xl drop-shadow-[0_0_12px_rgba(45,212,191,0.9)]"
                              : "text-teal-300"
                            : "text-slate-200"
                        } ${fontClasses[fontSize]}`}>
                          {line.romaji}
                        </p>
                      )}

                      {(lyricsViewMode === "dual" || lyricsViewMode === "japanese") && (
                        <p className={`font-medium ${
                          isSelected
                            ? isKaraokeMode
                              ? "text-white font-black text-2xl sm:text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
                              : "text-white drop-shadow-sm"
                            : "text-slate-300"
                        } ${fontClasses[fontSize]}`}>
                          {line.ja}
                        </p>
                      )}

                      {(lyricsViewMode === "dual" || lyricsViewMode === "english") && (
                        <p className={`italic pt-0.5 ${
                          isSelected && isKaraokeMode ? "text-sm text-slate-100 font-semibold" : "text-xs text-slate-400"
                        }`}>
                          "{line.en}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Full Text Archive & Copy Mode */}
            {!isLoadingLyrics && !isDetectingAI && lyricsData && lyricsViewMode === "fulltext" && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-300">Complete Song Transcripts</span>
                  <button
                    onClick={handleCopyFullLyrics}
                    className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {copiedLyrics ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLyrics ? "Copied!" : "Copy All Lyrics"}</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <h4 className="text-teal-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Romaji Sing-Along Text</span>
                    </h4>
                    <p className="whitespace-pre-line text-slate-300 leading-relaxed">{lyricsData.romajiLyrics}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="text-pink-400 font-bold uppercase mb-1">日本語歌詞 (Japanese)</h4>
                    <p className="whitespace-pre-line text-slate-300 leading-relaxed font-sans">{lyricsData.japaneseLyrics}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="text-cyan-400 font-bold uppercase mb-1">English Translation</h4>
                    <p className="whitespace-pre-line text-slate-400 leading-relaxed font-sans">{lyricsData.englishLyrics}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Song Trivia & Google Search Sources Citations */}
            {lyricsData && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                {lyricsData.trivia && (
                  <div className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
                    <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <span className="font-bold text-teal-300">Vocaloid Trivia: </span>
                      {lyricsData.trivia}
                    </p>
                  </div>
                )}

                {/* Google Search Grounding Sources Badges */}
                {lyricsData.sources && lyricsData.sources.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-teal-400" />
                        Google Search Verified Sources:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {lyricsData.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-teal-500/30 hover:border-teal-400 rounded-lg text-[10px] font-mono text-teal-300 hover:text-white transition-all truncate max-w-xs"
                          title={src.title}
                        >
                          <ExternalLink className="w-2.5 h-2.5 text-teal-400 shrink-0" />
                          <span className="truncate">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curated Vocaloid Hall of Fame Playlist Grid */}
      <div className={`bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 transition-opacity duration-300 ${
        isKaraokeMode ? "opacity-30 hover:opacity-100" : "opacity-100"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-pink-400" />
              <span>Vocaloid Hall of Fame & Live Stage Classics</span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any song to instantly load video and auto-match synchronized karaoke lyrics.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/30">
            {CURATED_VOCALOID_TRACKS.length} Classics Ready
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
  );
}
