import React from "react";
import { PageView, LanguageCode, UserProfile, AppSettings } from "../types";
import { SUPPORTED_LANGUAGES, getTranslation } from "../utils/i18n";
import { sfx } from "../utils/sfx";
import {
  Sparkles,
  Globe,
  Tv,
  Eye,
  Settings,
  Cpu,
  Trophy,
  Image as ImageIcon,
  Film,
  Tv2,
  UserCheck,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  Coins,
  Crown,
  Heart,
  RefreshCw,
  Gift,
  Radio,
  Gamepad2,
  HardDrive,
  Layers,
  Camera,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Radio as RemoteIcon,
  Award,
  MessageSquare
} from "lucide-react";

interface HeaderProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  activeSeconds: number;
  userRank: number;
  profile: UserProfile;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  openSettingsModal: () => void;
  openMissionsModal: () => void;
  openDonationsModal: () => void;
  openDailyModal?: () => void;
  openAdminModal?: () => void;
  openTvRemote?: () => void;
  openCommandPalette?: () => void;
  openLiveWallpaperModal?: () => void;
  openSocialAuthModal?: () => void;
  isAdmin?: boolean;
  liveActiveUsers?: number;
  liveTotalVisits?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  activeSeconds,
  userRank,
  profile,
  settings,
  updateSettings,
  openSettingsModal,
  openMissionsModal,
  openDonationsModal,
  openDailyModal,
  openAdminModal,
  openTvRemote,
  openCommandPalette,
  openLiveWallpaperModal,
  openSocialAuthModal,
  isAdmin = false,
  liveActiveUsers = 1,
  liveTotalVisits = 1,
}) => {
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const navItems: { id: PageView; labelKey: string; icon: React.ReactNode }[] = [
    { id: "home", labelKey: "home", icon: <Compass className="w-4 h-4" /> },
    { id: "community", labelKey: "community", icon: <MessageSquare className="w-4 h-4 text-purple-400" /> },
    { id: "achievements", labelKey: "achievements", icon: <Award className="w-4 h-4 text-amber-400" /> },
    { id: "wallpapers", labelKey: "wallpapers", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "gifs", labelKey: "gifs", icon: <Film className="w-4 h-4" /> },
    { id: "cosplay", labelKey: "cosplay", icon: <Camera className="w-4 h-4 text-pink-400" /> },
    { id: "media", labelKey: "media", icon: <Tv2 className="w-4 h-4" /> },
    { id: "watch", labelKey: "watch", icon: <Tv className="w-4 h-4" /> },
    { id: "radio", labelKey: "radio", icon: <Radio className="w-4 h-4" /> },
    { id: "amv", labelKey: "amv", icon: <Sparkles className="w-4 h-4 text-rose-500" /> },
    { id: "games", labelKey: "games", icon: <Gamepad2 className="w-4 h-4 text-emerald-400" /> },
    { id: "roms", labelKey: "roms", icon: <HardDrive className="w-4 h-4 text-purple-400" /> },
    { id: "cards", labelKey: "cards", icon: <Layers className="w-4 h-4 text-amber-400 animate-pulse" /> },
    { id: "vercel", labelKey: "vercel", icon: <Globe className="w-4 h-4 text-cyan-400 animate-pulse" /> },
    { id: "leaderboard", labelKey: "leaderboard", icon: <Trophy className="w-4 h-4" /> },
    { id: "profile", labelKey: "profile", icon: <UserCheck className="w-4 h-4" /> },
    { id: "vr", labelKey: "vr", icon: <Eye className="w-4 h-4" /> },
    { id: "hardware", labelKey: "hardware", icon: <Cpu className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PageView) => {
    sfx.playClick();
    setCurrentPage(page);
  };

  const isGold = settings.isGoldMode;

  const navScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  React.useEffect(() => {
    if (navScrollRef.current) {
      const activeEl = navScrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [currentPage]);

  const scrollNav = (direction: "left" | "right") => {
    sfx.playClick();
    if (navScrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      navScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-500 border-b ${
      isGold
        ? "bg-slate-950/90 border-amber-500/50 shadow-[0_4px_30px_rgba(245,158,11,0.25)]"
        : "bg-slate-950/80 border-indigo-500/20 shadow-[0_4px_30px_rgba(79,70,229,0.15)]"
    }`}>
      {/* Top Notification / Specs Bar */}
      <div className={`text-xs px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b transition-all ${
        isGold
          ? "bg-gradient-to-r from-amber-950/80 via-yellow-950/80 to-amber-950/80 border-amber-500/30 text-amber-200"
          : "bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-red-900/60 border-purple-500/10 text-slate-300"
      }`}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <span>{liveActiveUsers} Active Right Now</span>
          </span>

          <span className="inline-flex items-center gap-1 text-cyan-300 font-mono font-semibold bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-full">
            <Eye className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>{liveTotalVisits} Total Visits</span>
          </span>

          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline font-mono text-purple-300">
            {getTranslation(settings.language, "timeLogged")} <strong className="text-white">{formatTime(activeSeconds)}</strong>
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="font-mono text-amber-300">
            {getTranslation(settings.language, "rank")} <strong className="text-amber-400">#{userRank > 0 ? userRank : "100+"}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono">
          {/* Custom Web App Live Wallpaper Engine Button */}
          {openLiveWallpaperModal && (
            <button
              onClick={() => {
                sfx.playWarp();
                openLiveWallpaperModal();
              }}
              className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full font-bold transition-all hover:scale-105 shadow-sm ${
                settings.webAppWallpaperEnabled
                  ? "bg-purple-600 border border-purple-400 text-white animate-pulse shadow-purple-600/40"
                  : "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30"
              }`}
              title="Change Custom Web App Wallpapers & Live Backgrounds (MP4, GIF, 4K)"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Wallpaper</span>
            </button>
          )}

          {/* Daily Login Rewards Button */}
          {openDailyModal && (
            <button
              onClick={() => {
                sfx.playClick();
                openDailyModal();
              }}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 hover:scale-105 transition-all font-bold animate-pulse"
              title="Claim Daily Login Bonus"
            >
              <Gift className="w-3.5 h-3.5 text-indigo-400" />
              <span>Daily Rewards</span>
            </button>
          )}

          {/* Smart TV Remote Button */}
          {openTvRemote && (
            <button
              onClick={() => {
                sfx.playClick();
                openTvRemote();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 hover:scale-105 transition-all font-bold"
              title="Open Smart TV Remote Controls"
            >
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">TV Remote</span>
            </button>
          )}

          {/* Login as Admin Button */}
          {openAdminModal && (
            <button
              onClick={() => {
                sfx.playClick();
                openAdminModal();
              }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold transition-all ${
                isAdmin
                  ? "bg-red-500 border border-red-400 text-slate-950 animate-bounce shadow-md"
                  : "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
              }`}
              title="Admin Access & God Mode"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? "ADMIN ACTIVE" : "Login as Admin"}</span>
            </button>
          )}

          {/* Daily Missions & Coins Button */}
          <button
            onClick={() => {
              sfx.playClick();
              openMissionsModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:scale-105 transition-all font-bold"
            title="Daily Missions & Earn Isekai Coins"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{settings.isekaiCoins} Coins</span>
            <Gift className="w-3 h-3 text-yellow-300" />
          </button>

          {/* Support / Donations Button */}
          <button
            onClick={() => {
              sfx.playClick();
              openDonationsModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 hover:scale-105 transition-all font-bold"
            title="Donate & View Credits"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30" />
            <span className="hidden sm:inline">Donate & Credits</span>
          </button>

          {/* Auto Reload & Fix Button */}
          <button
            onClick={() => {
              sfx.playBadgeUnlock();
              window.location.reload();
            }}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-300 font-bold"
            title="Auto Reload & Self-Heal App"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Auto Fix</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sfx.playClick();
              updateSettings({ sfxEnabled: !settings.sfxEnabled });
            }}
            className="hover:text-white transition-colors flex items-center gap-1"
            title="Toggle Interface SFX"
          >
            {settings.sfxEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden lg:inline">{settings.sfxEnabled ? "SFX On" : "Mute"}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo with Gold / Rainbow Gradient */}
        <div
          onClick={() => handleNavClick("home")}
          className="cursor-pointer group flex items-center gap-2 sm:gap-3 select-none shrink-0"
        >
          <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl p-[2px] shadow-lg transition-all duration-300 ${
            isGold
              ? "bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 shadow-amber-500/50"
              : "bg-gradient-to-tr from-blue-600 via-purple-600 to-red-600 shadow-purple-500/30 group-hover:shadow-rose-500/50"
          }`}>
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
              <img
                src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4c755e0f-f925-4948-89de-e05d40d0d2ef/df45l8a-ccb2750e-0c08-4ed6-be91-3c33889d3c26.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi80Yzc1NWUwZi1mOTI1LTQ5NDgtODlkZS1lMDVkNDBkMGQyZWYvZGY0NWw4YS1jY2IyNzUwZS0wYzA4LTRlZDYtYmU5MS0zYzMzODg5ZDNjMjYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.86n9Lyf9AfBbnCLqXa7mVYEE9aTv_9qu409TdePxhBU"
                alt="Isekai Worlds Logo"
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-yellow-500/20 to-amber-500/20 animate-pulse"></div>
            </div>
          </div>

          <div className="hidden sm:flex flex-col min-w-0">
            <h1 className={`text-sm lg:text-lg font-black tracking-wider uppercase bg-clip-text text-transparent flex items-center gap-1 truncate ${
              isGold
                ? "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]"
                : "bg-gradient-to-r from-blue-400 via-purple-300 to-red-400 drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)]"
            }`}>
              <span>Isekai Worlds</span> {isGold && <Crown className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />}
            </h1>
            <span className={`text-[9px] font-mono tracking-widest uppercase -mt-0.5 truncate ${
              isGold ? "text-amber-300" : "text-indigo-300"
            }`}>
              {isGold ? "Gold Portal" : "Anime Multiverse"}
            </span>
          </div>
        </div>

        {/* Side-Scrollable Tabs Bar with Left and Right Navigation Controls */}
        <div className="relative flex items-center gap-1 flex-1 min-w-0 mx-1 sm:mx-2">
          {/* Left Scroll Arrow Button */}
          <button
            onClick={() => scrollNav("left")}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded-xl border font-bold transition-all shrink-0 z-10 ${
              canScrollLeft
                ? "bg-purple-600/30 hover:bg-purple-600/60 border-purple-400 text-purple-200 shadow-md shadow-purple-600/30 hover:scale-105 cursor-pointer"
                : "bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-40"
            }`}
            title="Scroll Tabs Left"
            aria-label="Scroll Tabs Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Tabs Track */}
          <nav
            ref={navScrollRef}
            onScroll={checkScroll}
            className={`flex items-center gap-1.5 p-1 sm:p-1.5 rounded-2xl border overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 ${
              isGold
                ? "bg-amber-950/40 border-amber-500/30"
                : "bg-slate-900/60 border-indigo-500/20"
            }`}
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => sfx.playHover()}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 select-none whitespace-nowrap shrink-0 ${
                    isActive
                      ? isGold
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold shadow-md shadow-amber-900/50 scale-[1.02]"
                        : "bg-gradient-to-r from-blue-600 via-violet-600 to-red-600 text-white shadow-md shadow-purple-900/50 scale-[1.02]"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  {item.icon}
                  <span>{getTranslation(settings.language, item.labelKey)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Scroll Arrow Button */}
          <button
            onClick={() => scrollNav("right")}
            disabled={!canScrollRight}
            className={`p-1.5 rounded-xl border font-bold transition-all shrink-0 z-10 ${
              canScrollRight
                ? "bg-purple-600/30 hover:bg-purple-600/60 border-purple-400 text-purple-200 shadow-md shadow-purple-600/30 hover:scale-105 cursor-pointer"
                : "bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-40"
            }`}
            title="Scroll Tabs Right"
            aria-label="Scroll Tabs Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* User Actions & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Gold Mode Indicator Toggle */}
          <button
            onClick={() => {
              sfx.playWarp();
              updateSettings({ isGoldMode: !settings.isGoldMode });
            }}
            className={`hidden md:flex p-1.5 sm:p-2 rounded-xl border font-mono text-xs font-bold items-center gap-1.5 transition-all ${
              isGold
                ? "bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30"
                : "bg-slate-900 text-slate-400 border-indigo-500/30 hover:text-amber-300"
            }`}
            title="Toggle Gold Premium Mode"
          >
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="hidden md:inline">{isGold ? "Gold ON" : "Gold"}</span>
          </button>

          {/* Quick Language Selector */}
          <div className="relative group shrink-0 hidden md:block">
            <select
              value={settings.language}
              onChange={(e) => {
                sfx.playClick();
                updateSettings({ language: e.target.value as LanguageCode });
              }}
              className="appearance-none bg-slate-900/80 hover:bg-slate-800 text-[11px] sm:text-xs text-slate-200 border border-purple-500/30 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 font-mono cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all max-w-[95px] sm:max-w-[130px] truncate"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
            <Globe className="w-3.5 h-3.5 text-purple-400 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Social Auth Login / Verification Button */}
          {openSocialAuthModal && (
            <button
              onClick={() => {
                sfx.playClick();
                openSocialAuthModal();
              }}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border text-xs font-mono font-bold transition-all shrink-0 shadow-sm ${
                profile.verifiedSocial
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900"
                  : "bg-indigo-950/80 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900"
              }`}
              title="Social Sign-In & Connected Accounts"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${profile.verifiedSocial ? "text-emerald-400" : "text-indigo-400"}`} />
              <span className="hidden xl:inline">{profile.verifiedSocial ? "Verified" : "Social Login"}</span>
            </button>
          )}

          {/* User Profile Pill */}
          <button
            onClick={() => handleNavClick("profile")}
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 p-1 sm:p-1.5 pr-1.5 sm:pr-2.5 rounded-2xl border border-indigo-500/30 hover:border-indigo-400 transition-all shrink-0"
            title="Open Profile Dashboard"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl object-cover ring-2 ${isGold ? "ring-amber-400" : "ring-purple-500/40"}`}
            />
            <span className="hidden lg:inline text-xs font-bold text-slate-200 truncate max-w-[70px] lg:max-w-[90px]">
              {profile.username}
            </span>
          </button>

          {/* Live Wallpaper Quick Engine Button */}
          {openLiveWallpaperModal && (
            <button
              onClick={() => {
                sfx.playWarp();
                openLiveWallpaperModal();
              }}
              className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shrink-0 shadow-md ${
                settings.webAppWallpaperEnabled
                  ? "bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border-purple-400/60 shadow-purple-600/20"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-750"
              }`}
              title="Change Custom Web App Wallpapers & Live Backgrounds (MP4, GIF, 4K)"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Wallpaper</span>
            </button>
          )}

          {/* Command Palette Launcher Button */}
          {openCommandPalette && (
            <button
              onClick={() => {
                sfx.playClick();
                openCommandPalette();
              }}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/90 hover:bg-purple-900/40 text-slate-300 hover:text-white rounded-xl border border-purple-500/30 hover:border-purple-400 text-xs font-mono font-bold transition-all shrink-0 shadow-sm"
              title="Open Command Palette (Cmd+K)"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Cmd+K</span>
            </button>
          )}

          {/* System Settings Button */}
          <button
            onClick={() => {
              sfx.playClick();
              openSettingsModal();
            }}
            className="p-1.5 sm:p-2 bg-slate-900/80 hover:bg-indigo-900/50 text-slate-300 hover:text-white rounded-xl border border-indigo-500/30 transition-all shrink-0"
            title="Open Settings"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

