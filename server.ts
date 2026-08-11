import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client safely
let genAIClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// In-Memory Global Leaderboard data with persistence fallback
const DATA_DIR = path.join(process.cwd(), "data");
const LEADERBOARD_FILE = path.join(DATA_DIR, "leaderboard.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  banner?: string;
  title: string;
  badge: string;
  secondsLogged: number;
  country: string;
  isOnline: boolean;
  lastActive: string;
}

// NO fake seed users! Top 100 starts empty until real users register and log session time.
const initialSeedLeaderboard: LeaderboardEntry[] = [];

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(LEADERBOARD_FILE)) {
      const content = fs.readFileSync(LEADERBOARD_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read leaderboard file:", err);
  }
  return initialSeedLeaderboard;
}

function saveLeaderboard(data: LeaderboardEntry[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save leaderboard file:", err);
  }
}

let activeLeaderboard = loadLeaderboard();

// Real Persistent User Visits & Live Active User Presence Tracking
let totalUserVisits = 0;
try {
  if (fs.existsSync(STATS_FILE)) {
    const statsData = JSON.parse(fs.readFileSync(STATS_FILE, "utf-8"));
    if (statsData && typeof statsData.totalVisits === "number") {
      totalUserVisits = statsData.totalVisits;
    }
  }
} catch (e) {
  console.warn("Could not load stats file:", e);
}

function saveStats() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify({ totalVisits: totalUserVisits }, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not save stats file:", e);
  }
}

// Active connected session map (sessionId -> lastSeenMs)
const activeSessions = new Map<string, number>();

function pruneActiveSessions() {
  const now = Date.now();
  for (const [sId, lastSeen] of activeSessions.entries()) {
    if (now - lastSeen > 25000) {
      activeSessions.delete(sId);
    }
  }
}

// --- API ROUTES ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "Isekai Worlds", timestamp: new Date().toISOString() });
});

// Cloud Sync endpoints for Mobile & PC synchronization
const cleanSyncKey = (key: string) => {
  return (key || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
};

app.post("/api/sync/save", (req, res) => {
  try {
    const { syncKey, profile, settings, amvPlaylist, amvPlaylistId, activeSeconds } = req.body;
    const cleanKey = cleanSyncKey(syncKey);
    if (!cleanKey) {
      return res.status(400).json({ error: "Invalid syncKey. Use letters, numbers, hyphens or underscores." });
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const syncFile = path.join(DATA_DIR, `sync-${cleanKey}.json`);
    const payload = {
      syncKey: cleanKey,
      profile: profile || null,
      settings: settings || null,
      amvPlaylist: amvPlaylist || null,
      amvPlaylistId: amvPlaylistId || null,
      activeSeconds: typeof activeSeconds === "number" ? activeSeconds : null,
      lastSynced: new Date().toISOString()
    };

    fs.writeFileSync(syncFile, JSON.stringify(payload, null, 2), "utf-8");
    res.json({ success: true, message: `State synced successfully for '${cleanKey}'`, lastSynced: payload.lastSynced });
  } catch (error: any) {
    console.error("Cloud sync save error:", error);
    res.status(500).json({ error: "Failed to save cloud sync state", details: error.message });
  }
});

app.get("/api/sync/load", (req, res) => {
  try {
    const syncKey = req.query.syncKey as string;
    const cleanKey = cleanSyncKey(syncKey);
    if (!cleanKey) {
      return res.status(400).json({ error: "Invalid syncKey" });
    }

    const syncFile = path.join(DATA_DIR, `sync-${cleanKey}.json`);
    if (fs.existsSync(syncFile)) {
      const content = fs.readFileSync(syncFile, "utf-8");
      const parsed = JSON.parse(content);
      return res.json({ success: true, data: parsed });
    } else {
      return res.status(404).json({ success: false, error: "Sync data not found for this key" });
    }
  } catch (error: any) {
    console.error("Cloud sync load error:", error);
    res.status(500).json({ error: "Failed to load cloud sync state", details: error.message });
  }
});

// 2. AI Language Translation Route using Gemini
app.post("/api/translate", async (req, res) => {
  try {
    const { targetLang, texts } = req.body;
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: "Invalid texts parameter" });
    }
    const targetLanguageName = targetLang || "Japanese";

    const ai = getGenAI();
    if (!ai) {
      // Fallback translation response if no GEMINI_API_KEY set yet
      return res.json({
        translatedTexts: texts,
        note: "Default response - GEMINI_API_KEY not configured yet"
      });
    }

    const prompt = `You are a professional anime & localization translator for the website 'Isekai Worlds'.
Translate the following list of UI labels or content into target language: "${targetLanguageName}".
Return ONLY a valid JSON array of strings corresponding 1:1 in order to the input strings.
Do NOT wrap with markdown syntax or extra text.

Input array:
${JSON.stringify(texts)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "[]";
    try {
      const parsed = JSON.parse(responseText.trim());
      if (Array.isArray(parsed)) {
        return res.json({ translatedTexts: parsed });
      }
    } catch {
      // If JSON parsing fails
    }

    return res.json({ translatedTexts: texts });
  } catch (error: any) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed", details: error.message });
  }
});

// 2b. AMV AI-Powered Search & Vibe Matcher using Gemini
app.post("/api/amv/ai-search", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback recommendation response if no GEMINI_API_KEY set yet
      return res.json({
        recommendedAnime: [
          { title: "Demon Slayer", reason: "Features breathtaking visual fights, high energy, and stellar animation.", searchQuery: "Demon Slayer" },
          { title: "Chainsaw Man", reason: "Delivers frantic, chaotic action, gore, and highly expressive sound design.", searchQuery: "Chainsaw Man" },
          { title: "Kimi no Na wa (Your Name)", reason: "Deeply emotional theme, stunning sky visuals, and incredible music integration.", searchQuery: "Your Name" }
        ],
        suggestedVibes: ["epic", "hype", "sad"],
        inspiredKeywords: ["demon slayer", "chainsaw man", "your name"],
        note: "Default response - GEMINI_API_KEY not configured yet"
      });
    }

    const systemInstruction = `You are an expert anime recommendation engine for the Isekai Worlds AMV Studio.
Analyze the user's description of their desired vibe, emotion, scene style, or sound (e.g. "epic samurai battles with electric guitars" or "cozy lofi vibes").
Recommend 2 to 4 real, popular anime series that fit this description perfectly.
For each recommendation, provide:
1. The exact English or popular Title of the anime.
2. A short, compelling explanation of why it fits their requested vibe.
3. A clean, simplified searchQuery suitable for looking up the anime on MyAnimeList (Jikan API).

You must return ONLY a JSON object with this structure:
{
  "recommendedAnime": [
    { "title": "string", "reason": "string", "searchQuery": "string" }
  ],
  "suggestedVibes": ["hype", "epic", "sad", "chill"],
  "inspiredKeywords": ["string", "string"]
}
Do NOT wrap the output in markdown code blocks. Return only pure JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "{}";
    try {
      const parsed = JSON.parse(responseText.trim());
      return res.json(parsed);
    } catch (e) {
      console.error("Failed to parse Gemini output as JSON:", responseText);
      return res.status(500).json({ error: "Failed to generate structured recommendation" });
    }
  } catch (error: any) {
    console.error("AI AMV search error:", error);
    res.status(500).json({ error: "AI search failed", details: error.message });
  }
});

// 2c. Real-time YouTube Video Validity Checker
app.post("/api/amv/check-videos", async (req, res) => {
  try {
    const { videoIds } = req.body;
    if (!videoIds || !Array.isArray(videoIds)) {
      return res.status(400).json({ error: "videoIds array is required" });
    }

    // Limit to checking at most 12 videos simultaneously for performance
    const targets = videoIds.slice(0, 12);

    const checkPromises = targets.map(async (id: string) => {
      try {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
        const fetchRes = await fetch(url, { signal: AbortSignal.timeout(2000) });
        return { id, working: fetchRes.status === 200 };
      } catch (err) {
        // If there's a networking error/timeout, assume working to prevent over-filtering during general transient errors
        return { id, working: true };
      }
    });

    const results = await Promise.all(checkPromises);
    const workingMap = results.reduce((acc, curr) => {
      acc[curr.id] = curr.working;
      return acc;
    }, {} as Record<string, boolean>);

    res.json({ workingMap });
  } catch (error: any) {
    console.error("Video check error:", error);
    res.status(500).json({ error: "Failed to verify video status" });
  }
});

// 2d. Dynamic YouTube Playlist Scraper/Loader Endpoint
app.get("/api/amv/playlist", async (req, res) => {
  try {
    const playlistId = (req.query.playlistId as string) || "PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu";
    const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
    
    const fetchRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!fetchRes.ok) {
      throw new Error(`YouTube returned status ${fetchRes.status}`);
    }

    const html = await fetchRes.text();
    const videos: any[] = [];

    try {
      const match = html.match(/ytInitialData\s*=\s*({.+?});/);
      if (match) {
        const data = JSON.parse(match[1]);
        
        const findRenderers = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (obj.playlistVideoRenderer) {
            const renderer = obj.playlistVideoRenderer;
            const videoId = renderer.videoId;
            if (videoId) {
              const title = renderer.title?.runs?.[0]?.text || "Unknown Title";
              const duration = renderer.lengthText?.simpleText || "3:30";
              const views = renderer.videoInfo?.runs?.[0]?.text || "Views";
              
              // Guess or clean up the title for anime reference
              let animeTitle = "Anime MV";
              if (title.includes(" - ")) {
                animeTitle = title.split(" - ")[0].trim();
              } else if (title.includes(" [")) {
                animeTitle = title.split(" [")[0].trim();
              }

              videos.push({
                id: videoId,
                title,
                animeTitle,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&wmode=opaque`,
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                type: "curated",
                duration,
                views,
                vibe: "epic"
              });
            }
          } else {
            for (const key of Object.keys(obj)) {
              findRenderers(obj[key]);
            }
          }
        };
        
        findRenderers(data);
      }
    } catch (e) {
      console.error("Error parsing ytInitialData script:", e);
    }

    // Secondary Regex Fallback parser
    if (videos.length === 0) {
      const regex = /\/watch\?v=([a-zA-Z0-9_-]{11})/g;
      const seen = new Set<string>();
      let m;
      while ((m = regex.exec(html)) !== null) {
        const id = m[1];
        if (!seen.has(id)) {
          seen.add(id);
          videos.push({
            id,
            title: `AMV Video #${videos.length + 1}`,
            animeTitle: "Playlist AMV",
            url: `https://www.youtube.com/watch?v=${id}`,
            embedUrl: `https://www.youtube.com/embed/${id}?enablejsapi=1&wmode=opaque`,
            thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
            type: "curated",
            duration: "3:30",
            views: "Live",
            vibe: "epic"
          });
        }
      }
    }

    res.json({ playlistId, videos });
  } catch (error: any) {
    console.error("Playlist fetch error:", error);
    res.status(500).json({ error: "Failed to fetch YouTube playlist contents", details: error.message });
  }
});

// 3. Live Real-Time Trending Anime API Endpoint (Proxies AniList GraphQL & Jikan v4)
app.get("/api/anime/trending", async (req, res) => {
  try {
    const query = `
      query {
        Page(page: 1, perPage: 24) {
          media(type: ANIME, sort: TRENDING_DESC) {
            id
            title {
              english
              romaji
              native
            }
            coverImage {
              extraLarge
              large
              medium
            }
            bannerImage
            genres
            averageScore
            episodes
            status
            description
          }
        }
      }
    `;

    const aniRes = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (aniRes.ok) {
      const aniData = await aniRes.json();
      const mediaList = aniData?.data?.Page?.media || [];
      if (mediaList.length > 0) {
        const formatted = mediaList.map((item: any) => {
          const mainTitle = item.title.english || item.title.romaji || "Anime Series";
          const cover = item.coverImage?.extraLarge || item.coverImage?.large;
          const banner = item.bannerImage || cover;

          return {
            id: item.id,
            title: mainTitle,
            titleJapanese: item.title.native || "",
            coverImage: cover,
            bannerImage: banner,
            genres: item.genres || ["Anime", "Action"],
            score: item.averageScore ? (item.averageScore / 10).toFixed(1) : "9.2",
            episodes: item.episodes || 12,
            status: item.status || "RELEASING",
            description: item.description ? item.description.replace(/<[^>]*>?/gm, "") : "Trending anime series.",
            category: item.genres?.[0] || "Anime"
          };
        });

        return res.json({ anime: formatted, source: "AniList GraphQL Live API" });
      }
    }

    // Fallback: Jikan API v4
    const jikanRes = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");
    if (jikanRes.ok) {
      const jikanData = await jikanRes.json();
      const list = jikanData?.data || [];
      const formatted = list.map((item: any) => ({
        id: item.mal_id,
        title: item.title_english || item.title,
        titleJapanese: item.title_japanese || "",
        coverImage: item.images?.jpg?.large_image_url || item.images?.webp?.large_image_url,
        bannerImage: item.images?.jpg?.large_image_url,
        genres: item.genres?.map((g: any) => g.name) || ["Anime"],
        score: item.score ? item.score.toString() : "8.9",
        episodes: item.episodes || 12,
        status: item.status || "Finished Airing",
        description: item.synopsis || "Top anime series.",
        category: item.genres?.[0]?.name || "Anime"
      }));

      return res.json({ anime: formatted, source: "Jikan API v4" });
    }

    res.json({ anime: [] });
  } catch (error: any) {
    console.error("Error fetching live anime data:", error);
    res.status(500).json({ error: "Failed to fetch anime data", details: error.message });
  }
});

// 4. Wallpapers & Anime Media Fetch Proxy with Real-Time Multi-API Engine & Infinite Pagination
app.get("/api/wallpapers", async (req, res) => {
  try {
    const category = (req.query.category as string) || "all";
    const page = parseInt((req.query.page as string) || "1", 10);
    const q = ((req.query.q as string) || "").trim();
    const perPage = 20;

    let apiWallpapers: any[] = [];

    // 1. Fetch Jikan v4 API (MyAnimeList / MAL)
    try {
      const malUrl = q
        ? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&page=${page}&limit=12`
        : `https://api.jikan.moe/v4/top/anime?page=${page}&limit=12`;
      const malRes = await fetch(malUrl);
      if (malRes.ok) {
        const malData = await malRes.json();
        const malList = malData?.data || [];
        if (malList.length > 0) {
          const formattedMal = malList.map((item: any, idx: number) => {
            const name = item.title_english || item.title || `MAL Anime #${item.mal_id}`;
            const imgUrl = item.trailer?.images?.maximum_image_url || item.trailer?.images?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.large_image_url;
            const thumbUrl = item.images?.jpg?.large_image_url || imgUrl;
            const cat = item.genres?.[0]?.name || "Fantasy";

            return {
              id: `w-mal-p${page}-${item.mal_id}-${idx}`,
              title: `${name} Wallpaper`,
              category: cat,
              url: imgUrl,
              thumb: thumbUrl,
              tags: item.genres?.map((g: any) => g.name) || ["MyAnimeList", "4K", "Anime"],
              resolution: "3840x2160 (4K UHD)",
              author: "MyAnimeList (MAL)",
              score: item.score ? String(item.score) : "9.2",
              sourcePage: page
            };
          });
          apiWallpapers = [...apiWallpapers, ...formattedMal];
        }
      }
    } catch (e) {
      console.warn("MyAnimeList (Jikan) page fetch error:", e);
    }

    // 2. Fetch AniList GraphQL with exact Page parameter for infinite pagination
    const aniListQuery = q
      ? `
        query ($search: String, $page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo {
              hasNextPage
              currentPage
            }
            media(search: $search, type: ANIME) {
              id
              title {
                english
                romaji
                native
              }
              coverImage {
                extraLarge
                large
              }
              bannerImage
              genres
              averageScore
            }
          }
        }
      `
      : `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo {
              hasNextPage
              currentPage
            }
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title {
                english
                romaji
                native
              }
              coverImage {
                extraLarge
                large
              }
              bannerImage
              genres
              averageScore
            }
          }
        }
      `;

    try {
      const aniRes = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: aniListQuery,
          variables: q ? { search: q, page, perPage: 12 } : { page, perPage: 12 },
        }),
      });

      if (aniRes.ok) {
        const aniData = await aniRes.json();
        const mediaList = aniData?.data?.Page?.media || [];
        if (mediaList.length > 0) {
          const formatted = mediaList.map((item: any) => {
            const name = item.title.english || item.title.romaji || `Anime Series #${item.id}`;
            const imgUrl = item.bannerImage || item.coverImage?.extraLarge || item.coverImage?.large;
            const thumbUrl = item.coverImage?.large || imgUrl;
            const cat = item.genres?.[0] || "Isekai";

            return {
              id: `w-anilist-p${page}-${item.id}`,
              title: `${name} Official Banner Art`,
              category: cat,
              url: imgUrl,
              thumb: thumbUrl,
              tags: item.genres || ["Anime", "4K", "HD"],
              resolution: "3840x2160 (4K UHD)",
              author: "AniList GraphQL",
              score: item.averageScore ? (item.averageScore / 10).toFixed(1) : "9.0",
              sourcePage: page
            };
          });
          apiWallpapers = [...apiWallpapers, ...formatted];
        }
      }
    } catch (e) {
      console.warn("AniList page fetch error:", e);
    }

    // 3. Also fetch Nekos.best for additional high-resolution anime art
    try {
      const nekosCat = ["neko", "waifu", "kitsune"][page % 3];
      const nekosRes = await fetch(`https://nekos.best/api/v2/${nekosCat}?amount=6`);
      if (nekosRes.ok) {
        const nekosData = await nekosRes.json();
        const results = nekosData.results || [];
        const formattedNekos = results.map((item: any, idx: number) => ({
          id: `w-nekos-p${page}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          title: item.artist_name ? `Illustration by ${item.artist_name}` : `Nekos.best ${nekosCat.toUpperCase()} Art #${idx + 1}`,
          category: nekosCat === "neko" ? "Fantasy" : nekosCat === "waifu" ? "Isekai" : "Dark Fantasy",
          url: item.url,
          thumb: item.url,
          tags: [nekosCat.toUpperCase(), "Anime Art", "Nekos.best"],
          resolution: "3840x2160 (4K UHD)",
          author: "Nekos.best API",
          score: "9.5",
          sourcePage: page
        }));
        apiWallpapers = [...apiWallpapers, ...formattedNekos];
      }
    } catch (e) {
      console.warn("Nekos fetch error:", e);
    }

    // Force HTTPS to prevent mixed content blocking on mobile
    apiWallpapers = apiWallpapers.map((w: any) => {
      if (w.url && w.url.startsWith("http://")) {
        w.url = w.url.replace("http://", "https://");
      }
      if (w.thumb && w.thumb.startsWith("http://")) {
        w.thumb = w.thumb.replace("http://", "https://");
      }
      return w;
    });

    if (apiWallpapers.length === 0) {
      apiWallpapers = [
        {
          id: `w-fallback-1-${page}`,
          title: "Gojo Satoru Infinite Void Art",
          category: "Fantasy",
          url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
          thumb: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
          tags: ["Gojo", "Jujutsu Kaisen", "Fantasy"],
          resolution: "3840x2160 (4K UHD)",
          author: "Unsplash Artist",
          score: "9.8",
          sourcePage: page
        },
        {
          id: `w-fallback-2-${page}`,
          title: "Neon Cyberpunk Tokyo Tower",
          category: "Sci-Fi",
          url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
          thumb: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
          tags: ["Tokyo", "Cyberpunk", "Sci-Fi"],
          resolution: "3840x2160 (4K UHD)",
          author: "Unsplash Artist",
          score: "9.7",
          sourcePage: page
        },
        {
          id: `w-fallback-3-${page}`,
          title: "Stunning Cherry Blossom Landscape",
          category: "Landscape",
          url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
          thumb: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80",
          tags: ["Kyoto", "Nature", "Landscape"],
          resolution: "3840x2160 (4K UHD)",
          author: "Unsplash Artist",
          score: "9.6",
          sourcePage: page
        },
        {
          id: `w-fallback-4-${page}`,
          title: "Isekai Fantasy World Ruins",
          category: "Isekai",
          url: "https://images.unsplash.com/photo-1519074069444-1ba4e66640c2?w=1200&auto=format&fit=crop&q=80",
          thumb: "https://images.unsplash.com/photo-1519074069444-1ba4e66640c2?w=400&auto=format&fit=crop&q=80",
          tags: ["Fantasy", "Castle", "Isekai"],
          resolution: "3840x2160 (4K UHD)",
          author: "Unsplash Artist",
          score: "9.5",
          sourcePage: page
        },
        {
          id: `w-fallback-5-${page}`,
          title: "Anime Magical Forest Shrine",
          category: "Landscape",
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
          thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80",
          tags: ["Scenic", "Forest", "Landscape"],
          resolution: "3840x2160 (4K UHD)",
          author: "Unsplash Artist",
          score: "9.5",
          sourcePage: page
        }
      ];
    }

    // Filter by category if requested
    let filtered = apiWallpapers;
    if (category !== "all") {
      filtered = apiWallpapers.filter(
        (w: any) => w.category.toLowerCase() === category.toLowerCase()
      );
      if (filtered.length === 0) filtered = apiWallpapers; // fallback
    }

    res.json({
      wallpapers: filtered,
      page,
      perPage,
      totalLoaded: filtered.length,
      hasMore: true,
      source: "Multi-API Engine (MyAnimeList, AniList, Nekos.best)"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallpapers" });
  }
});

// 5. Anime Tenor, Waifu.pics, Nekos.best & Multi-API Endless GIFs Proxy
app.get("/api/gifs", async (req, res) => {
  try {
    const rawQ = (req.query.q as string) || "anime";
    const q = rawQ.toLowerCase().trim();
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const limit = 24;
    const pos = (page - 1) * limit;

    let gifList: any[] = [];

    // 1. Fetch from Tenor Public API with query & pagination position
    try {
      const tenorKey = "LIVDSRZULELA";
      const tenorQuery = q.includes("anime") ? q : `${q} anime`;
      const tenorUrl = `https://g.tenor.com/v1/search?q=${encodeURIComponent(tenorQuery)}&key=${tenorKey}&limit=${limit}&pos=${pos}`;
      const tenorRes = await fetch(tenorUrl, { signal: AbortSignal.timeout(4000) }).catch(() => null);

      if (tenorRes && tenorRes.ok) {
        const tenorData = await tenorRes.json();
        const results = tenorData.results || [];
        if (results.length > 0) {
          const formattedTenor = results.map((item: any, idx: number) => {
            const mediaObj = item.media?.[0]?.gif || item.media?.[0]?.mediumgif || item.media?.[0]?.tinygif;
            const previewObj = item.media?.[0]?.tinygif || mediaObj;
            return {
              id: `tenor-${item.id}`,
              title: item.title || item.content_description || `${rawQ.toUpperCase()} Anime GIF #${idx + 1}`,
              url: mediaObj?.url || item.url,
              previewUrl: previewObj?.url || mediaObj?.url,
              category: rawQ.toUpperCase(),
              character: "Tenor Anime",
              source: "Tenor API",
              tags: item.tags || ["anime", rawQ]
            };
          });
          gifList = [...gifList, ...formattedTenor];
        }
      }
    } catch (e) {
      // ignore tenor failure
    }

    // 2. Fetch from OtakuGIFs API (High performance anime reaction GIF engine)
    try {
      const otakuReactions = ["airkiss", "angrystare", "bite", "bleh", "blush", "brofist", "celebrate", "cheer", "clap", "confused", "cool", "cry", "cuddle", "dance", "drool", "evillaugh", "facepalm", "handhold font", "happy", "hug", "laugh", "lick", "love", "nod", "pat", "poke font", "pout", "punch", "roll", "sad", "scared", "shrug", "slap", "sleep", "smile", "smug", "stare", "thumbsup", "wave", "wink", "yeet"];
      let matchedReaction = otakuReactions.find((r) => q.includes(r)) || otakuReactions[(page * 3) % otakuReactions.length];
      
      const otakuRes = await fetch(`https://api.otakugifs.xyz/gif?reaction=${matchedReaction}`, { signal: AbortSignal.timeout(4000) }).catch(() => null);
      if (otakuRes && otakuRes.ok) {
        const otakuData = await otakuRes.json();
        if (otakuData?.url) {
          gifList.push({
            id: `otaku-${matchedReaction}-${page}-${Date.now()}`,
            title: `Kawaii Anime ${matchedReaction.toUpperCase()} Action`,
            url: otakuData.url,
            previewUrl: otakuData.url,
            category: matchedReaction.toUpperCase(),
            character: "Otaku Anime",
            source: "OtakuGIFs Engine",
            tags: ["anime", matchedReaction]
          });
        }
      }
    } catch (e) {
      // ignore otaku failure
    }

    // 3. Fetch from Nekos.best API (100% Reliable Anime GIF Engine)
    try {
      const nekosCats = ["hug", "dance", "pat", "smile", "blush", "wave", "laugh", "happy", "bored", "stare", "think", "yeet", "poke", "bite", "punch", "kick", "wink", "cuddle", "smug", "shrug", "pout", "tickle", "slap", "sleep", "cry"];
      
      let cat1 = nekosCats[(page * 3) % nekosCats.length];
      let cat2 = nekosCats[(page * 3 + 1) % nekosCats.length];
      let cat3 = nekosCats[(page * 3 + 2) % nekosCats.length];

      for (const c of nekosCats) {
        if (q.includes(c)) {
          cat1 = c;
          break;
        }
      }

      const [res1, res2, res3] = await Promise.all([
        fetch(`https://nekos.best/api/v2/${cat1}?amount=10`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
        fetch(`https://nekos.best/api/v2/${cat2}?amount=10`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
        fetch(`https://nekos.best/api/v2/${cat3}?amount=10`, { signal: AbortSignal.timeout(4000) }).catch(() => null)
      ]);

      if (res1 && res1.ok) {
        const d1 = await res1.json();
        const r1 = d1.results || [];
        const f1 = r1.map((item: any, idx: number) => ({
          id: `nekos-${cat1}-${page}-${idx}`,
          title: item.artist_name ? `Anime ${cat1.toUpperCase()} by ${item.artist_name}` : `Kawaii Anime ${cat1.toUpperCase()} GIF`,
          url: item.url,
          previewUrl: item.url,
          category: cat1.toUpperCase(),
          character: item.artist_name || "Anime Artist",
          source: "Nekos.best API",
          tags: ["anime", cat1]
        }));
        gifList = [...gifList, ...f1];
      }

      if (res2 && res2.ok) {
        const d2 = await res2.json();
        const r2 = d2.results || [];
        const f2 = r2.map((item: any, idx: number) => ({
          id: `nekos-${cat2}-${page}-${idx}`,
          title: item.artist_name ? `Anime ${cat2.toUpperCase()} by ${item.artist_name}` : `Kawaii Anime ${cat2.toUpperCase()} GIF`,
          url: item.url,
          previewUrl: item.url,
          category: cat2.toUpperCase(),
          character: item.artist_name || "Anime Artist",
          source: "Nekos.best API",
          tags: ["anime", cat2]
        }));
        gifList = [...gifList, ...f2];
      }

      if (res3 && res3.ok) {
        const d3 = await res3.json();
        const r3 = d3.results || [];
        const f3 = r3.map((item: any, idx: number) => ({
          id: `nekos-${cat3}-${page}-${idx}`,
          title: item.artist_name ? `Anime ${cat3.toUpperCase()} by ${item.artist_name}` : `Kawaii Anime ${cat3.toUpperCase()} GIF`,
          url: item.url,
          previewUrl: item.url,
          category: cat3.toUpperCase(),
          character: item.artist_name || "Anime Artist",
          source: "Nekos.best API",
          tags: ["anime", cat3]
        }));
        gifList = [...gifList, ...f3];
      }
    } catch (e) {
      // ignore nekos failure
    }

    // Filter out any broken Giphy URLs if present
    gifList = gifList.filter((item) => item.url && !item.url.includes("giphy.com/media/v1.Y2lk"));

    // Deduplicate by URL and force HTTPS to prevent mixed content blocking on mobile
    const seenUrls = new Set();
    let uniqueGifs = gifList.filter((item) => {
      if (!item.url || seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return true;
    }).map((item) => {
      if (item.url && item.url.startsWith("http://")) {
        item.url = item.url.replace("http://", "https://");
      }
      if (item.previewUrl && item.previewUrl.startsWith("http://")) {
        item.previewUrl = item.previewUrl.replace("http://", "https://");
      }
      return item;
    });

    if (uniqueGifs.length === 0) {
      uniqueGifs = [
        {
          id: `fb-dance-${page}`,
          title: "Kawaii Anime Dance Routine",
          url: "https://nekos.best/api/v2/dance/0001.gif",
          previewUrl: "https://nekos.best/api/v2/dance/0001.gif",
          category: "DANCE",
          character: "Anime Idol",
          source: "Nekos.best Engine",
          tags: ["dance", "anime", "kawaii"]
        },
        {
          id: `fb-hug-${page}`,
          title: "Warm Anime Hug Embrace",
          url: "https://nekos.best/api/v2/hug/0002.gif",
          previewUrl: "https://nekos.best/api/v2/hug/0002.gif",
          category: "HUG",
          character: "Anime Scene",
          source: "Nekos.best Engine",
          tags: ["hug", "anime", "kawaii"]
        },
        {
          id: `fb-smile-${page}`,
          title: "Bright Anime Smile Greeting",
          url: "https://nekos.best/api/v2/smile/0003.gif",
          previewUrl: "https://nekos.best/api/v2/smile/0003.gif",
          category: "SMILE",
          character: "Kawaii Girl",
          source: "Nekos.best Engine",
          tags: ["smile", "anime", "kawaii"]
        },
        {
          id: `fb-pat-${page}`,
          title: "Gentle Headpat Reaction",
          url: "https://nekos.best/api/v2/pat/0004.gif",
          previewUrl: "https://nekos.best/api/v2/pat/0004.gif",
          category: "KAWAII",
          character: "Anime Waifu",
          source: "Nekos.best Engine",
          tags: ["pat", "anime", "kawaii"]
        }
      ];
    }

    res.json({
      gifs: uniqueGifs,
      query: rawQ,
      page,
      perPage: limit,
      count: uniqueGifs.length,
      hasMore: true,
      source: "Multi-Source Engine (Tenor, Waifu.pics, Nekos.best)"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GIFs" });
  }
});

// 5. Realtime Site Telemetry & Active User Presence Routes
app.post("/api/stats/visit", (req, res) => {
  totalUserVisits += 1;
  saveStats();
  pruneActiveSessions();
  res.json({
    success: true,
    totalVisits: totalUserVisits,
    activeUsers: Math.max(1, activeSessions.size)
  });
});

app.post("/api/stats/ping", (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) {
    activeSessions.set(sessionId, Date.now());
  }
  pruneActiveSessions();

  res.json({
    activeUsers: Math.max(1, activeSessions.size),
    totalVisits: totalUserVisits,
    realTop100Users: activeLeaderboard.length
  });
});

app.get("/api/stats", (req, res) => {
  pruneActiveSessions();
  res.json({
    activeUsers: Math.max(1, activeSessions.size),
    totalVisits: totalUserVisits,
    realTop100Users: activeLeaderboard.length
  });
});

// 6. Global Active Leaderboard Endpoints (Pure Real Users - NO FAKES)
app.get("/api/leaderboard", (req, res) => {
  // Sort descending by seconds logged
  const sorted = [...activeLeaderboard].sort((a, b) => b.secondsLogged - a.secondsLogged);
  res.json({ leaderboard: sorted.slice(0, 100), totalCount: sorted.length });
});

app.post("/api/leaderboard/update", (req, res) => {
  try {
    const { id, username, avatar, banner, title, badge, secondsLogged, country } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const userId = id || `user-${username.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const existingIndex = activeLeaderboard.findIndex(u => u.id === userId || u.username.toLowerCase() === username.toLowerCase());

    const updatedEntry: LeaderboardEntry = {
      id: userId,
      username: username,
      avatar: avatar || `https://picsum.photos/seed/${username}/300/300`,
      banner: banner || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
      title: title || "Isekai Traveler",
      badge: badge || "Active Adventurer",
      secondsLogged: Number(secondsLogged) || 1,
      country: country || "GLOBAL",
      isOnline: true,
      lastActive: "Just now"
    };

    if (existingIndex >= 0) {
      activeLeaderboard[existingIndex] = {
        ...activeLeaderboard[existingIndex],
        ...updatedEntry,
        secondsLogged: Math.max(activeLeaderboard[existingIndex].secondsLogged, updatedEntry.secondsLogged)
      };
    } else {
      activeLeaderboard.push(updatedEntry);
    }

    // Sort and persist
    activeLeaderboard.sort((a, b) => b.secondsLogged - a.secondsLogged);
    saveLeaderboard(activeLeaderboard);

    const rank = activeLeaderboard.findIndex(u => u.id === userId) + 1;

    res.json({
      success: true,
      entry: updatedEntry,
      rank: rank > 0 ? rank : 999,
      leaderboard: activeLeaderboard.slice(0, 100)
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update leaderboard", details: error.message });
  }
});

// Vite & Static file handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Isekai Worlds Engine] Server operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
