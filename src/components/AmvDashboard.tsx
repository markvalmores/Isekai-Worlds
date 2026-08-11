import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Search, 
  Heart, 
  Tv2, 
  Sparkles, 
  Clock, 
  Flame, 
  Music, 
  Plus, 
  Trash2, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  ThumbsUp, 
  Database,
  ArrowLeft,
  FileText,
  RotateCw,
  Info,
  Layers,
  HelpCircle,
  Brain,
  CheckCircle2
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface AMVVideo {
  id: string; // youtube id or mal video id
  title: string;
  animeTitle: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  type: "curated" | "api_promo" | "api_music";
  duration?: string;
  views?: string;
  vibe?: "hype" | "epic" | "sad" | "chill" | "all";
  malId?: number;
  verified?: boolean;
}

const CURATED_AMVS: AMVVideo[] = [
  {
    id: "lY20PxVepu0",
    title: "Into The Labyrinth - Bakemonogatari AMV",
    animeTitle: "Monogatari Series",
    url: "https://www.youtube.com/watch?v=lY20PxVepu0",
    embedUrl: "https://www.youtube.com/embed/lY20PxVepu0?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/lY20PxVepu0/mqdefault.jpg",
    type: "curated",
    duration: "4:02",
    views: "2.4M",
    vibe: "epic"
  },
  {
    id: "0W8fK_9Z-78",
    title: "Anime 101 - Ultimate High Energy Mashup",
    animeTitle: "Various Anime",
    url: "https://www.youtube.com/watch?v=0W8fK_9Z-78",
    embedUrl: "https://www.youtube.com/embed/0W8fK_9Z-78?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/0W8fK_9Z-78/mqdefault.jpg",
    type: "curated",
    duration: "3:42",
    views: "8.1M",
    vibe: "hype"
  },
  {
    id: "e_04ZrN-XTo",
    title: "Rise - Glitter & Gold Action Showcase",
    animeTitle: "Action Mix",
    url: "https://www.youtube.com/watch?v=e_04ZrN-XTo",
    embedUrl: "https://www.youtube.com/embed/e_04ZrN-XTo?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/e_04ZrN-XTo/mqdefault.jpg",
    type: "curated",
    duration: "3:15",
    views: "1.2M",
    vibe: "epic"
  },
  {
    id: "S8_R6-T_t4E",
    title: "Legends Never Die - Solo Leveling x Chainsaw Man",
    animeTitle: "Chainsaw Man / Solo Leveling",
    url: "https://www.youtube.com/watch?v=S8_R6-T_t4E",
    embedUrl: "https://www.youtube.com/embed/S8_R6-T_t4E?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/S8_R6-T_t4E/mqdefault.jpg",
    type: "curated",
    duration: "3:58",
    views: "920K",
    vibe: "hype"
  },
  {
    id: "ZRtdQ81jCgA",
    title: "Idol (YOASOBI Official Anime Music Video)",
    animeTitle: "Oshi no Ko",
    url: "https://www.youtube.com/watch?v=ZRtdQ81jCgA",
    embedUrl: "https://www.youtube.com/embed/ZRtdQ81jCgA?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/ZRtdQ81jCgA/mqdefault.jpg",
    type: "curated",
    duration: "3:48",
    views: "450M",
    vibe: "hype"
  },
  {
    id: "dFlDRhvM4L0",
    title: "Kick Back (Chainsaw Man Opening MV)",
    animeTitle: "Chainsaw Man",
    url: "https://www.youtube.com/watch?v=dFlDRhvM4L0",
    embedUrl: "https://www.youtube.com/embed/dFlDRhvM4L0?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/dFlDRhvM4L0/mqdefault.jpg",
    type: "curated",
    duration: "3:13",
    views: "180M",
    vibe: "epic"
  },
  {
    id: "CwkzK-F0Y00",
    title: "Gurenge - Demon Slayer OP (LiSA Cover / Live)",
    animeTitle: "Demon Slayer",
    url: "https://www.youtube.com/watch?v=CwkzK-F0Y00",
    embedUrl: "https://www.youtube.com/embed/CwkzK-F0Y00?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/CwkzK-F0Y00/mqdefault.jpg",
    type: "curated",
    duration: "4:00",
    views: "230M",
    vibe: "hype"
  },
  {
    id: "ntgcoYCH_pM",
    title: "Aishite, Aishite, Aishite (Love me, Love me, Love me)",
    animeTitle: "Vocaloid Project",
    url: "https://www.youtube.com/watch?v=ntgcoYCH_pM",
    embedUrl: "https://www.youtube.com/embed/ntgcoYCH_pM?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/ntgcoYCH_pM/mqdefault.jpg",
    type: "curated",
    duration: "4:15",
    views: "95M",
    vibe: "sad"
  },
  {
    id: "Gg8B6H6497c",
    title: "Shelter (Official Animated Music Video)",
    animeTitle: "Porter Robinson & Madeon",
    url: "https://www.youtube.com/watch?v=Gg8B6H6497c",
    embedUrl: "https://www.youtube.com/embed/Gg8B6H6497c?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/Gg8B6H6497c/mqdefault.jpg",
    type: "curated",
    duration: "6:07",
    views: "89M",
    vibe: "sad"
  },
  {
    id: "H58vbez_m4E",
    title: "Sparkle - Radwimps (Your Name OST MV)",
    animeTitle: "Kimi no Na wa",
    url: "https://www.youtube.com/watch?v=H58vbez_m4E",
    embedUrl: "https://www.youtube.com/embed/H58vbez_m4E?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/H58vbez_m4E/mqdefault.jpg",
    type: "curated",
    duration: "8:57",
    views: "140M",
    vibe: "chill"
  },
  {
    id: "3ymwM-eRLS4",
    title: "Koe no Katachi - Silent Voice Emotional AMV",
    animeTitle: "A Silent Voice",
    url: "https://www.youtube.com/watch?v=3ymwM-eRLS4",
    embedUrl: "https://www.youtube.com/embed/3ymwM-eRLS4?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/3ymwM-eRLS4/mqdefault.jpg",
    type: "curated",
    duration: "4:30",
    views: "5.3M",
    vibe: "sad"
  },
  {
    id: "bWnST6y8SjE",
    title: "Demon Slayer Mugen Train Lofi Chill Beats",
    animeTitle: "Kimetsu no Yaiba",
    url: "https://www.youtube.com/watch?v=bWnST6y8SjE",
    embedUrl: "https://www.youtube.com/embed/bWnST6y8SjE?enablejsapi=1&wmode=opaque",
    thumbnail: "https://img.youtube.com/vi/bWnST6y8SjE/mqdefault.jpg",
    type: "curated",
    duration: "3:05",
    views: "1.5M",
    vibe: "chill"
  }
];

interface RadioGagaAMVProps {
  onCloudSave?: (key: string) => Promise<any>;
  syncKey?: string;
}

export function RadioGagaAMV({ onCloudSave, syncKey }: RadioGagaAMVProps = {}) {
  const [activeTab, setActiveTab] = useState<"curated" | "popular" | "recent" | "my-playlist" | "ai-match">("curated");
  const [vibeFilter, setVibeFilter] = useState<"hype" | "epic" | "sad" | "chill" | "all">("all");
  const [selectedVideo, setSelectedVideo] = useState<AMVVideo>(CURATED_AMVS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchedAnimeId, setSearchedAnimeId] = useState<number | null>(null);
  const [apiVideos, setApiVideos] = useState<AMVVideo[]>([]);
  const [popularVideos, setPopularVideos] = useState<AMVVideo[]>([]);
  const [recentVideos, setRecentVideos] = useState<AMVVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI-Powered search states
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMatchedVideos, setAiMatchedVideos] = useState<AMVVideo[]>([]);

  // Live playlist states
  const [curatedVideos, setCuratedVideos] = useState<AMVVideo[]>(CURATED_AMVS);
  const [playlistId, setPlaylistId] = useState(() => {
    return localStorage.getItem("isekai_amv_playlist_id") || "PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu";
  });
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);

  const isFirstRender = useRef(true);
  useEffect(() => {
    localStorage.setItem("isekai_amv_playlist_id", playlistId);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onCloudSave && syncKey) {
      onCloudSave(syncKey);
    }
  }, [playlistId, onCloudSave, syncKey]);

  // Playlist state
  const [myPlaylist, setMyPlaylist] = useState<AMVVideo[]>(() => {
    const saved = localStorage.getItem("isekai_amv_playlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Unique features
  const [theaterMode, setTheaterMode] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [notesText, setNotesText] = useState(() => {
    return localStorage.getItem("isekai_amv_scratchpad") || "";
  });

  // Save playlist helper
  const savePlaylist = (list: AMVVideo[]) => {
    setMyPlaylist(list);
    localStorage.setItem("isekai_amv_playlist", JSON.stringify(list));
    if (onCloudSave && syncKey) {
      onCloudSave(syncKey);
    }
  };

  // Video verification checker layer
  const validateAndFilterVideos = async (videos: AMVVideo[]): Promise<AMVVideo[]> => {
    if (videos.length === 0) return [];
    try {
      const videoIds = videos.map(v => v.id).filter(id => !id.startsWith("mal-"));
      if (videoIds.length === 0) {
        return videos.map(v => ({ ...v, verified: true }));
      }
      
      const res = await fetch("/api/amv/check-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIds })
      });
      if (res.ok) {
        const data = await res.json();
        const workingMap = data.workingMap || {};
        return videos
          .map(v => ({ ...v, verified: workingMap[v.id] !== false }))
          .filter(v => workingMap[v.id] !== false);
      }
    } catch (err) {
      console.warn("Failed to check video validity:", err);
    }
    return videos.map(v => ({ ...v, verified: true }));
  };

  // Save scratchpad helper

  // Save scratchpad helper
  useEffect(() => {
    localStorage.setItem("isekai_amv_scratchpad", notesText);
  }, [notesText]);

  // Load live playlist from our backend scraper
  useEffect(() => {
    const fetchLivePlaylist = async () => {
      setIsPlaylistLoading(true);
      try {
        const res = await fetch(`/api/amv/playlist?playlistId=${encodeURIComponent(playlistId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.videos && Array.isArray(json.videos) && json.videos.length > 0) {
            const vibes: Array<"hype" | "epic" | "sad" | "chill"> = ["epic", "hype", "sad", "chill"];
            const mapped: AMVVideo[] = json.videos.map((vid: any, idx: number) => ({
              ...vid,
              vibe: vibes[idx % vibes.length]
            }));
            setCuratedVideos(mapped);
            setSelectedVideo(mapped[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load live playlist:", err);
      } finally {
        setIsPlaylistLoading(false);
      }
    };
    fetchLivePlaylist();
  }, [playlistId]);

  // Fetch Jikan watch popular promos on mount
  useEffect(() => {
    const fetchPopularPromos = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/watch/promos/popular");
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            const parsed: AMVVideo[] = json.data.slice(0, 15).map((item: any) => ({
              id: item.trailer.youtube_id || `mal-${item.entry.mal_id}`,
              title: item.trailer.title || `${item.entry.title} - Official PV`,
              animeTitle: item.entry.title,
              url: item.trailer.url || `https://www.youtube.com/watch?v=${item.trailer.youtube_id}`,
              embedUrl: `https://www.youtube.com/embed/${item.trailer.youtube_id}?enablejsapi=1&wmode=opaque`,
              thumbnail: item.trailer.images?.medium_image_url || item.entry.images?.jpg?.large_image_url || "",
              type: "api_promo",
              malId: item.entry.mal_id
            }));
            const validated = await validateAndFilterVideos(parsed);
            setPopularVideos(validated);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch popular promos:", err);
      }
    };

    const fetchRecentPromos = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/watch/promos");
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            const parsed: AMVVideo[] = json.data.slice(0, 15).map((item: any) => ({
              id: item.trailer.youtube_id || `mal-${item.entry.mal_id}`,
              title: item.trailer.title || `${item.entry.title} - Promo Video`,
              animeTitle: item.entry.title,
              url: item.trailer.url || `https://www.youtube.com/watch?v=${item.trailer.youtube_id}`,
              embedUrl: `https://www.youtube.com/embed/${item.trailer.youtube_id}?enablejsapi=1&wmode=opaque`,
              thumbnail: item.trailer.images?.medium_image_url || item.entry.images?.jpg?.large_image_url || "",
              type: "api_promo",
              malId: item.entry.mal_id
            }));
            const validated = await validateAndFilterVideos(parsed);
            setRecentVideos(validated);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch recent promos:", err);
      }
    };

    fetchPopularPromos();
    // Delay slightly to prevent rate limit issues
    setTimeout(fetchRecentPromos, 1000);
  }, []);

  // Search Anime via Jikan API
  const handleAnimeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    sfx.playWarp();
    setIsLoading(true);
    setErrorMsg(null);
    setSearchResults([]);
    setApiVideos([]);

    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery.trim())}&limit=8`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setSearchResults(json.data);
        } else {
          setErrorMsg("No matching anime records found in the MAL central database.");
        }
      } else {
        throw new Error("Unable to relay search request.");
      }
    } catch (err) {
      setErrorMsg("MAL Search relay timed out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load videos for a selected anime from search
  const loadAnimeVideos = async (animeId: number, animeTitle: string) => {
    sfx.playWarp();
    setIsLoading(true);
    setErrorMsg(null);
    setSearchedAnimeId(animeId);

    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/videos`);
      if (res.ok) {
        const json = await res.json();
        const promoVideos = json.data?.promo || [];
        const musicVideos = json.data?.music_videos || [];

        const combined: AMVVideo[] = [];

        // Parse official PVs
        promoVideos.forEach((p: any, idx: number) => {
          if (p.trailer?.youtube_id) {
            combined.push({
              id: p.trailer.youtube_id,
              title: p.title || `${animeTitle} - PV #${idx + 1}`,
              animeTitle: animeTitle,
              url: p.trailer.url,
              embedUrl: `https://www.youtube.com/embed/${p.trailer.youtube_id}?enablejsapi=1&wmode=opaque`,
              thumbnail: p.trailer.images?.medium_image_url || `https://img.youtube.com/vi/${p.trailer.youtube_id}/mqdefault.jpg`,
              type: "api_promo",
              malId: animeId
            });
          }
        });

        // Parse official Music Videos
        musicVideos.forEach((m: any, idx: number) => {
          if (m.video?.youtube_id) {
            combined.push({
              id: m.video.youtube_id,
              title: m.meta?.title ? `[MV] ${m.meta.title} by ${m.meta.author || "Artist"}` : m.title || `${animeTitle} - Music Video #${idx + 1}`,
              animeTitle: animeTitle,
              url: m.video.url,
              embedUrl: `https://www.youtube.com/embed/${m.video.youtube_id}?enablejsapi=1&wmode=opaque`,
              thumbnail: `https://img.youtube.com/vi/${m.video.youtube_id}/mqdefault.jpg`,
              type: "api_music",
              malId: animeId
            });
          }
        });

        if (combined.length === 0) {
          setErrorMsg(`This anime is registered but has no official video trailers or music videos recorded.`);
        } else {
          const validated = await validateAndFilterVideos(combined);
          if (validated.length === 0) {
            setErrorMsg(`All official videos recorded for this anime are currently unavailable.`);
          } else {
            setApiVideos(validated);
            setSelectedVideo(validated[0]);
          }
        }
      } else {
        throw new Error("Unable to fetch anime details.");
      }
    } catch (err) {
      setErrorMsg("Failed to fetch official videos for this anime.");
    } finally {
      setIsLoading(false);
    }
  };

  // AI-Powered search and multi-API vibe matcher
  const handleAiVibeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSearchQuery.trim()) return;

    sfx.playWarp();
    setIsAiLoading(true);
    setErrorMsg(null);
    setAiRecommendations([]);
    setAiMatchedVideos([]);
    setActiveTab("ai-match");

    try {
      // 1. Ask Gemini backend for matches
      const aiRes = await fetch("/api/amv/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiSearchQuery.trim() })
      });

      if (!aiRes.ok) {
        throw new Error("Failed to consult Gemini Vibe Core.");
      }

      const aiData = await aiRes.json();
      setAiRecommendations(aiData.recommendedAnime || []);

      // 2. For each recommended anime, fetch its MAL ID and pull videos
      const finalVideos: AMVVideo[] = [];
      const recommendedList = aiData.recommendedAnime || [];

      for (let i = 0; i < recommendedList.length; i++) {
        const item = recommendedList[i];
        try {
          // Delay to respect Jikan rate limit (max 3 req/sec)
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Search MAL for the anime to get mal_id
          const searchRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(item.searchQuery)}&limit=1`);
          if (searchRes.ok) {
            const searchJson = await searchRes.json();
            const animeObj = searchJson.data?.[0];
            if (animeObj) {
              const malId = animeObj.mal_id;
              // Fetch videos
              const videosRes = await fetch(`https://api.jikan.moe/v4/anime/${malId}/videos`);
              if (videosRes.ok) {
                const videosJson = await videosRes.json();
                const promo = videosJson.data?.promo || [];
                const music = videosJson.data?.music_videos || [];

                promo.forEach((p: any, idx: number) => {
                  if (p.trailer?.youtube_id) {
                    finalVideos.push({
                      id: p.trailer.youtube_id,
                      title: p.title || `${animeObj.title} - Promo #${idx + 1}`,
                      animeTitle: animeObj.title,
                      url: p.trailer.url,
                      embedUrl: `https://www.youtube.com/embed/${p.trailer.youtube_id}?enablejsapi=1&wmode=opaque`,
                      thumbnail: p.trailer.images?.medium_image_url || `https://img.youtube.com/vi/${p.trailer.youtube_id}/mqdefault.jpg`,
                      type: "api_promo",
                      malId: malId,
                      vibe: aiData.suggestedVibes?.[0] || "epic"
                    });
                  }
                });

                music.forEach((m: any, idx: number) => {
                  if (m.video?.youtube_id) {
                    finalVideos.push({
                      id: m.video.youtube_id,
                      title: m.meta?.title ? `[AI Vibe] ${m.meta.title}` : `${animeObj.title} - Music Video #${idx + 1}`,
                      animeTitle: animeObj.title,
                      url: m.video.url,
                      embedUrl: `https://www.youtube.com/embed/${m.video.youtube_id}?enablejsapi=1&wmode=opaque`,
                      thumbnail: `https://img.youtube.com/vi/${m.video.youtube_id}/mqdefault.jpg`,
                      type: "api_music",
                      malId: malId,
                      vibe: aiData.suggestedVibes?.[0] || "epic"
                    });
                  }
                });
              }
            }
          }
        } catch (err) {
          console.warn("Failed to fetch details for recommendation:", item.title, err);
        }
      }

      if (finalVideos.length === 0) {
        setErrorMsg("The AI recommended matches, but we couldn't retrieve valid video feeds from MyAnimeList.");
      } else {
        // 3. Verify all fetched videos in real-time, removing broken ones
        const validated = await validateAndFilterVideos(finalVideos);
        if (validated.length === 0) {
          setErrorMsg("All recommended video streams are currently flagged as unavailable on YouTube.");
        } else {
          setAiMatchedVideos(validated);
          setSelectedVideo(validated[0]);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("AI Matcher relay experienced a transient timeout. Please retry.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Add to Playlist toggle
  const togglePlaylist = (video: AMVVideo) => {
    sfx.playClick();
    const isSaved = myPlaylist.some((item) => item.id === video.id);
    if (isSaved) {
      const filtered = myPlaylist.filter((item) => item.id !== video.id);
      savePlaylist(filtered);
    } else {
      const updated = [...myPlaylist, video];
      savePlaylist(updated);
    }
  };

  // Share action helper
  const handleShare = () => {
    sfx.playWarp();
    navigator.clipboard.writeText(selectedVideo.url);
    alert(`Copied link to clipboard: ${selectedVideo.title}`);
  };

  // Get active display feed based on Tab selection & Vibe filter
  const getDisplayFeed = () => {
    if (activeTab === "curated") {
      if (vibeFilter === "all") return curatedVideos;
      return curatedVideos.filter((item) => item.vibe === vibeFilter);
    }
    if (activeTab === "popular") return popularVideos;
    if (activeTab === "recent") return recentVideos;
    if (activeTab === "my-playlist") return myPlaylist;
    if (activeTab === "ai-match") return aiMatchedVideos;
    return [];
  };

  const displayFeed = getDisplayFeed();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      {/* Tab Header Badge Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/15 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
        
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>HQ ANIME MUSIC VIDEOS PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            AMV Studio <span className="text-sm px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-mono lowercase">HD</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Synchronize high fidelity anime trailers, promo videos, and epic community AMVs. Use MAL database querying to find individual media segments dynamically.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-indigo-500/15 relative z-10 w-full md:w-auto">
          {[
            { id: "curated", label: "Epic AMVs", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: "popular", label: "MAL Popular", icon: <Flame className="w-3.5 h-3.5" /> },
            { id: "recent", label: "New Releases", icon: <Clock className="w-3.5 h-3.5" /> },
            { id: "my-playlist", label: "My Playlist", icon: <Bookmark className="w-3.5 h-3.5" /> },
            { id: "ai-match", label: "AI Vibe Match", icon: <Brain className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sfx.playClick();
                setActiveTab(tab.id as any);
                setSearchResults([]);
                setApiVideos([]);
                setSearchQuery("");
                setSearchedAnimeId(null);
                setErrorMsg(null);
              }}
              className={`flex-1 md:flex-initial px-3.5 py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-950/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Playlist Customizer Bar */}
      {activeTab === "curated" && (
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-mono text-slate-450 uppercase block tracking-wider">Active YouTube AMV Playlist:</span>
              <span className="text-xs text-white font-bold font-mono">
                {playlistId === "PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu" ? "Default Curated AMV Playlist" : `Custom Playlist (${playlistId})`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Paste custom Playlist ID (e.g., PLjNlQ2...)"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
              className="w-full sm:w-64 bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono transition-all"
            />
            <button
              onClick={() => {
                sfx.playWarp();
                setPlaylistId("PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu");
              }}
              disabled={playlistId === "PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu"}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 shrink-0"
              title="Reset to default playlist"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Player on left/top, query directories & search results on right */}
      <div className={`grid grid-cols-1 ${theaterMode ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-6 transition-all duration-300`}>
        
        {/* Theater Player Block */}
        <div className={theaterMode ? "lg:col-span-1" : "lg:col-span-2"}>
          <div className="relative rounded-3xl border border-rose-500/20 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-4">
            
            {/* Ambient Backlight Glow behind the video */}
            {ambientGlow && (
              <div 
                className="absolute inset-0 pointer-events-none transition-all duration-1000 blur-[80px] opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, #f43f5e, #6366f1, transparent)`
                }}
              />
            )}

            {/* Video Header Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest block">
                  NOW REPRODUCING IN HIGH RESOLUTION
                </span>
                <h2 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">
                  {selectedVideo.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Origin: <strong className="text-indigo-400">{selectedVideo.animeTitle}</strong>
                </p>
              </div>

              {/* Theater Mode Control toggles */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setAmbientGlow(!ambientGlow)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all ${
                    ambientGlow 
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" 
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                  title="Toggle glowing responsive backdrop ambient lighting"
                >
                  Glow
                </button>
                <button
                  onClick={() => { sfx.playClick(); setTheaterMode(!theaterMode); }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
                  title={theaterMode ? "Return standard grid view" : "Activate Theater Mode"}
                >
                  {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Responsive Iframe Frame Container */}
            <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-900 relative z-10 shadow-inner">
              {selectedVideo.id ? (
                <iframe
                  src={selectedVideo.embedUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <Tv2 className="w-12 h-12 text-slate-700 animate-pulse" />
                  <p className="text-sm font-bold text-slate-400">Select a video channel from the catalog below</p>
                </div>
              )}
            </div>

            {/* Quick Interaction Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/50 border border-slate-800 rounded-2xl relative z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePlaylist(selectedVideo)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                    myPlaylist.some((item) => item.id === selectedVideo.id)
                      ? "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${myPlaylist.some((item) => item.id === selectedVideo.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>
                    {myPlaylist.some((item) => item.id === selectedVideo.id) ? "In Playlist" : "Add Playlist"}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-mono font-bold uppercase transition-all flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* View/Duration specs */}
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                {selectedVideo.duration && (
                  <span className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-900">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {selectedVideo.duration}
                  </span>
                )}
                {selectedVideo.views && (
                  <span className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-900">
                    <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
                    {selectedVideo.views} views
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive scratchpad for user lyrics and comments */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 relative overflow-hidden mt-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Vibe Notes & Lyrics scratchpad
              </h3>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Jot down anime titles to watch later, lyrics, thoughts on the AMV, or copy text here while playing..."
              className="w-full h-24 bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/30 transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500 font-mono">
              <span>Saved automatically to offline terminal storage</span>
              <button
                onClick={() => { sfx.playClick(); setNotesText(""); }}
                className="text-rose-400 hover:text-rose-300 underline"
              >
                Clear pad
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Navigation feed & Anime metadata search */}
        <div className={theaterMode ? "lg:col-span-1" : "lg:col-span-1"}>
          
          {/* AI Vibe Matcher Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-purple-500/20 space-y-4 relative overflow-hidden shadow-xl mb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <h3 className="text-xs font-mono font-bold text-purple-300 tracking-wider uppercase flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                AI Vibe Matcher
              </h3>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Describe a vibe, genre, or style (e.g., "cyberpunk beats with fast motorcycle chase visuals"), and Gemini will match recommended anime and build a verified video feed for you!
              </p>
            </div>

            <form onSubmit={handleAiVibeSearch} className="flex gap-2 relative z-10">
              <input
                type="text"
                required
                placeholder="Describe a vibe (e.g. cozy lofi, intense combat...)"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="px-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md flex items-center justify-center"
                title="Generate AI video mix"
              >
                {isAiLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Jikan MAL Database Direct query Search Engine */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400 animate-pulse" />
                Query MAL Database
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Query the central MyAnimeList library directory. Clicking a card pulls its promo trailers & high-resolution video streams instantly.
              </p>
            </div>

            <form onSubmit={handleAnimeSearch} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Search anime (e.g. Demon Slayer, Naruto...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-rose-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="px-3.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md flex items-center justify-center"
                title="Search database"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Back button if viewed anime videos */}
            {searchedAnimeId && (
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setSearchedAnimeId(null);
                  setApiVideos([]);
                  setErrorMsg(null);
                }}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-mono block underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Return to Search results
              </button>
            )}
          </div>

          {/* Vibe Filter Controls (Only visible in Curated mode) */}
          {activeTab === "curated" && (
            <div className="p-4 rounded-3xl bg-slate-900/30 border border-indigo-500/10 space-y-2">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                FILTER CURATED BY AUDIO VIBE
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: "all", label: "All Vibes" },
                  { id: "hype", label: "Hype" },
                  { id: "epic", label: "Action/Epic" },
                  { id: "sad", label: "Emotional" },
                  { id: "chill", label: "Lofi/Chill" }
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { sfx.playClick(); setVibeFilter(v.id as any); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase transition-all ${
                      vibeFilter === v.id 
                        ? "bg-rose-500/20 border border-rose-500/30 text-rose-300" 
                        : "bg-slate-950 text-slate-400 hover:text-white border border-transparent"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media list section (Search Results OR Loaded Videos OR Curated list) */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                {searchedAnimeId ? "Anime Videos" : activeTab === "ai-match" ? "AI Vibe Matches" : "Media Catalog"}
              </h3>
              <span className="text-[9px] font-mono text-slate-500">
                {searchResults.length > 0 && !searchedAnimeId ? `${searchResults.length} Anime results` : `${displayFeed.length} items`}
              </span>
            </div>

            {/* AI Recommendations panel */}
            {activeTab === "ai-match" && aiRecommendations.length > 0 && !isAiLoading && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2">
                <span className="text-[9px] font-mono font-bold text-purple-300 uppercase tracking-wider block">
                  ★ Gemini matched recommendations:
                </span>
                <div className="space-y-2">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className="text-[10px] text-slate-300 leading-relaxed border-b border-purple-500/10 pb-1.5 last:border-b-0 last:pb-0">
                      <span className="text-purple-300 font-bold uppercase block">{rec.title}</span>
                      <span className="text-slate-400 block">{rec.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAiLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                <RotateCw className="w-8 h-8 text-purple-500 animate-spin" />
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest block animate-pulse">
                    Consulting Gemini Vibe Core...
                  </span>
                  <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    Analyzing description, querying databases, and verifying live video status...
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <RotateCw className="w-8 h-8 text-rose-500 animate-spin" />
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block animate-pulse">
                  Relaying satellite database...
                </span>
              </div>
            ) : errorMsg ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
                <p className="text-[11px] text-rose-300 leading-relaxed">
                  {errorMsg}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSearchQuery("");
                    setSearchResults([]);
                    setApiVideos([]);
                    setSearchedAnimeId(null);
                  }}
                  className="text-[10px] font-mono text-white underline block mx-auto"
                >
                  Reload Curated Catalog
                </button>
              </div>
            ) : searchResults.length > 0 && !searchedAnimeId ? (
              // Show searched MAL anime list
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                {searchResults.map((anime) => (
                  <button
                    key={anime.mal_id}
                    onClick={() => loadAnimeVideos(anime.mal_id, anime.title)}
                    className="w-full text-left p-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 hover:border-slate-700 transition-all flex items-start gap-3 group"
                  >
                    <div className="w-12 h-16 rounded-xl overflow-hidden bg-slate-900 relative flex-shrink-0 border border-slate-800">
                      <img
                        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 pt-0.5">
                      <h4 className="text-xs font-black text-white truncate uppercase tracking-tight group-hover:text-rose-300 transition-colors">
                        {anime.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {anime.synopsis || "No description recorded in MyAnimeList."}
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded">
                          ★ {anime.score || "N/A"}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500 ml-auto flex items-center gap-1 group-hover:text-rose-300 transition-colors">
                          Query videos <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Normal list of AMVs (Curated or Jikan-resolved videos)
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                {apiVideos.length > 0 ? (
                  // API-loaded direct videos for an anime
                  apiVideos.map((video) => {
                    const isCurrent = selectedVideo.id === video.id;
                    return (
                      <button
                        key={video.id}
                        onClick={() => { sfx.playWarp(); setSelectedVideo(video); }}
                        className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center gap-3 group ${
                          isCurrent
                             ? "bg-gradient-to-r from-rose-950/40 to-indigo-950/40 border-rose-500/40 shadow-lg"
                             : "bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700"
                        }`}
                      >
                        <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-900 relative flex-shrink-0 border border-slate-800">
                          <img
                            src={video.thumbnail}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                            <Play className="w-3 h-3 text-white fill-current opacity-70" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight group-hover:text-rose-300 transition-colors">
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-rose-400">
                              {video.type === "api_music" ? "Official MV" : "Promo Trailer"}
                            </span>
                            {video.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded font-bold uppercase">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : displayFeed.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono uppercase">
                    Your custom playlist or matching feed is empty.
                  </div>
                ) : (
                  // Regular tab display feed (curated / popular / recent / favorites / ai-match)
                  displayFeed.map((video) => {
                    const isCurrent = selectedVideo.id === video.id;
                    return (
                      <button
                        key={video.id}
                        onClick={() => { sfx.playWarp(); setSelectedVideo(video); }}
                        className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-start gap-3 group ${
                          isCurrent
                            ? "bg-gradient-to-r from-rose-950/40 to-indigo-950/40 border-rose-500/40 shadow-lg"
                            : "bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700"
                        }`}
                      >
                        <div className="w-20 h-12 rounded-xl overflow-hidden bg-slate-900 relative flex-shrink-0 border border-slate-800">
                          <img
                            src={video.thumbnail}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-950/35 flex items-center justify-center">
                            <Play className="w-4.5 h-4.5 text-white fill-current opacity-80" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h4 className="text-xs font-black text-white truncate uppercase tracking-tight group-hover:text-rose-300 transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-[10px] text-indigo-400 truncate">
                            {video.animeTitle}
                          </p>
                          <div className="flex items-center gap-1.5">
                            {video.vibe && (
                              <span className="text-[8px] font-mono text-slate-500 bg-slate-900 px-1 py-0.5 rounded uppercase">
                                {video.vibe}
                              </span>
                            )}
                            {video.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded font-bold uppercase">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                            {video.duration && (
                              <span className="text-[8px] font-mono text-slate-500 ml-auto">
                                {video.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
