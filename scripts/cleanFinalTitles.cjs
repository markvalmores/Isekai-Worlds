const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/exclusiveAnimesData.ts");
const fileText = fs.readFileSync(filePath, "utf-8");

const jsonMatch = fileText.match(/export const EXCLUSIVE_ANIMES_DATA: ExclusiveAnimeItem\[\] = ([\s\S]*?);/);
if (!jsonMatch) {
  console.error("Could not parse EXCLUSIVE_ANIMES_DATA");
  process.exit(1);
}

const items = JSON.parse(jsonMatch[1]);

function cleanTitle(t) {
  if (!t) return "Muse Asia Anime";

  let clean = t;

  // Remove leading bracket tags like [2021 Summer Anime], [Promotion Video], [English Sub], etc.
  clean = clean.replace(/^\[[^\]]+\]\s*/g, "");
  clean = clean.replace(/《/g, "").replace(/》/g, "");
  clean = clean.replace(/【[^】]+】/g, "");

  // Remove trailing " - Preview of", " - Teaser PV", etc.
  clean = clean.replace(/\s*-\s*Preview of\s*$/i, "");
  clean = clean.replace(/\s*-\s*Main PV.*$/i, " (PV)");
  clean = clean.replace(/\s*-\s*Teaser PV.*$/i, " (PV)");
  clean = clean.replace(/\s*-\s*PV.*$/i, " (PV)");
  clean = clean.replace(/\s*-\s*Teaser.*$/i, " (Teaser)");
  clean = clean.replace(/\s*-\s*Trailer.*$/i, " (Trailer)");

  clean = clean.replace(/\s*-\s*Episode\s*\d+.*$/i, "");
  clean = clean.replace(/\s*-\s*Ep\.?\s*\d+.*$/i, "");
  clean = clean.replace(/Episode\s*\d+.*$/i, "");
  clean = clean.replace(/Ep\.?\s*\d+.*$/i, "");
  clean = clean.replace(/\s*-\s*0?1\s*(\[.*\])?$/i, "");

  clean = clean.replace(/\[\s*English Sub\s*\]/gi, "");
  clean = clean.replace(/\[\s*English Dub\s*\]/gi, " (Dub)");
  clean = clean.replace(/\[\s*Sub\s*\]/gi, "");
  clean = clean.replace(/\[\s*Dub\s*\]/gi, " (Dub)");

  clean = clean.replace(/\|\s*Coming to streaming platforms!/gi, "");
  clean = clean.replace(/\|\s*Muse Asia/gi, "");
  clean = clean.trim().replace(/^[-:\s|]+/, "").replace(/[-:\s|]+$/, "").trim();

  if (!clean || clean.length < 2) return t.replace(/《/g, "").replace(/》/g, "").replace(/^\[[^\]]+\]\s*/g, "").trim();

  return clean;
}

items.forEach(item => {
  item.title = cleanTitle(item.title);
  item.description = `Watch official ${item.title} legally on Muse Asia! Full series episodes, official audio tracks, HD stream quality, and promotional specials.`;
});

// Sort items ALPHABETICALLY A-Z by title!
items.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true }));

const output = `export interface ExclusiveAnimeItem {
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

export const EXCLUSIVE_ANIMES_DATA: ExclusiveAnimeItem[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync(filePath, output);
console.log(`Successfully cleaned and sorted ${items.length} titles in src/data/exclusiveAnimesData.ts!`);
