import React, { useState } from "react";
import {
  ExternalLink,
  Sparkles,
  Globe,
  ArrowUpRight,
  Layers,
  Lock,
  Copy,
  Check,
  Info,
  Maximize2,
  Tv,
  Smartphone,
  Eye,
  RefreshCw
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { trackHistory } from "../lib/historyService";

interface ExclusiveDestination {
  id: string;
  name: string;
  shortName: string;
  url: string;
  description: string;
  badge: string;
  gradient: string;
  borderColor: string;
  accentColor: string;
  features: string[];
  fallbackImage: string;
}

const EXCLUSIVE_DESTINATIONS: ExclusiveDestination[] = [
  {
    id: "isekai-1",
    name: "Isekai Worlds 1",
    shortName: "Wix Multiverse",
    url: "https://markitext.wixsite.com/isekaiworlds",
    description: "The flagship Isekai Worlds official universe hosted on Wix, featuring comprehensive anime galleries, character lore, interactive worlds, and community portal links.",
    badge: "FLAGSHIP MULTIVERSE",
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    borderColor: "border-purple-500/40",
    accentColor: "text-purple-400",
    features: [
      "Official Flagship Universe",
      "Anime Multiverse Lore & Galleries",
      "Interactive Character Portals",
      "High-Res Creative Visuals"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80"
  },
  {
    id: "isekai-2",
    name: "Isekai Worlds 2",
    shortName: "Google Sites Edition",
    url: "https://sites.google.com/view/isekaiworlds/home",
    description: "The official Google Sites edition of Isekai Worlds, engineered for lightning-fast cloud accessibility, curated dimension archives, and cloud streaming hubs.",
    badge: "GOOGLE SITES EDITION",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    borderColor: "border-cyan-500/40",
    accentColor: "text-cyan-400",
    features: [
      "Google Cloud Infrastructure",
      "Curated Dimension Archives",
      "Zero-Lag Cloud Hubs",
      "Official Dimension Roster"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80"
  },
  {
    id: "zero-zone",
    name: "Zero Zone",
    shortName: "01Tune Hub",
    url: "https://markitext.wixsite.com/01tune",
    description: "The Zero Zone 01Tune portal featuring verified mobile apps, digital media projects, futuristic experimental audio tools, and official app showcase releases.",
    badge: "01TUNE ECOSYSTEM",
    gradient: "from-emerald-600 via-teal-600 to-green-600",
    borderColor: "border-emerald-500/40",
    accentColor: "text-emerald-400",
    features: [
      "Verified Mobile Apps & Games",
      "Futuristic Soundtracks & 01Tune",
      "Creative Digital Projects",
      "Play Store Ecosystem Links"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80"
  }
];

interface ScreenshotCardProps {
  dest: ExclusiveDestination;
  isFeatured?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

const ScreenshotCard: React.FC<ScreenshotCardProps> = ({
  dest,
  isFeatured = false,
  onSelect,
  isSelected = false
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Primary screenshot URL using Thum.io with dynamic render
  const primaryScreenshot = `https://image.thum.io/get/width/1200/crop/750/noanimate/${dest.url}`;
  // Fallback screenshot URL using Microlink
  const fallbackScreenshot = `https://api.microlink.io?url=${encodeURIComponent(dest.url)}&screenshot=true&meta=false&embed=screenshot.url`;

  const [currentSrc, setCurrentSrc] = useState(primaryScreenshot);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playClick();
    navigator.clipboard.writeText(dest.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sfx.playWarp();
    trackHistory("browse", dest.url, dest.name);
    window.open(dest.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={onSelect || handleOpen}
      className={`rounded-3xl border bg-slate-900/90 overflow-hidden shadow-2xl transition-all flex flex-col justify-between ${
        isSelected
          ? `ring-2 ring-amber-400 ${dest.borderColor} shadow-[0_0_50px_rgba(245,158,11,0.2)]`
          : "border-slate-800 hover:border-slate-700 hover:shadow-indigo-950/40"
      }`}
    >
      {/* Mockup Browser Window Chrome Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
        {/* macOS Style Traffic Dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-lg mx-auto flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 truncate">
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate text-slate-300 select-all">{dest.url}</span>
        </div>

        {/* Browser Header Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleOpen}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors cursor-pointer"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Website Screenshot Preview Area */}
      <div className="relative group cursor-pointer overflow-hidden bg-slate-950 aspect-[16/10] sm:aspect-[16/9]">
        {/* Image Loader Spinner */}
        {imageLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10 space-y-2">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
            <span className="text-[11px] font-mono text-slate-400">Loading Live Screenshot...</span>
          </div>
        )}

        {/* Live Website Screenshot Image */}
        <img
          src={currentSrc}
          alt={`${dest.name} Website Screenshot Preview`}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            if (currentSrc === primaryScreenshot) {
              setCurrentSrc(fallbackScreenshot);
            } else if (!imageError) {
              setCurrentSrc(dest.fallbackImage);
              setImageError(true);
              setImageLoading(false);
            }
          }}
        />

        {/* Gradient Overlay & Hover Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Floating Screenshot Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono font-bold text-amber-300 shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>WEBSITE SCREENSHOT PREVIEW</span>
          </span>
        </div>

        {/* Hover Launch Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/50 backdrop-blur-xs">
          <button
            onClick={handleOpen}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
          >
            <span>Open External Website</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info & Launch Button Footer */}
      <div className="p-6 space-y-4 bg-slate-900/90">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              {dest.badge}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>Official External Portal</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Globe className={`w-5 h-5 ${dest.accentColor}`} />
            <span>{dest.name}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            {dest.description}
          </p>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {dest.features.map((feat, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 font-mono"
            >
              ✓ {feat}
            </span>
          ))}
        </div>

        {/* Primary Open External Website CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleOpen}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
            title={`Launch ${dest.name} in an external browser window`}
          >
            <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>Open External Website</span>
            <ArrowUpRight className="w-4 h-4 opacity-75" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ExclusivePageTab: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>("all");

  const handleLaunchAll = () => {
    sfx.playWarp();
    EXCLUSIVE_DESTINATIONS.forEach((dest) => {
      window.open(dest.url, "_blank", "noopener,noreferrer");
    });
  };

  const displayedDestinations =
    activeTabId === "all"
      ? EXCLUSIVE_DESTINATIONS
      : EXCLUSIVE_DESTINATIONS.filter((d) => d.id === activeTabId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-mono text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ISEKAI WORLDS EXCLUSIVE EXTERNAL PORTAL NETWORK</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>Exclusive Page</span>
              <Globe className="w-8 h-8 text-amber-400 inline" />
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Browse official visual website screenshot previews below. Every exclusive network is configured as an <strong className="text-amber-300 font-semibold">External Website Only</strong> with zero iframe restrictions for full native features, high-resolution media, and personal account synchronizations.
            </p>
          </div>

          {/* Quick Header Launch Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleLaunchAll}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/25 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              title="Open all 3 exclusive websites in external tabs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch All 3 Portals</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sfx.playClick();
                setActiveTabId("all");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTabId === "all"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              All 3 Portals
            </button>

            {EXCLUSIVE_DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => {
                  sfx.playClick();
                  setActiveTabId(dest.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeTabId === dest.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>External Only • Main Website Screenshot Previews</span>
          </div>
        </div>
      </div>

      {/* Grid of Exclusive Websites with Live Screenshot Previews */}
      <div className={`grid gap-8 ${
        displayedDestinations.length === 1
          ? "grid-cols-1 max-w-4xl mx-auto"
          : "grid-cols-1 lg:grid-cols-3"
      }`}>
        {displayedDestinations.map((dest) => (
          <ScreenshotCard
            key={dest.id}
            dest={dest}
            isFeatured={displayedDestinations.length === 1}
          />
        ))}
      </div>

      {/* Why External Website Only Policy Info Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-start gap-4 text-xs text-slate-400 max-w-4xl mx-auto">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 leading-relaxed">
          <h4 className="font-bold text-slate-200 text-sm">
            Why are Exclusive Page websites external only?
          </h4>
          <p>
            Major platform ecosystems (such as Wix and Google Sites) utilize specialized cross-origin frames, script engines, and authentication security that prevent full desktop rendering inside third-party iframe containers. By presenting authentic live website screenshot previews paired with direct external links, you receive 100% full functionality, unrestricted video streaming, and verified account features.
          </p>
        </div>
      </div>
    </div>
  );
};
