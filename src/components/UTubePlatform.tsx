import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Upload,
  Plus,
  Search,
  Heart,
  MessageSquare,
  Share2,
  User,
  Users,
  Radio,
  Key,
  RefreshCw,
  Play,
  Check,
  Flame,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Settings,
  AlertCircle,
  Compass,
  X,
  Star
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { UserProfile } from "../types";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDocs,
  where,
  limit,
  serverTimestamp
} from "firebase/firestore";

interface UTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "VTuber" | "UVTuber" | "Gaming" | "Vlog" | "Blogger" | "ASMR" | "Music";
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorRole: string;
  createdAt: any;
  views: number;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  isLive: boolean;
  streamUrl?: string;
  streamKey?: string;
  commentsCount?: number;
}

interface UTubeComment {
  id: string;
  videoId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: any;
  likes: number;
  likedBy: string[];
}

interface UTubeChannel {
  id: string;
  name: string;
  avatar: string;
  role: "UTuber" | "UVTuber" | "Isekai Blogger";
  subscribers: string[]; // List of userIds subscribing
  subCount: number;
  bio: string;
  blessed: boolean;
}

interface UTubePlatformProps {
  userProfile: UserProfile;
  onAddCoins?: (amount: number, reason: string) => void;
  isGoldMode?: boolean;
}

// Curated high quality seed/fallback videos
const SEED_VIDEOS: UTubeVideo[] = [
  {
    id: "seed-v1",
    title: "Usagyuun & Friends Happy Dance 24 Hour Loop!",
    description: "Welcome to the absolute blessed stream! Join us in this infinite loop of kawaii dancing and celestial vibes, perfect for study, grinding retro games, or sleeping. Blessed by Yahua & Yahusha! #VTuber #Dance",
    url: "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-with-virtual-reality-headset-41315-large.mp4",
    category: "UVTuber",
    creatorId: "creator-usagyuun",
    creatorName: "Usagyuun_Official",
    creatorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=usagyuun",
    creatorRole: "UVTuber",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    views: 12400,
    likes: 850,
    dislikes: 4,
    likedBy: [],
    dislikedBy: [],
    isLive: false,
    commentsCount: 12
  },
  {
    id: "seed-v2",
    title: "Genshin Impact Live Convention Playthrough (Max RTX Graphics)",
    description: "Testing out the new RTX & AI Frame Gen engine directly in Fontaine! This open world gameplay runs at buttery smooth 120 FPS. Tune in for live tips and free gacha pulls!",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-gamer-playing-with-a-glowing-keyboard-41718-large.mp4",
    category: "Gaming",
    creatorId: "creator-genshingamer",
    creatorName: "AetherDiva_Gamer",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aetherdiva",
    creatorRole: "UTuber",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    views: 4520,
    likes: 310,
    dislikes: 1,
    likedBy: [],
    dislikedBy: [],
    isLive: false,
    commentsCount: 5
  },
  {
    id: "seed-v3",
    title: "Celestial Bible Reader Daily Devotional - Ambiance Live Stream",
    description: "Peaceful celestial reader livestream featuring beautiful lo-fi instrumentals, soft rainfall, and calming daily scripture. Find your inner peace here in this isekai realm. All Blessed by Yahua, Yahusha and Holy Spirit in Lord Jesus Christ.",
    url: "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-background-with-soft-glowing-stars-41617-large.mp4",
    category: "Blogger",
    creatorId: "creator-celestial",
    creatorName: "CelestialDevotional",
    creatorAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=celestial",
    creatorRole: "Isekai Blogger",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    views: 980,
    likes: 145,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    isLive: true,
    streamUrl: "rtmp://utube.isekai.worlds/live/",
    streamKey: "stream_live_celestial_777",
    commentsCount: 3
  }
];

export function UTubePlatform({ userProfile, onAddCoins, isGoldMode = false }: UTubePlatformProps) {
  // Navigation & tabs
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<UTubeVideo | null>(SEED_VIDEOS[0]);

  // Firestore DB states
  const [videos, setVideos] = useState<UTubeVideo[]>([]);
  const [channels, setChannels] = useState<Record<string, UTubeChannel>>({});
  const [comments, setComments] = useState<UTubeComment[]>([]);
  const [loading, setLoading] = useState(true);

  // User Creator setup
  const [myChannel, setMyChannel] = useState<UTubeChannel | null>(null);
  const [creatorRoleChoice, setCreatorRoleChoice] = useState<"UTuber" | "UVTuber" | "Isekai Blogger">("UTuber");
  const [channelBio, setChannelBio] = useState("");
  const [showChannelModal, setShowChannelModal] = useState(false);

  // Video Upload / Livestream states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<"VTuber" | "UVTuber" | "Gaming" | "Vlog" | "Blogger" | "ASMR" | "Music">("VTuber");
  const [isLiveStreamUpload, setIsLiveStreamUpload] = useState(false);
  const [generatedStreamKey, setGeneratedStreamKey] = useState("");

  // Comment input
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // Copy success indicator
  const [copiedKey, setCopiedKey] = useState(false);

  // Referrer error helper
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    // If video fails, try to fallback to a reliable nature stream
    const target = e.currentTarget;
    target.onerror = null;
    target.src = "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-background-with-soft-glowing-stars-41617-large.mp4";
  };

  // Sync Videos from Firestore
  useEffect(() => {
    const vRef = collection(db, "videos");
    const qVideos = query(vRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(qVideos, (snapshot) => {
      const list: UTubeVideo[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: doc.id,
          title: d.title || "",
          description: d.description || "",
          url: d.url || "",
          category: d.category || "VTuber",
          creatorId: d.creatorId || "anonymous",
          creatorName: d.creatorName || "Isekai Traveler",
          creatorAvatar: d.creatorAvatar || "https://api.dicebear.com/7.x/pixel-art/svg",
          creatorRole: d.creatorRole || "UTuber",
          createdAt: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString(),
          views: d.views || 0,
          likes: d.likes || 0,
          dislikes: d.dislikes || 0,
          likedBy: d.likedBy || [],
          dislikedBy: d.dislikedBy || [],
          isLive: d.isLive || false,
          streamUrl: d.streamUrl || "",
          streamKey: d.streamKey || "",
          commentsCount: d.commentsCount || 0
        });
      });

      // Merge firestore videos with local curated seed videos, preventing duplicates by URL or ID
      const merged = [...list];
      SEED_VIDEOS.forEach((seed) => {
        if (!merged.some(v => v.id === seed.id || v.url === seed.url)) {
          merged.push(seed);
        }
      });

      setVideos(merged);
      
      // Auto-select first video if activeVideo is null
      if (merged.length > 0 && !activeVideo) {
        setActiveVideo(merged[0]);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Firestore live videos sync failed. Utilizing seed videos.", err);
      setVideos(SEED_VIDEOS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Channels info
  useEffect(() => {
    const cRef = collection(db, "utube_channels");
    const unsubscribe = onSnapshot(cRef, (snapshot) => {
      const channelMap: Record<string, UTubeChannel> = {};
      snapshot.forEach((doc) => {
        const d = doc.data();
        channelMap[doc.id] = {
          id: doc.id,
          name: d.name || "",
          avatar: d.avatar || "",
          role: d.role || "UTuber",
          subscribers: d.subscribers || [],
          subCount: d.subCount || 0,
          bio: d.bio || "",
          blessed: d.blessed !== false
        };
      });
      setChannels(channelMap);

      // Check if user has a channel
      if (channelMap[userProfile.id]) {
        setMyChannel(channelMap[userProfile.id]);
      } else {
        setMyChannel(null);
      }
    });

    return () => unsubscribe();
  }, [userProfile.id]);

  // Sync Comments for active video
  useEffect(() => {
    if (!activeVideo) return;
    
    const commentsRef = collection(db, "video_comments");
    const qComments = query(
      commentsRef, 
      where("videoId", "==", activeVideo.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(qComments, (snapshot) => {
      const list: UTubeComment[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: doc.id,
          videoId: d.videoId,
          authorId: d.authorId,
          authorName: d.authorName,
          authorAvatar: d.authorAvatar,
          content: d.content,
          createdAt: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString(),
          likes: d.likes || 0,
          likedBy: d.likedBy || []
        });
      });
      setComments(list);
    }, (err) => {
      console.warn("Comments snapshot error:", err);
      // Fallback local comments for seed videos
      setComments([]);
    });

    return () => unsubscribe();
  }, [activeVideo?.id]);

  // Setup Channel
  const handleRegisterChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playBadgeUnlock();
    
    const channelData = {
      id: userProfile.id,
      name: userProfile.username,
      avatar: userProfile.avatarUrl || "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + userProfile.username,
      role: creatorRoleChoice,
      subscribers: [],
      subCount: 0,
      bio: channelBio || "Welcome to my Isekai channel! Blessed and ready to stream.",
      blessed: true
    };

    try {
      await setDoc(doc(db, "utube_channels", userProfile.id), channelData);
      setMyChannel(channelData);
      setShowChannelModal(false);
      if (onAddCoins) onAddCoins(100, "Created UTube Creator Channel (+100 Coins)");
    } catch (err) {
      console.error("Failed to register channel in Firestore:", err);
    }
  };

  // Generate stream key
  const handleGenerateStreamKey = () => {
    sfx.playWarp();
    const key = "live_stream_key_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setGeneratedStreamKey(key);
  };

  // Upload/Post Video
  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playClick();

    if (!newTitle.trim()) return;

    let finalVideoUrl = newUrl.trim();
    // Default high-quality royalty-free video if none is provided
    if (!finalVideoUrl) {
      finalVideoUrl = isLiveStreamUpload 
        ? "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-background-with-soft-glowing-stars-41617-large.mp4"
        : "https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-retro-arcade-machine-41716-large.mp4";
    }

    const videoData = {
      title: newTitle,
      description: newDescription || "Amazing video posted in Isekai Worlds!",
      url: finalVideoUrl,
      category: newCategory,
      creatorId: userProfile.id,
      creatorName: userProfile.username,
      creatorAvatar: userProfile.avatarUrl,
      creatorRole: myChannel?.role || "UTuber",
      createdAt: serverTimestamp(),
      views: Math.floor(Math.random() * 20) + 1,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      isLive: isLiveStreamUpload,
      streamUrl: isLiveStreamUpload ? "rtmp://utube.isekai.worlds/live/" : "",
      streamKey: isLiveStreamUpload ? (generatedStreamKey || "stream_key_default") : "",
      commentsCount: 0
    };

    try {
      const docRef = await addDoc(collection(db, "videos"), videoData);
      sfx.playBadgeUnlock();
      setShowUploadModal(false);
      
      // Reset fields
      setNewTitle("");
      setNewDescription("");
      setNewUrl("");
      setNewCategory("VTuber");
      setIsLiveStreamUpload(false);
      setGeneratedStreamKey("");

      if (onAddCoins) onAddCoins(50, "Uploaded Blessed Video Content (+50 Coins)");
    } catch (err) {
      console.error("Failed to save video to Firestore:", err);
    }
  };

  // Increment views
  const handlePlayVideo = async (video: UTubeVideo) => {
    setActiveVideo(video);
    sfx.playClick();
    
    // Only increment view counter if it's not a seed video (or handle nicely)
    if (!video.id.startsWith("seed-")) {
      try {
        const vDoc = doc(db, "videos", video.id);
        await updateDoc(vDoc, {
          views: (video.views || 0) + 1
        });
      } catch (e) {
        console.warn("Could not increment views:", e);
      }
    }
  };

  // React to Video
  const handleReactToVideo = async (type: "like" | "dislike") => {
    if (!activeVideo) return;
    sfx.playClick();

    if (activeVideo.id.startsWith("seed-")) {
      // Local simulation for seed videos
      const updated = { ...activeVideo };
      if (type === "like") {
        updated.likes += 1;
      } else {
        updated.dislikes += 1;
      }
      setActiveVideo(updated);
      return;
    }

    try {
      const vDoc = doc(db, "videos", activeVideo.id);
      let likesList = [...(activeVideo.likedBy || [])];
      let dislikesList = [...(activeVideo.dislikedBy || [])];

      if (type === "like") {
        if (likesList.includes(userProfile.id)) {
          likesList = likesList.filter(id => id !== userProfile.id);
        } else {
          likesList.push(userProfile.id);
          dislikesList = dislikesList.filter(id => id !== userProfile.id);
          if (onAddCoins) onAddCoins(5, "Liked Video (+5 Coins)");
        }
      } else {
        if (dislikesList.includes(userProfile.id)) {
          dislikesList = dislikesList.filter(id => id !== userProfile.id);
        } else {
          dislikesList.push(userProfile.id);
          likesList = likesList.filter(id => id !== userProfile.id);
        }
      }

      await updateDoc(vDoc, {
        likedBy: likesList,
        dislikedBy: dislikesList,
        likes: likesList.length,
        dislikes: dislikesList.length
      });

      // Keep visual state in sync
      setActiveVideo({
        ...activeVideo,
        likedBy: likesList,
        dislikedBy: dislikesList,
        likes: likesList.length,
        dislikes: dislikesList.length
      });
    } catch (e) {
      console.error("Error rating video:", e);
    }
  };

  // Subscribe to channel
  const handleToggleSubscribe = async (creatorId: string) => {
    sfx.playBadgeUnlock();
    const targetChannel = channels[creatorId];
    
    // Simulate seed subscriber toggle
    if (creatorId.startsWith("creator-") || !targetChannel) {
      alert(`Subscribed to ${activeVideo?.creatorName || "Creator"} successfully! Blessed!`);
      return;
    }

    try {
      const cDoc = doc(db, "utube_channels", creatorId);
      let subs = [...(targetChannel.subscribers || [])];

      if (subs.includes(userProfile.id)) {
        subs = subs.filter(id => id !== userProfile.id);
      } else {
        subs.push(userProfile.id);
        if (onAddCoins) onAddCoins(25, `Subscribed to ${targetChannel.name} (+25 Coins)`);
      }

      await updateDoc(cDoc, {
        subscribers: subs,
        subCount: subs.length
      });
    } catch (err) {
      console.error("Error subscribing:", err);
    }
  };

  // Post Comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeVideo) return;
    sfx.playClick();

    const commentData = {
      videoId: activeVideo.id,
      authorId: userProfile.id,
      authorName: userProfile.username,
      authorAvatar: userProfile.avatarUrl,
      content: newCommentText,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: []
    };

    try {
      await addDoc(collection(db, "video_comments"), commentData);
      setNewCommentText("");

      // Update comments counter
      if (!activeVideo.id.startsWith("seed-")) {
        const vDoc = doc(db, "videos", activeVideo.id);
        await updateDoc(vDoc, {
          commentsCount: (activeVideo.commentsCount || 0) + 1
        });
      }

      if (onAddCoins) onAddCoins(10, "Commented on Video (+10 Coins)");
    } catch (err) {
      console.error("Comment post error:", err);
    }
  };

  // Edit Comment
  const handleEditComment = async (commentId: string) => {
    if (!editingCommentText.trim()) return;
    sfx.playClick();

    try {
      const cDoc = doc(db, "video_comments", commentId);
      await updateDoc(cDoc, {
        content: editingCommentText
      });
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (comment: UTubeComment) => {
    if (comment.authorId !== userProfile.id) return;
    sfx.playClick();

    try {
      await deleteDoc(doc(db, "video_comments", comment.id));
      
      // Update comments counter
      if (!comment.videoId.startsWith("seed-") && activeVideo) {
        const vDoc = doc(db, "videos", activeVideo.id);
        await updateDoc(vDoc, {
          commentsCount: Math.max(0, (activeVideo.commentsCount || 1) - 1)
        });
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // Copy streaming info
  const handleCopyStreamKey = () => {
    navigator.clipboard.writeText(`rtmp://utube.isekai.worlds/live/   [Key: ${generatedStreamKey}]`);
    sfx.playClick();
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredVideos = videos.filter((vid) => {
    const matchesCategory = activeCategory === "All" || vid.category === activeCategory;
    const matchesSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Platform Welcome Header */}
      <div className="relative rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" /> UTube: Live Stream & Video Platform
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            UTube Platform <span className="text-sm font-normal text-rose-300 lowercase font-mono">Blessed by Yahua, Yahusha</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All creations can view, see, post, react, edit and comment. We cater to UTubers, UVTubers, Streamers and Bloggers with direct upload & generated stream keys!
          </p>
        </div>

        {/* Action Button Area */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {myChannel ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload / Stream
              </button>

              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-xl">
                <img
                  src={myChannel.avatar}
                  alt={myChannel.name}
                  className="w-7 h-7 rounded-full object-cover border border-red-500/40"
                />
                <div className="text-[10px] font-mono">
                  <span className="text-white font-bold block truncate max-w-[80px]">{myChannel.name}</span>
                  <span className="text-red-400 text-[9px] uppercase font-bold">{myChannel.role}</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowChannelModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center gap-2 scale-105 hover:scale-110 duration-200"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Become a UTuber / UVTuber
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Video Player + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Video Player View & Details */}
        <div className="lg:col-span-2 space-y-4">
          {activeVideo ? (
            <div className="space-y-4">
              {/* Responsive Video/Stream Box */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                {activeVideo.isLive && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-red-600 text-white font-mono font-black text-[10px] uppercase tracking-wider rounded-md animate-pulse shadow flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE STREAM
                  </div>
                )}
                
                {activeVideo.url.includes("youtube.com") || activeVideo.url.includes("youtu.be") ? (
                  <iframe
                    src={activeVideo.url.replace("watch?v=", "embed/")}
                    title={activeVideo.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.url}
                    controls
                    autoPlay
                    muted={false}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={handleVideoError}
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Video Title & Rating Actions */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold uppercase rounded-md">
                      {activeVideo.category}
                    </span>
                    <h2 className="text-xl font-black text-white leading-snug">{activeVideo.title}</h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {activeVideo.views} views</span>
                      <span>•</span>
                      <span>{new Date(activeVideo.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Likes / Dislikes */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReactToVideo("like")}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold transition-all ${
                        activeVideo.likedBy?.includes(userProfile.id) ? "text-red-400 border-red-500/40" : "text-slate-300"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{activeVideo.likes}</span>
                    </button>
                    <button
                      onClick={() => handleReactToVideo("dislike")}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold transition-all ${
                        activeVideo.dislikedBy?.includes(userProfile.id) ? "text-slate-400 border-slate-500/40" : "text-slate-300"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{activeVideo.dislikes}</span>
                    </button>
                    <button
                      onClick={() => {
                        sfx.playClick();
                        navigator.clipboard.writeText(activeVideo.url);
                        alert("Video share link copied to clipboard!");
                      }}
                      className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all"
                      title="Share Video"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Creator Channel Strip */}
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeVideo.creatorAvatar || "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + activeVideo.creatorName}
                      alt={activeVideo.creatorName}
                      className="w-10 h-10 rounded-full object-cover border border-red-500/40"
                    />
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1">
                        {activeVideo.creatorName}
                        <Check className="w-3.5 h-3.5 bg-red-600 rounded-full p-0.5 text-white" />
                      </h4>
                      <span className="text-[10px] text-red-400 font-mono font-bold uppercase block">{activeVideo.creatorRole}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {channels[activeVideo.creatorId]?.subCount || 120} subscribers
                      </span>
                    </div>
                  </div>

                  {activeVideo.creatorId !== userProfile.id && (
                    <button
                      onClick={() => handleToggleSubscribe(activeVideo.creatorId)}
                      className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                        channels[activeVideo.creatorId]?.subscribers?.includes(userProfile.id)
                          ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          : "bg-red-600 text-white hover:bg-red-500"
                      }`}
                    >
                      {channels[activeVideo.creatorId]?.subscribers?.includes(userProfile.id) ? "Subscribed" : "Subscribe"}
                    </button>
                  )}
                </div>

                {/* Video Description Box */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850 text-xs text-slate-300 leading-relaxed font-sans">
                  {activeVideo.description}
                </div>
              </div>

              {/* Real-time Video Comments Section */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-500" />
                  <span>Comments ({comments.length})</span>
                </h3>

                {/* Comment Input */}
                <form onSubmit={handlePostComment} className="flex gap-3">
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.username}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a public comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      Comment
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pt-2">
                  {comments.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 font-mono py-4">No comments yet. Be the first to bless this video!</p>
                  ) : (
                    comments.map((comment) => {
                      const isOwnComment = comment.authorId === userProfile.id;
                      const isEditing = editingCommentId === comment.id;

                      return (
                        <div key={comment.id} className="flex gap-3 text-xs border-b border-slate-850/40 pb-3">
                          <img
                            src={comment.authorAvatar || "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + comment.authorName}
                            alt={comment.authorName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-200 font-mono">{comment.authorName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              {isOwnComment && (
                                <div className="flex items-center gap-1.5 text-slate-500">
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditingCommentText(comment.content);
                                    }}
                                    className="p-1 hover:text-white transition-colors"
                                    title="Edit Comment"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment)}
                                    className="p-1 hover:text-red-400 transition-colors"
                                    title="Delete Comment"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {isEditing ? (
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  value={editingCommentText}
                                  onChange={(e) => setEditingCommentText(e.target.value)}
                                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                                />
                                <button
                                  onClick={() => handleEditComment(comment.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-[10px] font-bold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingCommentId(null)}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg font-mono text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <p className="text-slate-300 font-sans">{comment.content}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
              Select a video to launch play mode.
            </div>
          )}
        </div>

        {/* Right Column: Interactive Video Explorer & Filters */}
        <div className="space-y-4">
          {/* Search bar inside list */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search UTube feed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full font-mono"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {["All", "VTuber", "UVTuber", "Gaming", "Vlog", "Blogger", "ASMR", "Music"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-red-600 text-white shadow"
                    : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Video List */}
          <div className="space-y-3 max-h-[680px] overflow-y-auto no-scrollbar pr-1">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="h-24 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
              ))
            ) : filteredVideos.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-500 font-mono text-xs">
                No videos found in this category.
              </div>
            ) : (
              filteredVideos.map((vid) => {
                const isActive = activeVideo?.id === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => handlePlayVideo(vid)}
                    className={`p-3 rounded-2xl border flex gap-3 cursor-pointer transition-all hover:scale-[1.02] ${
                      isActive
                        ? "bg-red-950/20 border-red-500/50 shadow-md shadow-red-900/10"
                        : "bg-slate-900/80 border-slate-850 hover:border-slate-700"
                    }`}
                  >
                    {/* Thumbnail box */}
                    <div className="relative w-28 h-20 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0">
                      {vid.isLive && (
                        <span className="absolute top-1 left-1 z-10 px-1.5 py-0.2 bg-red-600 text-white text-[8px] font-mono font-bold uppercase rounded flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                          LIVE
                        </span>
                      )}
                      
                      {vid.url.includes("youtube.com") || vid.url.includes("youtu.be") ? (
                        <img
                          src={`https://img.youtube.com/vi/${vid.url.split("v=")[1]?.split("&")[0] || "default"}/mqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                          <Play className="w-6 h-6 text-red-500/80" />
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] font-mono text-slate-300">Video</span>
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-red-400">
                        {vid.title}
                      </h4>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-300 font-mono font-medium block truncate">
                          {vid.creatorName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
                          <span>{vid.views} views</span>
                          <span>•</span>
                          <span className="text-red-400 font-bold uppercase">{vid.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Creator Registration Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleRegisterChannel}
            className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" /> Become a UTuber / UVTuber!
              </h2>
              <button
                type="button"
                onClick={() => setShowChannelModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Choose your creator avatar style and register on the UTube Platform. Upload recordings, anime videos, and gain celestial streams of followers in this isekai worlds!
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono text-slate-400 uppercase block font-semibold">Select Creator Path</label>
              <div className="grid grid-cols-3 gap-2">
                {(["UTuber", "UVTuber", "Isekai Blogger"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      sfx.playClick();
                      setCreatorRoleChoice(role);
                    }}
                    className={`p-3 rounded-xl border font-mono text-[10px] font-bold uppercase tracking-wider transition-all text-center ${
                      creatorRoleChoice === role
                        ? "bg-red-600/20 border-red-500 text-red-300 shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase block font-semibold">Channel Biography / Slogan</label>
                <textarea
                  value={channelBio}
                  onChange={(e) => setChannelBio(e.target.value)}
                  placeholder="Tell your fans who you are... (e.g. Blessed VTuber spreading joy!)"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              Launch My Channel 🚀
            </button>
          </form>
        </div>
      )}

      {/* Upload Video & Stream Setup Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleUploadVideo}
            className="w-full max-w-lg bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-500" /> Create Post / Set Up Stream
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video vs Livestream Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setIsLiveStreamUpload(false);
                }}
                className={`py-2 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                  !isLiveStreamUpload ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                📹 Upload Video Record
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setIsLiveStreamUpload(true);
                }}
                className={`py-2 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                  isLiveStreamUpload ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                📡 Set up Livestream
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase block font-semibold">Video Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter a catchy title..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase block font-semibold">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter video info, hashtags, tags..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 uppercase block font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  >
                    <option value="VTuber">VTuber</option>
                    <option value="UVTuber">UVTuber</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Vlog">Vlog</option>
                    <option value="Blogger">Blogger</option>
                    <option value="ASMR">ASMR</option>
                    <option value="Music">Music</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 uppercase block font-semibold">Video/Stream URL</label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Direct .mp4 Link or YouTube share link"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Livestream specific generated details */}
              {isLiveStreamUpload && (
                <div className="p-4 bg-red-950/10 border border-red-500/20 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono text-rose-300 font-bold uppercase tracking-wider">Stream Key Generator</span>
                    <button
                      type="button"
                      onClick={handleGenerateStreamKey}
                      className="px-3 py-1 bg-red-600/30 hover:bg-red-600 text-red-200 text-[10px] font-mono font-bold uppercase rounded-lg border border-red-500/40 transition-all flex items-center gap-1"
                    >
                      <Key className="w-3 h-3" />
                      <span>{generatedStreamKey ? "Regenerate" : "Generate stream key"}</span>
                    </button>
                  </div>

                  {generatedStreamKey && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-slate-300 bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex justify-between items-center">
                        <span className="truncate pr-2">rtmp://utube.isekai.worlds/live/  [Key: {generatedStreamKey}]</span>
                        <button
                          type="button"
                          onClick={handleCopyStreamKey}
                          className="text-[9px] text-red-400 hover:text-white font-bold"
                        >
                          {copiedKey ? "Copied!" : "Copy Stream info"}
                        </button>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 leading-normal block">
                        * Configure your streaming software (OBS, Streamlabs) to stream to this RMTP url with this generated stream key to broadcast live.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              {isLiveStreamUpload ? "Go Live Broadcast Now! 📡" : "Publish Video Record 🚀"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
