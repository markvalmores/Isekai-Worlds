export type PageView =
  | "home"
  | "community"
  | "achievements"
  | "wallpapers"
  | "gifs"
  | "cosplay"
  | "media"
  | "leaderboard"
  | "profile"
  | "vr"
  | "hardware"
  | "watch"
  | "radio"
  | "amv"
  | "games"
  | "roms"
  | "cards"
  | "vercel"
  | "cinemax";

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

export interface SocialAccounts {
  google?: { connected: boolean; email?: string; name?: string; avatar?: string };
  discord?: { connected: boolean; username?: string; id?: string; avatar?: string };
  github?: { connected: boolean; username?: string; avatar?: string };
  twitter?: { connected: boolean; handle?: string; avatar?: string };
  twitch?: { connected: boolean; username?: string; avatar?: string };
  reddit?: { connected: boolean; username?: string; avatar?: string };
}

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
  socialAccounts?: SocialAccounts;
  verifiedSocial?: boolean;
  loginMethod?: string;
  favoriteCosplayIds?: string[];
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
  sourceProvider?: "nekos.best" | "waifu.im" | "waifu.pics" | "anilist" | "all" | string;
  sourceUrl?: string;
  dominantColor?: string;
  score?: string;
  sourcePage?: number;
  width?: number;
  height?: number;
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
  ambientLightSync?: boolean;
  webAppWallpaperEnabled?: boolean;
  webAppWallpaperUrl?: string;
  webAppWallpaperType?: "video" | "image";
  webAppWallpaperOpacity?: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: "activity" | "games" | "media" | "social" | "master";
  rewardBadge: string;
  rewardAvatar?: string;
  rewardCoins: number;
  rewardTitle?: string;
  progress: number;
  target: number;
  unlocked: boolean;
  claimed: boolean;
  iconName: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  timestamp: string;
  content: string;
  likes: number;
  userLiked?: boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  authorTitle: string;
  channel: string;
  timestamp: string;
  content: string;
  mediaType?: "image" | "video" | "gif" | "none";
  mediaUrl?: string;
  tags: string[];
  taggedFriends?: string[];
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  reactions?: {
    heart?: number;
    fire?: number;
    laugh?: number;
    mindblown?: number;
  };
  commentsCount: number;
  comments?: CommunityComment[];
  isPinned?: boolean;
}

export interface CosplayItem {
  id: string;
  title: string;
  character: string;
  artist: string;
  imageUrl: string;
  thumbUrl: string;
  likes: number;
  series: string;
  source: string;
  tags: string[];
}


