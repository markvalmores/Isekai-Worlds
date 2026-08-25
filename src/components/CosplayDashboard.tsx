import React, { useState, useEffect } from "react";
import { Camera, Search, Heart, Bookmark, Share2, Download, ExternalLink, Sparkles, Filter, Eye, RefreshCw, X, Shield, Star, Flame } from "lucide-react";
import { sfx } from "../utils/sfx";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { CosplayItem } from "../types";
import { Cosplay } from "./Cosplay";
import { LightBox } from "./LightBox";

interface CosplayDashboardProps {
  onAddCoins: (amount: number, reason: string) => void;
  isGoldMode?: boolean;
}

export function CosplayDashboard({ onAddCoins, isGoldMode = false }: CosplayDashboardProps) {
  const [cosplayList, setCosplayList] = useState<CosplayItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCosplay, setSelectedCosplay] = useState<CosplayItem | null>(null);

  // Bookmarked Cosplay items
  const [savedCosplayIds, setSavedCosplayIds] = useState<string[]>([]);
  
  // Intersection observer to load more items
  const observerTarget = React.useRef(null);

  // Load active profile from localStorage for Firebase sync fallback
  const [activeProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("isekai_user_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: "u-anon-" + Math.random().toString(36).substring(2, 8),
      username: "Isekai Voyager"
    };
  });

  // Real-time Firestore synchronization for saved cosplays
  useEffect(() => {
    if (!activeProfile?.id) return;
    const favsRef = collection(db, "saved_cosplay");
    const qFavs = query(favsRef, where("userId", "==", activeProfile.id));

    const unsubscribe = onSnapshot(qFavs, (snapshot) => {
      const list: string[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        if (d.cosplayId) list.push(d.cosplayId);
      });
      setSavedCosplayIds(list);
    }, (err) => {
      console.warn("Firestore saved_cosplay sync error:", err);
    });

    return () => unsubscribe();
  }, [activeProfile?.id]);

  // Liked Cosplay items
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Fetch real Cosplay media feed
  const fetchCosplayFeed = async (q: string = "", cat: string = "all", pageNum: number = 1, isAppend: boolean = false) => {
    if (!isAppend) setIsLoading(true);
    try {
      const res = await fetch(`/api/cosplay?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}&page=${pageNum}`);
      if (res.ok) {
        const data = await res.json();
        if (data.cosplays && Array.isArray(data.cosplays)) {
          if (isAppend) {
            setCosplayList((prev) => [...prev, ...data.cosplays]);
            if (data.cosplays.length === 0) setHasMore(false);
          } else {
            setCosplayList(data.cosplays);
            setHasMore(true);
          }
        }
      }
    } catch (e) {
      console.warn("Error fetching cosplay feed:", e);
    } finally {
      if (!isAppend) setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchCosplayFeed(searchQuery, activeCategory, 1, false);
  }, [activeCategory]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchCosplayFeed(searchQuery, activeCategory, nextPage, true);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, page, searchQuery, activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playClick();
    setPage(1);
    fetchCosplayFeed(searchQuery, activeCategory, 1, false);
  };

  const toggleBookmark = async (item: CosplayItem) => {
    sfx.playClick();
    if (!activeProfile?.id) return;

    const favoriteDocId = `${activeProfile.id}_${item.id}`;
    const docRef = doc(db, "saved_cosplay", favoriteDocId);

    const isBookmarked = savedCosplayIds.includes(item.id);

    try {
      if (isBookmarked) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          userId: activeProfile.id,
          username: activeProfile.username || "Voyager",
          cosplayId: item.id,
          title: item.title || "Cosplay Shoot",
          character: item.character || "",
          artist: item.artist || "",
          imageUrl: item.imageUrl,
          thumbUrl: item.thumbUrl || item.imageUrl,
          series: item.series || "",
          createdAt: serverTimestamp()
        });
        onAddCoins(15, "Bookmarked Cosplay Photo (+15 Coins)");
      }
    } catch (err) {
      console.error("Failed to sync cosplay bookmark with Firestore:", err);
      setSavedCosplayIds((prev) =>
        prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
      );
    }
  };

  const toggleLike = (id: string) => {
    sfx.playClick();
    const next = new Set(likedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      onAddCoins(10, "Liked Cosplay Shoot (+10 Coins)");
    }
    setLikedIds(next);
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null;
    // Hide the broken image to avoid showing placeholder
    target.style.display = "none";
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4 text-pink-400" /> Real-Time Cosplay Archive
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Cosplay & Costume Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover real-time, high-resolution cosplay photography, character transformations, and creator showcases from top global anime and gaming conventions.
          </p>

          {/* Search Bar & Categories */}
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 pt-2">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search character, series, or cosplayer..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-1.5"
            >
              Search
            </button>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
            {[
              { id: "all", label: "🔥 All Cosplays" },
              { id: "anime", label: "🌸 Anime Series" },
              { id: "gaming", label: "🎮 Gaming & RPG" },
              { id: "vtuber", label: "👑 VTubers & Idols" },
              { id: "bookmarked", label: `⭐ Saved (${savedCosplayIds.length})` }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sfx.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-pink-600 border border-pink-400 text-white shadow-md"
                    : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Return Up Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-40 p-3 bg-slate-900 border border-slate-700 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all"
        title="Return to top"
      >
        <div className="rotate-180">
          <Eye className="w-5 h-5" />
        </div>
      </button>

      {/* Cosplay Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : cosplayList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-full">
             <Shield className="w-12 h-12 text-pink-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white">404 Underconstruction</h2>
          <p className="text-slate-400">Isekai Maintenance in progress. Please check back shortly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cosplayList
            .filter((item) => activeCategory !== "bookmarked" || savedCosplayIds.includes(item.id))
            .map((item) => {
              const isSaved = savedCosplayIds.includes(item.id);
              const isLiked = likedIds.has(item.id);

              return (
                <div key={item.id}>
                  <Cosplay
                    item={item}
                    isSaved={isSaved}
                    isLiked={isLiked}
                    onToggleBookmark={toggleBookmark}
                    onToggleLike={toggleLike}
                    onSelect={setSelectedCosplay}
                    onImgError={handleImgError}
                  />
                </div>
              );
            })}
          <div ref={observerTarget} className="h-10" />
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedCosplay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedCosplay(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Viewport */}
            <div className="md:w-3/5 bg-slate-950 flex items-center justify-center p-4">
              <img
                src={selectedCosplay.imageUrl}
                alt={selectedCosplay.title}
                referrerPolicy="no-referrer"
                onError={handleImgError}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-xl"
              />
            </div>

            {/* Info Sidebar */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-slate-900">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-400 text-xs font-mono font-bold uppercase tracking-wider inline-block">
                  {selectedCosplay.series}
                </span>

                <h2 className="text-xl font-black text-white">{selectedCosplay.title}</h2>

                <div className="space-y-2 text-xs font-mono text-slate-300 border-y border-slate-800 py-3">
                  <div><span className="text-slate-500">Character:</span> {selectedCosplay.character}</div>
                  <div><span className="text-slate-500">Artist:</span> {selectedCosplay.artist}</div>
                  <div><span className="text-slate-500">Source:</span> {selectedCosplay.source}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <a
                  href={selectedCosplay.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" /> Download 4K Cosplay Photo
                </a>

                <button
                  onClick={() => toggleBookmark(selectedCosplay)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4" /> {savedCosplayIds.includes(selectedCosplay.id) ? "Remove from Saved" : "Save to Favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
