import React, { useRef } from "react";
import { Maximize2 } from "lucide-react";

export function CineMax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <button
        onClick={toggleFullScreen}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
      >
        <Maximize2 className="w-4 h-4" /> Full Screen
      </button>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: "1200px",
          height: "80vh",
          minHeight: "600px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          backgroundColor: "#0f172a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <iframe
          src="https://cinego.co/home/"
          title="Cinego"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
