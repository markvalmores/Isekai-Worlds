import { AnimeWallpaper, AnimeGif } from "../types";
import { fetchLiveAnimeWallpapers } from "./animeApi";

export interface AMVVideo {
  id: string;
  title: string;
  animeTitle: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  type: "curated" | "search" | "ai" | "api_promo" | "local";
  duration?: string;
  views?: string;
  vibe?: "hype" | "epic" | "sad" | "chill" | "all";
}

// Global high-reliability fallback wallpapers
export const FALLBACK_WALLPAPERS: AnimeWallpaper[] = [
  {
    id: "fb-wp-1",
    title: "Chrono Citadel Skyline",
    category: "Landscape",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    tags: ["Landscape", "City", "Epic"],
    resolution: "1920x1080",
    author: "Anigrapher"
  },
  {
    id: "fb-wp-2",
    title: "Cyberpunk Neo Tokyo Street",
    category: "Sci-Fi",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    tags: ["Sci-Fi", "Neon", "Cyberpunk"],
    resolution: "1920x1080",
    author: "Netrunner"
  },
  {
    id: "fb-wp-3",
    title: "Mystic Forest Shrine",
    category: "Fantasy",
    url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    tags: ["Fantasy", "Nature", "Isekai"],
    resolution: "1920x1080",
    author: "Wanderer"
  },
  {
    id: "fb-wp-4",
    title: "Ethereal Cloud Gardens",
    category: "Isekai",
    url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80",
    tags: ["Isekai", "Clouds", "Dreamy"],
    resolution: "1920x1080",
    author: "Chrono Traveler"
  }
];

// Global high-reliability fallback GIFs
export const FALLBACK_GIFS: AnimeGif[] = [
  {
    id: "fb-gif-1",
    title: "Kawaii Anime Dance Routine",
    url: "https://nekos.best/api/v2/dance/0001.gif",
    previewUrl: "https://nekos.best/api/v2/dance/0001.gif",
    category: "DANCE",
    character: "Anime Idol",
    source: "Nekos.best Engine"
  },
  {
    id: "fb-gif-2",
    title: "Warm Anime Hug Embrace",
    url: "https://nekos.best/api/v2/hug/0002.gif",
    previewUrl: "https://nekos.best/api/v2/hug/0002.gif",
    category: "HUG",
    character: "Anime Scene",
    source: "Nekos.best Engine"
  },
  {
    id: "fb-gif-3",
    title: "Bright Anime Smile Greeting",
    url: "https://nekos.best/api/v2/smile/0003.gif",
    previewUrl: "https://nekos.best/api/v2/smile/0003.gif",
    category: "SMILE",
    character: "Kawaii Girl",
    source: "Nekos.best Engine"
  },
  {
    id: "fb-gif-4",
    title: "Gentle Headpat Reaction",
    url: "https://nekos.best/api/v2/pat/0004.gif",
    previewUrl: "https://nekos.best/api/v2/pat/0004.gif",
    category: "KAWAII",
    character: "Anime Waifu",
    source: "Nekos.best Engine"
  }
];

// Global high-reliability fallback AMVs
export const FALLBACK_AMVS: AMVVideo[] = [
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
  }
];

/**
 * Generic fetch wrapper with retries, timeout and delay
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  delay = 1000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.signal ? 20000 : 12000); // Set standard safety timeout

  const combinedOptions: RequestInit = {
    ...options,
    signal: options.signal || controller.signal,
  };

  try {
    const response = await fetch(url, combinedOptions);
    clearTimeout(timeoutId);

    // If rate-limited (429) or server error (5xx), we might want to retry
    if (!response.ok && (response.status === 429 || response.status >= 500) && retries > 0) {
      console.warn(`Fetch returned status ${response.status}. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 1.5);
    }

    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (retries > 0) {
      console.warn(`Fetch error: ${error.message || error}. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 1.5);
    }
    throw error;
  }
}

/**
 * Clean and normalize a YouTube playlist ID, extracting list parameters if full sharing link is provided
 */
export function cleanPlaylistId(playlistId: string): string {
  if (!playlistId) return "PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu";
  
  let cleaned = playlistId.trim();

  // If a full YouTube URL is passed, try to extract 'list' parameter
  try {
    if (cleaned.includes("youtube.com") || cleaned.includes("youtu.be")) {
      const urlObj = new URL(cleaned);
      const listParam = urlObj.searchParams.get("list");
      if (listParam) {
        cleaned = listParam;
      }
    }
  } catch (e) {
    // Ignore URL parse error and fall back to manual cleaning
  }

  // Handle manual queries containing sharing parameters, e.g., 'PLjN...&si=...'
  if (cleaned.includes("&")) {
    cleaned = cleaned.split("&")[0];
  }
  if (cleaned.includes("?")) {
    cleaned = cleaned.split("?")[0];
  }

  return cleaned;
}

/**
 * Robust wallpaper query powered directly by Live Anime Thumbnails & Multi-API Artworks
 * (Nekos.best, Waifu.im, Waifu.pics, AniList, Jikan) with seamless backend and client fallback
 */
export async function fetchWallpapersApi(
  category: string,
  page: number,
  query = "",
  provider = "all"
): Promise<AnimeWallpaper[]> {
  // 1. Try server-side aggregation first with short timeout
  try {
    const url = `/api/wallpapers?category=${encodeURIComponent(category)}&page=${page}&q=${encodeURIComponent(query)}&provider=${encodeURIComponent(provider)}`;
    const response = await fetchWithRetry(url, {}, 1, 500);
    if (response.ok) {
      const data = await response.json();
      if (data.wallpapers && Array.isArray(data.wallpapers) && data.wallpapers.length > 0) {
        return data.wallpapers;
      }
    }
  } catch (err) {
    // Expected on network blips, fall through to direct live anime APIs
  }

  // 2. Direct browser-level live anime thumbnails & multi-API artwork engine
  try {
    const liveWallpapers = await fetchLiveAnimeWallpapers({
      category,
      page,
      query,
      provider,
      limit: 24
    });
    if (liveWallpapers && liveWallpapers.length > 0) {
      return liveWallpapers;
    }
  } catch (err) {
    console.error("fetchLiveAnimeWallpapers error:", err);
  }

  // 3. High-res anime seed fallback
  return FALLBACK_WALLPAPERS;
}

/**
 * Robust GIF query with automatic fallbacks
 */
export async function fetchGifsApi(query: string, page: number): Promise<{ gifs: AnimeGif[]; hasMore: boolean }> {
  try {
    const url = `/api/gifs?q=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetchWithRetry(url, {}, 2, 800);
    if (response.ok) {
      const data = await response.json();
      if (data.gifs && Array.isArray(data.gifs) && data.gifs.length > 0) {
        return { gifs: data.gifs, hasMore: data.hasMore !== false };
      }
    }
  } catch (err) {
    console.error("fetchGifsApi failed, using fallback GIFs:", err);
  }

  // Fallback category matching
  const q = query.toLowerCase();
  const matched = FALLBACK_GIFS.filter(
    (g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
  );

  return {
    gifs: matched.length > 0 ? matched : FALLBACK_GIFS,
    hasMore: false,
  };
}

/**
 * Robust AMV playlist loading with automatic fallbacks
 */
export async function fetchAmvPlaylistApi(playlistId: string): Promise<AMVVideo[]> {
  const cleanId = cleanPlaylistId(playlistId);
  try {
    const url = `/api/amv/playlist?playlistId=${encodeURIComponent(cleanId)}`;
    const response = await fetchWithRetry(url, {}, 2, 1000);
    if (response.ok) {
      const data = await response.json();
      if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
        const vibes: Array<"hype" | "epic" | "sad" | "chill"> = ["epic", "hype", "sad", "chill"];
        return data.videos.map((vid: any, idx: number) => ({
          ...vid,
          vibe: vibes[idx % vibes.length],
        }));
      }
    }
  } catch (err) {
    console.error("fetchAmvPlaylistApi failed, using fallback AMVs:", err);
  }

  return FALLBACK_AMVS;
}
