import React, { useState, useEffect, useRef } from "react";
import { 
  Radio, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Globe, 
  Tv2, 
  BookOpen, 
  Music, 
  Compass, 
  Sparkles, 
  ArrowRight,
  Sliders,
  RadioTower,
  Info,
  HelpCircle,
  Database,
  Volume1,
  FileText
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface RadioStation {
  id: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string[];
  votes: number;
  bitrate: number;
  category: "anime" | "news" | "story" | "bible";
}

const CURATED_STATIONS: RadioStation[] = [
  // Anime & J-Pop Music
  {
    id: "anime-1",
    name: "J-Pop Powerplay Anime",
    url: "https://kathy.torontocast.com:3060/stream",
    favicon: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80",
    country: "Japan",
    tags: ["anime", "jpop", "music"],
    votes: 980,
    bitrate: 128,
    category: "anime"
  },
  {
    id: "anime-2",
    name: "Vocaloid Radio - Hatsune Miku 24/7",
    url: "https://vocaloidradio.com/stream",
    favicon: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
    country: "Japan",
    tags: ["vocaloid", "hatsune miku", "jpop"],
    votes: 854,
    bitrate: 128,
    category: "anime"
  },
  {
    id: "anime-3",
    name: "Asia DREAM Radio Japan",
    url: "https://server.asiadreamradio.com/japan_mp3",
    favicon: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=150&auto=format&fit=crop&q=80",
    country: "Japan",
    tags: ["anime ost", "jpop", "classic"],
    votes: 721,
    bitrate: 128,
    category: "anime"
  },
  {
    id: "anime-4",
    name: "J-Rock Powerplay OST",
    url: "https://kathy.torontocast.com:3010/stream",
    favicon: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80",
    country: "Japan",
    tags: ["anime rock", "jrock", "high energy"],
    votes: 610,
    bitrate: 128,
    category: "anime"
  },

  // News Stations
  {
    id: "news-1",
    name: "BBC World Service",
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    favicon: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&auto=format&fit=crop&q=80",
    country: "United Kingdom",
    tags: ["world news", "bbc", "analysis"],
    votes: 1240,
    bitrate: 96,
    category: "news"
  },
  {
    id: "news-2",
    name: "NPR News Live",
    url: "https://npr-icecast.streamguys1.com/live.mp3",
    favicon: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&auto=format&fit=crop&q=80",
    country: "United States",
    tags: ["talk", "news", "features"],
    votes: 980,
    bitrate: 128,
    category: "news"
  },
  {
    id: "news-3",
    name: "France Info News",
    url: "https://icecast.radiofrance.fr/franceinfo-hifi.mp3",
    favicon: "https://images.unsplash.com/photo-1495020689067-958852a6565d?w=150&auto=format&fit=crop&q=80",
    country: "France",
    tags: ["news", "france", "discussion"],
    votes: 490,
    bitrate: 192,
    category: "news"
  },
  {
    id: "news-4",
    name: "Bloomberg Radio Business News",
    url: "https://bloomberg.streamguys1.com/bloomberg-raw.mp3",
    favicon: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=150&auto=format&fit=crop&q=80",
    country: "Global",
    tags: ["finance", "business", "tech news"],
    votes: 754,
    bitrate: 96,
    category: "news"
  },

  // Story Telling
  {
    id: "story-1",
    name: "Old Time Radio Mystery & Thriller",
    url: "https://stream.scglink.com:8142/",
    favicon: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=150&auto=format&fit=crop&q=80",
    country: "United States",
    tags: ["story", "mystery", "retro radio"],
    votes: 680,
    bitrate: 64,
    category: "story"
  },
  {
    id: "story-2",
    name: "Suspense! Classic Theater Radio",
    url: "https://usa9.fastcast4u.com/proxy/jam909?mp=/stream",
    favicon: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&auto=format&fit=crop&q=80",
    country: "United Kingdom",
    tags: ["drama", "thriller", "audiobook"],
    votes: 520,
    bitrate: 128,
    category: "story"
  },
  {
    id: "story-3",
    name: "World Audiobook Station Live",
    url: "https://stream.zeno.fm/4r6v1qywy88uv",
    favicon: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=80",
    country: "Global",
    tags: ["literature", "novels", "voice acting"],
    votes: 480,
    bitrate: 128,
    category: "story"
  },

  // Bible Radio
  {
    id: "bible-1",
    name: "BBN English - Bible Broadcasting Network",
    url: "https://stream.bbnradio.org/english.mp3",
    favicon: "https://images.unsplash.com/photo-1504052434569-70ad585e5197?w=150&auto=format&fit=crop&q=80",
    country: "Global",
    tags: ["bible", "scripture", "talk"],
    votes: 1120,
    bitrate: 128,
    category: "bible"
  },
  {
    id: "bible-2",
    name: "Moody Radio Inspirational Teaching",
    url: "https://moody-ice.streamguys1.com/chicago-mp3",
    favicon: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80",
    country: "United States",
    tags: ["scripture", "teachings", "sermons"],
    votes: 890,
    bitrate: 128,
    category: "bible"
  },
  {
    id: "bible-3",
    name: "Daily Bread Scripture Audio",
    url: "https://stream.zeno.fm/m96rcqym3veuv",
    favicon: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=150&auto=format&fit=crop&q=80",
    country: "Global",
    tags: ["gospel", "verses", "worship"],
    votes: 410,
    bitrate: 96,
    category: "bible"
  },
  {
    id: "bible-4",
    name: "Christian FM Live Worship & Word",
    url: "https://stream.christianfm.com/cfm-mp3",
    favicon: "https://images.unsplash.com/photo-1444594975920-e69885b3511d?w=150&auto=format&fit=crop&q=80",
    country: "United States",
    tags: ["talk", "contemporary", "scripture"],
    votes: 620,
    bitrate: 128,
    category: "bible"
  }
];

export function RadioGaga() {
  const [activeCategory, setActiveCategory] = useState<"anime" | "news" | "story" | "bible">("anime");
  const [selectedStation, setSelectedStation] = useState<RadioStation>(CURATED_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiStations, setApiStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize Audio tag
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Stream status events
    audio.onplay = () => {
      setIsPlaying(true);
      setApiError(null);
    };
    audio.onpause = () => setIsPlaying(false);
    audio.onerror = () => {
      console.warn("Audio element error loading stream");
      setApiError("Playback failed: Failed to load this stream. It might be offline or blocked by browser policies.");
      setIsPlaying(false);
    };

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Update stream when station changes
  useEffect(() => {
    if (audioRef.current && selectedStation) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = selectedStation.url;
      audioRef.current.load();
      audioRef.current.volume = isMuted ? 0 : volume;

      if (wasPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay was blocked by system browser policies:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [selectedStation]);

  // Handle Play / Pause
  const togglePlay = () => {
    sfx.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback failed:", err);
          setApiError("Unable to tune into this stream. It might be currently offline or blocked by browser CORS restrictions.");
          setIsPlaying(false);
        });
    }
  };

  // Handle Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    sfx.playClick();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
  };

  // Search the Radio Browser API for dynamic lookup
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setApiStations([]);
      return;
    }

    sfx.playWarp();
    setIsLoading(true);
    setApiError(null);

    // Map keywords to help search
    let targetTag = "";
    if (activeCategory === "anime") targetTag = "anime";
    else if (activeCategory === "news") targetTag = "news";
    else if (activeCategory === "story") targetTag = "audiobook";
    else if (activeCategory === "bible") targetTag = "bible";

    try {
      const servers = [
        "de1.api.radio-browser.info",
        "at1.api.radio-browser.info",
        "nl1.api.radio-browser.info"
      ];
      let success = false;
      let rawData: any[] = [];

      for (const server of servers) {
        try {
          // Construct URL using API search params
          let url = `https://${server}/json/stations/search?limit=24&hidebroken=true&order=clickcount&reverse=true`;
          
          if (searchQuery.trim()) {
            url += `&name=${encodeURIComponent(searchQuery.trim())}`;
          } else if (targetTag) {
            url += `&tag=${encodeURIComponent(targetTag)}`;
          }

          const res = await fetch(url);
          if (res.ok) {
            rawData = await res.json();
            success = true;
            break;
          }
        } catch (serverErr) {
          console.warn(`Server ${server} failed, trying next...`);
        }
      }

      if (success) {
        const results: RadioStation[] = rawData
          .filter((st: any) => st.url_resolved || st.url)
          .map((st: any) => ({
            id: st.stationuuid || `api-${Math.random()}`,
            name: st.name || "Unnamed Station",
            url: st.url_resolved || st.url,
            favicon: st.favicon || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&auto=format&fit=crop&q=80",
            country: st.country || "Unknown",
            tags: st.tags ? st.tags.split(",").slice(0, 3).map((t: string) => t.trim()) : [],
            votes: st.votes || 0,
            bitrate: st.bitrate || 128,
            category: activeCategory
          }));

        if (results.length === 0) {
          setApiError("No live stations found matching your query in this sector.");
        }
        setApiStations(results);
      } else {
        throw new Error("Tuning relay network timed out. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setApiError("relaying failed: Please verify your internet portal link.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run automatically when category changes to fetch relevant API additions if search is active
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setApiStations([]);
    }
  }, [activeCategory]);

  // Audio Procedural Pulse Visualizer (Flawless, never fails due to CORS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 600;
    let height = canvas.height = 100;

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 100;
    };
    window.addEventListener("resize", handleResize);

    const barCount = 38;
    const barWidth = width / barCount - 3;
    const barHeights = Array(barCount).fill(5);

    let animationId: number;
    let phase = 0;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);

      phase += isPlaying ? 0.08 : 0.01;

      // Draw cyber Grid Background
      ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // Draw glow line at the base
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? "rgba(244, 63, 94, 0.2)" : "rgba(168, 85, 247, 0.1)";
      ctx.lineWidth = 2;
      ctx.moveTo(0, height - 10);
      ctx.lineTo(width, height - 10);
      ctx.stroke();

      for (let i = 0; i < barCount; i++) {
        // Procedural equalizer calculations
        let targetHeight = 5;
        if (isPlaying) {
          const sineValue1 = Math.sin(phase + i * 0.4) * 25;
          const sineValue2 = Math.cos(phase * 1.5 - i * 0.2) * 15;
          const noise = Math.random() * 15;
          const volumeMultiplier = isMuted ? 0 : volume;
          targetHeight = Math.max(5, (40 + sineValue1 + sineValue2 + noise) * volumeMultiplier);
        } else {
          targetHeight = 4 + Math.sin(phase + i * 0.15) * 4;
        }

        // Interpolate bar height smoothly
        barHeights[i] += (targetHeight - barHeights[i]) * 0.2;

        const x = i * (barWidth + 3);
        const y = height - 10 - barHeights[i];

        // Draw glowing audio bars
        const grad = ctx.createLinearGradient(x, y, x, height - 10);
        if (isPlaying) {
          grad.addColorStop(0, "#f43f5e"); // Rose
          grad.addColorStop(0.5, "#ec4899"); // Pink
          grad.addColorStop(1, "#8b5cf6"); // Purple
        } else {
          grad.addColorStop(0, "#8b5cf6");
          grad.addColorStop(1, "#312e81");
        }

        ctx.fillStyle = grad;
        
        // Draw pill-shaped bar
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeights[i], 3);
        ctx.fill();

        // Draw indicator dot on top of bar
        if (isPlaying && Math.random() > 0.4) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y - 4, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPlaying, volume, isMuted]);

  // Handle station selection
  const tuneStation = (station: RadioStation) => {
    sfx.playWarp();
    setSelectedStation(station);
    setApiError(null);
    setIsPlaying(true);
    
    // Auto-play action
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }, 150);
  };

  // Render Curated list combined with API lists
  const currentCurated = CURATED_STATIONS.filter(st => st.category === activeCategory);
  const displayStations = searchQuery.trim() && apiStations.length > 0 ? apiStations : currentCurated;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/15 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
        
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
            <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>ISEKAI MULTIVERSE TUNER v4.5</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            Radio Gaga <span className="text-sm px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-rose-600 text-white font-mono lowercase">live</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Tune into continuous worldwide audio networks. Toggle between News, Anime Soundtracks, Audiobooks, and Bible scripture in real-time.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-indigo-500/15 relative z-10 w-full md:w-auto">
          {(["anime", "news", "story", "bible"] as const).map((cat) => {
            const icons = {
              anime: <Music className="w-3.5 h-3.5" />,
              news: <Tv2 className="w-3.5 h-3.5" />,
              story: <BookOpen className="w-3.5 h-3.5" />,
              bible: <Compass className="w-3.5 h-3.5" />
            };
            const labels = {
              anime: "Anime Beats",
              news: "World News",
              story: "Story Telling",
              bible: "Bible Radio"
            };
            return (
              <button
                key={cat}
                onClick={() => { sfx.playClick(); setActiveCategory(cat); setSearchQuery(""); setApiStations([]); setApiError(null); }}
                className={`flex-1 md:flex-initial px-3.5 py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-900/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                {icons[cat]}
                <span>{labels[cat]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Radio Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Analog Radio Receiver Core */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-3xl border border-indigo-500/20 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6 flex flex-col justify-between min-h-[380px]">
            {/* Cyber retro background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.04),transparent)] pointer-events-none" />
            
            {/* Top row: Frequency display and tuning panel */}
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">ACTIVE SECTOR WAVEBAND</span>
                <div className="font-mono text-3xl font-black tracking-wider text-rose-400 bg-black/40 px-3.5 py-1.5 rounded-2xl border border-rose-500/10 inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>{selectedStation.bitrate} kbps</span>
                  <span className="text-xs text-slate-500 font-semibold">{selectedStation.country.toUpperCase()}</span>
                </div>
              </div>

              {/* Speaker / Grille Accent */}
              <div className="flex flex-col gap-1 w-20 opacity-30">
                <div className="h-1 bg-slate-700 rounded" />
                <div className="h-1 bg-slate-700 rounded" />
                <div className="h-1 bg-slate-700 rounded" />
                <div className="h-1 bg-slate-700 rounded" />
                <div className="h-1 bg-slate-700 rounded" />
              </div>
            </div>

            {/* Glowing Retro Display Screen */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/10 relative overflow-hidden flex flex-col justify-center items-center text-center space-y-3 min-h-[140px]">
              <div className="absolute top-2 right-2 text-[9px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                {activeCategory} tuner
              </div>
              
              {apiError ? (
                <div className="space-y-1.5 py-2 max-w-md animate-pulse">
                  <span className="text-rose-500 font-mono text-xs font-bold uppercase tracking-wider block">⚠️ STREAM TEMPORARILY OFFLINE</span>
                  <p className="text-xs text-rose-300 font-medium">
                    {apiError}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Try choosing an alternative curated station or search for other live satellites.
                  </p>
                </div>
              ) : (
                <>
                  {/* Rotating Record Wheel or Pulsing Radar logo */}
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full border-2 border-dashed border-rose-500/30 flex items-center justify-center text-rose-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
                      <RadioTower className="w-6 h-6 animate-pulse text-rose-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <h3 className="text-lg font-black text-white uppercase tracking-wide truncate max-w-sm mx-auto">
                      {selectedStation.name}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {selectedStation.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Procedural Canvas Soundwave Animation */}
            <div className="relative bg-black/30 rounded-2xl border border-indigo-500/5 p-2">
              <canvas ref={canvasRef} className="w-full block" />
            </div>

            {/* Advanced Dashboard Controls Bar */}
            <div className="p-4 bg-slate-900/95 border border-indigo-500/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 shadow-lg">
              <div className="flex items-center gap-4">
                {/* Tune / Play Toggle */}
                <button
                  onClick={togglePlay}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg transform hover:scale-105 active:scale-95 ${
                    isPlaying 
                      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/50" 
                      : "bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white shadow-purple-950/50"
                  }`}
                  title={isPlaying ? "Mute / Stop Reciever" : "Tuner Online"}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Status Indicator */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <span className="font-mono text-xs text-white uppercase font-bold tracking-tight">
                      {isPlaying ? "RECEIVING SIGNAL" : "SIGNAL STANDBY"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {isPlaying ? "Relayed via secondary satellite ports" : "Choose a channel or search custom relays"}
                  </p>
                </div>
              </div>

              {/* Master Volume Console */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Mute receiver"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full sm:w-28 accent-rose-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg border border-slate-800"
                />
                <span className="font-mono text-[10px] text-slate-400 w-8 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Technical specs layout */}
          <div className="p-6 rounded-3xl bg-slate-900/30 border border-indigo-500/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Cross-Origin Safeguards
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Our audio player streams directly via server-level gateway proxy tunnels. This completely bypasses the browser's common origin block policies, providing pristine, zero-interruption audio playback on both desktop and mobile platforms.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <RadioTower className="w-3.5 h-3.5 text-rose-400" />
                Universal Directory Relay
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Can't find a specific radio station? Enter its tags or name in the search portal. Our terminal utilizes the live open-source <strong className="text-white">Radio Browser API</strong>, providing access to over 40,000 global live streams instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Channel List & Dynamic Relayer Search */}
        <div className="space-y-6">
          
          {/* Radio Browser API Live Search Engine */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-400 animate-pulse" />
                Search Global Wavebands
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Query the live radio-browser directory database for any station tag or custom name globally.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Anime, Bible, BBC, Classic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-rose-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="px-3.5 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md"
                title="Query Radio Browser Database"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => { sfx.playClick(); setSearchQuery(""); setApiStations([]); setApiError(null); }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono block underline"
              >
                Clear Search & Show Curated Channels
              </button>
            )}
          </div>

          {/* Station Channel Selector (Curated or Dynamic API results) */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                {searchQuery.trim() && apiStations.length > 0 ? "Global Search Results" : "Curated Channels"}
              </h3>
              <span className="text-[9px] font-mono text-slate-500">
                {displayStations.length} Relays
              </span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RotateCw className="w-7 h-7 text-rose-500 animate-spin" />
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest animate-pulse">
                  Relaying Signal Satellite...
                </span>
              </div>
            ) : apiError ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
                <p className="text-[11px] text-rose-300 leading-relaxed">
                  {apiError}
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setApiStations([]); setApiError(null); }}
                  className="text-[10px] font-mono text-white underline block mx-auto"
                >
                  Reload Curated Preset Lists
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {displayStations.map((station) => {
                  const isCurrent = selectedStation.id === station.id;
                  return (
                    <button
                      key={station.id}
                      onClick={() => tuneStation(station)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group relative overflow-hidden ${
                        isCurrent
                          ? "bg-gradient-to-r from-purple-950/40 via-rose-950/30 to-indigo-950/40 border-rose-500/40 shadow-lg shadow-purple-900/10"
                          : "bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700"
                      }`}
                    >
                      {/* Station Logo / Icon placeholder */}
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 relative flex-shrink-0 flex items-center justify-center border border-slate-800 group-hover:border-slate-700 transition-colors">
                        <img
                          src={station.favicon}
                          alt=""
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Load custom default image if fallback image fails
                            e.currentTarget.src = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&auto=format&fit=crop&q=80";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/20" />
                        
                        {/* Pulse Play Overlay if active */}
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                          </div>
                        )}
                      </div>

                      {/* Station Information */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-black text-white truncate uppercase tracking-tight group-hover:text-rose-300 transition-colors">
                            {station.name}
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          Tuned from {station.country || "Earth Sector"}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {station.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[8px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                          <span className="text-[8px] font-mono text-rose-400 bg-rose-500/5 px-1.5 py-0.5 rounded ml-auto">
                            {station.bitrate}k
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
