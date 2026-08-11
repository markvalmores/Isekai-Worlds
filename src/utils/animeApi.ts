export interface RealTimeAnimeItem {
  id: number | string;
  title: string;
  titleJapanese?: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  score: number | string;
  episodes?: number;
  status?: string;
  description?: string;
  category?: string;
  sourceApi?: string;
  artist?: string;
}

// In-memory client cache
let cachedAnimeList: RealTimeAnimeItem[] | null = null;
let lastFetchTime = 0;

/**
 * Fetch dynamic anime artwork from Nekos.best API v2
 */
export async function fetchNekosBestArt(amount = 10): Promise<RealTimeAnimeItem[]> {
  try {
    const categories = ["neko", "waifu", "kitsune", "hug", "pat", "smile"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const res = await fetch(`https://nekos.best/api/v2/${randomCategory}?amount=${amount}`);
    if (res.ok) {
      const data = await res.json();
      const results = data.results || [];
      return results.map((item: any, idx: number) => ({
        id: `nekos-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.artist_name ? `Anime Art by ${item.artist_name}` : `Nekos.best ${randomCategory.toUpperCase()} #${idx + 1}`,
        coverImage: item.url,
        bannerImage: item.url,
        genres: ["Nekos.best", randomCategory.toUpperCase(), "Anime Art"],
        score: (8.5 + Math.random() * 1.4).toFixed(1),
        category: "Nekos.best API",
        sourceApi: "Nekos.best API",
        artist: item.artist_name || "Community Artist",
        description: `Fresh live anime artwork pulled directly from Nekos.best API v2 (${randomCategory}).`
      }));
    }
  } catch (err) {
    console.warn("Nekos.best API fetch error:", err);
  }
  return [];
}

/**
 * Fetch dynamic anime artwork from Waifu.im API
 */
export async function fetchWaifuImArt(): Promise<RealTimeAnimeItem[]> {
  try {
    const res = await fetch("https://api.waifu.im/search?is_nsfw=false&many=true");
    if (res.ok) {
      const data = await res.json();
      const images = data.images || [];
      return images.map((item: any, idx: number) => {
        const tagName = item.tags?.[0]?.name || "Waifu";
        return {
          id: `waifu-im-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
          title: `Waifu.im ${tagName.toUpperCase()} Highlight #${idx + 1}`,
          coverImage: item.url,
          bannerImage: item.url,
          genres: ["Waifu.im", tagName, "SFW Art"],
          score: (8.8 + Math.random() * 1.1).toFixed(1),
          category: "Waifu.im API",
          sourceApi: "Waifu.im API",
          artist: "Waifu.im Network",
          description: "High definition SFW anime illustration sourced from Waifu.im API."
        };
      });
    }
  } catch (err) {
    console.warn("Waifu.im API fetch error:", err);
  }
  return [];
}

/**
 * Fetch dynamic anime artwork from Waifu.pics API
 */
export async function fetchWaifuPicsArt(): Promise<RealTimeAnimeItem[]> {
  try {
    const endpoints = ["waifu", "neko", "shinobu", "megumin", "chase"];
    const promises = endpoints.map(ep =>
      fetch(`https://api.waifu.pics/sfw/${ep}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => data?.url ? { url: data.url, type: ep } : null)
        .catch(() => null)
    );
    const results = (await Promise.all(promises)).filter(Boolean);
    return results.map((item: any, idx: number) => ({
      id: `waifu-pics-${Date.now()}-${idx}`,
      title: `Waifu.pics ${item.type.toUpperCase()} Visual`,
      coverImage: item.url,
      bannerImage: item.url,
      genres: ["Waifu.pics", item.type, "Chibi"],
      score: (9.0 + Math.random() * 0.9).toFixed(1),
      category: "Waifu.pics API",
      sourceApi: "Waifu.pics API",
      artist: "Waifu.pics Network",
      description: `Live animated SFW anime artwork fetched from Waifu.pics endpoint (${item.type}).`
    }));
  } catch (err) {
    console.warn("Waifu.pics API fetch error:", err);
  }
  return [];
}

/**
 * Primary fetch function for real-time anime list with multi-API dynamic thumbnails on refresh
 */
export async function fetchRealTimeAnimeList(forceRefresh = false): Promise<RealTimeAnimeItem[]> {
  const now = Date.now();
  if (!forceRefresh && cachedAnimeList && now - lastFetchTime < 60000) {
    return cachedAnimeList;
  }

  // Simultaneously fetch from multiple dynamic APIs (Nekos.best, Waifu.im, AniList, Jikan, Waifu.pics)
  const [nekosArt, waifuImArt, waifuPicsArt] = await Promise.all([
    fetchNekosBestArt(12),
    fetchWaifuImArt(),
    fetchWaifuPicsArt()
  ]);

  let aniListSeries: RealTimeAnimeItem[] = [];

  try {
    // Randomize AniList page number on refresh (pages 1 to 5) so thumbnails change on page load
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const query = `
      query {
        Page(page: ${randomPage}, perPage: 20) {
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
        aniListSeries = mediaList.map((item: any) => {
          const mainTitle = item.title.english || item.title.romaji || "Anime Title";
          const cover = item.coverImage?.extraLarge || item.coverImage?.large;
          const banner = item.bannerImage || cover;

          return {
            id: `anilist-${item.id}`,
            title: mainTitle,
            titleJapanese: item.title.native || "",
            coverImage: cover,
            bannerImage: banner,
            genres: item.genres || ["Anime", "Fantasy"],
            score: item.averageScore ? (item.averageScore / 10).toFixed(1) : "9.2",
            episodes: item.episodes || 12,
            status: item.status || "RELEASING",
            description: item.description ? item.description.replace(/<[^>]*>?/gm, "") : "Official anime series.",
            category: item.genres?.[0] || "AniList Series",
            sourceApi: "AniList GraphQL"
          };
        });
      }
    }
  } catch (err) {
    console.warn("AniList query error:", err);
  }

  // Interleave and shuffle the results so every page refresh has fresh anime thumbnails from Nekos.best, Waifu.im, Waifu.pics & AniList!
  const combined: RealTimeAnimeItem[] = [];
  
  // Combine all API sources
  const pool = [...nekosArt, ...waifuImArt, ...aniListSeries, ...waifuPicsArt];

  // Shuffle pool randomly
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  if (pool.length > 0) {
    cachedAnimeList = pool;
    lastFetchTime = now;
    return pool;
  }

  return [];
}

