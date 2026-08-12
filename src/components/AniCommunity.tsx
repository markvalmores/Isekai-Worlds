import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Flame,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Heart,
  Smile,
  Send,
  Image as ImageIcon,
  Tag,
  AtSign,
  Share2,
  Bookmark,
  Sparkles,
  Users,
  Radio,
  Plus,
  Compass,
  CheckCircle2,
  Zap,
  Globe,
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import { UserProfile, CommunityPost } from "../types";
import { sfx } from "../utils/sfx";

interface AniCommunityProps {
  userProfile: UserProfile;
  isGoldMode?: boolean;
}

const CHANNELS = [
  { id: "#general", name: "general", desc: "Main chat for all anime fans", icon: "💬" },
  { id: "#anime-discussion", name: "anime-discussion", desc: "Debates, reviews & episode theories", icon: "📺" },
  { id: "#cosplay-corner", name: "cosplay-corner", desc: "Showcase cosplays, outfits & props", icon: "🌸" },
  { id: "#memes-gifs", name: "memes-gifs", desc: "Dank anime memes, reaction GIFs & laughs", icon: "😂" },
  { id: "#fanart", name: "fanart", desc: "Digital art, sketches & AI wallpaper prompts", icon: "🎨" },
  { id: "#gaming-lounge", name: "gaming-lounge", desc: "Gacha pulls, retro games & high scores", icon: "🎮" },
  { id: "#amv-showcase", name: "amv-showcase", desc: "4K edits, AMVs & music syncs", icon: "🎥" },
  { id: "#isekai-theories", name: "isekai-theories", desc: "Dimensional portals & web novel lore", icon: "🌀" },
];

const PRESET_FRIENDS = [
  "@ShadowSlayer",
  "@AsunaMaid",
  "@GokuFan99",
  "@ErenJaeger",
  "@RemEnthusiast",
  "@KurokoBasket",
  "@ZeroTwoWaifu",
  "@MikasaAckerman"
];

const PRESET_TAGS = [
  "#SoloLeveling",
  "#DemonSlayer",
  "#Cosplay",
  "#GachaLuck",
  "#IsekaiWorlds",
  "#AMVEdit",
  "#AttackOnTitan",
  "#ReZero"
];

const PRESET_MEDIA_IMAGES = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80"
];

export const AniCommunity: React.FC<AniCommunityProps> = ({
  userProfile,
  isGoldMode = false,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>("#general");
  const [feedSort, setFeedSort] = useState<"hot" | "new" | "top">("hot");
  const [searchQuery, setSearchQuery] = useState("");

  // Post composer state
  const [postContent, setPostContent] = useState("");
  const [postMediaUrl, setPostMediaUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["#AniCommunity"]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Active comment box state (postId -> text)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error("Failed to load community posts:", e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      sfx.playWarp();
      setIsSubmitting(true);

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: userProfile.id,
          authorName: userProfile.username,
          authorAvatar: userProfile.avatarUrl,
          authorBadge: userProfile.badge,
          authorTitle: userProfile.title,
          channel: activeChannel,
          content: postContent,
          mediaType: postMediaUrl ? "image" : "none",
          mediaUrl: postMediaUrl,
          tags: selectedTags,
          taggedFriends: selectedFriends,
        }),
      });

      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
        setPostContent("");
        setPostMediaUrl("");
        setShowMediaPicker(false);
      }
    } catch (err) {
      console.error("Error creating community post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (postId: string, direction: "up" | "down") => {
    try {
      sfx.playClick();
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const upDiff = direction === "up" ? 1 : 0;
            const downDiff = direction === "down" ? 1 : 0;
            return {
              ...p,
              upvotes: p.upvotes + upDiff,
              downvotes: p.downvotes + downDiff,
              userVote: direction,
            };
          }
          return p;
        })
      );

      await fetch(`/api/community/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
    } catch (e) {
      console.error("Error voting:", e);
    }
  };

  const handleReaction = async (postId: string, type: "heart" | "fire" | "laugh" | "mindblown") => {
    try {
      sfx.playBadgeUnlock();
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const react = p.reactions || { heart: 0, fire: 0, laugh: 0, mindblown: 0 };
            return {
              ...p,
              reactions: {
                ...react,
                [type]: (react[type] || 0) + 1,
              },
            };
          }
          return p;
        })
      );

      await fetch(`/api/community/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    } catch (e) {
      console.error("Error reacting:", e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      sfx.playClick();
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: userProfile.username,
          authorAvatar: userProfile.avatarUrl,
          authorBadge: userProfile.badge,
          content: text.trim(),
        }),
      });

      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (e) {
      console.error("Error adding comment:", e);
    }
  };

  // Filter posts by active channel, search query, and feed sort
  const filteredPosts = posts
    .filter((p) => {
      if (activeChannel !== "#general" && p.channel !== activeChannel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchContent = p.content.toLowerCase().includes(q);
        const matchAuthor = p.authorName.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        return matchContent || matchAuthor || matchTag;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned) return -1;
      if (b.isPinned) return 1;
      if (feedSort === "hot") return (b.upvotes + (b.reactions?.fire || 0)) - (a.upvotes + (a.reactions?.fire || 0));
      if (feedSort === "top") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      return 0; // default order is new
    });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/90 via-purple-950/90 to-red-950/90 border border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/40 text-purple-300 text-xs font-mono uppercase tracking-widest font-bold">
            <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Unified Anime Social Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide uppercase flex items-center justify-center md:justify-start gap-2">
            <span>AniCommunity</span>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            The ultimate fusion of Discord, Twitter/X, TikTok, Reddit & Facebook. Share posts, upvote artwork, tag squad members, react, and debate anime lore.
          </p>
        </div>

        {/* Live Social Quick Stats */}
        <div className="z-10 bg-slate-900/90 border border-purple-500/30 p-4 rounded-2xl flex items-center gap-6 shrink-0 shadow-xl font-mono">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Connected Otakus</span>
            <strong className="text-lg text-emerald-400 font-black flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              142 Online
            </strong>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Total Community Posts</span>
            <strong className="text-lg text-cyan-400 font-black">{posts.length}</strong>
          </div>
        </div>
      </div>

      {/* Main 3-Column Community Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Discord Channels Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 uppercase">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Discord Channels</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live
              </span>
            </div>

            <div className="space-y-1">
              {CHANNELS.map((ch) => {
                const isActive = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      sfx.playClick();
                      setActiveChannel(ch.id);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md shadow-purple-900/40"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{ch.icon}</span>
                      <span className="font-mono">{ch.id}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Official Discord / Social Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 space-y-2 pt-3">
              <span className="text-xs font-bold text-white block">Official Community Portal</span>
              <p className="text-[11px] text-slate-300">
                Join 50,000+ members on official social media and Discord channels.
              </p>
              <a
                href="https://markitext.wixsite.com/isekaiworlds"
                target="_blank"
                rel="noreferrer"
                className="w-full px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Join Official Guild</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Center Column: Feed & Post Composer (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Post Composer Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.username}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/50 shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-white block">{userProfile.username}</span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-500/30 inline-block">
                  {activeChannel}
                </span>
              </div>
            </div>

            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`Share anything on ${activeChannel}! Anime theories, cosplay, AMV edits, gacha pulls...`}
              className="w-full h-24 p-3.5 bg-slate-950/90 border border-indigo-500/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-all resize-none"
            />

            {/* Attached Media Preview */}
            {postMediaUrl && (
              <div className="relative rounded-xl overflow-hidden border border-purple-500/40 max-h-48 group">
                <img src={postMediaUrl} alt="Attached Media" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPostMediaUrl("")}
                  className="absolute top-2 right-2 bg-slate-950/80 hover:bg-red-600 text-white p-1 rounded-lg text-xs font-mono transition-all"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Quick Media & Tag Selector */}
            {showMediaPicker && (
              <div className="p-3 bg-slate-950/90 border border-purple-500/30 rounded-xl space-y-2 animate-fadeIn">
                <span className="text-[10px] font-mono font-bold text-purple-300 uppercase block">
                  Select Quick Image or Enter Media URL:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={postMediaUrl}
                    onChange={(e) => setPostMediaUrl(e.target.value)}
                    placeholder="https://image-or-gif-url..."
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                  {PRESET_MEDIA_IMAGES.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Preset"
                      onClick={() => setPostMediaUrl(img)}
                      className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:scale-105 border border-indigo-500/30 shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Composer Tool Buttons & Submit */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Media</span>
                </button>

                {/* Quick Friend Tagging */}
                <select
                  onChange={(e) => {
                    if (e.target.value && !selectedFriends.includes(e.target.value)) {
                      setSelectedFriends([...selectedFriends, e.target.value]);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono focus:outline-none border-none cursor-pointer"
                >
                  <option value="">Tag Friend</option>
                  {PRESET_FRIENDS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleCreatePost}
                disabled={isSubmitting || !postContent.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Posting..." : "Post to AniCommunity"}</span>
              </button>
            </div>
          </div>

          {/* Feed Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            {/* Feed Sort Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[
                { id: "hot", label: "Hot", icon: <Flame className="w-3.5 h-3.5 text-rose-400" /> },
                { id: "new", label: "New", icon: <Zap className="w-3.5 h-3.5 text-yellow-400" /> },
                { id: "top", label: "Top Karma", icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sfx.playClick();
                    setFeedSort(tab.id as any);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    feedSort === tab.id
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts or #tags..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>

          {/* Posts Feed List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all space-y-4 shadow-xl ${
                  post.isPinned
                    ? "border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900"
                    : "border-indigo-500/20 hover:border-indigo-500/40"
                }`}
              >
                {/* Author Info Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-bold text-white">{post.authorName}</strong>
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                          {post.authorBadge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span>{post.timestamp}</span>
                        <span>•</span>
                        <span className="text-purple-400 font-bold">{post.channel}</span>
                      </div>
                    </div>
                  </div>

                  {post.isPinned && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                {/* Post Body Content */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Tagged Friends & Hashtags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {post.taggedFriends?.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1"
                    >
                      <AtSign className="w-3 h-3 text-pink-400" />
                      <span>{f}</span>
                    </span>
                  ))}

                  {post.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-cyan-300 text-[10px] font-mono font-bold"
                    >
                      #{t.replace(/^#/, "")}
                    </span>
                  ))}
                </div>

                {/* Embedded Media Image */}
                {post.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-96 shadow-lg">
                    <img
                      src={post.mediaUrl}
                      alt="Post Attachment"
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                    />
                  </div>
                )}

                {/* Upvotes / Downvotes & Reactions Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
                  {/* Reddit Upvote / Downvote Counter */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleVote(post.id, "up")}
                      className={`p-1.5 rounded-lg hover:bg-slate-800 transition-all ${
                        post.userVote === "up" ? "text-amber-400 font-bold" : "text-slate-400"
                      }`}
                      title="Upvote Post"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <strong className="px-1 text-white font-black">{post.upvotes - post.downvotes}</strong>
                    <button
                      onClick={() => handleVote(post.id, "down")}
                      className={`p-1.5 rounded-lg hover:bg-slate-800 transition-all ${
                        post.userVote === "down" ? "text-blue-400 font-bold" : "text-slate-400"
                      }`}
                      title="Downvote Post"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Facebook Reaction Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handleReaction(post.id, "heart")}
                      className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-pink-950/60 border border-slate-800 hover:border-pink-500/40 text-pink-300 flex items-center gap-1 text-[11px] transition-all"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      <span>{post.reactions?.heart || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, "fire")}
                      className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 text-amber-300 flex items-center gap-1 text-[11px] transition-all"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{post.reactions?.fire || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, "laugh")}
                      className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-yellow-950/60 border border-slate-800 hover:border-yellow-500/40 text-yellow-300 flex items-center gap-1 text-[11px] transition-all"
                    >
                      <Smile className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{post.reactions?.laugh || 0}</span>
                    </button>
                  </div>

                  {/* Comments Toggle Button */}
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{post.commentsCount || 0} Comments</span>
                  </button>
                </div>

                {/* Comments Section Drawer */}
                {expandedComments[post.id] && (
                  <div className="pt-3 border-t border-slate-800 space-y-3 animate-fadeIn">
                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        placeholder="Write a comment..."
                        className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-bold transition-all"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Existing Comments List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pt-1">
                      {post.comments?.map((cc) => (
                        <div
                          key={cc.id}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="font-bold text-purple-300">{cc.authorName}</span>
                            <span className="text-slate-500">{cc.timestamp}</span>
                          </div>
                          <p className="text-slate-200">{cc.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Trending Hashtags & Top Otakus (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Trending Hashtags Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 uppercase">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Trending Topics</span>
              </span>
            </div>

            <div className="space-y-2">
              {PRESET_TAGS.map((t, idx) => (
                <button
                  key={t}
                  onClick={() => setSearchQuery(t)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 text-xs text-left transition-all group"
                >
                  <span className="font-mono font-bold text-cyan-300 group-hover:text-cyan-200">
                    {t}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">#{idx + 1} Trending</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Otakus Guild Guidelines */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 space-y-3 shadow-lg text-xs">
            <span className="font-bold text-white uppercase block font-mono text-xs">
              🛡️ AniCommunity Rules
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
              <li>Keep posts respectful & anime focused.</li>
              <li>Tag NSFW content appropriately.</li>
              <li>Upvote quality artwork & AMV edits.</li>
              <li>Earn Karma points for Top 100 Leaderboards.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
