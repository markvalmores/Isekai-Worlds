import React, { useEffect, useState } from "react";
import {
  PageView,
  LanguageCode,
  UserProfile,
  AppSettings,
  HardwareConfig
} from "./types";
import { sfx } from "./utils/sfx";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { PageTransitionModal } from "./components/PageTransitionModal";
import { HomeHeroView } from "./components/HomeHeroView";
import { WallpaperGallery } from "./components/WallpaperGallery";
import { GifGallery } from "./components/GifGallery";
import { MediaHub } from "./components/MediaHub";
import { GlobalLeaderboard } from "./components/GlobalLeaderboard";
import { ProfileDashboard } from "./components/ProfileDashboard";
import { VrViewPortal } from "./components/VrViewPortal";
import { HardwareEngine } from "./components/HardwareEngine";
import { WatchAnimePortal } from "./components/WatchAnimePortal";
import { RadioGaga } from "./components/RadioGaga";
import { RadioGagaAMV } from "./components/AmvDashboard";
import { PlayGamesDashboard } from "./components/PlayGamesDashboard";
import { RomsDashboard } from "./components/RomsDashboard";
import { CardGamesDashboard } from "./components/CardGamesDashboard";
import { FloatingLanguageWidget } from "./components/FloatingLanguageWidget";
import { SettingsModal } from "./components/SettingsModal";
import { DailyMissionsModal } from "./components/DailyMissionsModal";
import { DonationCreditsModal } from "./components/DonationCreditsModal";
import { Cookie, Check, Sparkles, Tv } from "lucide-react";

export default function App() {
  // Page View State
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPageName, setTargetPageName] = useState("Portal Hub");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isDonationsOpen, setIsDonationsOpen] = useState(false);

  // Active Time Logger State (In Seconds)
  const [activeSeconds, setActiveSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("isekai_active_seconds");
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [userRank, setUserRank] = useState<number>(1);
  const [liveActiveUsers, setLiveActiveUsers] = useState<number>(1);
  const [liveTotalVisits, setLiveTotalVisits] = useState<number>(1);
  const [watchIframeLoaded, setWatchIframeLoaded] = useState(false);

  // Generate or read persistent Session ID for telemetry
  const [sessionId] = useState<string>(() => {
    try {
      let saved = sessionStorage.getItem("isekai_session_id");
      if (!saved) {
        saved = "session-" + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem("isekai_session_id", saved);
      }
      return saved;
    } catch {
      return "session-guest-" + Math.random().toString(36).substring(2, 8);
    }
  });

  // Track Real Total Visit & Heartbeat Ping for Active Connected Users
  useEffect(() => {
    // 1. Record site visit on initial load
    fetch("/api/stats/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.totalVisits === "number") setLiveTotalVisits(data.totalVisits);
        if (typeof data.activeUsers === "number") setLiveActiveUsers(data.activeUsers);
      })
      .catch(() => {});

    // 2. Heartbeat ping every 10s to keep presence active
    const pingInterval = setInterval(() => {
      fetch("/api/stats/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.activeUsers === "number") setLiveActiveUsers(data.activeUsers);
          if (typeof data.totalVisits === "number") setLiveTotalVisits(data.totalVisits);
        })
        .catch(() => {});
    }, 10000);

    return () => clearInterval(pingInterval);
  }, [sessionId]);

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("isekai_user_profile");
      if (saved) return JSON.parse(saved);
    } catch {
      // Default
    }
    return {
      id: "u-player-1",
      username: "IsekaiTraveler",
      avatarUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
      bio: "Traversing through anime dimensions. S-Rank Adventurer and Isekai enthusiast.",
      title: "Chrono Dimension Hopper",
      badge: "S-Rank Hero",
      customStatus: "Exploring 4K Anime Wallpapers & Media Feeds...",
      bannerGradient: "from-blue-600 via-purple-600 to-red-600",
      accentColor: "#a855f7",
      country: "GLOBAL",
      joinedDate: "2026",
      favAnime: "Re:Zero / Sword Art Online"
    };
  });

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem("isekai_app_settings");
      if (saved) return JSON.parse(saved);
    } catch {
      // Default
    }
    return {
      darkMode: true,
      sfxEnabled: true,
      sfxVolume: 0.3,
      cookiesAccepted: false,
      tvRemoteNavigationMode: false,
      language: "en",
      autoTranslate: true,
      reducedMotion: false,
      ambientSound: false,
      isGoldMode: false,
      isekaiCoins: 120,
      unlockedGoldPermanently: false,
    };
  });

  // Hardware Engine Config State
  const [hardware, setHardware] = useState<HardwareConfig>({
    rtxEnabled: true,
    pathTracingEnabled: true,
    aiFrameGenEnabled: true,
    targetFps: 120,
    simulatedGpuTemp: 58,
    simulatedGpuUsage: 74,
    simulatedCpuUsage: 38,
    vramUsedGb: 8.4
  });

  // Active Session Timer Interval & Passive Coins Accumulation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSeconds((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem("isekai_active_seconds", next.toString());
        } catch {
          // Ignore
        }

        // Add 5 coins every 60 seconds online
        if (next % 60 === 0) {
          updateSettings({ isekaiCoins: (settings.isekaiCoins || 0) + 5 });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.isekaiCoins]);

  // Sync SFX Sound Manager
  useEffect(() => {
    sfx.setEnabled(settings.sfxEnabled);
  }, [settings.sfxEnabled]);

  // Handle Page Change with Transition Screen
  const handlePageChange = (page: PageView) => {
    if (page === currentPage) return;

    const names: Record<PageView, string> = {
      home: "Portal Hub",
      wallpapers: "4K Anime Wallpapers",
      gifs: "Anime GIFs & Reactions",
      media: "Live Anime Streams",
      leaderboard: "Global Leaderboards",
      profile: "Profile Dashboard",
      vr: "3D VR Portal Space",
      hardware: "RTX & AI Frame Gen Engine",
      watch: "Watch Anime Online",
      radio: "Radio Gaga Broadcast",
      amv: "Anime Music Videos",
      games: "Arcade Games Portal",
      roms: "Retro ROMs Vault",
      cards: "Anime Card Games Arena"
    };

    setTargetPageName(names[page] || "Isekai Realm");
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("isekai_user_profile", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("isekai_app_settings", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleAddCoins = (amount: number) => {
    updateSettings({ isekaiCoins: (settings.isekaiCoins || 0) + amount });
  };

  const updateHardware = (updates: Partial<HardwareConfig>) => {
    setHardware((prev) => ({ ...prev, ...updates }));
  };

  const clearCache = () => {
    try {
      localStorage.removeItem("isekai_active_seconds");
      localStorage.removeItem("isekai_user_profile");
      localStorage.removeItem("isekai_app_settings");
      setActiveSeconds(0);
      alert("System cache and local session cleared successfully!");
    } catch {
      // Ignore
    }
  };

  // Keyboard / Smart TV Remote D-Pad Navigation Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
        setIsMissionsOpen(false);
        setIsDonationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isGold = settings.isGoldMode;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden ${
        isGold ? "ring-4 ring-amber-400/60" : ""
      } ${settings.tvRemoteNavigationMode ? "ring-4 ring-rose-500/50" : ""}`}
    >
      {/* Background Ambient Glow (Gold or Blue-Violet-Red) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isGold ? (
          <>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/30 rounded-full blur-[120px]" />
            <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-yellow-400/25 rounded-full blur-[150px]" />
            <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-600/30 rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px]" />
            <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {/* Main Header Bar */}
      <Header
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        activeSeconds={activeSeconds}
        userRank={userRank}
        profile={profile}
        settings={settings}
        updateSettings={updateSettings}
        openSettingsModal={() => setIsSettingsOpen(true)}
        openMissionsModal={() => setIsMissionsOpen(true)}
        openDonationsModal={() => setIsDonationsOpen(true)}
        liveActiveUsers={liveActiveUsers}
        liveTotalVisits={liveTotalVisits}
      />

      {/* Main Page View Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {currentPage === "home" && (
          <HomeHeroView
            setCurrentPage={handlePageChange}
            settings={settings}
            profile={profile}
            activeSeconds={activeSeconds}
            userRank={userRank}
          />
        )}

        {currentPage === "wallpapers" && (
          <WallpaperGallery
            profile={profile}
            updateProfile={updateProfile}
            onAddCoins={handleAddCoins}
            isGoldMode={isGold}
          />
        )}

        {currentPage === "gifs" && <GifGallery />}

        {currentPage === "media" && (
          <MediaHub
            userProfile={profile}
            onAddCoins={handleAddCoins}
            isGoldMode={isGold}
          />
        )}

        {currentPage === "leaderboard" && (
          <GlobalLeaderboard
            userProfile={profile}
            userActiveSeconds={activeSeconds}
            liveActiveUsers={liveActiveUsers}
            liveTotalVisits={liveTotalVisits}
          />
        )}

        {currentPage === "profile" && (
          <ProfileDashboard
            profile={profile}
            updateProfile={updateProfile}
            activeSeconds={activeSeconds}
            userRank={userRank}
          />
        )}

        {currentPage === "vr" && <VrViewPortal />}

        {currentPage === "hardware" && (
          <HardwareEngine
            hardware={hardware}
            updateHardware={updateHardware}
          />
        )}

        {currentPage === "watch" && (
          <WatchAnimePortal />
        )}

        {currentPage === "radio" && (
          <RadioGaga />
        )}

        {currentPage === "amv" && (
          <RadioGagaAMV />
        )}

        {currentPage === "games" && (
          <PlayGamesDashboard
            onAddCoins={handleAddCoins}
            isGoldMode={isGold}
          />
        )}

        {currentPage === "roms" && (
          <RomsDashboard
            onAddCoins={handleAddCoins}
            isGoldMode={isGold}
          />
        )}

        {currentPage === "cards" && (
          <CardGamesDashboard
            onAddCoins={handleAddCoins}
            isGoldMode={isGold}
          />
        )}
      </main>

      {/* Page Switch Loading & Transition Screen */}
      <PageTransitionModal
        isLoading={isTransitioning}
        targetPageName={targetPageName}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        clearCache={clearCache}
      />

      {/* Daily Missions & Rewards Modal */}
      <DailyMissionsModal
        isOpen={isMissionsOpen}
        onClose={() => setIsMissionsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        activeSeconds={activeSeconds}
      />

      {/* Support & Donations Modal */}
      <DonationCreditsModal
        isOpen={isDonationsOpen}
        onClose={() => setIsDonationsOpen(false)}
        isGoldMode={isGold}
      />

      {/* Floating Cookie Consent Notification */}
      {!settings.cookiesAccepted && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 max-w-md p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            <Cookie className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-slate-300">
              Isekai Worlds uses cookies to persist active session times & profile settings.
            </span>
          </div>
          <button
            onClick={() => {
              sfx.playClick();
              updateSettings({ cookiesAccepted: true });
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-rose-600 text-white font-mono text-xs font-bold whitespace-nowrap shadow-md"
          >
            Accept
          </button>
        </div>
      )}

      {/* Floating Language Selector Widget */}
      <FloatingLanguageWidget
        settings={settings}
        updateSettings={updateSettings}
      />

      {/* Footer */}
      {currentPage !== "watch" && (
        <Footer
          settings={settings}
          updateSettings={updateSettings}
          setCurrentPage={handlePageChange}
          clearCache={clearCache}
          openDonationsModal={() => setIsDonationsOpen(true)}
        />
      )}
    </div>
  );
}

