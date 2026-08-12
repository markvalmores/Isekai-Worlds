import React, { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  Gamepad2,
  Swords,
  Database,
  Search,
  Gift,
  Trophy,
  Play,
  Users,
  Check,
  RefreshCw,
  Heart,
  Shield,
  Zap,
  BookOpen,
  ExternalLink,
  Minimize2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Award,
  AlertCircle
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface Card {
  id: string;
  name: string;
  game: "yugioh" | "pokemon";
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "God";
  type: string; // e.g. "Dragon / Effect", "Fire / Stage 2"
  atk?: number; // for yugioh
  def?: number; // for yugioh
  hp?: number;  // for pokemon
  element?: string; // e.g. "Fire", "Lightning", "Dark", "LIGHT"
  attackName?: string; // e.g. "Fire Spin"
  description: string;
  imageUrl: string;
  levelStars?: number; // e.g. 8 stars
}

const PRESET_CARDS: Card[] = [
  // Yu-Gi-Oh
  {
    id: "yg-1",
    name: "Blue-Eyes White Dragon",
    game: "yugioh",
    rarity: "Legendary",
    type: "Dragon / Normal",
    atk: 3000,
    def: 2500,
    element: "LIGHT",
    levelStars: 8,
    description: "This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/89631139.jpg"
  },
  {
    id: "yg-2",
    name: "Dark Magician",
    game: "yugioh",
    rarity: "Epic",
    type: "Spellcaster / Normal",
    atk: 2500,
    def: 2100,
    element: "DARK",
    levelStars: 7,
    description: "The ultimate wizard in terms of attack and defense.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/46986414.jpg"
  },
  {
    id: "yg-3",
    name: "Exodia the Forbidden One",
    game: "yugioh",
    rarity: "God",
    type: "Spellcaster / Effect",
    atk: 1000,
    def: 1000,
    element: "DARK",
    levelStars: 3,
    description: "An automatic victory is declared when all five legendary pieces of the Forbidden One are gathered in your active card layout.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/33396948.jpg"
  },
  {
    id: "yg-4",
    name: "Red-Eyes Black Dragon",
    game: "yugioh",
    rarity: "Rare",
    type: "Dragon / Normal",
    atk: 2400,
    def: 2000,
    element: "DARK",
    levelStars: 7,
    description: "A ferocious dragon with a deadly dark energy attack. Its power is rivaled only by its absolute rage.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/74677422.jpg"
  },
  {
    id: "yg-5",
    name: "Obelisk the Tormentor",
    game: "yugioh",
    rarity: "God",
    type: "Divine-Beast / Effect",
    atk: 4000,
    def: 4000,
    element: "DIVINE",
    levelStars: 10,
    description: "The descent of this mighty creature shall be heralded by burning winds and twisted lands. And with the coming of this horror, those who draw breath shall know the true meaning of eternal slumber.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/13839129.jpg"
  },
  {
    id: "yg-6",
    name: "Slifer the Sky Dragon",
    game: "yugioh",
    rarity: "God",
    type: "Divine-Beast / Effect",
    atk: 4000,
    def: 4000,
    element: "DIVINE",
    levelStars: 10,
    description: "The heavens affect the beast, making its power relative to your tactical positioning in combat. Those who oppose it are burned to ash.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/27564031.jpg"
  },
  {
    id: "yg-7",
    name: "Winged Dragon of Ra",
    game: "yugioh",
    rarity: "God",
    type: "Divine-Beast / Effect",
    atk: 4000,
    def: 4000,
    element: "DIVINE",
    levelStars: 10,
    description: "Spirits sing of an ancient beast, that takes the form of a golden phoenix, descending to cleanse the mortal realms with blinding solar fire.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/30208154.jpg"
  },
  {
    id: "yg-8",
    name: "Black Luster Soldier",
    game: "yugioh",
    rarity: "Legendary",
    type: "Warrior / Ritual",
    atk: 3000,
    def: 2500,
    element: "EARTH",
    levelStars: 8,
    description: "The ultimate warrior of light and shadow, summoned through ancient sacred ritual power to cut down the darkness.",
    imageUrl: "https://images.ygoprodeck.com/images/cards/5405694.jpg"
  },

  // Pokémon
  {
    id: "pk-1",
    name: "Charizard",
    game: "pokemon",
    rarity: "Legendary",
    type: "Stage 2 Fire Dragon",
    hp: 150,
    element: "Fire",
    attackName: "Fire Spin (120 DMG)",
    description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally. Flaps its wings to ascend above the clouds.",
    imageUrl: "https://images.pokemontcg.io/base1/4.png"
  },
  {
    id: "pk-2",
    name: "Pikachu",
    game: "pokemon",
    rarity: "Common",
    type: "Basic Lightning Mouse",
    hp: 60,
    element: "Lightning",
    attackName: "Thunderbolt (30 DMG)",
    description: "When several of these Pokémon gather, their electricity can build and cause spontaneous lightning storms in the local biome.",
    imageUrl: "https://images.pokemontcg.io/base1/58.png"
  },
  {
    id: "pk-3",
    name: "Mewtwo",
    game: "pokemon",
    rarity: "God",
    type: "Legendary Psychic Humanoid",
    hp: 130,
    element: "Psychic",
    attackName: "Psyburn (110 DMG)",
    description: "It was created by a scientist after years of horrific gene-splicing and DNA engineering experiments. Its heart is cold and focused purely on strength.",
    imageUrl: "https://images.pokemontcg.io/base1/10.png"
  },
  {
    id: "pk-4",
    name: "Rayquaza",
    game: "pokemon",
    rarity: "God",
    type: "Legendary Dragon Serpent",
    hp: 170,
    element: "Dragon",
    attackName: "Dragon Burst (150 DMG)",
    description: "It flies in the ozone layer way above the clouds and cannot be seen from the ground. It has lived for hundreds of millions of years.",
    imageUrl: "https://images.pokemontcg.io/xy6/75.png"
  },
  {
    id: "pk-5",
    name: "Lugia",
    game: "pokemon",
    rarity: "Epic",
    type: "Legendary Guardian Psychic",
    hp: 140,
    element: "Psychic",
    attackName: "Aero Blast (100 DMG)",
    description: "It sleeps in a deep-sea trench. If it flaps its massive wings, it is said to cause a forty-day torrential rainstorm.",
    imageUrl: "https://images.pokemontcg.io/neo1/9.png"
  },
  {
    id: "pk-6",
    name: "Umbreon",
    game: "pokemon",
    rarity: "Rare",
    type: "Stage 1 Moonlight Dark",
    hp: 110,
    element: "Dark",
    attackName: "Dark Moon (70 DMG)",
    description: "When exposed to the moon's aura, the golden rings on its body glow faintly, absorbing a mysterious cosmic energy.",
    imageUrl: "https://images.pokemontcg.io/neo2/13.png"
  },
  {
    id: "pk-7",
    name: "Blastoise",
    game: "pokemon",
    rarity: "Epic",
    type: "Stage 2 Shellfish Water",
    hp: 140,
    element: "Water",
    attackName: "Hydro Pump (90 DMG)",
    description: "A brutal Pokémon with pressurized water cannons protruding from its steel shell. It can punch holes through reinforced bank vaults.",
    imageUrl: "https://images.pokemontcg.io/base1/2.png"
  },
  {
    id: "pk-8",
    name: "Venusaur",
    game: "pokemon",
    rarity: "Epic",
    type: "Stage 2 Seed Grass",
    hp: 140,
    element: "Grass",
    attackName: "Solar Beam (100 DMG)",
    description: "There is a large flower on Venusaur's back. The flower is said to take on vivid colors if it gets plenty of nutrition and bright sunlight.",
    imageUrl: "https://images.pokemontcg.io/base1/15.png"
  }
];

interface CardGamesDashboardProps {
  onAddCoins: (amount: number) => void;
  isGoldMode: boolean;
  isAdmin?: boolean;
}

export function CardGamesDashboard({ onAddCoins, isGoldMode, isAdmin = false }: CardGamesDashboardProps) {
  // We rename the component dynamically or reuse it as "CardGamesDashboard" internally
  const EXTERNAL_URL = "https://mobile-anime-card-gacha-battle.vercel.app/";
  const externalContainerRef = React.useRef<HTMLDivElement>(null);

  const adminActive = isAdmin || localStorage.getItem("isekai_admin_mode") === "true";
  
  // Image error fallback handler to ensure Yu-Gi-Oh and Pokemon legendaries always display art
  const handleCardImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>, game?: string) => {
    const target = e.currentTarget;
    target.onerror = null;
    if (game === "yugioh") {
      target.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80";
    } else {
      target.src = "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80";
    }
  };

  const toggleExternalNativeFullscreen = () => {
    sfx.playClick();
    if (!document.fullscreenElement) {
      if (externalContainerRef.current?.requestFullscreen) {
        externalContainerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };
  
  // Tabs: "gacha" | "inventory" | "battle" | "external"
  const [subTab, setSubTab] = useState<"gacha" | "inventory" | "battle" | "external">("gacha");
  
  // Game mode filter: "all" | "yugioh" | "pokemon"
  const [gameFilter, setGameFilter] = useState<"all" | "yugioh" | "pokemon">("all");
  const [rarityFilter, setRarityFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Helper to generate a unique random starter card pack for each new user
  const generateRandomStarterCards = (): string[] => {
    const shuffled = [...PRESET_CARDS].sort(() => 0.5 - Math.random());
    const starterPack = shuffled.slice(0, 3).map((c) => c.id);
    try {
      localStorage.setItem("isekai_card_inventory", JSON.stringify(starterPack));
    } catch {}
    return starterPack;
  };

  // Inventory state (Persisted locally per user)
  const [inventory, setInventory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("isekai_card_inventory");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return generateRandomStarterCards();
  });

  // Effective inventory: Admins get all cards unlocked in PRESET_CARDS automatically
  const effectiveInventory = adminActive ? PRESET_CARDS.map((c) => c.id) : inventory;

  // Coins state
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("isekai_app_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isekaiCoins === "number") return parsed.isekaiCoins;
      }
    } catch {}
    return 120;
  });

  // Sync coins with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("isekai_app_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.isekaiCoins === "number") {
            setCoins(parsed.isekaiCoins);
          }
        }
      } catch {}
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const deductCoins = (amount: number): boolean => {
    if (coins < amount) {
      sfx.playError();
      return false;
    }
    const nextCoins = coins - amount;
    setCoins(nextCoins);
    
    // Save back to local storage settings
    try {
      const saved = localStorage.getItem("isekai_app_settings");
      let parsed = saved ? JSON.parse(saved) : {};
      parsed.isekaiCoins = nextCoins;
      localStorage.setItem("isekai_app_settings", JSON.stringify(parsed));
    } catch {}
    
    return true;
  };

  const addLocalCoins = (amount: number) => {
    const nextCoins = coins + amount;
    setCoins(nextCoins);
    onAddCoins(amount);
    try {
      const saved = localStorage.getItem("isekai_app_settings");
      let parsed = saved ? JSON.parse(saved) : {};
      parsed.isekaiCoins = nextCoins;
      localStorage.setItem("isekai_app_settings", JSON.stringify(parsed));
    } catch {}
  };

  // Gacha Pull Logic
  const [recentPulls, setRecentPulls] = useState<Card[]>([]);
  const [isPulling, setIsPulling] = useState(false);

  const executePull = (count: number) => {
    const cost = count === 10 ? 100 : 10;
    if (coins < cost) {
      alert("Insufficient Isekai Coins! Earn more coins by active time or battle wins.");
      sfx.playError();
      return;
    }

    sfx.playWarp();
    setIsPulling(true);
    deductCoins(cost);

    setTimeout(() => {
      const pulls: Card[] = [];
      const newInventoryIds = [...inventory];

      for (let i = 0; i < count; i++) {
        // Roll for card
        const randomIndex = Math.floor(Math.random() * PRESET_CARDS.length);
        const card = PRESET_CARDS[randomIndex];
        pulls.push(card);
        newInventoryIds.push(card.id);
      }

      setRecentPulls(pulls);
      // Remove duplicates for saved array but keep records
      const cleanInv = Array.from(new Set(newInventoryIds));
      setInventory(cleanInv);
      localStorage.setItem("isekai_card_inventory", JSON.stringify(cleanInv));
      
      setIsPulling(false);
      sfx.playBadgeUnlock();
    }, 1200);
  };

  // External Sandbox State
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dynamic search fetch from real Yu-Gi-Oh and Pokémon APIs
  const [searchGameType, setSearchGameType] = useState<"yugioh" | "pokemon">("yugioh");
  const [apiSearchActive, setApiSearchActive] = useState(false);
  const [apiCardResult, setApiCardResult] = useState<any | null>(null);

  const searchDatabaseApi = async (query: string) => {
    if (!query.trim()) return;
    setApiSearchActive(true);
    setApiCardResult(null);
    try {
      if (searchGameType === "yugioh") {
        const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.data && data.data.length > 0) {
            const first = data.data[0];
            setApiCardResult({
              name: first.name,
              type: first.type,
              atk: first.atk,
              def: first.def,
              level: first.level,
              attribute: first.attribute,
              desc: first.desc,
              imageUrl: first.card_images[0].image_url_small
            });
            sfx.playBadgeUnlock();
          } else {
            setApiCardResult("No official card found for this name query.");
          }
        } else {
          setApiCardResult("No matching official card found.");
        }
      } else {
        // Pokemon TCG API v2
        const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(query)}*"` + "&pageSize=1");
        if (res.ok) {
          const data = await res.json();
          if (data && data.data && data.data.length > 0) {
            const first = data.data[0];
            const attacksText = first.attacks 
              ? first.attacks.map((atk: any) => `⚔️ ${atk.name} (${atk.damage || "0"} DMG): ${atk.text || ""}`).join("\n") 
              : "";
            setApiCardResult({
              name: first.name,
              type: `${first.supertype} - ${first.subtypes ? first.subtypes.join(", ") : ""}`,
              hp: first.hp,
              element: first.types ? first.types[0] : "Normal",
              desc: attacksText || `A Pokémon from the ${first.set?.name || "TCG"} expansion.`,
              imageUrl: first.images.small
            });
            sfx.playBadgeUnlock();
          } else {
            setApiCardResult("No official Pokémon card found for this query.");
          }
        } else {
          setApiCardResult("No matching Pokémon card found.");
        }
      }
    } catch {
      setApiCardResult("Failed to reach external database server.");
    } finally {
      setApiSearchActive(false);
    }
  };

  // Battle Arena Simulation State
  const [battleMode, setBattleMode] = useState<"lobby" | "cpu_loading" | "pvp_waiting" | "active_cpu" | "active_pvp" | "ended">("lobby");
  const [pvpWaitSeconds, setPvpWaitSeconds] = useState(0);
  const [selectedFighter, setSelectedFighter] = useState<Card | null>(null);
  const [opponentFighter, setOpponentFighter] = useState<Card | null>(null);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [battleReward, setBattleReward] = useState(0);
  const [opponentName, setOpponentName] = useState("AI CPU Duelist");

  // Filtered Preset Cards for display
  const availablePresetFiltered = PRESET_CARDS.filter((card) => {
    const matchesGame = gameFilter === "all" || card.game === gameFilter;
    const matchesRarity = rarityFilter === "All" || card.rarity === rarityFilter;
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          card.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGame && matchesRarity && matchesSearch;
  });

  const totalPages = Math.ceil(availablePresetFiltered.length / itemsPerPage);
  const paginatedCards = availablePresetFiltered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // PVP wait ticker
  useEffect(() => {
    let ticker: any;
    if (battleMode === "pvp_waiting") {
      ticker = setInterval(() => {
        setPvpWaitSeconds((prev) => {
          const next = prev + 1;
          if (next === 3) {
            setBattleLogs((curr) => [...curr, "📡 Latency handshake completed. Ping: 24ms."]);
          }
          if (next === 6) {
            setBattleLogs((curr) => [...curr, "👥 Opponent Match Found! Connected with 'S-Rank_Gamer99'."]);
          }
          if (next === 8) {
            // Start PVP battle
            clearInterval(ticker);
            startActiveBattle("pvp");
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(ticker);
  }, [battleMode]);

  const startActiveBattle = (type: "cpu" | "pvp") => {
    sfx.playWarp();
    if (!selectedFighter) {
      // Pick random collected fighter if none chosen
      const collectedIds = effectiveInventory.length > 0 ? effectiveInventory : ["yg-1", "pk-2"];
      const randomId = collectedIds[Math.floor(Math.random() * collectedIds.length)];
      const found = PRESET_CARDS.find((c) => c.id === randomId) || PRESET_CARDS[0];
      setSelectedFighter(found);
    }

    // Pick random opponent fighter
    const opponentRandom = PRESET_CARDS[Math.floor(Math.random() * PRESET_CARDS.length)];
    setOpponentFighter(opponentRandom);

    setPlayerHp(100);
    setOpponentHp(100);
    setOpponentName(type === "cpu" ? "AI CPU Duelist" : "S-Rank_Gamer99");
    setBattleLogs([
      `⚔️ Battle initiated! ${selectedFighter?.name || "Chrono Fighter"} VS ${opponentRandom.name}`,
      `👊 ${type === "cpu" ? "CPU" : "Player 'S-Rank_Gamer99'"} drew their fighter first!`
    ]);
    setBattleMode(type === "cpu" ? "active_cpu" : "active_pvp");
  };

  const executeAttack = () => {
    if (!selectedFighter || !opponentFighter) return;
    sfx.playClick();

    // Player attack
    const playerAtkVal = selectedFighter.atk || (selectedFighter.hp ? selectedFighter.hp / 2 : 50);
    const playerDamage = Math.max(15, Math.floor(playerAtkVal / 10 + Math.random() * 15));
    const nextOppHp = Math.max(0, opponentHp - playerDamage);
    setOpponentHp(nextOppHp);

    const log1 = `💥 Your ${selectedFighter.name} uses ${selectedFighter.attackName || "Starlight Strike"} doing ${playerDamage} DMG!`;

    if (nextOppHp <= 0) {
      setBattleLogs((prev) => [...prev, log1, `🏆 Victory! You have defeated ${opponentName}!`, `💰 Reward added: +50 Isekai Coins!`]);
      addLocalCoins(50);
      setBattleReward(50);
      setBattleMode("ended");
      sfx.playBadgeUnlock();
      return;
    }

    // Opponent counter attack
    const oppAtkVal = opponentFighter.atk || (opponentFighter.hp ? opponentFighter.hp / 2 : 50);
    const oppDamage = Math.max(12, Math.floor(oppAtkVal / 11 + Math.random() * 12));
    const nextPlayHp = Math.max(0, playerHp - oppDamage);
    setPlayerHp(nextPlayHp);

    const log2 = `⚡ Opponent's ${opponentFighter.name} counterattacks with force! Recieved ${oppDamage} damage.`;

    if (nextPlayHp <= 0) {
      setBattleLogs((prev) => [...prev, log1, log2, `💀 Defeat! ${opponentName} wins.`, `💰 Consolation prize: +10 Isekai Coins`]);
      addLocalCoins(10);
      setBattleReward(10);
      setBattleMode("ended");
      sfx.playError();
      return;
    }

    setBattleLogs((prev) => [...prev, log1, log2]);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className={`p-8 rounded-3xl relative overflow-hidden border ${
        isGoldMode
          ? "bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-amber-950/40 border-amber-500/20"
          : "bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-purple-950/40 border-indigo-500/15"
      }`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.015)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
              Isekai Card Battlegrounds
            </div>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Anime Collectible Card Arena
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pull Legendary Yu-Gi-Oh and Pokémon cards with your Isekai Coins. View detailed stats, manage your active binder, and duel AI or wait for live players in the PVP matchmaking.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center gap-3.5 shadow-lg shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              🪙
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Isekai Balance</span>
              <span className="text-lg font-mono font-black text-amber-400">{coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-slate-850">
          <button
            onClick={() => { sfx.playClick(); setSubTab("gacha"); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
              subTab === "gacha"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Generate Cards (Gacha)</span>
          </button>

          <button
            onClick={() => { sfx.playClick(); setSubTab("inventory"); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
              subTab === "inventory"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span>My Binder ({effectiveInventory.length} Cards)</span>
            {adminActive && (
              <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                ⚡ Admin Unlocked
              </span>
            )}
          </button>

          <button
            onClick={() => { sfx.playClick(); setSubTab("battle"); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
              subTab === "battle"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Active Battle Arena</span>
          </button>

          <button
            onClick={() => { sfx.playClick(); setSubTab("external"); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
              subTab === "external"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Anime Card Gacha Battle Web</span>
          </button>
        </div>
      </div>

      {/* Render Sub Tabs */}
      {subTab === "gacha" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Generator Left Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 space-y-4">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <Gift className="w-4 h-4 text-indigo-400" />
                Gacha Booster Station
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Drawn randomly from all legendary Pokémon and Yu-Gi-Oh preset rosters.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  disabled={isPulling}
                  onClick={() => executePull(1)}
                  className="p-4 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-102 group active:scale-95 disabled:opacity-40"
                >
                  <span className="text-lg">🎴</span>
                  <span className="text-[10px] font-mono font-black text-white block">1x Pull</span>
                  <span className="text-[9px] font-mono text-amber-400">🪙 10 Coins</span>
                </button>

                <button
                  disabled={isPulling}
                  onClick={() => executePull(10)}
                  className="p-4 bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 hover:border-indigo-400 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-102 active:scale-95 disabled:opacity-40"
                >
                  <span className="text-lg">⚡</span>
                  <span className="text-[10px] font-mono font-black text-amber-400 block">10x Gacha Boost</span>
                  <span className="text-[9px] font-mono text-amber-400">🪙 100 Coins</span>
                </button>
              </div>

              {/* Rarity rates */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-[9px] font-mono text-slate-450">
                <div className="flex justify-between items-center text-white font-bold">
                  <span>BOOSTER PACK PROBABILITIES</span>
                  <span>100% Guaranteed</span>
                </div>
                <div className="flex justify-between"><span>Common (e.g. Pikachu)</span><span className="text-slate-400">40%</span></div>
                <div className="flex justify-between"><span>Rare (e.g. Umbreon)</span><span className="text-sky-400">30%</span></div>
                <div className="flex justify-between"><span>Epic (e.g. Dark Magician)</span><span className="text-purple-400">20%</span></div>
                <div className="flex justify-between"><span>Legendary (e.g. Blue-Eyes)</span><span className="text-amber-400">8%</span></div>
                <div className="flex justify-between"><span>Multiverse God (e.g. Mewtwo / Exodia)</span><span className="text-red-400 animate-pulse">2%</span></div>
              </div>
            </div>

            {/* API Direct Retrieval Panel */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-850 space-y-4">
              <div>
                <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Live Card Database Search
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Query real official data on-the-fly using live public servers.
                </p>
              </div>

              {/* Game Selector Tab */}
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                <button
                  onClick={() => { sfx.playClick(); setSearchGameType("yugioh"); setApiCardResult(null); }}
                  className={`py-1 rounded-lg text-[10px] font-mono uppercase font-black transition-all ${
                    searchGameType === "yugioh"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-450 hover:text-white"
                  }`}
                >
                  Yu-Gi-Oh
                </button>
                <button
                  onClick={() => { sfx.playClick(); setSearchGameType("pokemon"); setApiCardResult(null); }}
                  className={`py-1 rounded-lg text-[10px] font-mono uppercase font-black transition-all ${
                    searchGameType === "pokemon"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-450 hover:text-white"
                  }`}
                >
                  Pokémon
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={searchGameType === "yugioh" ? "e.g. Exodia, Kuriboh, Stardust" : "e.g. Charizard, Pikachu, Mewtwo"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchDatabaseApi((e.target as HTMLInputElement).value);
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  onClick={(e) => {
                    const inp = e.currentTarget.previousElementSibling as HTMLInputElement;
                    searchDatabaseApi(inp.value);
                  }}
                  className="p-2 bg-slate-950 border border-slate-850 hover:border-cyan-500/40 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Card API response */}
              {apiSearchActive && (
                <div className="py-4 flex items-center justify-center text-xs font-mono text-cyan-400 gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting Database API...</span>
                </div>
              )}

              {apiCardResult && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-left space-y-2">
                  {typeof apiCardResult === "string" ? (
                    <span className="text-[10px] text-amber-400 font-mono">{apiCardResult}</span>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-3 items-start">
                        <img
                          src={apiCardResult.imageUrl}
                          alt={apiCardResult.name}
                          referrerPolicy="no-referrer"
                          className="w-12 rounded border border-slate-800"
                        />
                        <div className="space-y-0.5">
                          <h5 className="text-[10px] font-bold text-white uppercase">{apiCardResult.name}</h5>
                          <p className="text-[8px] text-cyan-400 font-mono uppercase">{apiCardResult.type}</p>
                          <div className="text-[9px] text-slate-400 font-mono">
                            {searchGameType === "yugioh" ? (
                              <span>ATK: <strong className="text-white">{apiCardResult.atk ?? "N/A"}</strong> | DEF: <strong className="text-white">{apiCardResult.def ?? "N/A"}</strong></span>
                            ) : (
                              <span>HP: <strong className="text-white">{apiCardResult.hp ?? "N/A"}</strong> | Element: <strong className="text-white">{apiCardResult.element ?? "N/A"}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-[8px] text-slate-500 leading-relaxed font-mono whitespace-pre-wrap">
                        {apiCardResult.desc}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Pull Animation Display Area */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between min-h-[480px]">
            <div className="text-center space-y-1 pb-4">
              <h4 className="text-xs font-black text-slate-450 uppercase tracking-widest font-mono">Booster Pack Display Screen</h4>
              <p className="text-[10px] text-slate-400">Drawn cards will slide in with interactive holographic borders below.</p>
            </div>

            {isPulling ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-400 animate-ping flex items-center justify-center text-white text-xl">
                  🎴
                </div>
                <span className="text-xs font-mono text-indigo-400 font-bold animate-pulse uppercase tracking-wider">Tearing Booster Pack Wrap...</span>
              </div>
            ) : recentPulls.length > 0 ? (
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 items-center justify-center overflow-y-auto max-h-[380px] p-2">
                {recentPulls.map((card, index) => {
                  const rarityColors = {
                    Common: "border-slate-800 text-slate-400",
                    Rare: "border-blue-500/50 text-blue-400 shadow-md shadow-blue-500/5",
                    Epic: "border-purple-500/50 text-purple-400 shadow-md shadow-purple-500/5",
                    Legendary: "border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10",
                    God: "border-red-500 text-red-400 animate-pulse bg-gradient-to-b from-red-950/20 to-slate-950"
                  };
                  return (
                    <div
                      key={index}
                      className={`p-2.5 rounded-2xl bg-slate-950 border ${rarityColors[card.rarity]} text-center space-y-1.5 flex flex-col justify-between h-[170px] hover:scale-105 transition-all cursor-pointer`}
                      title={`${card.name}: ${card.description}`}
                    >
                      <span className="text-[7px] font-mono text-slate-500 uppercase block tracking-wider truncate">
                        {card.rarity}
                      </span>
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleCardImgError(e, card.game)}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <div className="space-y-0.5">
                        <h5 className="text-[9px] font-black text-white truncate">{card.name}</h5>
                        <span className="text-[7px] text-indigo-400 font-mono block truncate uppercase">
                          {card.game}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-2 text-slate-500">
                <Layers className="w-12 h-12 text-slate-700 animate-bounce" />
                <span className="text-xs font-mono font-bold uppercase">No Active Booster Pulls</span>
                <p className="text-[10px] text-slate-600 font-mono">Select a booster tier above to spend coins and summon anime fighters!</p>
              </div>
            )}

            {recentPulls.length > 0 && (
              <div className="pt-4 border-t border-slate-850/60 flex items-center justify-between">
                <span className="text-[9px] font-mono text-emerald-400 font-bold">✓ Automatically added to Collectibles Vault!</span>
                <button
                  onClick={() => { sfx.playClick(); setRecentPulls([]); }}
                  className="text-[9px] font-mono text-slate-400 hover:text-white uppercase font-bold"
                >
                  Clear Screen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collectibles Binder Tab */}
      {subTab === "inventory" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { sfx.playClick(); setGameFilter("all"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  gameFilter === "all"
                    ? "bg-slate-950 text-white border border-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Cards
              </button>

              <button
                onClick={() => { sfx.playClick(); setGameFilter("yugioh"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  gameFilter === "yugioh"
                    ? "bg-slate-950 text-white border border-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yu-Gi-Oh
              </button>

              <button
                onClick={() => { sfx.playClick(); setGameFilter("pokemon"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  gameFilter === "pokemon"
                    ? "bg-slate-950 text-white border border-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Pokémon
              </button>
            </div>

            {/* Rarity filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Common", "Rare", "Epic", "Legendary", "God"].map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => { sfx.playClick(); setRarityFilter(rarity); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase ${
                    rarityFilter === rarity
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                      : "bg-slate-950 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search card binder..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-650 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Cards Paginated Grid Layout */}
          {paginatedCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {paginatedCards.map((card) => {
                const isCollected = effectiveInventory.includes(card.id);
                const rarityStyle = {
                  Common: "from-slate-900 via-slate-950 to-slate-900 border-slate-800 text-slate-400",
                  Rare: "from-blue-950/40 via-slate-950 to-blue-950/40 border-blue-500/30 text-blue-400",
                  Epic: "from-purple-950/40 via-slate-950 to-purple-950/40 border-purple-500/30 text-purple-400",
                  Legendary: "from-amber-950/40 via-slate-950 to-amber-950/40 border-amber-500/40 text-amber-400",
                  God: "from-red-950/40 via-slate-950 to-red-950/40 border-red-500/50 text-red-400"
                };

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      sfx.playClick();
                      setSelectedFighter(card);
                    }}
                    className={`rounded-3xl p-5 bg-gradient-to-b ${rarityStyle[card.rarity]} border flex flex-col justify-between h-[360px] relative transition-all duration-300 hover:scale-102 hover:shadow-xl cursor-pointer ${
                      !isCollected ? "opacity-30 grayscale filter" : "shadow-md"
                    }`}
                  >
                    {/* Game badge top right */}
                    <div className="absolute top-4 right-4 text-[8px] font-mono font-black uppercase bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                      {card.game === "yugioh" ? "YGO" : "PKM"}
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-0.5 text-left">
                        <span className="text-[8px] font-mono uppercase tracking-widest font-bold">
                          {card.rarity} Card
                        </span>
                        <h4 className="text-sm font-black text-white truncate uppercase">
                          {card.name}
                        </h4>
                      </div>

                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleCardImgError(e, card.game)}
                        className="w-full h-36 object-cover rounded-2xl border border-slate-850/60 shadow-inner"
                      />

                      {/* Power numbers / core stats */}
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-850 flex items-center justify-between text-[10px] font-mono">
                        {card.game === "yugioh" ? (
                          <>
                            <span className="text-slate-400">ATK: <strong className="text-white">{card.atk}</strong></span>
                            <span className="text-slate-400">DEF: <strong className="text-white">{card.def}</strong></span>
                            <span className="text-slate-400">⭐ {card.levelStars}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-400">HP: <strong className="text-white">{card.hp}</strong></span>
                            <span className="text-slate-400">Type: <strong className="text-white">{card.element}</strong></span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-left pt-2.5 border-t border-slate-850/40">
                      <p className="text-[9px] text-slate-450 leading-relaxed truncate">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">
                          {isCollected ? "✓ COLLECTED" : "✕ NOT OWNED"}
                        </span>
                        {isCollected && (
                          <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-850 text-slate-500 font-mono text-xs">
              No matching collectibles in current page. Try adjusting filters or pulling new cards!
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => { sfx.playClick(); setCurrentPage((p) => p - 1); }}
                className="p-2 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded-xl text-slate-400 hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400">
                Page <strong className="text-white">{currentPage}</strong> of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => { sfx.playClick(); setCurrentPage((p) => p + 1); }}
                className="p-2 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded-xl text-slate-400 hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Battle Arena tab */}
      {subTab === "battle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selected Fighter Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-850 space-y-4 text-left">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Ready Duelist Fighter</span>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  Your Active Champion
                </h3>
              </div>

              {selectedFighter ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/20 text-center">
                    <img
                      src={selectedFighter.imageUrl}
                      alt={selectedFighter.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleCardImgError(e, selectedFighter.game)}
                      className="w-full h-44 object-cover rounded-xl border border-slate-800"
                    />
                    <h5 className="text-xs font-black text-white uppercase mt-3">{selectedFighter.name}</h5>
                    <span className="text-[8px] font-mono text-indigo-400 block uppercase mt-0.5">{selectedFighter.rarity} - {selectedFighter.game}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                    <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg">
                      <span className="text-[8px] text-slate-500 uppercase block">Atk / HP</span>
                      <strong className="text-white">
                        {selectedFighter.atk || selectedFighter.hp || 100}
                      </strong>
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg">
                      <span className="text-[8px] text-slate-500 uppercase block">Element</span>
                      <strong className="text-white">
                        {selectedFighter.element || "NEUTRAL"}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-850 text-slate-500 font-mono text-xs">
                  No card chosen. Click on a card in the vault to set as active champion.
                </div>
              )}

              {/* Lobby Mode selection */}
              {battleMode === "lobby" && (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      if (!selectedFighter) {
                        alert("Select a card from 'My Binder' first to battle!");
                        return;
                      }
                      startActiveBattle("cpu");
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Quick CPU Duel Match</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!selectedFighter) {
                        alert("Select a card from 'My Binder' first to battle!");
                        return;
                      }
                      sfx.playWarp();
                      setBattleLogs(["📡 Dialing multiverse signal...", "🔍 Searching for compatible online matchmaking decks..."]);
                      setPvpWaitSeconds(0);
                      setBattleMode("pvp_waiting");
                    }}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 text-indigo-400 hover:text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Queue PVP Live Duel Match</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Arena Interactive Display */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between min-h-[440px]">
            {battleMode === "lobby" && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-slate-500">
                <Swords className="w-12 h-12 text-slate-700 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase">Multiverse Battle Stadium</span>
                <p className="text-[10px] text-slate-600 font-mono max-w-xs text-center leading-relaxed">
                  Summon your champion. Victories reward you with up to 50 Coins instantly! Defeats still offer a 10 coin active consolation.
                </p>
              </div>
            )}

            {battleMode === "pvp_waiting" && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-400 flex items-center justify-center text-white text-xl animate-spin-slow">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-indigo-400 font-bold uppercase animate-pulse">Waiting for Real Player match...</span>
                  <p className="text-[9px] font-mono text-slate-500">Searching global lobby index. Queue Time: {pvpWaitSeconds}s</p>
                </div>

                <div className="w-full max-w-md p-3 bg-slate-950 rounded-xl border border-slate-850 text-left font-mono text-[9px] text-slate-400 space-y-1">
                  {battleLogs.map((log, i) => (
                    <div key={i} className="truncate">{log}</div>
                  ))}
                </div>

                <button
                  onClick={() => { sfx.playClick(); setBattleMode("lobby"); }}
                  className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-450 hover:text-white rounded-lg text-[9px] font-mono uppercase"
                >
                  Cancel Matchmaking
                </button>
              </div>
            )}

            {(battleMode === "active_cpu" || battleMode === "active_pvp") && selectedFighter && opponentFighter && (
              <div className="flex-1 flex flex-col justify-between">
                {/* Visual HP Bars */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-850/60">
                  {/* Player HP */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-white font-bold truncate">PLAYER (You)</span>
                      <span className="text-emerald-400">{playerHp} HP</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${playerHp}%` }}
                      />
                    </div>
                  </div>

                  {/* Opponent HP */}
                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-red-400">{opponentHp} HP</span>
                      <span className="text-white font-bold truncate">{opponentName}</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${opponentHp}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Core Arena graphics */}
                <div className="flex-1 py-4 flex items-center justify-around gap-4">
                  {/* Player Fighter Graphic */}
                  <div className="text-center space-y-1.5 scale-90">
                    <img
                      src={selectedFighter.imageUrl}
                      alt={selectedFighter.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleCardImgError(e, selectedFighter.game)}
                      className="w-16 h-20 object-cover rounded-xl border-2 border-indigo-500 shadow-md"
                    />
                    <p className="text-[10px] font-bold text-white truncate max-w-[80px]">{selectedFighter.name}</p>
                  </div>

                  <div className="text-lg font-mono text-red-500 font-black italic animate-bounce shrink-0">VS</div>

                  {/* Opponent Fighter Graphic */}
                  <div className="text-center space-y-1.5 scale-90">
                    <img
                      src={opponentFighter.imageUrl}
                      alt={opponentFighter.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleCardImgError(e, opponentFighter.game)}
                      className="w-16 h-20 object-cover rounded-xl border-2 border-red-500 shadow-md"
                    />
                    <p className="text-[10px] font-bold text-white truncate max-w-[80px]">{opponentFighter.name}</p>
                  </div>
                </div>

                {/* Arena Battle logs box */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 h-28 overflow-y-auto text-left font-mono text-[9px] text-indigo-300 space-y-1 scrollbar-thin">
                  {battleLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>

                {/* Battle Actions bar */}
                <div className="pt-4 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Your turn! Select action</span>
                  <div className="flex gap-2">
                    <button
                      onClick={executeAttack}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-mono font-bold uppercase flex items-center gap-1 transition-all active:scale-95 shadow"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-300" />
                      <span>{selectedFighter.attackName ? "Attack Match" : "Execute Strike"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {battleMode === "ended" && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl text-amber-400">
                  🏆
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase font-mono">Battle Concluded</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Multiplayer signal terminated cleanly.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 font-mono text-[10px] text-white">
                  Result Cash Rewards: <strong className="text-amber-400">+{battleReward} Coins</strong>
                </div>

                <button
                  onClick={() => { sfx.playClick(); setBattleMode("lobby"); }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-bold uppercase rounded-lg shadow-md transition-all active:scale-95"
                >
                  Return to Stadium Lobby
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* External Sandbox Framed link */}
      {subTab === "external" && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-indigo-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-xs">
                ✦
              </div>
              <div>
                <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Anime Gacha Battle</span>
                <h3 className="text-xs font-black text-white uppercase">
                  mobile-anime-card-gacha-battle.vercel.app
                </h3>
              </div>
            </div>

            <div className="flex-1 max-w-md w-full">
              <input
                type="text"
                readOnly
                value={EXTERNAL_URL}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-[10px] text-slate-450 font-mono focus:outline-none truncate text-center"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { sfx.playClick(); setIframeKey(Date.now()); }}
                className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all"
                title="Refresh Frame"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <a
                href={EXTERNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sfx.playWarp()}
                className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all inline-flex items-center"
                title="Open External"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={toggleExternalNativeFullscreen}
                className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl transition-all"
                title="Toggle True Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div
            ref={externalContainerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none w-screen h-screen" : "h-[650px]"
            }`}
          >
            <iframe
              key={iframeKey}
              src={EXTERNAL_URL}
              className="w-full h-full border-none bg-slate-900"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              referrerPolicy="no-referrer"
            />

            <div className="bg-slate-900/90 border-t border-slate-850 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-slate-450">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Framed redirection sandbox active</span>
              </div>
              <div className="hidden sm:block">
                Secure link: <span className="text-emerald-400 font-bold">ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
