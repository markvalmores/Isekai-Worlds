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
import { CosplayDashboard } from "./components/CosplayDashboard";
import { AchievementsDashboard } from "./components/AchievementsDashboard";
import { AniCommunity } from "./components/AniCommunity";
import { DailyLoginModal } from "./components/DailyLoginModal";
import { SmartTvRemote } from "./components/SmartTvRemote";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { CommandPaletteModal } from "./components/CommandPaletteModal";
import { LiveWallpaperModal } from "./components/LiveWallpaperModal";
import { generateRandomUserProfile } from "./utils/randomProfile";
import { FloatingLanguageWidget } from "./components/FloatingLanguageWidget";
import { SettingsModal } from "./components/SettingsModal";
import { DailyMissionsModal } from "./components/DailyMissionsModal";
import { DonationCreditsModal } from "./components/DonationCreditsModal";
import { SocialAuthModal } from "./components/SocialAuthModal";
import { VercelAppsDashboard } from "./components/VercelAppsDashboard";
import { Cookie, Check, Sparkles, Tv } from "lucide-react";

export default function App() {
  // Page View State
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPageName, setTargetPageName] = useState("Portal Hub");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isDonationsOpen, setIsDonationsOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isTvRemoteOpen, setIsTvRemoteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLiveWallpaperOpen, setIsLiveWallpaperOpen] = useState(false);
  const [isSocialAuthOpen, setIsSocialAuthOpen] = useState(false);

  // Admin God Mode State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isekai_admin_mode") === "true";
    } catch {
      return false;
    }
  });

  // First User Coin Bonus Check (3478 Coins)
  const [isFirstUser, setIsFirstUser] = useState<boolean>(() => {
    try {
      const hasVisited = localStorage.getItem("isekai_has_visited_before");
      if (!hasVisited) {
        localStorage.setItem("isekai_has_visited_before", "true");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Check if Daily Login Rewards Modal should auto-popup on first visit of the day
  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const lastLoginStr = localStorage.getItem("isekai_last_login_date");
      if (lastLoginStr !== todayStr || isFirstUser) {
        // First visit today! Trigger daily login modal
        const timer = setTimeout(() => {
          setIsDailyOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

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
    const newRandomProfile = generateRandomUserProfile();
    localStorage.setItem("isekai_user_profile", JSON.stringify(newRandomProfile));
    return newRandomProfile;
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
      community: "AniCommunity Feed",
      achievements: "Milestones & Achievements",
      wallpapers: "4K Anime Wallpapers",
      gifs: "Anime GIFs & Reactions",
      cosplay: "Cosplay & Costume Vault",
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
      cards: "Anime Card Games Arena",
      vercel: "Vercel APPs & Games"
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

  // Cloud Sync state and handlers
  const [syncKey, setSyncKey] = useState<string>(() => {
    try {
      return localStorage.getItem("isekai_sync_key") || "";
    } catch {
      return "";
    }
  });

  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => {
    try {
      return localStorage.getItem("isekai_last_synced") || "";
    } catch {
      return "";
    }
  });

  const handleCloudSave = async (key: string): Promise<{ success: boolean; message: string; lastSynced?: string }> => {
    const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanKey) {
      return { success: false, message: "Invalid key format." };
    }

    try {
      // Read custom AMV playlist from localStorage
      let amvPlaylist = [];
      try {
        const savedPlaylist = localStorage.getItem("isekai_amv_playlist");
        if (savedPlaylist) amvPlaylist = JSON.parse(savedPlaylist);
      } catch (e) {
        console.warn("Failed to read AMV playlist for cloud sync:", e);
      }

      // Read custom AMV playlist ID
      const amvPlaylistId = localStorage.getItem("isekai_amv_playlist_id") || "PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu";

      // Read card inventory
      let inventory = [];
      try {
        const savedInv = localStorage.getItem("isekai_card_inventory");
        if (savedInv) inventory = JSON.parse(savedInv);
      } catch (e) {}

      // Read game comments
      let gameComments = null;
      try {
        const savedComms = localStorage.getItem("isekai_game_comments");
        if (savedComms) gameComments = JSON.parse(savedComms);
      } catch (e) {}

      // Read saved wallpapers, gifs, watch history
      let savedWallpapers = null;
      let savedGifs = null;
      let watchHistory = null;
      try {
        const sw = localStorage.getItem("isekai_saved_wallpapers");
        if (sw) savedWallpapers = JSON.parse(sw);
        const sg = localStorage.getItem("isekai_saved_gifs");
        if (sg) savedGifs = JSON.parse(sg);
        const wh = localStorage.getItem("isekai_watch_history");
        if (wh) watchHistory = JSON.parse(wh);
      } catch (e) {}

      const res = await fetch("/api/sync/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syncKey: cleanKey,
          profile,
          settings,
          amvPlaylist,
          amvPlaylistId,
          activeSeconds,
          inventory,
          gameComments,
          savedWallpapers,
          savedGifs,
          watchHistory
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("isekai_sync_key", cleanKey);
        localStorage.setItem("isekai_last_synced", data.lastSynced);
        setSyncKey(cleanKey);
        setLastSyncedTime(data.lastSynced);
        return { success: true, message: data.message, lastSynced: data.lastSynced };
      } else {
        return { success: false, message: data.error || "Failed to save state to server." };
      }
    } catch (err: any) {
      console.error("Cloud sync save fetch error:", err);
      return { success: false, message: err.message || "Network error occurred." };
    }
  };

  const handleCloudLoad = async (key: string): Promise<{ success: boolean; error?: string }> => {
    const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanKey) {
      return { success: false, error: "Invalid key format." };
    }

    try {
      const res = await fetch(`/api/sync/load?syncKey=${encodeURIComponent(cleanKey)}`);
      const resJson = await res.json();

      if (res.ok && resJson.success && resJson.data) {
        const payload = resJson.data;

        // Apply to localStorage & React state
        if (payload.profile) {
          localStorage.setItem("isekai_user_profile", JSON.stringify(payload.profile));
          setProfile(payload.profile);
        }
        if (payload.settings) {
          localStorage.setItem("isekai_app_settings", JSON.stringify(payload.settings));
          setSettings(payload.settings);
        }
        if (payload.amvPlaylist) {
          localStorage.setItem("isekai_amv_playlist", JSON.stringify(payload.amvPlaylist));
        }
        if (payload.amvPlaylistId) {
          localStorage.setItem("isekai_amv_playlist_id", payload.amvPlaylistId);
        }
        if (payload.inventory) {
          localStorage.setItem("isekai_card_inventory", JSON.stringify(payload.inventory));
        }
        if (payload.gameComments) {
          localStorage.setItem("isekai_game_comments", JSON.stringify(payload.gameComments));
        }
        if (payload.savedWallpapers) {
          localStorage.setItem("isekai_saved_wallpapers", JSON.stringify(payload.savedWallpapers));
        }
        if (payload.savedGifs) {
          localStorage.setItem("isekai_saved_gifs", JSON.stringify(payload.savedGifs));
        }
        if (payload.watchHistory) {
          localStorage.setItem("isekai_watch_history", JSON.stringify(payload.watchHistory));
        }
        if (typeof payload.activeSeconds === "number") {
          localStorage.setItem("isekai_active_seconds", payload.activeSeconds.toString());
          setActiveSeconds(payload.activeSeconds);
        }

        localStorage.setItem("isekai_sync_key", cleanKey);
        localStorage.setItem("isekai_last_synced", payload.lastSynced || new Date().toISOString());
        setSyncKey(cleanKey);
        setLastSyncedTime(payload.lastSynced || new Date().toISOString());

        return { success: true };
      } else {
        return { success: false, error: resJson.error || "No sync data found for this key." };
      }
    } catch (err: any) {
      console.error("Cloud sync load fetch error:", err);
      return { success: false, error: err.message || "Network error occurred." };
    }
  };

  // On mount, auto-sync from cloud if a sync key exists
  useEffect(() => {
    const savedSyncKey = localStorage.getItem("isekai_sync_key");
    if (savedSyncKey) {
      fetch(`/api/sync/load?syncKey=${encodeURIComponent(savedSyncKey)}`)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.success && resJson.data) {
            const payload = resJson.data;
            if (payload.profile) {
              setProfile(payload.profile);
              localStorage.setItem("isekai_user_profile", JSON.stringify(payload.profile));
            }
            if (payload.settings) {
              setSettings(payload.settings);
              localStorage.setItem("isekai_app_settings", JSON.stringify(payload.settings));
            }
            if (payload.amvPlaylistId) {
              localStorage.setItem("isekai_amv_playlist_id", payload.amvPlaylistId);
            }
            if (typeof payload.activeSeconds === "number") {
              setActiveSeconds(payload.activeSeconds);
              localStorage.setItem("isekai_active_seconds", payload.activeSeconds.toString());
            }
            if (payload.lastSynced) {
              setLastSyncedTime(payload.lastSynced);
              localStorage.setItem("isekai_last_synced", payload.lastSynced);
            }
            console.log("Auto-synced successfully from cloud on mount!");
          }
        })
        .catch((err) => console.warn("Auto-sync on mount failed:", err));
    }
  }, []);

  // Whenever profile or settings changes, auto-save to cloud if a sync key is set (debounced)
  useEffect(() => {
    if (syncKey) {
      const timer = setTimeout(() => {
        handleCloudSave(syncKey);
      }, 2000); // 2s debounce to avoid excessive writes
      return () => clearTimeout(timer);
    }
  }, [profile, settings]);

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

  // Keyboard Shortcut Handler (Cmd+K / Ctrl+K Command Palette & Escape Close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sfx.playWarp();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSettingsOpen(false);
        setIsMissionsOpen(false);
        setIsDonationsOpen(false);
        setIsCommandPaletteOpen(false);
        setIsLiveWallpaperOpen(false);
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
      {/* Custom Web App Live Wallpaper Background Engine (MP4, GIF, JPG, PNG Loop) */}
      {settings.webAppWallpaperEnabled && settings.webAppWallpaperUrl && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {settings.webAppWallpaperType === "video" ? (
            <video
              src={settings.webAppWallpaperUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90 contrast-110"
            />
          ) : (
            <img
              src={settings.webAppWallpaperUrl}
              alt="Live Web App Background"
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90 contrast-110"
            />
          )}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        </div>
      )}

      {/* Background Ambient Light Sync Halo Glows (Gold or Blue-Violet-Red) */}
      {settings.ambientLightSync !== false && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {isGold ? (
            <>
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/30 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-yellow-400/25 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-600/30 rounded-full blur-[120px] animate-pulse" />
            </>
          ) : (
            <>
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
            </>
          )}
        </div>
      )}

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
        openDailyModal={() => setIsDailyOpen(true)}
        openAdminModal={() => setIsAdminOpen(true)}
        openTvRemote={() => setIsTvRemoteOpen(!isTvRemoteOpen)}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        openLiveWallpaperModal={() => setIsLiveWallpaperOpen(true)}
        openSocialAuthModal={() => setIsSocialAuthOpen(true)}
        isAdmin={isAdmin}
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

        {currentPage === "community" && (
          <AniCommunity
            userProfile={profile}
            isGoldMode={isGold}
          />
        )}

        {currentPage === "achievements" && (
          <AchievementsDashboard
            userProfile={profile}
            updateProfile={updateProfile}
            activeSeconds={activeSeconds}
            isekaiCoins={settings.isekaiCoins}
            onAddCoins={handleAddCoins}
            isGoldMode={isGold}
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

        {currentPage === "cosplay" && (
          <CosplayDashboard
            onAddCoins={handleAddCoins}
            isGoldMode={isGold}
          />
        )}

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
            openSocialAuthModal={() => setIsSocialAuthOpen(true)}
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
          <RadioGagaAMV onCloudSave={handleCloudSave} syncKey={syncKey} />
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
            isAdmin={isAdmin}
          />
        )}

        {currentPage === "vercel" && (
          <VercelAppsDashboard
            userProfile={profile}
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
        syncKey={syncKey}
        setSyncKey={setSyncKey}
        lastSyncedTime={lastSyncedTime}
        onCloudSave={handleCloudSave}
        onCloudLoad={handleCloudLoad}
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

      {/* Daily Login Rewards Modal */}
      <DailyLoginModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        onClaimCoins={(amt, reason) => {
          handleAddCoins(amt);
          handleCloudSave(syncKey || "default-user");
        }}
        isFirstUser={isFirstUser}
      />

      {/* Smart TV Remote Control Panel */}
      <SmartTvRemote
        isOpen={isTvRemoteOpen}
        onClose={() => setIsTvRemoteOpen(false)}
        activeTab={currentPage}
        setActiveTab={handlePageChange}
        tabsList={[
          { id: "home", label: "Portal Hub" },
          { id: "community", label: "AniCommunity" },
          { id: "achievements", label: "Achievements" },
          { id: "wallpapers", label: "Wallpapers" },
          { id: "gifs", label: "GIFs" },
          { id: "cosplay", label: "Cosplay" },
          { id: "media", label: "Streams" },
          { id: "watch", label: "Watch Anime" },
          { id: "games", label: "Arcade Games" },
          { id: "cards", label: "Cards Arena" }
        ]}
      />

      {/* Executive Admin Portal Modal */}
      <AdminLoginModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onAddCoins={(amt) => handleAddCoins(amt)}
        onUnlockAllCards={() => {
          // Unlock all cards in card inventory
          const ALL_CARDS = [
            "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12"
          ];
          localStorage.setItem("isekai_card_inventory", JSON.stringify(ALL_CARDS));
          alert("All 12 Legendary Anime Cards unlocked in Gacha Inventory!");
        }}
      />

      {/* Global Command Palette Modal (Cmd+K / Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        settings={settings}
        updateSettings={updateSettings}
        onClearCache={clearCache}
        openSettingsModal={() => setIsSettingsOpen(true)}
        openDailyModal={() => setIsDailyOpen(true)}
        openAdminModal={() => setIsAdminOpen(true)}
        openTvRemote={() => setIsTvRemoteOpen(!isTvRemoteOpen)}
      />

      {/* Web App Live & Custom Wallpaper Engine Modal */}
      <LiveWallpaperModal
        isOpen={isLiveWallpaperOpen}
        onClose={() => setIsLiveWallpaperOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
      />

      {/* Social Media Sign-In & Verification Modal */}
      <SocialAuthModal
        isOpen={isSocialAuthOpen}
        onClose={() => setIsSocialAuthOpen(false)}
        userProfile={profile}
        updateProfile={updateProfile}
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

