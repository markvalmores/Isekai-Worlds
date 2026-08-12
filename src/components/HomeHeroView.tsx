import React, { useState, useEffect } from "react";
import { PageView, AppSettings, UserProfile } from "../types";
import { getTranslation } from "../utils/i18n";
import { sfx } from "../utils/sfx";
import { fetchRealTimeAnimeList, RealTimeAnimeItem } from "../utils/animeApi";
import {
  Compass,
  Trophy,
  Image as ImageIcon,
  Film,
  Tv2,
  Eye,
  Cpu,
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Play,
  Flame,
  Globe,
  Radio,
  Clock
} from "lucide-react";

interface HomeHeroViewProps {
  setCurrentPage: (page: PageView) => void;
  settings: AppSettings;
  profile: UserProfile;
  activeSeconds: number;
  userRank: number;
}

export const HomeHeroView: React.FC<HomeHeroViewProps> = ({
  setCurrentPage,
  settings,
  profile,
  activeSeconds,
  userRank,
}) => {
  const portalCards = [
    {
      id: "wallpapers" as PageView,
      title: "4K Anime Wallpapers",
      desc: "Ultra HD Isekai & Fantasy background art gallery",
      icon: <ImageIcon className="w-6 h-6 text-cyan-400" />,
      badge: "LIVE API",
      bgGradient: "from-blue-600/30 to-purple-600/30",
    },
    {
      id: "gifs" as PageView,
      title: "Anime GIFs & Reactions",
      desc: "High quality animated action scenes & reaction clips",
      icon: <Film className="w-6 h-6 text-rose-400" />,
      badge: "UPDATED",
      bgGradient: "from-purple-600/30 to-red-600/30",
    },
    {
      id: "media" as PageView,
      title: "Live Anime Streams",
      desc: "Stream trailers, ambient lofi soundtracks & anime media",
      icon: <Tv2 className="w-6 h-6 text-amber-400" />,
      badge: "AUDIO SFX",
      bgGradient: "from-red-600/30 to-blue-600/30",
    },
    {
      id: "leaderboard" as PageView,
      title: "Global Active Top 100",
      desc: "Compete with anime travelers worldwide for longest active session",
      icon: <Trophy className="w-6 h-6 text-emerald-400" />,
      badge: "TOP 100",
      bgGradient: "from-emerald-600/30 to-blue-600/30",
    },
    {
      id: "vr" as PageView,
      title: "3D VR View Portal",
      desc: "Immersive 3D portal space view compatible with all VR headsets",
      icon: <Eye className="w-6 h-6 text-violet-400" />,
      badge: "360° VR",
      bgGradient: "from-violet-600/30 to-indigo-600/30",
    },
    {
      id: "hardware" as PageView,
      title: "RTX & AI Frame Gen",
      desc: "Simulated Ray Tracing, Path Tracing and 120 FPS frame interpolation",
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      badge: "GPU BOOST",
      bgGradient: "from-cyan-600/30 to-purple-600/30",
    },
  ];

  const [featuredAnime, setFeaturedAnime] = useState<RealTimeAnimeItem[]>([]);

  useEffect(() => {
    fetchRealTimeAnimeList().then((data) => {
      if (data && data.length > 0) {
        setFeaturedAnime(data);
      }
    });
  }, []);

  const bgHeroImage = featuredAnime[0]?.bannerImage || featuredAnime[0]?.coverImage || "https://cdn.myanimelist.net/images/anime/1090/140954.jpg";

  return (
    <div className="space-y-12">
      {/* Main Hero Banner with Blue-Violet-Red Gradient Aura */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-indigo-500/30 p-8 sm:p-12 shadow-[0_0_80px_rgba(79,70,229,0.2)]">
        {/* Background Ambient Art Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `url('${bgHeroImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-purple-950/80 to-red-950/90 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 border border-purple-500/40 text-xs font-mono text-purple-300">
            <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>ISEKAI MULTIVERSE ENGINE v2.5</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none text-white">
            {getTranslation(settings.language, "welcomeTitle")}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            {getTranslation(settings.language, "subtitle")}
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => {
                sfx.playWarp();
                setCurrentPage("wallpapers");
              }}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-purple-900/50 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              <span>{getTranslation(settings.language, "exploreNow")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sfx.playWarp();
                setCurrentPage("leaderboard");
              }}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-rose-900/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-amber-200" />
              <span>Join Top 100 Now</span>
            </button>

            <a
              href="https://markitext.wixsite.com/isekaiworlds"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                sfx.playWarp();
              }}
              className="px-4 py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-indigo-500/40 text-slate-300 font-bold text-xs tracking-wider uppercase hover:border-indigo-400 transition-all flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Official Web</span>
            </a>
          </div>
        </div>

        {/* User Card Floating Specs (Desktop) */}
        <div className="hidden lg:block absolute right-8 bottom-8 z-10 w-80 p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/30 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/50"
            />
            <div>
              <h4 className="text-sm font-bold text-white truncate">{profile.username}</h4>
              <span className="text-[11px] font-mono text-purple-300 px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/30 inline-block">
                {profile.badge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Global Rank</span>
              <span className="text-amber-400 font-bold text-sm">#{userRank}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Active Time</span>
              <span className="text-cyan-400 font-bold text-sm">{Math.floor(activeSeconds / 60)}m</span>
            </div>
          </div>
        </div>
      </section>

      {/* Multiverse Portals Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
              <span>ISEKAI MULTIVERSE PORTALS</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Select a portal to travel across anime media hubs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portalCards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                sfx.playWarp();
                setCurrentPage(card.id);
              }}
              onMouseEnter={() => sfx.playHover()}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-slate-900/80 border border-indigo-500/20 p-6 hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgGradient} rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none`} />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-[10px] font-mono text-purple-300 font-bold tracking-wider">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-purple-300 group-hover:text-rose-400 transition-colors">
                <span>OPEN PORTAL</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlighting Grid: Live Feeds & RTX Hardware Specs */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Anime Feed Teaser */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-sm">
              <Flame className="w-5 h-5 animate-bounce" />
              <span>Live Anime Media Highlight</span>
            </div>
            <span className="text-xs font-mono text-slate-400">4K Ultra Stream</span>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 group">
            <img
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80"
              alt="Anime Stream"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <button
              onClick={() => {
                sfx.playClick();
                setCurrentPage("media");
              }}
              className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/20 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/50 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </button>
            <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-semibold truncate">
              Chrono Portal: Arcane Celestial Awakening
            </div>
          </div>
        </div>

        {/* Global Active Benchmark Teaser */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-sm">
              <Trophy className="w-5 h-5" />
              <span>Global Session Leaderboard</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                setCurrentPage("leaderboard");
              }}
              className="text-xs font-mono text-purple-300 hover:underline"
            >
              View Top 100 →
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { rank: 1, name: "Kirito_Aincrad", badge: "Isekai God", time: "240h 03m", avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80" },
              { rank: 2, name: "Subaru_Natsuki", badge: "Witch Champion", time: "208h 55m", avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80" },
              { rank: 3, name: "Rimuru_Tempest", badge: "Demon Lord", time: "197h 20m", avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80" },
            ].map((u) => (
              <div
                key={u.rank}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    u.rank === 1 ? "bg-amber-500 text-black" : u.rank === 2 ? "bg-slate-300 text-black" : "bg-amber-700 text-white"
                  }`}>
                    #{u.rank}
                  </span>
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <span className="font-bold text-white block">{u.name}</span>
                    <span className="text-[10px] text-purple-300">{u.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-cyan-400 font-bold block">{u.time}</span>
                  <span className="text-[10px] text-slate-300">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
