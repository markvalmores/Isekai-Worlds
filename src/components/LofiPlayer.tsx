import React, { useState, useEffect, useRef } from "react";
import { Disc3, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Radio } from "lucide-react";
import { sfx } from "../utils/sfx";

const LOFI_TRACKS = [
  { title: "🌸 Tokyo Rain - Lo-Fi Anime Chill", src: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg" },
  { title: "✨ Midnight Coffee & Anime Beats", src: "https://commondatastorage.googleapis.com/codeskulptor-assets/ricochet.ogg" },
  { title: "🌙 Akihabara Sunset Lofi", src: "https://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg" },
  { title: "⚡ Otaku Study Session", src: "https://commondatastorage.googleapis.com/codeskulptor-assets/weekdays.ogg" }
];

export const LofiPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = LOFI_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    sfx.playClick();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Handle autoplay policy
        setIsPlaying(false);
      });
    }
  };

  const nextTrack = () => {
    sfx.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % LOFI_TRACKS.length);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 100);
  };

  const prevTrack = () => {
    sfx.playClick();
    setCurrentTrackIndex((prev) => (prev - 1 + LOFI_TRACKS.length) % LOFI_TRACKS.length);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 100);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-pink-500/30 text-xs font-mono shadow-md backdrop-blur-md">
      <audio
        ref={audioRef}
        src={track.src}
        loop
        onEnded={nextTrack}
      />

      <button
        onClick={togglePlay}
        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
          isPlaying ? "bg-pink-600 text-white shadow-md shadow-pink-600/30 animate-pulse" : "bg-slate-800 text-pink-300 hover:text-white"
        }`}
        title={isPlaying ? "Pause Lo-Fi Music" : "Play Lo-Fi Anime Music"}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      <div className="hidden sm:flex flex-col max-w-[150px] truncate">
        <div className="flex items-center gap-1.5">
          <Disc3 className={`w-3 h-3 text-pink-400 ${isPlaying ? "animate-spin" : ""}`} />
          <span className="text-white font-bold truncate text-[11px]">{track.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
        <button
          onClick={prevTrack}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Previous Track"
        >
          <SkipBack className="w-3 h-3" />
        </button>
        <button
          onClick={nextTrack}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Next Track"
        >
          <SkipForward className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            sfx.playClick();
            setIsMuted(!isMuted);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors ml-1"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-pink-400" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-12 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500 hidden md:block"
          title="Volume"
        />
      </div>
    </div>
  );
};
