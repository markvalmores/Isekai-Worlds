import React, { useEffect, useState } from "react";
import { LeaderboardEntry, UserProfile } from "../types";
import { sfx } from "../utils/sfx";
import { db } from "../lib/firebase";
import { collection, doc, setDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import {
  Trophy,
  Sparkles,
  RefreshCw,
  UserCheck,
  Flame,
  Globe,
  Eye,
  UserPlus,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

interface GlobalLeaderboardProps {
  userProfile: UserProfile;
  userActiveSeconds: number;
  liveActiveUsers?: number;
  liveTotalVisits?: number;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  userProfile,
  userActiveSeconds,
  liveActiveUsers = 1,
  liveTotalVisits = 1,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRank, setUserRank] = useState<number>(999);
  const [registering, setRegistering] = useState(false);

  // Keep a ref to the latest active seconds to prevent stale closures in the interval
  const activeSecondsRef = React.useRef(userActiveSeconds);
  useEffect(() => {
    activeSecondsRef.current = userActiveSeconds;
  }, [userActiveSeconds]);

  // Sync leaderboard every 12 seconds instead of spamming on every single second
  useEffect(() => {
    // Initial fetch
    fetchLeaderboardAndUpdate(true);

    const interval = setInterval(() => {
      fetchLeaderboardAndUpdate(false);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboardAndUpdate = async (isFirstLoad = false) => {
    try {
      if (isFirstLoad || leaderboard.length === 0) {
        setLoading(true);
      }

      const q = query(collection(db, "rankings"), orderBy("secondsLogged", "desc"), limit(100));
      const querySnapshot = await getDocs(q);
      const data: LeaderboardEntry[] = [];
      let rank = 1;
      
      querySnapshot.forEach((doc) => {
        data.push(doc.data() as LeaderboardEntry);
      });
      
      const userRank = data.findIndex(u => u.id === userProfile.id) + 1;

      setLeaderboard(data);
      if (userRank > 0) setUserRank(userRank);
      
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [registerSuccessMsg, setRegisterSuccessMsg] = useState("");

  const handleRegisterUser = async () => {
    try {
      sfx.playBadgeUnlock();
      setRegistering(true);

      const secondsToSubmit = Math.max(30, activeSecondsRef.current || 30);
      const effectiveUsername = userProfile.username?.trim() || "IsekaiAdventurer";

      const userData: LeaderboardEntry = {
        id: userProfile.id || `user-${Date.now()}`,
        username: effectiveUsername,
        avatar: userProfile.avatarUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
        banner: userProfile.bannerUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
        title: userProfile.title || "Isekai Traveler",
        badge: userProfile.badge || "Active Adventurer",
        secondsLogged: secondsToSubmit,
        country: userProfile.country || "GLOBAL",
        isOnline: true,
        lastActive: "Just now"
      };

      await setDoc(doc(db, "rankings", userData.id), {
        ...userData,
        registeredAt: serverTimestamp()
      });

      // Refresh after registration
      await fetchLeaderboardAndUpdate(true);
      
      setRegisterSuccessMsg(
        `Registered Successfully! Your name is hardcoded in the Global Ranking forever!`
      );
      setTimeout(() => setRegisterSuccessMsg(""), 5000);
      
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setRegistering(false);
    }
  };

  const formatHoursMinsSecs = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const filtered = leaderboard.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Header Banner & Realtime Telemetry Indicators */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/20 relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>REALTIME GLOBAL TOP 100 • REAL USERS ONLY</span>
          </div>

          {/* Realtime Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span>{liveActiveUsers} Active Right Now</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 shadow">
              <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{liveTotalVisits} Total Visits</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Realtime Global Top 100
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Strictly real active users only — no fake bot seeds! If you log session time, your real handle immediately appears in the Global Top 100 leaderboard with live synchronized rank positioning.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {registerSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono font-bold flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{registerSuccessMsg}</span>
          </div>
          <button
            onClick={() => setRegisterSuccessMsg("")}
            className="text-emerald-400 hover:text-white text-xs underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* User Session Rank Card Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/90 via-purple-950/90 to-red-950/90 border border-purple-500/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.username}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-purple-500/50 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">{userProfile.username}</h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-[10px] font-mono text-purple-300 shrink-0">
                {userProfile.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5 truncate">{userProfile.title}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 font-mono pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 uppercase block">Active Session Time</span>
            <strong className="text-base sm:text-lg text-cyan-400">{formatHoursMinsSecs(userActiveSeconds)}</strong>
          </div>

          <div className="text-right md:pl-4 md:border-l border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Real Rank</span>
            <strong className="text-lg sm:text-xl text-amber-400">
              {leaderboard.length === 0 ? "Not Ranked" : `#${userRank}`}
            </strong>
          </div>

          {/* Prominent Register & Join Top 100 Now Button */}
          <button
            onClick={handleRegisterUser}
            disabled={registering}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            title="Click to register or update your handle instantly on the Global Top 100 Leaderboard"
          >
            <UserPlus className="w-4 h-4 text-yellow-200" />
            <span>{registering ? "Syncing Rank..." : "Register & Join Top 100 Now"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LOADING STATE PLACEHOLDER */}
      {loading && leaderboard.length === 0 && (
        <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-indigo-500/10 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
            <span className="font-mono text-xs text-indigo-300">Synchronizing with Multiverse Live Database...</span>
          </div>
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="h-4 bg-slate-800/60 rounded-full animate-pulse w-3/4 mx-auto"></div>
            <div className="h-3 bg-slate-800/40 rounded-full animate-pulse w-1/2 mx-auto"></div>
          </div>
        </div>
      )}

      {/* EMPTY LEADERBOARD STATE (NO FAKE USERS) */}
      {!loading && leaderboard.length === 0 && (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/80 border border-indigo-500/30 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              No Users in Global Top 100 Yet!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
              There are strictly no fake users on this leaderboard. Be the very first real user to register your handle and claim Rank #1 in the Global Top 100!
            </p>
          </div>

          <button
            onClick={handleRegisterUser}
            disabled={registering}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-900/40 hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-yellow-200" />
            <span>{registering ? "Syncing Rank #1..." : "Register & Join Top 100 Now"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP 3 PODIUM VIEW (Only when real users exist) */}
      {!loading && top3.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Top Podium Leaders ({top3.length} Real Registered)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Rank 2 if available */}
            {top3[1] ? (
              <div className="order-2 md:order-1 p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 text-center space-y-3 relative overflow-hidden transform md:translate-y-4">
                <div className="w-10 h-10 mx-auto rounded-2xl bg-slate-300 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                  #2
                </div>
                <img src={top3[1].avatar} alt={top3[1].username} className="w-14 h-14 mx-auto rounded-2xl object-cover ring-2 ring-slate-400" />
                <div>
                  <h4 className="font-bold text-white text-sm truncate">{top3[1].username}</h4>
                  <span className="text-[10px] font-mono text-purple-300 block">{top3[1].badge}</span>
                </div>
                <p className="text-xs font-mono text-cyan-400 font-bold">{formatHoursMinsSecs(top3[1].secondsLogged)}</p>
              </div>
            ) : null}

            {/* Rank 1 (Gold) */}
            {top3[0] && (
              <div className="order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/50 text-center space-y-3 relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>SUPREME RANK #1</span>
                </div>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 font-black text-xl flex items-center justify-center shadow-xl shadow-amber-500/40">
                  #1
                </div>
                <img src={top3[0].avatar} alt={top3[0].username} className="w-16 h-16 mx-auto rounded-2xl object-cover ring-4 ring-amber-400" />
                <div>
                  <h4 className="font-extrabold text-white text-base truncate">{top3[0].username}</h4>
                  <span className="text-xs font-mono text-amber-300 block">{top3[0].title}</span>
                </div>
                <p className="text-sm font-mono text-amber-400 font-extrabold">{formatHoursMinsSecs(top3[0].secondsLogged)}</p>
              </div>
            )}

            {/* Rank 3 if available */}
            {top3[2] ? (
              <div className="order-3 p-5 rounded-3xl bg-slate-900/90 border border-amber-800/40 text-center space-y-3 relative overflow-hidden transform md:translate-y-6">
                <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-700 text-amber-100 font-black text-lg flex items-center justify-center shadow-lg">
                  #3
                </div>
                <img src={top3[2].avatar} alt={top3[2].username} className="w-14 h-14 mx-auto rounded-2xl object-cover ring-2 ring-amber-700" />
                <div>
                  <h4 className="font-bold text-white text-sm truncate">{top3[2].username}</h4>
                  <span className="text-[10px] font-mono text-purple-300 block">{top3[2].badge}</span>
                </div>
                <p className="text-xs font-mono text-cyan-400 font-bold">{formatHoursMinsSecs(top3[2].secondsLogged)}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* SEARCH BAR & DUAL AXIS SCROLLABLE TOP 100 TABLE / CARDS */}
      {leaderboard.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search real Top 100 users by name, title or badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
                Showing <strong className="text-white">{filtered.length}</strong> real users
              </span>

              <button
                onClick={() => {
                  sfx.playClick();
                  fetchLeaderboardAndUpdate();
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sync Live Ranks</span>
              </button>
            </div>
          </div>

          {/* DUAL SCROLL CONTAINER (Left/Right & Up/Down with Mobile Touch Auto Adjust) */}
          <div className="relative rounded-2xl border border-indigo-500/20 bg-slate-900/90 overflow-hidden shadow-2xl">
            {/* Scroll Hint Mobile Indicator */}
            <div className="sm:hidden px-3 py-1.5 bg-indigo-950/80 border-b border-indigo-500/20 text-[10px] font-mono text-purple-300 flex items-center justify-between">
              <span>Swipe left/right & up/down to view full user stats</span>
              <div className="flex items-center gap-1">
                <ChevronLeft className="w-3 h-3 text-cyan-400 animate-pulse" />
                <ChevronRight className="w-3 h-3 text-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Scrollable Container with max height and overflow-x & y */}
            <div className="max-h-[500px] overflow-y-auto overflow-x-auto touch-pan-x touch-pan-y scrollbar-thin scrollbar-thumb-purple-600/40">
              <table className="w-full text-left text-xs font-mono min-w-[600px]">
                <thead className="sticky top-0 z-20 bg-slate-950 text-slate-400 border-b border-indigo-500/20 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 text-center w-20">Rank</th>
                    <th className="py-3.5 px-4">Real Traveler</th>
                    <th className="py-3.5 px-4">Title / Badge</th>
                    <th className="py-3.5 px-4 text-center">Region</th>
                    <th className="py-3.5 px-4 text-right">Active Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.map((user) => {
                    const rankNum = leaderboard.findIndex((u) => u.id === user.id) + 1;
                    const isCurrentUser = user.id === userProfile.id;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-800/60 transition-colors ${
                          isCurrentUser ? "bg-purple-950/40 font-bold border-l-4 border-l-purple-500" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg font-extrabold text-xs ${
                              rankNum === 1
                                ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                                : rankNum === 2
                                ? "bg-slate-300 text-black"
                                : rankNum === 3
                                ? "bg-amber-700 text-white"
                                : "text-slate-400 bg-slate-950"
                            }`}
                          >
                            #{rankNum}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-purple-500/30 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">{user.username}</span>
                              {isCurrentUser && (
                                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="text-slate-200 block truncate">{user.title}</span>
                            <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded bg-purple-900/40 inline-block">
                              {user.badge}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                            {user.country || "GLOBAL"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <strong className="text-cyan-400 text-sm font-bold">
                            {formatHoursMinsSecs(user.secondsLogged)}
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
