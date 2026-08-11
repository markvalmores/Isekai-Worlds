import React, { useState, useEffect } from "react";
import { Comment, UserProfile } from "../types";
import { sfx } from "../utils/sfx";
import { MessageSquare, Send, Heart, User, Sparkles, Check, ThumbsUp } from "lucide-react";

interface CommentSectionProps {
  targetId: string;
  targetTitle: string;
  userProfile: UserProfile;
  onAddCommentCoins?: (amount: number) => void;
  isGoldMode?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  targetId,
  targetTitle,
  userProfile,
  onAddCommentCoins,
  isGoldMode = false,
}) => {
  const STORAGE_KEY = `isekai_comments_${targetId}`;

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }

    // Default initial comments for realistic anime community chatter
    return [
      {
        id: `c-init-1-${targetId}`,
        targetId,
        username: "Junichi555",
        avatarUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
        content: `Incredible quality on ${targetTitle}! The animation and resolution look absolutely godly! ✨`,
        timestamp: "10m ago",
        likes: 14,
        userLiked: false,
      },
      {
        id: `c-init-2-${targetId}`,
        targetId,
        username: "Eleventh Gyuuun",
        avatarUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80",
        content: "Adding this straight to my daily Isekai playlist! Loving the smooth FPS and audio output! 🔥",
        timestamp: "32m ago",
        likes: 9,
        userLiked: false,
      },
      {
        id: `c-init-3-${targetId}`,
        targetId,
        username: "Usagyuun VTuber",
        avatarUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80",
        content: "Usagyuun cheer! 🎉 Don't forget to tip on Streamlabs to support Mark David Valmores & team!",
        timestamp: "1h ago",
        likes: 28,
        userLiked: true,
      },
    ];
  });

  const [newText, setNewText] = useState("");
  const [justPosted, setJustPosted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // Ignore
    }
  }, [comments, STORAGE_KEY]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    sfx.playBadgeUnlock();

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      targetId,
      username: userProfile.username,
      avatarUrl: userProfile.avatarUrl,
      content: newText.trim(),
      timestamp: "Just now",
      likes: 1,
      userLiked: true,
    };

    setComments([newComment, ...comments]);
    setNewText("");
    setJustPosted(true);

    if (onAddCommentCoins) {
      onAddCommentCoins(15);
    }

    setTimeout(() => setJustPosted(false), 3000);
  };

  const handleToggleLike = (id: string) => {
    sfx.playClick();
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const userLiked = !c.userLiked;
          return {
            ...c,
            userLiked,
            likes: userLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <div
      className={`p-6 rounded-3xl border transition-all space-y-6 ${
        isGoldMode
          ? "bg-amber-950/40 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          : "bg-slate-900/90 border-indigo-500/30"
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-5 h-5 ${isGoldMode ? "text-amber-400" : "text-purple-400"}`} />
          <h3 className={`font-bold font-mono text-sm uppercase ${isGoldMode ? "text-amber-200" : "text-white"}`}>
            Isekai Traveler Discussion ({comments.length})
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Post Comment = +15 Isekai Coins</span>
        </span>
      </div>

      {/* Comment Submission Form */}
      <form onSubmit={handlePost} className="space-y-3">
        <div className="flex gap-3">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.username}
            className={`w-10 h-10 rounded-xl object-cover ring-2 ${
              isGoldMode ? "ring-amber-400" : "ring-purple-500/50"
            }`}
          />
          <div className="flex-1 space-y-2">
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={`Share your thoughts on ${targetTitle}...`}
              rows={2}
              className={`w-full rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                isGoldMode
                  ? "bg-amber-950/60 border border-amber-500/40 focus:ring-amber-400"
                  : "bg-slate-950 border border-indigo-500/30 focus:ring-purple-500"
              }`}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Logged as <strong className={isGoldMode ? "text-amber-300" : "text-purple-300"}>{userProfile.username}</strong>
              </span>
              <button
                type="submit"
                disabled={!newText.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-lg transition-all ${
                  !newText.trim()
                    ? "opacity-50 cursor-not-allowed bg-slate-800 text-slate-500"
                    : isGoldMode
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white hover:scale-105"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment (+15 Coins)</span>
              </button>
            </div>
          </div>
        </div>

        {justPosted && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Comment published! Earned +15 Isekai Coins!</span>
          </div>
        )}
      </form>

      {/* Comment List */}
      <div className="space-y-4 divide-y divide-slate-800/80 pt-2">
        {comments.map((comment) => (
          <div key={comment.id} className="pt-4 first:pt-0 flex gap-3">
            <img
              src={comment.avatarUrl}
              alt={comment.username}
              className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-slate-700"
            />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isGoldMode ? "text-amber-200" : "text-white"}`}>
                    {comment.username}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{comment.timestamp}</span>
                </div>

                <button
                  onClick={() => handleToggleLike(comment.id)}
                  className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg transition-colors ${
                    comment.userLiked
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{comment.likes}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
