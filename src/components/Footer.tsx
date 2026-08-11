import React from "react";
import { AppSettings, PageView } from "../types";
import { getTranslation } from "../utils/i18n";
import { sfx } from "../utils/sfx";
import { Heart, Shield, Cpu, RefreshCw, Cookie, Sparkles, Check } from "lucide-react";

interface FooterProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setCurrentPage: (page: PageView) => void;
  clearCache: () => void;
  openDonationsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  updateSettings,
  setCurrentPage,
  clearCache,
  openDonationsModal,
}) => {
  return (
    <footer className="mt-20 border-t border-indigo-500/20 bg-slate-950/90 backdrop-blur-xl text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Column 1: Brand & Spiritual Blessing */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-purple-600 to-red-600 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <span className="text-sm font-black bg-gradient-to-r from-blue-400 to-rose-400 bg-clip-text text-transparent">
                  IW
                </span>
              </div>
            </div>
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-blue-400 via-purple-300 to-red-400 bg-clip-text text-transparent uppercase">
              Isekai Worlds
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            The next-generation anime multiverse platform crafted for anime enthusiasts worldwide.
            Featuring live anime streams, 4K wallpapers, GIFs, global active leaderboards,
            and real-time AI translation.
          </p>

          {/* User Requested Spiritual Blessing & Credits */}
          <div className="p-4 bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-red-950/40 rounded-2xl border border-purple-500/20 text-xs text-purple-200 space-y-3">
            <div className="flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Project Blessing & Dedication:</p>
                <p className="italic text-[11px] text-slate-300">
                  "May Yahua Yahusha and Holy Spirit Lord Jesus Christ Bless this Project named Isekai Worlds so users can fully immerse themselves in joy and inspiration."
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-amber-300 font-bold">Credits: Mark David Valmores • Usagyuun VTuber • Junichi555 • Eleventh Gyuuun</span>
              {openDonationsModal && (
                <button
                  onClick={() => {
                    sfx.playClick();
                    openDonationsModal();
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all"
                >
                  Support & Donate
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-xs font-bold font-mono tracking-wider text-purple-300 uppercase mb-4">
            Navigation Hub
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => { sfx.playClick(); setCurrentPage("home"); }}
                className="hover:text-cyan-400 transition-colors"
              >
                Portal Hub
              </button>
            </li>
            <li>
              <button
                onClick={() => { sfx.playClick(); setCurrentPage("wallpapers"); }}
                className="hover:text-cyan-400 transition-colors"
              >
                4K Anime Wallpapers
              </button>
            </li>
            <li>
              <button
                onClick={() => { sfx.playClick(); setCurrentPage("gifs"); }}
                className="hover:text-cyan-400 transition-colors"
              >
                Anime GIFs Gallery
              </button>
            </li>
            <li>
              <button
                onClick={() => { sfx.playClick(); setCurrentPage("leaderboard"); }}
                className="hover:text-cyan-400 transition-colors"
              >
                Global Top 100 Leaderboard
              </button>
            </li>
            <li>
              <button
                onClick={() => { sfx.playClick(); setCurrentPage("hardware"); }}
                className="hover:text-cyan-400 transition-colors"
              >
                RTX & AI Frame Generation
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Utilities & Cache */}
        <div>
          <h4 className="text-xs font-bold font-mono tracking-wider text-purple-300 uppercase mb-4">
            System & Cache Controls
          </h4>
          <div className="space-y-3 text-xs">
            <button
              onClick={() => {
                sfx.playClick();
                clearCache();
              }}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{getTranslation(settings.language, "clearCache")}</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                updateSettings({ cookiesAccepted: !settings.cookiesAccepted });
              }}
              className={`w-full py-2 px-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                settings.cookiesAccepted
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                  : "bg-amber-950/40 border-amber-500/40 text-amber-300"
              }`}
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>
                {settings.cookiesAccepted ? "Cookies Accepted" : "Accept Cookies"}
              </span>
              {settings.cookiesAccepted && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-indigo-500/20 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span>GPU Acceleration:</span>
                <span className="text-cyan-400 font-mono">RTX ON</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Offline Sync:</span>
                <span className="text-emerald-400 font-mono">ENABLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Specs */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
        <div>
          © {new Date().getFullYear()} <strong className="text-slate-200">Isekai Worlds</strong>. All Rights Reserved. Powered by Gemini AI & RTX Shader Engine.
        </div>
        <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
          <span>v2.5 Ultra-Multi</span>
          <span>•</span>
          <span className="text-purple-400">Smart TV / VR Ready</span>
        </div>
      </div>
    </footer>
  );
};
