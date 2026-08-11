import React, { useState, useEffect } from "react";
import { AppSettings } from "../types";
import { sfx } from "../utils/sfx";
import { Gift, Coins, Flame, CheckCircle2, Crown, Sparkles, Calendar, ShieldCheck, Zap, Award, Gauge } from "lucide-react";

interface DailyLoginBonusProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const STREAK_REWARDS = [
  { day: 1, reward: 20, label: "+20", mult: "1.0x" },
  { day: 2, reward: 40, label: "+40", mult: "1.2x" },
  { day: 3, reward: 60, label: "+60", mult: "1.5x" },
  { day: 4, reward: 80, label: "+80", mult: "1.8x" },
  { day: 5, reward: 100, label: "+100", mult: "2.0x" },
  { day: 6, reward: 150, label: "+150", mult: "2.2x" },
  { day: 7, reward: 250, label: "+250 👑", isGrand: true, mult: "2.5x MAX" },
];

export const DailyLoginBonus: React.FC<DailyLoginBonusProps> = ({
  settings,
  updateSettings,
}) => {
  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("isekai_login_streak");
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [lastClaimDate, setLastClaimDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem("isekai_last_claim_date");
    } catch {
      return null;
    }
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const canClaimToday = lastClaimDate !== todayStr;

  const handleClaimBonus = () => {
    if (!canClaimToday) return;

    // Determine current reward day (1-7)
    const currentDayIndex = ((streak - 1) % 7);
    const rewardItem = STREAK_REWARDS[currentDayIndex];

    sfx.playBadgeUnlock();

    // Award coins
    const newCoins = (settings.isekaiCoins || 0) + rewardItem.reward;
    updateSettings({ isekaiCoins: newCoins });

    // Update streak and last claim
    const nextStreak = streak >= 7 ? 1 : streak + 1;
    setStreak(nextStreak);
    setLastClaimDate(todayStr);

    try {
      localStorage.setItem("isekai_login_streak", nextStreak.toString());
      localStorage.setItem("isekai_last_claim_date", todayStr);
    } catch {
      // Ignore
    }
  };

  const activeDayIndex = Math.min(streak - 1, 6);
  const streakPercent = Math.min(100, Math.round(((streak) / 7) * 100));

  const getHeatTitle = (s: number) => {
    if (s >= 30) return { title: "COSMIC SUPERNOVA", color: "from-purple-500 to-rose-400 text-rose-300 border-rose-500/40" };
    if (s >= 14) return { title: "INFERNAL BLAZE", color: "from-amber-500 to-rose-500 text-amber-300 border-amber-500/40" };
    if (s >= 7) return { title: "FLAMING CROWN", color: "from-amber-400 to-yellow-300 text-yellow-200 border-yellow-400/40" };
    if (s >= 3) return { title: "EMBER BOOST", color: "from-orange-500 to-amber-400 text-orange-200 border-orange-400/40" };
    return { title: "SPARK IGNITION", color: "from-blue-500 to-indigo-400 text-indigo-200 border-indigo-400/40" };
  };

  const heat = getHeatTitle(streak);

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 border border-amber-500/40 shadow-2xl space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-rose-500 p-0.5 shadow-lg shadow-amber-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider font-mono text-white flex items-center gap-2">
              <span>Daily Login Bonus</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-gradient-to-r ${heat.color}`}>
                🔥 {streak} Day Streak ({heat.title})
              </span>
            </h4>
            <p className="text-[11px] text-amber-300/80">Log in daily to stack multipliers & unlock grand crown rewards!</p>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={handleClaimBonus}
          disabled={!canClaimToday}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold flex items-center gap-2 shadow-xl transition-all ${
            canClaimToday
              ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 hover:scale-105 cursor-pointer shadow-amber-500/30 animate-pulse"
              : "bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default"
          }`}
        >
          {canClaimToday ? (
            <>
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Claim Day {streak} (+{STREAK_REWARDS[activeDayIndex].reward})</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Claimed Today!</span>
            </>
          )}
        </button>
      </div>

      {/* DAILY STREAK VISUALIZER BAR & HEAT LEVEL GAUGE */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3 shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-300 font-bold flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-amber-400 animate-spin" />
            <span>STREAK MULTIPLIER VISUALIZER</span>
          </span>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Streak Shield Active (1 Token)</span>
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Current Streak Progress</span>
            <span className="text-amber-300 font-bold">{streakPercent}% to Next Level</span>
          </div>

          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-amber-500/30 relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-rose-500 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-1000 relative"
              style={{ width: `${streakPercent}%` }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.4)_0%,_transparent_100%)] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Streak Stats Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[11px]">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase">Active Heat Level</span>
            <span className="text-amber-300 font-bold">Lvl {Math.min(10, Math.floor(streak / 3) + 1)} Flame</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase">Coin Multiplier</span>
            <span className="text-emerald-400 font-bold">{STREAK_REWARDS[activeDayIndex].mult}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase">Streak Bonus</span>
            <span className="text-cyan-300 font-bold">+{streak * 10} Bonus XP</span>
          </div>
        </div>
      </div>

      {/* 7-Day Streak Calendar Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {STREAK_REWARDS.map((item, idx) => {
          const isPast = idx < activeDayIndex || (!canClaimToday && idx === activeDayIndex);
          const isCurrent = canClaimToday && idx === activeDayIndex;

          return (
            <div
              key={item.day}
              className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-1 transition-all relative overflow-hidden ${
                isCurrent
                  ? "bg-gradient-to-b from-amber-500/30 to-yellow-500/10 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 scale-105"
                  : isPast
                  ? "bg-slate-900/60 border-slate-800 text-slate-500"
                  : "bg-slate-950/80 border-indigo-500/20 text-slate-300"
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Day {item.day}
              </span>

              <div className="my-1">
                {item.isGrand ? (
                  <Crown className={`w-5 h-5 mx-auto ${isCurrent ? "text-amber-300 animate-bounce" : "text-amber-500/60"}`} />
                ) : (
                  <Coins className={`w-4 h-4 mx-auto ${isCurrent ? "text-amber-300 animate-bounce" : "text-amber-400/60"}`} />
                )}
              </div>

              <span className={`text-xs font-mono font-bold ${
                isCurrent ? "text-amber-200" : isPast ? "text-slate-500 line-through" : "text-slate-200"
              }`}>
                {item.label}
              </span>

              <span className="text-[9px] font-mono text-amber-400/80 block">
                {item.mult}
              </span>

              {isPast && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

