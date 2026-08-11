import React, { useEffect, useState } from "react";
import { Sparkles, Compass, Shield, Zap } from "lucide-react";

interface PageTransitionModalProps {
  isLoading: boolean;
  targetPageName: string;
}

const ANIME_QUOTES = [
  { quote: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.", author: "Naruto Uzumaki" },
  { quote: "Whatever you do, enjoy it to the fullest. That is the secret of life.", author: "Rider (Fate/Zero)" },
  { quote: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger as well as kinder.", author: "Gildarts Clive" },
  { quote: "Push through the pain, giving up hurts more.", author: "Vegeta" },
  { quote: "The world isn't perfect. But it's there for us, doing the best it can... that's what makes it so damn beautiful.", author: "Roy Mustang" },
  { quote: "No matter how deep the night, it will always turn to day.", author: "Brook (One Piece)" }
];

const ANIME_WALLPAPER_PRESETS = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
];

export const PageTransitionModal: React.FC<PageTransitionModalProps> = ({
  isLoading,
  targetPageName,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentWallpaper, setCurrentWallpaper] = useState("");
  const [quote, setQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const randWallpaper = ANIME_WALLPAPER_PRESETS[Math.floor(Math.random() * ANIME_WALLPAPER_PRESETS.length)];
      const randQuote = ANIME_QUOTES[Math.floor(Math.random() * ANIME_QUOTES.length)];
      setCurrentWallpaper(randWallpaper);
      setQuote(randQuote);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 15;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl transition-all duration-300">
      {/* Background Anime Wallpaper with Blur */}
      {currentWallpaper && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${currentWallpaper})` }}
        />
      )}

      {/* Radial Gradient Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/80 via-purple-950/80 to-red-950/80 pointer-events-none" />

      {/* Center Content Card */}
      <div className="relative z-10 max-w-lg w-full mx-4 p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-[0_0_50px_rgba(168,85,247,0.3)] text-center space-y-6">
        {/* Animated Warp Ring */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 border-r-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-rose-500/20 border-b-rose-500 animate-spin [animation-duration:1.5s]" />
          <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        {/* Warp Title */}
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest bg-gradient-to-r from-blue-400 via-purple-300 to-red-400 bg-clip-text text-transparent">
            WARPING TO {targetPageName}
          </h3>
          <p className="text-xs text-indigo-300 font-mono mt-1">
            Loading 4K Assets & Synchronizing Shader Pipelines...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Asset Stream</span>
            </span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>

          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-[2px] border border-indigo-500/30">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full transition-all duration-200 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Anime Quote */}
        {quote.quote && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 text-left">
            <p className="text-xs italic text-slate-300 leading-relaxed">
              "{quote.quote}"
            </p>
            <p className="text-[11px] font-bold text-indigo-400 text-right mt-1 font-mono">
              — {quote.author}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
