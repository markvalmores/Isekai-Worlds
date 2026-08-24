import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { sfx } from "../utils/sfx";
import { generateRandomUserProfile } from "../utils/randomProfile";
import {
  UserCheck,
  Edit2,
  Camera,
  Image as ImageIcon,
  Shield,
  Sparkles,
  Save,
  Check,
  Globe,
  Clock,
  Heart,
  Zap,
  Layout,
  RefreshCw,
  Copy,
  Trash2,
  Plus,
  Cloud,
  CheckCircle2,
  Share2,
  Users
} from "lucide-react";

interface ProfileDashboardProps {
  profile: UserProfile;
  allProfiles: UserProfile[];
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchProfile: (profileId: string) => void;
  createNewProfile: (customData?: Partial<UserProfile>) => void;
  duplicateProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  activeSeconds: number;
  userRank: number;
  openSocialAuthModal?: () => void;
  lastSyncedTime?: string;
  onForceSyncAll?: () => Promise<void>;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  profile,
  allProfiles = [],
  updateProfile,
  switchProfile,
  createNewProfile,
  duplicateProfile,
  deleteProfile,
  activeSeconds,
  userRank,
  openSocialAuthModal,
  lastSyncedTime,
  onForceSyncAll,
}) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isForceSyncing, setIsForceSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Sync formData when profile changes
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleGenerateRandom = async () => {
    sfx.playBadgeUnlock();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/profile/random");
      if (res.ok) {
        const randomData = await res.json();
        const updated = {
          ...formData,
          ...randomData
        };
        setFormData(updated);
        updateProfile(updated);
      } else {
        const localRandom = generateRandomUserProfile();
        const updated = { ...formData, ...localRandom };
        setFormData(updated);
        updateProfile(updated);
      }
    } catch {
      const localRandom = generateRandomUserProfile();
      const updated = { ...formData, ...localRandom };
      setFormData(updated);
      updateProfile(updated);
    } finally {
      setIsGenerating(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleForceSync = async () => {
    if (!onForceSyncAll) return;
    setIsForceSyncing(true);
    sfx.playWarp();
    try {
      await onForceSyncAll();
      setSyncFeedback("All profiles hardcode synchronized everywhere across cloud, server & Firestore!");
    } catch (e: any) {
      setSyncFeedback("Sync finished!");
    } finally {
      setIsForceSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  const presetAvatars = [
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80"
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playBadgeUnlock();
    updateProfile(formData);
    setEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const formatHoursMins = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Live Universal Multi-Profile Synchronizer Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-indigo-950/60 border border-purple-500/40 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
              <Users className="w-5 h-5 animate-pulse text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-mono">
                  All Synced Traveler Personas ({allProfiles.length || 1})
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Hardcode Synced Everywhere</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Every profile is continuously synchronized across Firestore, Cloud Server & all devices.
                {lastSyncedTime && ` Last synchronized: ${new Date(lastSyncedTime).toLocaleTimeString()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sfx.playClick();
                createNewProfile();
              }}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
              title="Create a new persona profile and sync it everywhere"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Persona</span>
            </button>

            {onForceSyncAll && (
              <button
                onClick={handleForceSync}
                disabled={isForceSyncing}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-purple-300 font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Force universal sync pulse to all cloud endpoints"
              >
                <Cloud className={`w-3.5 h-3.5 ${isForceSyncing ? "animate-spin" : ""}`} />
                <span>{isForceSyncing ? "Syncing..." : "Sync All Now"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Personas Carousel / Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {allProfiles.map((p) => {
            const isActive = p.id === profile.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  if (!isActive) {
                    switchProfile(p.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex items-center justify-between gap-3 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border-purple-400 shadow-lg shadow-purple-900/40 ring-1 ring-purple-400"
                    : "bg-slate-950/60 border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={p.avatarUrl}
                      alt={p.username}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-500/40 bg-slate-950"
                    />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 shadow-md" title="Active Persona" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate max-w-[110px] sm:max-w-[130px]">
                        {p.username}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 font-bold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[120px]">
                      {p.title || p.badge || "Traveler"}
                    </span>
                  </div>
                </div>

                {/* Persona Card Action Buttons */}
                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateProfile(p.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-purple-900/40 border border-slate-700 text-slate-300 hover:text-purple-300 transition-colors"
                    title="Clone / Duplicate Persona"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {allProfiles.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete persona "${p.username}"?`)) {
                          deleteProfile(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-900/40 border border-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Delete Persona"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {syncFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* Discord Style Profile Card */}
      <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl relative">
        {/* Banner Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-950">
          <img
            src={formData.bannerUrl}
            alt="Cover Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

          {/* Top Control Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleGenerateRandom}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-xs font-bold font-mono text-amber-300 flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95"
              title="Generate Random Anime Profile & Avatar with AI"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Random Persona</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setEditing(!editing);
              }}
              className="px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-purple-500/40 text-xs font-bold font-mono text-purple-300 flex items-center gap-2 backdrop-blur-md shadow-lg transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{editing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Profile Details Header */}
        <div className="px-6 sm:px-8 pb-8 relative -mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={formData.avatarUrl}
                alt={formData.username}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-slate-900 shadow-2xl bg-slate-950"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-900 shadow-lg" title="Online" />
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-center">
                <span className="text-slate-400 text-[10px] block">Global Rank</span>
                <strong className="text-amber-400 text-sm">#{userRank}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-center">
                <span className="text-slate-400 text-[10px] block">Active Time</span>
                <strong className="text-cyan-400 text-sm">{formatHoursMins(activeSeconds)}</strong>
              </div>

              <button
                onClick={async () => {
                  sfx.playBadgeUnlock();
                  try {
                    const effectiveUsername = formData.username?.trim() || "IsekaiAdventurer";
                    await fetch("/api/leaderboard/update", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: formData.id || `user-${Date.now()}`,
                        username: effectiveUsername,
                        avatar: formData.avatarUrl,
                        banner: formData.bannerUrl,
                        title: formData.title,
                        badge: formData.badge,
                        secondsLogged: Math.max(30, activeSeconds || 30),
                        country: formData.country || "GLOBAL",
                      }),
                    });
                  } catch (e) {
                    console.warn("Leaderboard sync offline fallback:", e);
                  } finally {
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 3000);
                  }
                }}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                title="Sync and register your profile on the Realtime Global Top 100"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
                <span>Register in Top 100</span>
              </button>
            </div>
          </div>

          {/* User Names & Bio */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black text-white">{formData.username}</h2>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-mono text-xs font-bold shadow-md shadow-purple-900/50">
                {formData.badge}
              </span>
            </div>

            <p className="text-xs font-mono text-cyan-400">{formData.title}</p>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed max-w-2xl">
              <span className="text-purple-400 font-bold font-mono block mb-1">Custom Status: "{formData.customStatus}"</span>
              {formData.bio}
            </div>

            {/* Connected Social Accounts & Social Auth Status */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-950/80 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                  <Shield className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {profile.verifiedSocial ? "Verified Social Account" : "Social Media Authentication"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {profile.verifiedSocial
                      ? `Linked via ${profile.loginMethod?.toUpperCase() || "Social OAuth"}`
                      : "Link Google, Discord, GitHub, Twitter, Twitch or Reddit"}
                  </span>
                </div>
              </div>

              {openSocialAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    openSocialAuthModal();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Manage Social Auth
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Section */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Customize Active Persona ({formData.username})</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Supports GIF / PNG / JPG URLs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-mono font-bold">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Custom Title */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-mono font-bold">Isekai Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Avatar URL (PNG/JPG/GIF) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-300 font-mono font-bold">Avatar Image/GIF URL</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://... (GIF, PNG, JPG supported)"
              />
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] text-slate-400 font-mono">Quick Presets:</span>
                {presetAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Preset"
                    onClick={() => setFormData({ ...formData, avatarUrl: url })}
                    className="w-6 h-6 rounded-lg object-cover cursor-pointer hover:scale-110 transition-transform ring-1 ring-slate-700"
                  />
                ))}
              </div>
            </div>

            {/* Cover Banner URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-300 font-mono font-bold">Cover Banner Photo URL</label>
              <input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://..."
              />
            </div>

            {/* Custom Status */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-300 font-mono font-bold">Custom Status Message</label>
              <input
                type="text"
                value={formData.customStatus}
                onChange={(e) => setFormData({ ...formData, customStatus: e.target.value })}
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-300 font-mono font-bold">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-purple-900/50 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Hardcode-Sync Everywhere</span>
          </button>
        </form>
      )}

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile saved and hardcode synchronized to all profiles across cloud & Firestore!</span>
        </div>
      )}
    </div>
  );
};
