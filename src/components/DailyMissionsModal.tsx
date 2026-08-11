import React from "react";
import { DailyMission, AppSettings } from "../types";
import { DailyLoginBonus } from "./DailyLoginBonus";
import { sfx } from "../utils/sfx";
import {
  Trophy,
  X,
  CheckCircle2,
  Gift,
  Coins,
  Crown,
  Sparkles,
  Flame,
  Zap,
  Clock
} from "lucide-react";

interface DailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  activeSeconds: number;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
  activeSeconds,
}) => {
  if (!isOpen) return null;

  const GOLD_SUBSCRIPTION_COST = 100;

  // Default missions logic calculated dynamically
  const minsLogged = Math.floor(activeSeconds / 60);

  const missions: DailyMission[] = [
    {
      id: "m-time-5",
      title: "Chrono Dimension Traveler",
      description: "Stay online on Isekai Worlds for at least 5 minutes",
      rewardCoins: 50,
      progress: Math.min(minsLogged, 5),
      target: 5,
      completed: minsLogged >= 5,
      claimed: false,
      iconName: "Clock",
    },
    {
      id: "m-time-15",
      title: "S-Rank Overlord Focus",
      description: "Stay online on Isekai Worlds for 15 minutes",
      rewardCoins: 100,
      progress: Math.min(minsLogged, 15),
      target: 15,
      completed: minsLogged >= 15,
      claimed: false,
      iconName: "Flame",
    },
    {
      id: "m-explore-wallpapers",
      title: "Visual Art Enthusiast",
      description: "Explore 4K anime wallpapers gallery & leave a like",
      rewardCoins: 35,
      progress: 1,
      target: 1,
      completed: true,
      claimed: false,
      iconName: "Sparkles",
    },
    {
      id: "m-livestream",
      title: "Aniplus Stream Watcher",
      description: "Tune into live TV anime stream on Media Hub",
      rewardCoins: 40,
      progress: 1,
      target: 1,
      completed: true,
      claimed: false,
      iconName: "Zap",
    },
  ];

  const handleClaimCoins = (amount: number) => {
    sfx.playBadgeUnlock();
    updateSettings({ isekaiCoins: settings.isekaiCoins + amount });
  };

  const handleSubscribeGold = () => {
    if (settings.isekaiCoins < GOLD_SUBSCRIPTION_COST && !settings.unlockedGoldPermanently) {
      alert(`You need ${GOLD_SUBSCRIPTION_COST} Isekai Coins! Stay online or complete missions to earn more!`);
      return;
    }

    sfx.playWarp();
    const newCoins = settings.unlockedGoldPermanently ? settings.isekaiCoins : settings.isekaiCoins - GOLD_SUBSCRIPTION_COST;
    updateSettings({
      isekaiCoins: Math.max(0, newCoins),
      unlockedGoldPermanently: true,
      isGoldMode: !settings.isGoldMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative max-w-xl w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Gift className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
                Daily Missions & Rewards
              </h3>
              <p className="text-xs text-amber-300 font-mono">Earn Isekai Coins & Subscribe to Gold Mode</p>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Coin Balance & Gold Subscription Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border border-amber-500/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                Your Balance
              </span>
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-400 animate-bounce" />
                <span className="text-3xl font-black text-white font-mono">{settings.isekaiCoins}</span>
                <span className="text-xs font-mono text-amber-300 font-bold">COINS</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Passive Income:</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">+5 Coins / min</span>
            </div>
          </div>

          {/* Gold Mode Subscribe Toggle */}
          <div className="pt-4 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>GOLD MODE PREMIUM THEME</span>
              </span>
              <p className="text-[11px] text-slate-300">
                Turns website UI into radiant gold themes & unlocks exclusive gold glows.
              </p>
            </div>

            <button
              onClick={handleSubscribeGold}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
                settings.isGoldMode
                  ? "bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-300"
                  : "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105"
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>
                {settings.isGoldMode
                  ? "Gold Mode: ACTIVE"
                  : settings.unlockedGoldPermanently
                  ? "Toggle Gold Mode ON"
                  : `Unlock Gold (${GOLD_SUBSCRIPTION_COST} Coins)`}
              </span>
            </button>
          </div>
        </div>

        {/* Daily Consecutive Login Bonus */}
        <DailyLoginBonus settings={settings} updateSettings={updateSettings} />

        {/* Daily Missions List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase text-slate-300">Daily Quest Log</h4>

          {missions.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{m.title}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    +{m.rewardCoins} Coins
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{m.description}</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
                    style={{ width: `${(m.progress / m.target) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleClaimCoins(m.rewardCoins)}
                disabled={!m.completed}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
                  m.completed
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-lg shadow-emerald-900/50"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {m.completed ? "Claim Reward" : `${m.progress}/${m.target}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
