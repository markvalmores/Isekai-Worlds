export type PageView = "home" | "wallpapers" | "gifs" | "media" | "leaderboard" | "profile" | "vr" | "hardware" | "watch" | "radio" | "amv" | "games" | "roms" | "cards";

export type LanguageCode =
  | "en"
  | "ja"
  | "es"
  | "fr"
  | "de"
  | "tag"
  | "ko"
  | "zh"
  | "it"
  | "pt"
  | "ru"
  | "ar"
  | "hi";

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  title: string;
  badge: string;
  customStatus: string;
  bannerGradient: string;
  accentColor: string;
  country: string;
  joinedDate: string;
  favAnime: string;
}

export interface LeaderboardEntry {
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

export interface AnimeWallpaper {
  id: string;
  title: string;
  category: string;
  url: string;
  thumb: string;
  tags: string[];
  resolution: string;
  author: string;
  likes?: number;
}

export interface AnimeGif {
  id: string;
  title: string;
  url: string;
  previewUrl?: string;
  category: string;
  character: string;
  source?: string;
}

export interface HardwareConfig {
  rtxEnabled: boolean;
  pathTracingEnabled: boolean;
  aiFrameGenEnabled: boolean;
  targetFps: number;
  simulatedGpuTemp: number;
  simulatedGpuUsage: number;
  simulatedCpuUsage: number;
  vramUsedGb: number;
}

export interface Comment {
  id: string;
  targetId: string; // Wallpaper ID or Media ID
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  iconName: string;
}

export interface AppSettings {
  darkMode: boolean;
  sfxEnabled: boolean;
  sfxVolume: number;
  cookiesAccepted: boolean;
  tvRemoteNavigationMode: boolean;
  language: LanguageCode;
  autoTranslate: boolean;
  reducedMotion: boolean;
  ambientSound: boolean;
  isGoldMode: boolean;
  isekaiCoins: number;
  unlockedGoldPermanently: boolean;
}

