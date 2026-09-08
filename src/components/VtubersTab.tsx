import React, { useState } from "react";
import { Tv, ExternalLink, Maximize, RotateCcw, Sparkles, Radio, Play, ShieldCheck, Heart } from "lucide-react";
import { sfx } from "../utils/sfx";

export const VtubersTab: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  // Default to the requested VTuber livestream embed URL
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string>("https://www.youtube.com/embed/Af7pRKJYFE0");
  const [customSearchQuery, setCustomSearchQuery] = useState<string>("VTuber");

  // Polling state
  const [pollOptions, setPollOptions] = useState([
    { id: "stream-1", name: "VTuber Live Stream", votes: 42 },
    { id: "stream-2", name: "Hololive English", votes: 68 },
    { id: "stream-3", name: "Nijisanji En", votes: 35 },
    { id: "stream-4", name: "Vgen Stream", votes: 50 },
    { id: "stream-5", name: "VShojo", votes: 29 }
  ]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVotedId, setUserVotedId] = useState<string | null>(null);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  const popularVtuberStreams = [
    { name: "VTuber Live Stream", embedUrl: "https://www.youtube.com/embed/Af7pRKJYFE0", linkUrl: "https://www.youtube.com/watch?v=Af7pRKJYFE0", query: "VTuber live", icon: "🔴" },
    { name: "Hololive English", embedUrl: "https://www.youtube.com/embed/54oaXuyyfMc", linkUrl: "https://www.youtube.com/watch?v=54oaXuyyfMc", query: "hololive english", icon: "✨" },
    { name: "Nijisanji En", embedUrl: "https://www.youtube.com/embed/8BiOeQQn3io", linkUrl: "https://www.youtube.com/watch?v=8BiOeQQn3io", query: "nijisanji en", icon: "🌟" },
    { name: "Holostars", embedUrl: "https://www.youtube.com/embed/F9m6j-RKxYo", linkUrl: "https://www.youtube.com/watch?v=F9m6j-RKxYo", query: "holostars", icon: "⭐" },
    { name: "Holostars English", embedUrl: "https://www.youtube.com/embed/UdXvaf0Ld80", linkUrl: "https://www.youtube.com/watch?v=UdXvaf0Ld80", query: "holostars english", icon: "💫" },
    { name: "HIMEHINA", embedUrl: "https://www.youtube.com/embed/rPARkChnFA0", linkUrl: "https://www.youtube.com/watch?v=rPARkChnFA0", query: "himehina", icon: "🌸" },
    { name: "VShojo", embedUrl: "https://www.youtube.com/embed/8UqsrwIZVRw", linkUrl: "https://www.youtube.com/watch?v=8UqsrwIZVRw", query: "vshojo", icon: "💜" },
    { name: "Vgen", embedUrl: "https://www.youtube.com/embed/22BjqX3khS0", linkUrl: "https://www.youtube.com/watch?v=22BjqX3khS0", query: "vgen", icon: "💎" },
    { name: "Hololive ReGLOSS", embedUrl: "https://www.youtube.com/embed/_I7rCnEDJfo", linkUrl: "https://www.youtube.com/watch?v=_I7rCnEDJfo", query: "hololive regloss", icon: "🎨" },
    { name: "Hololive FLOW GLOW", embedUrl: "https://www.youtube.com/embed/0ko7LKM3yoU", linkUrl: "https://www.youtube.com/watch?v=0ko7LKM3yoU", query: "hololive flow glow", icon: "🔥" },
    { name: "VTuber NEWS", embedUrl: "https://www.youtube.com/embed/Y1gTa-8-5eg", linkUrl: "https://www.youtube.com/watch?v=Y1gTa-8-5eg", query: "vtuber news", icon: "📰" }
  ];

  const handleVote = (id: string) => {
    sfx.playClick();
    if (!hasVoted) {
      setPollOptions(pollOptions.map(opt => opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt));
      setHasVoted(true);
      setUserVotedId(id);
    }
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim()) return;
    sfx.playClick();
    const newId = `custom-${Date.now()}`;
    setPollOptions([...pollOptions, { id: newId, name: newSuggestion.trim(), votes: 1 }]);
    setNewSuggestion("");
    setSuggestionSubmitted(true);
    if (!hasVoted) {
      setHasVoted(true);
      setUserVotedId(newId);
    }
    setTimeout(() => setSuggestionSubmitted(false), 4000);
  };

  const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

  const handleFullscreenToggle = () => {
    sfx.playClick();
    const elem = document.getElementById("vtubers-embed-container");
    if (!document.fullscreenElement) {
      elem?.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 flex flex-col selection:bg-pink-500 selection:text-slate-950">
      {/* Top Header Bar */}
      <div className="border-b border-pink-500/30 bg-gradient-to-r from-slate-950 via-pink-950/30 to-slate-950 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold">
              <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>VTUBERS STREAMING & VIDEO PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
              <span>🌸 VTubers Hub & Live Feed</span>
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              Immersive full-screen YouTube VTuber video streams, channels, and search results.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularVtuberStreams.map((v) => (
              <button
                key={v.name}
                onClick={() => {
                  sfx.playClick();
                  setActiveEmbedUrl(v.embedUrl);
                  setCustomSearchQuery(v.query);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                  activeEmbedUrl === v.embedUrl
                    ? "bg-pink-600 text-white border-pink-400 shadow-lg shadow-pink-600/30"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/40"
                }`}
              >
                <span>{v.icon}</span>
                <span>{v.name}</span>
              </button>
            ))}

            <button
              onClick={handleFullscreenToggle}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <Maximize className="w-4 h-4 text-pink-400" />
              <span>Full Screen</span>
            </button>

            <a
              href={popularVtuberStreams.find(v => v.embedUrl === activeEmbedUrl)?.linkUrl || "https://www.youtube.com/results?search_query=VTuber"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Video & Web Embed Stage */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        <div
          id="vtubers-embed-container"
          className="relative flex-1 min-h-[75vh] w-full bg-slate-900 border-2 border-pink-500/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.3)] flex flex-col"
        >
          {/* Top Embedded Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-pink-500/30 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 truncate">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping" />
              <span className="text-white font-bold truncate">Live VTuber Stream Embed:</span>
              <span className="text-pink-400 truncate max-w-md">{activeEmbedUrl}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sfx.playClick();
                  const iframe = document.getElementById("vtuber-iframe") as HTMLIFrameElement;
                  if (iframe) iframe.src = activeEmbedUrl;
                }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-pink-300 hover:text-white transition-colors"
                title="Reload Frame"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleFullscreenToggle}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-pink-300 hover:text-white transition-colors"
                title="Full Screen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Iframe Embed */}
          <div className="relative flex-1 w-full bg-slate-950 min-h-[500px]">
            <iframe
              id="vtuber-iframe"
              src={activeEmbedUrl}
              title="VTubers YouTube Embed"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Interactive Polling & Suggestions Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Polling Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-pink-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-black text-white">Community VTuber Stream Poll</h3>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300">
                  {totalVotes} Total Votes
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Vote for your favorite VTuber stream or agency channel below! Results update instantly in real-time.
              </p>

              <div className="space-y-3">
                {pollOptions.map((opt) => {
                  const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const isUserPick = userVotedId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleVote(opt.id)}
                      className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer group ${
                        isUserPick
                          ? "bg-pink-950/40 border-pink-500 shadow-lg shadow-pink-500/20"
                          : "bg-slate-950/60 border-slate-800 hover:border-pink-500/40 hover:bg-slate-950"
                      }`}
                    >
                      {/* Percentage Progress Bar Background */}
                      <div
                        className="absolute inset-y-0 left-0 bg-pink-600/20 transition-all duration-500 pointer-events-none"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                            isUserPick ? "bg-pink-600 border-pink-400 text-white" : "border-slate-700 text-slate-500"
                          }`}>
                            {isUserPick ? "✓" : ""}
                          </div>
                          <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                            {opt.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono font-bold">
                          <span className="text-pink-400">{percentage}%</span>
                          <span className="text-slate-400">({opt.votes} votes)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {hasVoted && (
              <div className="mt-4 p-3 rounded-xl bg-pink-950/30 border border-pink-500/30 text-center text-xs text-pink-300 font-mono">
                🎉 Thank you for voting! Your voice has been recorded in the VTuber community ledger.
              </div>
            )}
          </div>

          {/* Suggestion Box Card */}
          <div className="bg-slate-900 border border-pink-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-black text-white">Suggest a VTuber Stream</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Have a favorite stream or clipper you want to add to the poll and watch together? Submit it here!
              </p>

              <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-2">
                    VTuber Name or Stream Title
                  </label>
                  <input
                    type="text"
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    placeholder="e.g. Pekora, Gawr Gura, etc."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Suggestion to Poll</span>
                </button>
              </form>

              {suggestionSubmitted && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-300 font-mono">
                  ✨ Successfully added to poll options!
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono text-center">
              Isekai Realm • VTuber Community Hub
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
