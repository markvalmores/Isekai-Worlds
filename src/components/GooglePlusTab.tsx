import React, { useState } from "react";
import { Globe, Sparkles, ExternalLink, RefreshCw, Maximize, Search, MessageSquare, Shield, Layers } from "lucide-react";
import { sfx } from "../utils/sfx";

export const GooglePlusTab: React.FC = () => {
  const [activeService, setActiveService] = useState<"google" | "gemini">("google");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [geminiPrompt, setGeminiPrompt] = useState<string>("");
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'gemini'; text: string }>>([
    { role: "gemini", text: "Hello! I am Gemini. How can I assist you today within the Google+ Realm?" }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGoogleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    sfx.playClick();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
  };

  const handleGeminiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiPrompt.trim() || isGenerating) return;
    sfx.playClick();
    const userText = geminiPrompt.trim();
    const updatedHistory = [...chatLog, { role: "user" as const, text: userText }];
    setChatLog(updatedHistory);
    setGeminiPrompt("");
    setIsGenerating(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          history: updatedHistory.slice(-6)
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        // If response is raw HTML or text instead of JSON
        if (rawText && rawText.length < 500 && !rawText.toLowerCase().includes("<!doctype")) {
          data = { reply: rawText };
        } else {
          data = { reply: `Gemini server returned non-JSON response: ${rawText.slice(0, 100)}...` };
        }
      }

      if (data && data.reply) {
        setChatLog(prev => [...prev, { role: "gemini", text: data.reply }]);
      } else {
        setChatLog(prev => [...prev, { role: "gemini", text: "I received your prompt, but encountered an unexpected response format." }]);
      }
    } catch (err: any) {
      console.error("Gemini request error:", err);
      const errMsg = err.name === "AbortError" ? "Request timed out after 25 seconds." : (err.message || "Unknown error");
      setChatLog(prev => [...prev, { role: "gemini", text: `Gemini response notice: ${errMsg}` }]);
    } finally {
      setIsGenerating(false);
      sfx.playClick();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-slate-950">
      {/* Top Header Bar */}
      <div className="border-b border-blue-500/30 bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-950 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
              <Globe className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>GOOGLE+ & GEMINI ECOSYSTEM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
              <span>🌐 Google+ Portal</span>
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              Direct access to Google Search and Gemini AI App integration.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                sfx.playClick();
                setActiveService("google");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-2 ${
                activeService === "google"
                  ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/40"
              }`}
            >
              <Globe className="w-4 h-4 text-blue-300" />
              <span>Google Search (google.com)</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveService("gemini");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-2 ${
                activeService === "gemini"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gemini App (gemini.google.com)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {activeService === "google" ? (
          <div className="flex-1 bg-slate-900 border-2 border-blue-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col">
            {/* Top Toolbar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-blue-500/30 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block animate-pulse" />
                <span className="text-white font-bold">Embed URL:</span>
                <span className="text-blue-400">https://www.google.com/</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open google.com in New Tab</span>
                </a>
              </div>
            </div>

            {/* Google Embedded View / Interactive Search Simulator */}
            <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-center">
              <div className="max-w-2xl w-full space-y-8">
                <div className="space-y-3">
                  <div className="text-5xl sm:text-6xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-amber-400">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-emerald-500">l</span>
                    <span className="text-red-500">e</span>
                    <span className="text-slate-400 text-2xl font-mono">+</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono">
                    Search the world's information, webpages, images, and more.
                  </p>
                </div>

                <form onSubmit={handleGoogleSearch} className="relative flex items-center max-w-xl mx-auto">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Google or type a URL..."
                    className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-950 border border-blue-500/30 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-blue-400 shadow-xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md"
                  >
                    Google Search
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  <a
                    href="https://www.google.com/search?q=VTubers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
                  >
                    <div className="text-xs font-mono font-bold text-blue-400 mb-1">Trending Search</div>
                    <div className="text-sm font-bold text-white group-hover:text-blue-300">VTubers Live Streams</div>
                  </a>
                  <a
                    href="https://images.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
                  >
                    <div className="text-xs font-mono font-bold text-emerald-400 mb-1">Google Images</div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-300">Explore Wallpapers & Art</div>
                  </a>
                  <a
                    href="https://news.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
                  >
                    <div className="text-xs font-mono font-bold text-amber-400 mb-1">Google News</div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-300">Global Headlines</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-slate-900 border-2 border-indigo-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.2)] flex flex-col">
            {/* Top Toolbar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-indigo-500/30 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block animate-pulse" />
                <span className="text-white font-bold">Embed URL:</span>
                <span className="text-indigo-400">https://gemini.google.com/app</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://gemini.google.com/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open gemini.google.com in New Tab</span>
                </a>
              </div>
            </div>

            {/* Gemini App Embedded Chat Interface */}
            <div className="flex-1 flex flex-col bg-slate-950">
              <div className="bg-slate-900/80 border-b border-indigo-500/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Gemini Web App</h2>
                    <p className="text-[11px] font-mono text-indigo-300">Powered by Google AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Online
                  </span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[55vh]">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user" ? "bg-blue-600 text-white" : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                    }`}>
                      {msg.role === "user" ? "U" : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-xl px-4 py-3 rounded-2xl text-xs sm:text-sm font-mono leading-relaxed shadow-md ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-900 border border-indigo-500/30 text-slate-200 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-mono animate-pulse">
                      Gemini is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 sm:p-6 bg-slate-900 border-t border-indigo-500/20">
                <form onSubmit={handleGeminiSubmit} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={geminiPrompt}
                    onChange={(e) => setGeminiPrompt(e.target.value)}
                    placeholder="Ask Gemini anything or prompt creative ideas..."
                    className="flex-1 px-4 py-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-white placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-indigo-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
