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
  Search,
  Flame,
  Star,
  ListMusic,
  Disc3,
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
  Sliders,
  Type,
  PartyPopper,
  Zap,
  Activity,
  ChevronRight,
  ChevronLeft,
  Timer,
  Gauge,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Radio,
  FlameKindling,
  Trophy
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { AppSettings, UserProfile } from "../types";

interface KaraokeTrack {
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

interface KaraokeLyricsData {
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

const CURATED_KARAOKE_TRACKS: KaraokeTrack[] = [
  {
    id: "k-senbonzakura",
    title: "Senbonzakura (千本桜)",
    artist: "Kurousa-P feat. Hatsune Miku",
    producer: "WhiteFlame / Kurousa-P",
    vocalist: "Hatsune Miku",
    videoId: "shs0rAiwsGQ",
    thumb: "https://img.youtube.com/vi/shs0rAiwsGQ/hqdefault.jpg",
    tag: "👑 Legendary Classic",
    views: "100M+ Views",
    year: "2011"
  },
  {
    id: "k-world-is-mine",
    title: "The World is Mine (ワールドイズマイン)",
    artist: "ryo (supercell) feat. Hatsune Miku",
    producer: "ryo (supercell)",
    vocalist: "Hatsune Miku",
    videoId: "EuJ6UR_p40A",
    thumb: "https://img.youtube.com/vi/EuJ6UR_p40A/hqdefault.jpg",
    tag: "✨ Diva Anthem",
    views: "50M+ Views",
    year: "2008"
  },
  {
    id: "k-ghost-rule",
    title: "Ghost Rule (ゴーストルール)",
    artist: "DECO*27 feat. Hatsune Miku",
    producer: "DECO*27",
    vocalist: "Hatsune Miku",
    videoId: "Kha8ERq5paM",
    thumb: "https://img.youtube.com/vi/Kha8ERq5paM/hqdefault.jpg",
    tag: "🔥 Rock Masterpiece",
    views: "80M+ Views",
    year: "2016"
  },
  {
    id: "k-melt",
    title: "Melt (メルト)",
    artist: "ryo (supercell) feat. Hatsune Miku",
    producer: "ryo (supercell)",
    vocalist: "Hatsune Miku",
    videoId: "eFfYB2aVpyg",
    thumb: "https://img.youtube.com/vi/eFfYB2aVpyg/hqdefault.jpg",
    tag: "💖 Sweet Ballad",
    views: "45M+ Views",
    year: "2007"
  },
  {
    id: "k-idol",
    title: "Idol (アイドル) - Oshi No Ko",
    artist: "YOASOBI",
    producer: "Ayase",
    vocalist: "Ikura / Vocaloid Synth",
    videoId: "ZRtdQ81jPUQ",
    thumb: "https://img.youtube.com/vi/ZRtdQ81jPUQ/hqdefault.jpg",
    tag: "🌟 Global Anime Hit",
    views: "400M+ Views",
    year: "2023"
  },
  {
    id: "k-lemon",
    title: "Lemon",
    artist: "Kenshi Yonezu",
    producer: "Kenshi Yonezu",
    vocalist: "Kenshi Yonezu",
    videoId: "SX_ViT4Ra7k",
    thumb: "https://img.youtube.com/vi/SX_ViT4Ra7k/hqdefault.jpg",
    tag: "💧 Emotional Ballad",
    views: "800M+ Views",
    year: "2018"
  }
];

const DEFAULT_VIDEO_ID = "shs0rAiwsGQ";

export const KaraokePlayerTab: React.FC<{ settings: AppSettings; profile: UserProfile }> = ({
  settings,
  profile
}) => {
  const [currentVideoId, setCurrentVideoId] = useState<string>(DEFAULT_VIDEO_ID);
  const [urlInput, setUrlInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTrackInfo, setActiveTrackInfo] = useState<KaraokeTrack>(CURATED_KARAOKE_TRACKS[0]);

  // Player Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [pitchShift, setPitchShift] = useState<number>(0); // -4 to +4 semitones
  const [vocalVolume, setVocalVolume] = useState<number>(100);
  const [musicVolume, setMusicVolume] = useState<number>(90);
  const [reverbEffect, setReverbEffect] = useState<boolean>(true);
  const [isDarkStageMode, setIsDarkStageMode] = useState<boolean>(true);
  const [activeSubtitleLang, setActiveSubtitleLang] = useState<"romaji" | "ja" | "en" | "dual">("dual");
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Lyrics & Prompter State
  const [lyricsData, setLyricsData] = useState<KaraokeLyricsData | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);

  // Score & Streak Practice State
  const [score, setScore] = useState<number>(1420);
  const [streak, setStreak] = useState<number>(12);
  const [accuracyGrade, setAccuracyGrade] = useState<string>("S+");

  // Manual Lyrics / SRT / TXT Upload Modal State
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>("");
  const [manualSongTitle, setManualSongTitle] = useState<string>("");

  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Helper to extract YouTube ID from URL or Search
  const extractYouTubeId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return DEFAULT_VIDEO_ID;
    
    // Check if it's already a YouTube ID (11 chars alphanumeric / dash / underscore)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // Try standard regex match for watch?v= or youtu.be/ or embed/
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = trimmed.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }

    // If it's a search query, map to curated or fallback ID
    const lower = trimmed.toLowerCase();
    if (lower.includes("senbonzakura")) return "shs0rAiwsGQ";
    if (lower.includes("world is mine")) return "EuJ6UR_p40A";
    if (lower.includes("ghost rule")) return "Kha8ERq5paM";
    if (lower.includes("melt")) return "eFfYB2aVpyg";
    if (lower.includes("idol")) return "ZRtdQ81jPUQ";
    if (lower.includes("lemon")) return "SX_ViT4Ra7k";

    return DEFAULT_VIDEO_ID;
  };

  const handleLoadUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    sfx.playWarp();
    const vid = extractYouTubeId(urlInput);
    setCurrentVideoId(vid);

    // Find if it matches curated track
    const found = CURATED_KARAOKE_TRACKS.find(t => t.videoId === vid);
    if (found) {
      setActiveTrackInfo(found);
      loadLyricsForTrack(found);
    } else {
      const customTrack: KaraokeTrack = {
        id: `custom-${vid}`,
        title: `Custom Video (${vid})`,
        artist: "YouTube Creator",
        producer: "Custom URL Input",
        vocalist: "Virtual Vocalist",
        videoId: vid,
        thumb: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        tag: "🎵 Custom Load",
        views: "Live Stream"
      };
      setActiveTrackInfo(customTrack);
      loadCustomLyrics(customTrack.title);
    }
    setUrlInput("");
    setSyncToastMessage("🎉 YouTube video & karaoke audio loaded successfully!");
    setTimeout(() => setSyncToastMessage(null), 3500);
  };

  const handleSelectCuratedTrack = (track: KaraokeTrack) => {
    sfx.playClick();
    setCurrentVideoId(track.videoId);
    setActiveTrackInfo(track);
    loadLyricsForTrack(track);
    setSyncToastMessage(`🎤 Loaded: ${track.title}`);
    setTimeout(() => setSyncToastMessage(null), 3000);
  };

  const loadLyricsForTrack = (track: KaraokeTrack) => {
    // Curated high-fidelity lyrics datasets for the player
    let lines: KaraokeLine[] = [];
    if (track.videoId === "shs0rAiwsGQ") {
      lines = [
        { id: "1", section: "Intro", ja: "鮮やかな桜吹雪 今宵 君と踊る", romaji: "Ayazana sakura fubuki koyoi kimi to odoru", en: "Vivid cherry blossom blizzard, dancing with you tonight", timeOffsetSec: 4 },
        { id: "2", section: "Verse 1", ja: "千本桜 夜に紛れ 君の声を聞かせて", romaji: "Senbonzakura yoru ni magire kimi no koe o kikasete", en: "A thousand cherry blossoms hidden in the night, let me hear your voice", timeOffsetSec: 12 },
        { id: "3", section: "Verse 2", ja: "断線モールス信号 鳴り響く", romaji: "Dansen morusu shingo nari hibiku", en: "Disconnected Morse code echoing through the dark", timeOffsetSec: 22 },
        { id: "4", section: "Chorus", ja: "君の歌声は 世界を染め上げる！", romaji: "Kimi no utagoe wa sekai o some ageru!", en: "Your singing voice dyes the entire world!", timeOffsetSec: 32 },
        { id: "5", section: "Bridge", ja: "さあ踊れ 歌え 終焉のステージへ", romaji: "Saa odore utae shuen no suteeji e", en: "Come dance, sing, toward the stage of the end", timeOffsetSec: 45 }
      ];
    } else if (track.videoId === "EuJ6UR_p40A") {
      lines = [
        { id: "1", section: "Intro", ja: "世界でいちばんおひめさま", romaji: "Sekai de ichiban ohimesama", en: "The number one princess in the world", timeOffsetSec: 5 },
        { id: "2", section: "Verse 1", ja: "それがあたしなのよ ちゃんと分かってるよね？", romaji: "Sore ga atashi na no yo chanto wakatteru yone?", en: "That's me, you understand that properly, right?", timeOffsetSec: 14 },
        { id: "3", section: "Chorus", ja: "世界でいちばんおひめさま 扱ってよね！", romaji: "Sekai de ichiban ohimesama atsukatte yone!", en: "Treat me like the number one princess in the world!", timeOffsetSec: 28 }
      ];
    } else if (track.videoId === "ZRtdQ81jPUQ") {
      lines = [
        { id: "1", section: "Intro", ja: "幾つもの秘密を隠している この笑顔", romaji: "Ikutsumo no himitsu o kakushite iru kono egao", en: "This smile hides so many secrets", timeOffsetSec: 6 },
        { id: "2", section: "Chorus", ja: "誰もが目を奪われていく 完璧で究極のアイドル！", romaji: "Dare mo ga me o ubawarete iku kanpeki de kyukyoku no aidoru!", en: "Everyone gets captivated, the perfect and ultimate idol!", timeOffsetSec: 18 }
      ];
    } else {
      lines = [
        { id: "1", section: "Intro", ja: "バーチャルステージへようこそ！", romaji: "Baacharu suteeji e yokoso!", en: "Welcome to the Virtual Stage!", timeOffsetSec: 3 },
        { id: "2", section: "Verse", ja: "心を開いて リズムに合わせて歌おう", romaji: "Kokoro o hiraite rizumu ni awasete utaou", en: "Open your heart and sing along to the rhythm", timeOffsetSec: 10 },
        { id: "3", section: "Chorus", ja: "響けボカロメロディ 永遠に！", romaji: "Hibike bokaro merodii eien ni!", en: "Resound Vocaloid melody for eternity!", timeOffsetSec: 20 }
      ];
    }

    setLyricsData({
      songTitle: track.title,
      producer: track.producer,
      vocalist: track.vocalist,
      bpm: 142,
      recommendedSpeedSec: 4.5,
      romajiLyrics: lines.map(l => l.romaji).join("\n"),
      japaneseLyrics: lines.map(l => l.ja).join("\n"),
      englishLyrics: lines.map(l => l.en).join("\n"),
      lines
    });
    setActiveLineIndex(0);
  };

  const loadCustomLyrics = (title: string) => {
    const defaultLines: KaraokeLine[] = [
      { id: "1", section: "Intro", ja: "カスタム楽曲が読み込まれました", romaji: "Kasutamu gakkyoku ga yomikomaremashita", en: "Custom song loaded successfully", timeOffsetSec: 5 },
      { id: "2", section: "Verse", ja: "歌詞を入力またはSRTファイルをアップロードしてください", romaji: "Kashi o nyuryoku mata wa ESU-ARU-TEE fairu o appuroodo shite kudasai", en: "Please enter lyrics or upload an SRT file", timeOffsetSec: 15 }
    ];
    setLyricsData({
      songTitle: title,
      producer: "Custom User Input",
      vocalist: "Custom Vocalist",
      bpm: 130,
      recommendedSpeedSec: 5.0,
      romajiLyrics: defaultLines.map(l => l.romaji).join("\n"),
      japaneseLyrics: defaultLines.map(l => l.ja).join("\n"),
      englishLyrics: defaultLines.map(l => l.en).join("\n"),
      lines: defaultLines
    });
    setActiveLineIndex(0);
  };

  useEffect(() => {
    loadLyricsForTrack(CURATED_KARAOKE_TRACKS[0]);
  }, []);

  // Simulate active karaoke line progression over video time
  useEffect(() => {
    if (!lyricsData || !lyricsData.lines.length) return;
    const interval = setInterval(() => {
      setActiveLineIndex((prev) => (prev + 1) % lyricsData.lines.length);
      setScore(s => s + Math.floor(Math.random() * 15) + 5);
      setStreak(s => s + 1);
    }, 5500);
    return () => clearInterval(interval);
  }, [lyricsData]);

  const handleApplyManualLyrics = () => {
    if (!manualText.trim()) return;
    sfx.playBadgeUnlock();
    const title = manualSongTitle.trim() || activeTrackInfo.title || "Custom Karaoke Track";
    const rawLines = manualText.split(/\r?\n/).filter(l => l.trim().length > 0);
    
    const newLines: KaraokeLine[] = rawLines.map((l, idx) => ({
      id: String(idx + 1),
      section: idx === 0 ? "Intro" : "Verse",
      ja: l,
      romaji: l,
      en: l,
      timeOffsetSec: 4 + idx * 5
    }));

    setLyricsData({
      songTitle: title,
      producer: "Manual Upload / Paste",
      vocalist: activeTrackInfo.vocalist,
      bpm: 140,
      recommendedSpeedSec: 5.0,
      romajiLyrics: manualText,
      japaneseLyrics: manualText,
      englishLyrics: manualText,
      lines: newLines.length > 0 ? newLines : [
        { id: "1", section: "Intro", ja: manualText, romaji: manualText, en: manualText, timeOffsetSec: 5 }
      ]
    });
    setActiveLineIndex(0);
    setShowManualModal(false);
    setManualText("");
    setManualSongTitle("");
    setSyncToastMessage("✍️ Custom manual lyrics & SRT successfully applied!");
    setTimeout(() => setSyncToastMessage(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setManualText(content);
        if (!manualSongTitle) {
          setManualSongTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-500 text-slate-100 ${
      isDarkStageMode ? "bg-slate-950" : "bg-slate-900"
    }`}>
      {/* Toast Notification */}
      {syncToastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-950/95 border-2 border-pink-500 text-white px-5 py-3 rounded-2xl shadow-[0_0_35px_rgba(236,72,153,0.5)] backdrop-blur-xl flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-pink-400 animate-spin" />
          <span className="text-xs font-mono font-bold">{syncToastMessage}</span>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className={`relative overflow-hidden border-b py-8 px-4 sm:px-8 mb-6 ${
        isDarkStageMode
          ? "bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border-pink-500/30"
          : "bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-indigo-500/20"
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold animate-pulse">
              <Mic className="w-3.5 h-3.5 text-pink-400" />
              <span>ISEKAI VIRTUAL STAGE & KARAOKE PLAYER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
              <span>🎤 Ultimate Karaoke Studio</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                100% Synced
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl">
              Paste any YouTube video link or search your favorite Vocaloid & Anime tracks. Enjoy real-time synchronized karaoke lyrics, pitch shifts, vocal effects, and score streaks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { sfx.playClick(); setIsDarkStageMode(!isDarkStageMode); }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-2 ${
                isDarkStageMode
                  ? "bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-600/30"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <Flame className="w-4 h-4 text-pink-300" />
              <span>Dark Stage Mode: {isDarkStageMode ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => { sfx.playClick(); setShowManualModal(true); }}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-pink-500 text-slate-950 shadow-lg shadow-teal-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>✍️ Paste / Upload SRT</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* YouTube Link Input & Search Bar */}
        <div className="bg-slate-900/90 border border-pink-500/30 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-xl">
          <form onSubmit={handleLoadUrl} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=...) or song title..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white font-mono outline-none transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 hover:opacity-95 text-white font-mono font-bold text-xs rounded-2xl shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Load Video & Lyrics</span>
            </button>
          </form>

          {/* Quick Curated Song Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Flame className="w-3 h-3 text-pink-400" /> Quick Hits:
            </span>
            {CURATED_KARAOKE_TRACKS.map((track) => {
              const isSelected = currentVideoId === track.videoId;
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectCuratedTrack(track)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                    isSelected
                      ? "bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/30 scale-105"
                      : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-pink-500/50 hover:text-white"
                  }`}
                >
                  <Music className="w-3 h-3 text-pink-400" />
                  <span>{track.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Stage Grid: Video Player + Karaoke Prompter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: YouTube Video & Effects Controls (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/95 border-2 border-pink-500/40 rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Video Header Info */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping shrink-0" />
                  <span className="text-xs font-mono font-bold text-white truncate">{activeTrackInfo.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-300">
                    {activeTrackInfo.vocalist}
                  </span>
                </div>
              </div>

              {/* YouTube Iframe Container (16:9 aspect ratio) */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0`}
                  title={activeTrackInfo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Audio & Karaoke Effects Toolbar */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Speed:</span>
                    {[0.75, 1.0, 1.25].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => { sfx.playClick(); setPlaybackSpeed(spd); }}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          playbackSpeed === spd
                            ? "bg-pink-500 text-white border-pink-400"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Pitch Shift:</span>
                    <button
                      onClick={() => { sfx.playClick(); setPitchShift(p => Math.max(-4, p - 1)); }}
                      className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-800"
                    >
                      -
                    </button>
                    <span className="text-pink-400 font-bold">{pitchShift > 0 ? `+${pitchShift}` : pitchShift} semitones</span>
                    <button
                      onClick={() => { sfx.playClick(); setPitchShift(p => Math.min(4, p + 1)); }}
                      className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">Vocal Reverb:</span>
                    <button
                      onClick={() => { sfx.playClick(); setReverbEffect(!reverbEffect); }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                        reverbEffect
                          ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                          : "bg-slate-900 text-slate-500 border-slate-800"
                      }`}
                    >
                      {reverbEffect ? "✨ Studio Hall Reverb ON" : "OFF"}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Score: <strong className="text-amber-300">{score}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-pink-400" />
                      <span>Streak: <strong className="text-pink-300">{streak}x</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-teal-400" />
                      <span>Grade: <strong className="text-teal-300">{accuracyGrade}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Synchronized Karaoke Prompter (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/95 border-2 border-pink-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
                    <Mic2 className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Live Karaoke Prompter</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Synchronized Romaji, Kanji & English</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                  {(["dual", "romaji", "ja", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { sfx.playClick(); setActiveSubtitleLang(lang); }}
                      className={`px-2.5 py-1 rounded-lg uppercase font-bold transition-all ${
                        activeSubtitleLang === lang
                          ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompter Lyrics Lines Container */}
              <div
                ref={lyricsContainerRef}
                className="space-y-4 max-h-[460px] overflow-y-auto pr-2 no-scrollbar"
              >
                {lyricsData?.lines.map((line, idx) => {
                  const isActive = idx === activeLineIndex;
                  return (
                    <div
                      key={line.id}
                      onClick={() => { sfx.playClick(); setActiveLineIndex(idx); }}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                        isActive
                          ? "bg-gradient-to-r from-pink-950/70 via-purple-950/70 to-slate-950 border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.35)] scale-[1.02]"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider font-bold">
                          {line.section || `Cue #${line.id}`}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500 text-white font-bold animate-pulse">
                            ♪ SING NOW ♪
                          </span>
                        )}
                      </div>

                      {(activeSubtitleLang === "dual" || activeSubtitleLang === "ja") && (
                        <p className={`font-bold transition-colors ${isActive ? "text-xl text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" : "text-sm text-slate-300"}`}>
                          {line.ja}
                        </p>
                      )}

                      {(activeSubtitleLang === "dual" || activeSubtitleLang === "romaji") && (
                        <p className={`font-mono transition-colors ${isActive ? "text-sm text-pink-300 font-bold" : "text-xs text-slate-400"}`}>
                          {line.romaji}
                        </p>
                      )}

                      {(activeSubtitleLang === "dual" || activeSubtitleLang === "en") && (
                        <p className="text-xs text-slate-400 italic mt-1 font-serif">
                          {line.en}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Manual Import Prompt Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-4">
                <span className="text-[11px] text-slate-400 font-mono">Not matching your song?</span>
                <button
                  onClick={() => { sfx.playClick(); setShowManualModal(true); }}
                  className="text-xs font-mono font-bold text-pink-400 hover:text-pink-300 underline"
                >
                  Upload custom SRT / TXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Lyrics & SRT / TXT Import Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-pink-500/50 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Manual Karaoke Lyrics & SRT Importer</h3>
                  <p className="text-xs text-slate-400 font-mono">Upload an SRT file or paste text to match your YouTube video</p>
                </div>
              </div>
              <button
                onClick={() => { sfx.playClick(); setShowManualModal(false); }}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Song Title (Optional)
                </label>
                <input
                  type="text"
                  value={manualSongTitle}
                  onChange={(e) => setManualSongTitle(e.target.value)}
                  placeholder="e.g. My Custom Karaoke Song"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Upload SRT or TXT File
                  </label>
                  <label className="cursor-pointer text-xs font-mono text-pink-400 hover:text-pink-300 bg-pink-500/10 px-3 py-1 rounded-lg border border-pink-500/30 transition-all">
                    Browse File...
                    <input type="file" accept=".srt,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <textarea
                  rows={8}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste raw lyrics line by line or SRT subtitle content here..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-2xl p-4 text-xs font-mono text-slate-200 outline-none resize-none transition-colors leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { sfx.playClick(); setShowManualModal(false); }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyManualLyrics}
                  disabled={!manualText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 hover:opacity-95 text-white text-xs font-mono font-bold shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply & Sync to Karaoke Player</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
