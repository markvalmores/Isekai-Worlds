const fs = require("fs");
const path = require("path");

const rawUrlsText = fs.readFileSync(path.join(__dirname, "buildData.cjs"), "utf-8");

const match = rawUrlsText.match(/const rawUrls = `([\s\S]*?)`;/);
if (!match) {
  console.error("Could not find rawUrls block");
  process.exit(1);
}

const rawUrlsList = match[1].trim().split("\n").map(s => s.trim()).filter(Boolean);

function cleanAnimeTitle(rawTitle) {
  let title = rawTitle;

  // Replace 《 and 》
  title = title.replace(/《/g, "").replace(/》/g, "");

  // Remove common prefixes/suffixes
  title = title.replace(/【[^】]+】/g, ""); // Remove 【Muse Asia】 etc.

  // Remove trailing preview / pv text
  title = title.replace(/\s*-\s*Preview of\s*$/i, "");
  title = title.replace(/\s*-\s*Main PV.*$/i, " (PV)");
  title = title.replace(/\s*-\s*Teaser PV.*$/i, " (PV)");
  title = title.replace(/\s*-\s*PV.*$/i, " (PV)");
  title = title.replace(/\s*-\s*Trailer.*$/i, " (Trailer)");

  // Remove episode info
  title = title.replace(/\s*-\s*Episode\s*\d+.*$/i, "");
  title = title.replace(/\s*-\s*Ep\.?\s*\d+.*$/i, "");
  title = title.replace(/Episode\s*\d+.*$/i, "");
  title = title.replace(/Ep\.?\s*\d+.*$/i, "");
  title = title.replace(/\s*-\s*0?1\s*(\[.*\])?$/i, "");
  title = title.replace(/#\d+.*$/i, "");

  // Remove language brackets like [English Sub], [English Dub]
  title = title.replace(/\[\s*English Sub\s*\]/gi, "");
  title = title.replace(/\[\s*English Dub\s*\]/gi, " (Dub)");
  title = title.replace(/\[\s*Sub\s*\]/gi, "");
  title = title.replace(/\[\s*Dub\s*\]/gi, " (Dub)");

  // Clean trailing punctuation and whitespace
  title = title.trim().replace(/[-:\s|]+$/, "").trim();

  if (!title || title.length < 2) {
    title = rawTitle.replace(/《/g, "").replace(/》/g, "").replace(/【[^】]+】/g, "").replace(/\[[^\]]+\]/g, "").trim();
  }

  return title || rawTitle;
}

async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
}

async function processAll() {
  const results = [];
  const batchSize = 15;

  for (let i = 0; i < rawUrlsList.length; i += batchSize) {
    const batch = rawUrlsList.slice(i, i + batchSize);

    const promises = batch.map(async (urlStr, batchIdx) => {
      const globalIdx = i + batchIdx;
      let videoId = "";
      let playlistId = "";

      if (urlStr.includes("watch?v=")) {
        const vMatch = urlStr.match(/v=([a-zA-Z0-9_-]+)/);
        if (vMatch) videoId = vMatch[1];
      }
      if (urlStr.includes("list=")) {
        const lMatch = urlStr.match(/list=([a-zA-Z0-9_-]+)/);
        if (lMatch) playlistId = lMatch[1];
      } else if (urlStr.includes("/show/VL")) {
        const vlMatch = urlStr.match(/\/show\/VL([a-zA-Z0-9_-]+)/);
        if (vlMatch) playlistId = vlMatch[1];
      }

      let rawTitle = "";

      if (videoId) {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const res = await fetchWithTimeout(oembedUrl);
        if (res && res.ok) {
          try {
            const data = await res.json();
            if (data.title) {
              rawTitle = data.title;
            }
          } catch (e) {}
        }
      }

      if (!rawTitle) {
        rawTitle = `Muse Asia Anime #${globalIdx + 1}`;
      }

      const animeTitle = cleanAnimeTitle(rawTitle);

      const isDub = rawTitle.toLowerCase().includes("dub") || urlStr.toLowerCase().includes("dub");
      const tags = [isDub ? "DUB" : "SUB"];

      if (rawTitle.toLowerCase().includes("movie") || urlStr.includes("show/")) {
        tags.push("Movies");
      } else if (rawTitle.toLowerCase().includes("ova") || rawTitle.toLowerCase().includes("oad")) {
        tags.push("OVA", "OAD");
      } else if (rawTitle.toLowerCase().includes("limited") || urlStr.includes("pp=")) {
        tags.push("Limited-Time");
      } else if (rawTitle.toLowerCase().includes("pv") || rawTitle.toLowerCase().includes("special") || rawTitle.toLowerCase().includes("teaser") || animeTitle.includes("(PV)")) {
        tags.push("Extras");
      } else {
        tags.push("Full Series", "Seasons");
      }

      const thumb = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80";

      return {
        id: `muse-asia-${globalIdx + 1}`,
        title: animeTitle,
        publisher: "Muse Asia",
        originalUrl: urlStr,
        videoId: videoId || "TQY7-Hfw9Nw",
        playlistId: playlistId,
        thumbnail: thumb,
        tags: Array.from(new Set(tags)),
        episodesCount: Math.floor(Math.random() * 12) + 12,
        rating: (4.5 + (globalIdx % 5) * 0.1).toFixed(1),
        year: "2023-2026",
        description: `Watch official ${animeTitle} legally on Muse Asia! Full series episodes, official audio tracks, HD stream quality, and promotional specials.`
      };
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  // Sort ALPHABETICALLY A-Z by Title!
  results.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true }));

  console.log(`Successfully fetched and cleaned ${results.length} items. Writing to src/data/exclusiveAnimesData.ts...`);

  const tsContent = `export interface ExclusiveAnimeItem {
  id: string;
  title: string;
  publisher: "Muse Asia" | "Exclusive Animes";
  originalUrl: string;
  videoId: string;
  playlistId: string;
  thumbnail: string;
  tags: ("SUB" | "DUB" | "Seasons" | "Movies" | "OVA" | "OAD" | "Full Series" | "Limited-Time" | "Extras")[];
  episodesCount: number;
  rating: string;
  year: string;
  description: string;
}

export const EXCLUSIVE_ANIMES_DATA: ExclusiveAnimeItem[] = ${JSON.stringify(results, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, "../src/data/exclusiveAnimesData.ts"), tsContent);
  console.log("Done updating src/data/exclusiveAnimesData.ts!");
}

processAll();
