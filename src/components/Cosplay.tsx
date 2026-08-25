import React from "react";
import { Camera, Search, Heart, Bookmark, Share2, Download, ExternalLink, Sparkles, Filter, Eye, RefreshCw, X, Shield, Star, Flame } from "lucide-react";
import { CosplayItem } from "../types";

interface CosplayProps {
  item: CosplayItem;
  isSaved: boolean;
  isLiked: boolean;
  onToggleBookmark: (item: CosplayItem) => void;
  onToggleLike: (id: string) => void;
  onSelect: (item: CosplayItem) => void;
  onImgError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function Cosplay({
  item,
  isSaved,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onSelect,
  onImgError,
}: CosplayProps) {
  return (
    <div
      className="group relative bg-slate-900 border border-slate-800 hover:border-pink-500/50 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Photo Container */}
      <div
        onClick={() => onSelect(item)}
        className="relative h-80 overflow-hidden cursor-pointer"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          onError={onImgError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 bg-slate-950/80 border border-slate-800 backdrop-blur rounded-full text-[10px] font-mono font-bold text-pink-400 uppercase">
            {item.series}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item);
            }}
            className={`p-2 rounded-full backdrop-blur border transition-all ${
              isSaved
                ? "bg-amber-500 border-amber-400 text-slate-950"
                : "bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Bottom Metadata overlay */}
        <div className="absolute bottom-3 left-3 right-3 space-y-1">
          <h3 className="text-sm font-black text-white line-clamp-1 group-hover:text-pink-300 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-pink-400 font-bold">{item.artist}</span>
            <span className="text-[10px] text-slate-400 font-mono">{item.character}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-between">
        <button
          onClick={() => onToggleLike(item.id)}
          className={`flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
            isLiked ? "text-pink-500" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-pink-500" : ""}`} />
          <span>{item.likes + (isLiked ? 1 : 0)}</span>
        </button>

        <button
          onClick={() => onSelect(item)}
          className="flex items-center gap-1 text-xs font-mono font-bold text-slate-300 hover:text-pink-400 transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> View Photo
        </button>
      </div>
    </div>
  );
}
