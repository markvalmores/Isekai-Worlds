import React, { useState } from "react";
import { Mic, MicOff, Sparkles, X, Globe, Search, ArrowRight, Zap } from "lucide-react";
import { sfx } from "../utils/sfx";
import { PageView } from "../types";

interface GlobalVoiceNavigatorProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
}

export const GlobalVoiceNavigator: React.FC<GlobalVoiceNavigatorProps> = ({
  currentPage,
  setCurrentPage
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pagesMap: Record<string, PageView> = {
    home: "home",
    portal: "home",
    hub: "home",
    wallpaper: "wallpapers",
    wallpapers: "wallpapers",
    backgrounds: "wallpapers",
    gif: "gifs",
    gifs: "gifs",
    cosplay: "cosplay",
    costume: "cosplay",
    vocaloid: "vocaloid",
    miku: "vocaloid",
    karaoke: "karaoke",
    sing: "karaoke",
    stream: "media",
    streams: "media",
    live: "media",
    media: "media",
    watch: "watch",
    anime: "watch",
    games: "games",
    game: "games",
    arcade: "games",
    roms: "roms",
    emulator: "roms",
    cards: "cards",
    gacha: "cards",
    dictionary: "dictionary",
    define: "dictionary",
    languages: "dictionary",
    community: "community",
    chat: "community",
    achievements: "achievements",
    badges: "achievements",
    leaderboard: "leaderboard",
    top: "leaderboard",
    profile: "profile",
    dashboard: "profile",
    vr: "vr",
    "3d": "vr",
    hardware: "hardware",
    specs: "hardware",
    radio: "radio",
    amv: "amv",
    music: "radio",
    vercel: "vercel",
    apps: "vercel",
    cinemax: "cinemax",
    movies: "cinemax",
    cinema: "cinemax",
    history: "history",
    logs: "history"
  };

  const executeVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    setTranscript(text);
    sfx.playBadgeUnlock();

    // Check for navigation match
    let matchedPage: PageView | null = null;
    for (const [keyword, page] of Object.entries(pagesMap)) {
      if (text.includes(keyword)) {
        matchedPage = page;
        break;
      }
    }

    if (matchedPage) {
      setCurrentPage(matchedPage);
      setFeedback(`Navigating to ${matchedPage.toUpperCase()}! ("${rawText}")`);
      sfx.playClick();
      setTimeout(() => {
        setFeedback(null);
        setIsOpen(false);
      }, 2500);
    } else {
      setFeedback(`Command not recognized: "${rawText}". Try saying "Go to Wallpapers", "Dictionary", "Watch Anime", or "Games".`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setFeedback("Speech recognition is not supported in this browser.");
      setIsOpen(true);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setIsOpen(true);
      setFeedback("Listening for voice command... (e.g., 'Go to Dictionary', 'Watch Anime', 'Wallpapers')");
      sfx.playClick();

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          executeVoiceCommand(spoken);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Voice command error", event.error);
        setIsListening(false);
        setFeedback(`Voice error: ${event.error}`);
        setTimeout(() => setFeedback(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      setFeedback("Could not start microphone.");
    }
  };

  return (
    <>
      {/* Floating Global Voice Commander Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 text-white font-mono text-xs font-bold shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-purple-400/50 hover:scale-105 active:scale-95 transition-all"
          title="Global Voice Command: Say anything to search or go anywhere"
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          <Mic className="w-5 h-5 text-emerald-300 animate-pulse" />
          <span className="hidden sm:inline">Voice Assistant</span>
        </button>
      </div>

      {/* Voice Commander Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.3)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Mic className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Global Voice Assistant</h3>
                  <p className="text-xs font-mono text-slate-400">Speak any command or destination</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mic Activation Area */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <button
                onClick={startVoiceSearch}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl border-2 ${
                  isListening
                    ? "bg-red-500 text-white border-red-300 animate-ping shadow-red-500/80 scale-110"
                    : "bg-gradient-to-tr from-purple-600 to-pink-600 text-white border-purple-400 hover:scale-105 shadow-purple-600/50"
                }`}
              >
                <Mic className={`w-10 h-10 ${isListening ? "animate-spin" : ""}`} />
              </button>
              <p className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                {isListening ? "Listening to your voice..." : "Tap microphone to speak"}
              </p>
            </div>

            {/* Transcript & Feedback */}
            {transcript && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Recognized Speech:</span>
                <p className="text-sm font-mono text-emerald-400 font-bold">"{transcript}"</p>
              </div>
            )}

            {feedback && (
              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-500/40 text-xs font-mono text-purple-200">
                {feedback}
              </div>
            )}

            {/* Quick Command Suggestions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Quick Voice Suggestions:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Go to Dictionary",
                  "Watch Anime",
                  "Wallpapers",
                  "Arcade Games",
                  "Global Leaderboard",
                  "Vocaloid Portal"
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => executeVoiceCommand(cmd)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 text-xs font-mono transition-all flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-purple-400" />
                    <span>"{cmd}"</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
