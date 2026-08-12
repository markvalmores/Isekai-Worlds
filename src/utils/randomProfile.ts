import { UserProfile } from "../types";

const ANIME_PREFIXES = [
  "Shadow", "Chrono", "Aether", "Kage", "Sora", "Cyber", "Nexus", "Astral", "Ryu", "Phantom",
  "Celestial", "Starlight", "Vortex", "Kuro", "Shiro", "Omega", "Zero", "Zenith", "Apex", "Divine",
  "Ethereal", "Valiant", "Giga", "Radiant", "Titan", "Solar", "Lunar", "Infinite", "Specter", "Abyssal"
];

const ANIME_SUFFIXES = [
  "Blade", "Traveler", "Vanguard", "Samurai", "Sovereign", "Shinobi", "Archon", "Phoenix", "Knight",
  "Reaper", "Paladin", "Slayer", "Monarch", "Sorcerer", "Wanderer", "Seeker", "Overlord", "Guardian", "Ronin", "Eclipse"
];

const ANIME_TITLES = [
  "S-Rank Dimension Hopper", "Master of Shadow Arts", "Supreme Isekai Overlord",
  "Chrono Spellcaster", "Archmage of the Abyss", "Starbound Wanderer",
  "Celestial Guild Master", "Demon King Slayer", "Quantum Cyber Shinobi",
  "Aether Realm Sovereign", "Mythic Card Summoner", "Grand Fleet Admiral"
];

const ANIME_BADGES = [
  "S-Rank Hero", "Mythic Champion", "SS-Rank Hunter", "Shadow Ruler",
  "Celestial Vanguard", "Grandmaster", "Aether Sovereign", "Divine Chosen"
];

const ANIME_BIOS = [
  "Traversing through endless anime dimensions. S-Rank Adventurer and Isekai enthusiast.",
  "Mastering arcane magic and collecting 4K wallpapers across quantum realms.",
  "Collecting rare anime cards and exploring retro gaming archives.",
  "Guild Master of the Celestial Syndicate. Seeking the ultimate Isekai quest.",
  "Netrunning through cyberpunk neon cities and streaming live anime.",
  "A quiet wanderer searching for legendary artifacts and 4K wallpapers."
];

const ANIME_AVATARS = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
];

const ANIME_BANNERS = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
];

const ANIME_FAV_SERIES = [
  "Re:Zero / Sword Art Online",
  "Jujutsu Kaisen / Demon Slayer",
  "Solo Leveling / Fate/stay night",
  "Overlord / No Game No Life",
  "Attack on Titan / Cyberpunk Edgerunners",
  "Genshin Impact / NieR:Automata"
];

export function generateRandomUserProfile(): UserProfile {
  const randomPrefix = ANIME_PREFIXES[Math.floor(Math.random() * ANIME_PREFIXES.length)];
  const randomSuffix = ANIME_SUFFIXES[Math.floor(Math.random() * ANIME_SUFFIXES.length)];
  const randomNum = Math.floor(100 + Math.random() * 900);
  const username = `${randomPrefix}${randomSuffix}_${randomNum}`;

  const title = ANIME_TITLES[Math.floor(Math.random() * ANIME_TITLES.length)];
  const badge = ANIME_BADGES[Math.floor(Math.random() * ANIME_BADGES.length)];
  const bio = ANIME_BIOS[Math.floor(Math.random() * ANIME_BIOS.length)];
  const avatarUrl = ANIME_AVATARS[Math.floor(Math.random() * ANIME_AVATARS.length)];
  const bannerUrl = ANIME_BANNERS[Math.floor(Math.random() * ANIME_BANNERS.length)];
  const favAnime = ANIME_FAV_SERIES[Math.floor(Math.random() * ANIME_FAV_SERIES.length)];

  const gradients = [
    "from-purple-600 via-indigo-600 to-pink-600",
    "from-blue-600 via-cyan-600 to-teal-600",
    "from-amber-600 via-orange-600 to-red-600",
    "from-emerald-600 via-teal-600 to-indigo-600"
  ];
  const bannerGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return {
    id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    username,
    avatarUrl,
    bannerUrl,
    bio,
    title,
    badge,
    customStatus: `Exploring Isekai Worlds as ${username}...`,
    bannerGradient,
    accentColor: "#a855f7",
    country: "GLOBAL",
    joinedDate: new Date().getFullYear().toString(),
    favAnime
  };
}
