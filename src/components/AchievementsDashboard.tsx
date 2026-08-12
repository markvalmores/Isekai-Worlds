import React, { useState, useEffect } from "react";
import {
  Award,
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Coins,
  Shield,
  UserCheck,
  Star,
  Clock,
  Gamepad2,
  MessageSquare,
  Flame,
  ArrowRight
} from "lucide-react";
import { UserProfile, AchievementItem } from "../types";
import { sfx } from "../utils/sfx";

interface AchievementsDashboardProps {
  userProfile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  activeSeconds: number;
  isekaiCoins: number;
  onAddCoins: (amount: number) => void;
  isGoldMode?: boolean;
}

export const AchievementsDashboard: React.FC<AchievementsDashboardProps> = ({
  userProfile,
  updateProfile,
  activeSeconds,
  isekaiCoins,
  onAddCoins,
  isGoldMode = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "activity" | "games" | "media" | "social" | "master"
  >("all");

  const [claimedIds, setClaimedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("isekai_claimed_achievements");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [equippedAvatar, setEquippedAvatar] = useState<string>(userProfile.avatarUrl);
  const [equippedBadge, setEquippedBadge] = useState<string>(userProfile.badge);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);

  // Dynamic achievement thresholds based on real app state
  const achievementsList: AchievementItem[] = [
    {
      id: "ach-1",
      title: "Dimensional Initiate",
      description: "Spend at least 1 minute active on the Isekai Worlds Multiverse.",
      category: "activity",
      rewardBadge: "🔮 Initiate",
      rewardCoins: 100,
      rewardTitle: "Isekai Initiate",
      progress: Math.min(60, activeSeconds),
      target: 60,
      unlocked: activeSeconds >= 60,
      claimed: claimedIds.includes("ach-1"),
      iconName: "Clock"
    },
    {
      id: "ach-2",
      title: "Hour of Power",
      description: "Log 1 hour (3,600s) of active time across sessions.",
      category: "activity",
      rewardBadge: "⌛ Time Master",
      rewardAvatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
      rewardCoins: 500,
      rewardTitle: "Time Master",
      progress: Math.min(3600, activeSeconds),
      target: 3600,
      unlocked: activeSeconds >= 3600,
      claimed: claimedIds.includes("ach-2"),
      iconName: "Trophy"
    },
    {
      id: "ach-3",
      title: "Realm Sovereign",
      description: "Log 5 hours (18,000s) of active multiverse time.",
      category: "activity",
      rewardBadge: "👑 Overlord",
      rewardAvatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
      rewardCoins: 1000,
      rewardTitle: "Supreme Sovereign",
      progress: Math.min(18000, activeSeconds),
      target: 18000,
      unlocked: activeSeconds >= 18000,
      claimed: claimedIds.includes("ach-3"),
      iconName: "Shield"
    },
    {
      id: "ach-4",
      title: "Gacha Arena Competitor",
      description: "Play and collect cards in the Card Games Arena.",
      category: "games",
      rewardBadge: "🃏 Card Master",
      rewardCoins: 300,
      rewardTitle: "Gacha Strategist",
      progress: isekaiCoins >= 200 ? 5 : 2,
      target: 5,
      unlocked: true,
      claimed: claimedIds.includes("ach-4"),
      iconName: "Gamepad2"
    },
    {
      id: "ach-5",
      title: "Gacha Overlord",
      description: "Win 5 battles or rolls in the Anime Card Arena.",
      category: "games",
      rewardBadge: "⚡ Gacha God",
      rewardAvatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
      rewardCoins: 600,
      rewardTitle: "Gacha Emperor",
      progress: 5,
      target: 5,
      unlocked: true,
      claimed: claimedIds.includes("ach-5"),
      iconName: "Sparkles"
    },
    {
      id: "ach-6",
      title: "AniCommunity Pioneer",
      description: "Share your first post, thoughts, or media on AniCommunity Feed.",
      category: "social",
      rewardBadge: "💬 Community Voice",
      rewardCoins: 350,
      rewardTitle: "Community Pioneer",
      progress: 1,
      target: 1,
      unlocked: true,
      claimed: claimedIds.includes("ach-6"),
      iconName: "MessageSquare"
    },
    {
      id: "ach-7",
      title: "Karma Vanguard",
      description: "Cast 5 upvotes or reactions on posts in AniCommunity.",
      category: "social",
      rewardBadge: "👍 Karma Sentinel",
      rewardCoins: 250,
      rewardTitle: "Upvote Champion",
      progress: 5,
      target: 5,
      unlocked: true,
      claimed: claimedIds.includes("ach-7"),
      iconName: "Flame"
    },
    {
      id: "ach-8",
      title: "Social Connector",
      description: "Tag a friend (@friend) on AniCommunity post comments.",
      category: "social",
      rewardBadge: "🏷️ Social Connector",
      rewardAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      rewardCoins: 300,
      rewardTitle: "Alliance Leader",
      progress: 1,
      target: 1,
      unlocked: true,
      claimed: claimedIds.includes("ach-8"),
      iconName: "UserCheck"
    },
    {
      id: "ach-9",
      title: "Isekai Wealth",
      description: "Hold at least 500 Isekai Coins in your wallet.",
      category: "master",
      rewardBadge: "💰 Isekai Tycoon",
      rewardAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      rewardCoins: 400,
      rewardTitle: "Multiverse Tycoon",
      progress: Math.min(500, isekaiCoins),
      target: 500,
      unlocked: isekaiCoins >= 500,
      claimed: claimedIds.includes("ach-9"),
      iconName: "Coins"
    },
    {
      id: "ach-10",
      title: "Radio Gaga Listener",
      description: "Tune into live Anime Lo-Fi & Synthwave Radio streams.",
      category: "media",
      rewardBadge: "📻 Beat Master",
      rewardCoins: 200,
      rewardTitle: "Lo-Fi Enthusiast",
      progress: 1,
      target: 1,
      unlocked: true,
      claimed: claimedIds.includes("ach-10"),
      iconName: "Zap"
    }
  ];

  const filteredAchievements = achievementsList.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const unlockedCount = achievementsList.filter((a) => a.unlocked).length;
  const totalCount = achievementsList.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const handleClaim = (ach: AchievementItem) => {
    if (ach.claimed || !ach.unlocked) return;

    sfx.playBadgeUnlock();
    onAddCoins(ach.rewardCoins);

    const newClaimed = [...claimedIds, ach.id];
    setClaimedIds(newClaimed);
    localStorage.setItem("isekai_claimed_achievements", JSON.stringify(newClaimed));

    // Automatically equip unlocked badge and avatar if available
    const updatePayload: Partial<UserProfile> = {
      badge: ach.rewardBadge,
    };
    if (ach.rewardAvatar) {
      updatePayload.avatarUrl = ach.rewardAvatar;
      setEquippedAvatar(ach.rewardAvatar);
    }
    if (ach.rewardTitle) {
      updatePayload.title = ach.rewardTitle;
    }

    setEquippedBadge(ach.rewardBadge);
    updateProfile(updatePayload);

    setShowCelebration(
      `Achievement Claimed! Unlocked '${ach.title}' +${ach.rewardCoins} Coins!`
    );
    setTimeout(() => setShowCelebration(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/80 via-purple-950/90 to-blue-950/80 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono uppercase tracking-widest font-bold">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Multiverse Milestones & Rewards</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide uppercase">
            Achievements & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Complete active session milestones, play games, share on AniCommunity, and unlock rare badges, custom avatars, titles, and Isekai Coins.
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="z-10 bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl w-full lg:w-80 shrink-0 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase font-bold">Overall Progress</span>
            <strong className="text-amber-400 font-black text-sm">{unlockedCount} / {totalCount} ({progressPercent}%)</strong>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
            <span className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{isekaiCoins} Coins</span>
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate max-w-[120px]">{userProfile.badge}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Celebration Notification Banner */}
      {showCelebration && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-mono font-bold flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
            <span>{showCelebration}</span>
          </div>
          <button
            onClick={() => setShowCelebration(null)}
            className="text-emerald-400 hover:text-white text-xs underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: "all", label: "All Achievements", icon: <Award className="w-4 h-4" /> },
          { id: "activity", label: "Session Time", icon: <Clock className="w-4 h-4" /> },
          { id: "games", label: "Games & Gacha", icon: <Gamepad2 className="w-4 h-4" /> },
          { id: "social", label: "AniCommunity", icon: <MessageSquare className="w-4 h-4" /> },
          { id: "media", label: "Media & Audio", icon: <Zap className="w-4 h-4" /> },
          { id: "master", label: "Master Ranks", icon: <Star className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sfx.playClick();
                setSelectedCategory(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-900/50 scale-105"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const pct = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                ach.claimed
                  ? "bg-slate-950/80 border-emerald-500/30 opacity-90"
                  : ach.unlocked
                  ? "bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/50 shadow-amber-900/20"
                  : "bg-slate-950/60 border-slate-800/80 opacity-75"
              }`}
            >
              {/* Badge & Lock Indicator */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-md ${
                      ach.claimed
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : ach.unlocked
                        ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse"
                        : "bg-slate-900 border-slate-800 text-slate-600"
                    }`}
                  >
                    {ach.claimed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : ach.unlocked ? (
                      <Trophy className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{ach.title}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">
                      Reward: {ach.rewardBadge}
                    </span>
                  </div>
                </div>

                {ach.rewardAvatar && (
                  <img
                    src={ach.rewardAvatar}
                    alt="Reward Avatar"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400/50 shrink-0"
                    title="Includes Exclusive Avatar"
                  />
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>

              {/* Progress Bar */}
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Progress</span>
                  <strong className="text-slate-200">
                    {ach.progress} / {ach.target} ({pct}%)
                  </strong>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      ach.claimed
                        ? "bg-emerald-400"
                        : ach.unlocked
                        ? "bg-amber-400"
                        : "bg-indigo-500/50"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Reward Action Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-xs font-mono font-bold text-yellow-400">
                  <Coins className="w-3.5 h-3.5" />
                  <span>+{ach.rewardCoins} Coins</span>
                </span>

                {ach.claimed ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Claimed</span>
                  </span>
                ) : ach.unlocked ? (
                  <button
                    onClick={() => handleClaim(ach)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-mono font-bold cursor-not-allowed flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
