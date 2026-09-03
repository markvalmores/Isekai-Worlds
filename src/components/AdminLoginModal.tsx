import React, { useState } from "react";
import { ShieldCheck, Lock, Unlock, Key, Coins, Sparkles, AlertCircle, X, ShieldAlert, Zap, RefreshCw, Layers } from "lucide-react";
import { sfx } from "../utils/sfx";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  setIsAdmin: (status: boolean) => void;
  onAddCoins: (amount: number, reason: string) => void;
  onUnlockAllCards?: () => void;
}

export function AdminLoginModal({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  onAddCoins,
  onUnlockAllCards
}: AdminLoginModalProps) {
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [customCoinInput, setCustomCoinInput] = useState("100000");

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (passcode.trim() === "Markols#1997") {
      sfx.playBadgeUnlock();
      setIsAdmin(true);
      localStorage.setItem("isekai_admin_mode", "true");
      onAddCoins(999999999, "Admin God Mode Activated (+999,999,999 Coins)");
      setErrorMsg("");
    } else {
      sfx.playClick();
      setErrorMsg("Access Denied: Invalid Master Passcode");
    }
  };

  const handleLogout = () => {
    sfx.playClick();
    setIsAdmin(false);
    localStorage.removeItem("isekai_admin_mode");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-400" /> Executive Admin Portal
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {isAdmin ? "Admin Control Panel" : "Master Passcode Authentication"}
          </h2>
          <p className="text-xs text-slate-300">
            {isAdmin
              ? "Unlimited privileges active. Manage coins, gacha inventory, and system settings."
              : "Enter your confidential master admin passcode to enable God Mode."}
          </p>
        </div>

        {!isAdmin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Master Security Passcode
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all font-mono"
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Authenticate & Enable God Mode
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Admin Badge */}
            <div className="bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-500/20 border-2 border-red-500/40 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
                  👑
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-red-400 tracking-wider">
                    GOD MODE ACTIVE
                  </div>
                  <div className="text-[11px] text-slate-300">Unlimited Isekai Coins & Free Pulls</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold rounded-xl transition-all"
              >
                Logout
              </button>
            </div>

            {/* Admin Coin Generator */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 fill-amber-400" /> Instant Coin Injector
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customCoinInput}
                  onChange={(e) => setCustomCoinInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
                <button
                  onClick={() => {
                    const val = parseInt(customCoinInput, 10) || 100000;
                    sfx.playBadgeUnlock();
                    onAddCoins(val, `Admin Coin Injection (+${val.toLocaleString()})`);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all whitespace-nowrap"
                >
                  Inject Coins
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => {
                    sfx.playBadgeUnlock();
                    onAddCoins(100000, "Admin Boost");
                  }}
                  className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-mono font-bold text-slate-300 rounded-lg"
                >
                  +100K
                </button>
                <button
                  onClick={() => {
                    sfx.playBadgeUnlock();
                    onAddCoins(1000000, "Admin Boost");
                  }}
                  className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-mono font-bold text-slate-300 rounded-lg"
                >
                  +1M
                </button>
                <button
                  onClick={() => {
                    sfx.playBadgeUnlock();
                    onAddCoins(999999999, "Admin Max");
                  }}
                  className="py-1.5 bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400 rounded-lg"
                >
                  UNLIMITED (∞)
                </button>
              </div>
            </div>

            {/* Unlock Cards & Features */}
            {onUnlockAllCards && (
              <button
                onClick={() => {
                  sfx.playBadgeUnlock();
                  onUnlockAllCards();
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" /> Unlock All Legendary Cards in Gacha Inventory
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
