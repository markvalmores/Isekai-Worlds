import React, { useState, useEffect } from "react";
import { Gift, Sparkles, CheckCircle2, Calendar, Trophy, Coins, Flame, X, Zap } from "lucide-react";
import { sfx } from "../utils/sfx";

interface DailyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimCoins: (amount: number, reason: string) => void;
  isFirstUser: boolean;
}

const REWARD_DAYS = [
  { day: 1, reward: 500, label: "Day 1", icon: "✨" },
  { day: 2, reward: 750, label: "Day 2", icon: "🔥" },
  { day: 3, reward: 1000, label: "Day 3", icon: "💎" },
  { day: 4, reward: 1250, label: "Day 4", icon: "⚡" },
  { day: 5, reward: 1500, label: "Day 5", icon: "🌟" },
  { day: 6, reward: 2000, label: "Day 6", icon: "👑" },
  { day: 7, reward: 5000, label: "Day 7 (JACKPOT)", icon: "🏆" }
];

export function DailyLoginModal({ isOpen, onClose, onClaimCoins, isFirstUser }: DailyLoginModalProps) {
  const [currentStreak, setCurrentStreak] = useState<number>(1);
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [claimedWelcome, setClaimedWelcome] = useState<boolean>(false);

  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const lastLoginStr = localStorage.getItem("isekai_last_login_date");
      const streakStr = localStorage.getItem("isekai_login_streak");
      const claimedWelcomeStr = localStorage.getItem("isekai_claimed_first_bonus");

      let streak = streakStr ? parseInt(streakStr, 10) : 1;
      
      if (lastLoginStr) {
        if (lastLoginStr === todayStr) {
          setHasClaimedToday(true);
        } else {
          // Check if yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (lastLoginStr === yesterdayStr) {
            streak = streak >= 7 ? 1 : streak + 1;
          } else {
            streak = 1; // Reset streak if missed day
          }
          setHasClaimedToday(false);
        }
      } else {
        setHasClaimedToday(false);
      }

      setCurrentStreak(streak);
      if (claimedWelcomeStr === "true") {
        setClaimedWelcome(true);
      }
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const todayReward = REWARD_DAYS[(currentStreak - 1) % 7].reward;

  const handleClaimDaily = () => {
    sfx.playBadgeUnlock();
    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem("isekai_last_login_date", todayStr);
    localStorage.setItem("isekai_login_streak", currentStreak.toString());
    setHasClaimedToday(true);

    onClaimCoins(todayReward, `Daily Login Day ${currentStreak} Bonus`);
  };

  const handleClaimWelcomeBonus = () => {
    sfx.playBadgeUnlock();
    localStorage.setItem("isekai_claimed_first_bonus", "true");
    setClaimedWelcome(true);
    onClaimCoins(3478, "First-Time User Starter Bonus (+3,478 Coins)");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Gift className="w-4 h-4" /> Daily Isekai Login Rewards
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Claim Your Daily Treasures
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Log in every day to keep your streak alive and unlock massive coin multipliers!
          </p>
        </div>

        {/* First User Starter Pack Notice */}
        {isFirstUser && !claimedWelcome && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                🎁
              </div>
              <div>
                <h4 className="text-sm font-black uppercase text-amber-300">New Adventurer Starter Gift</h4>
                <p className="text-xs text-slate-200">First Time User Special Bonus</p>
              </div>
            </div>
            <button
              onClick={handleClaimWelcomeBonus}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Coins className="w-4 h-4 fill-slate-950" /> Claim +3,478
            </button>
          </div>
        )}

        {/* 7-Day Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {REWARD_DAYS.map((item) => {
            const isToday = item.day === ((currentStreak - 1) % 7 + 1);
            const isPassed = item.day < ((currentStreak - 1) % 7 + 1) || (hasClaimedToday && isToday);

            return (
              <div
                key={item.day}
                className={`relative rounded-2xl p-2 sm:p-3 text-center border transition-all flex flex-col items-center justify-between min-h-[90px] ${
                  isToday
                    ? "bg-amber-500/20 border-amber-400 shadow-md scale-105 ring-2 ring-amber-400/50"
                    : isPassed
                    ? "bg-slate-950/60 border-slate-800 text-slate-500"
                    : "bg-slate-800/40 border-slate-700/60 text-slate-300"
                }`}
              >
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  Day {item.day}
                </span>

                <span className="text-xl my-1">{item.icon}</span>

                <div className="flex items-center gap-0.5 text-[10px] font-black text-amber-400">
                  <Coins className="w-3 h-3 fill-amber-400" />
                  <span>+{item.reward}</span>
                </div>

                {isPassed && (
                  <div className="absolute top-1 right-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-950" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Streak & Claim Footer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-black">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Current Daily Streak</div>
              <div className="text-base font-black text-white">{currentStreak} Days Consecutive</div>
            </div>
          </div>

          {!hasClaimedToday ? (
            <button
              onClick={handleClaimDaily}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" /> Claim Day {((currentStreak - 1) % 7 + 1)} Reward (+{todayReward} Coins)
            </button>
          ) : (
            <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Claimed Today! Return Tomorrow
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
