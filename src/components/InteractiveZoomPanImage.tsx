import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";

interface InteractiveZoomPanImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const InteractiveZoomPanImage: React.FC<InteractiveZoomPanImageProps> = ({
  src,
  alt,
  className = ""
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const initialTouchDistance = useRef<number | null>(null);

  // Reset view
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Pan controls (left, right, up, down)
  const pan = (dx: number, dy: number) => {
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.2 : -0.2;
    setScale((prev) => {
      const next = Math.min(Math.max(prev + zoomFactor, 1), 5);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Pinch & Drag Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialTouchDistance.current = dist;
    } else if (e.touches.length === 1) {
      // Single finger drag
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistance.current !== null) {
      // Pinch gesture active
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (currentDist - initialTouchDistance.current) * 0.01;
      setScale((prev) => {
        const next = Math.min(Math.max(prev + delta, 1), 5);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
      initialTouchDistance.current = currentDist;
    } else if (e.touches.length === 1 && isDragging) {
      // Single finger pan
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialTouchDistance.current = null;
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing select-none bg-slate-950 rounded-2xl border border-slate-800 touch-none ${className}`}
    >
      {/* Zoomable Image Container */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center center"
        }}
      >
        <img src={src} alt={alt} className="max-w-full max-h-full object-contain pointer-events-none" referrerPolicy="no-referrer" />
      </div>

      {/* Floating HUD Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-indigo-500/30 z-20 shadow-xl">
        <span className="px-2 py-1 text-[10px] font-mono font-bold text-cyan-300 bg-slate-900 rounded-xl border border-cyan-500/30">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4 text-rose-400" />
        </button>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          title="Reset View (100%)"
        >
          <RotateCcw className="w-4 h-4 text-purple-400" />
        </button>
      </div>

      {/* Directional Pan Arrows Overlay (Visible when zoomed or clicked) */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-indigo-500/30 z-20 shadow-xl">
        <button
          onClick={() => pan(30, 0)}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Pan Left"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-300" />
        </button>
        <button
          onClick={() => pan(-30, 0)}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Pan Right"
        >
          <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
        </button>
        <button
          onClick={() => pan(0, 30)}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Pan Up"
        >
          <ArrowUp className="w-3.5 h-3.5 text-cyan-300" />
        </button>
        <button
          onClick={() => pan(0, -30)}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Pan Down"
        >
          <ArrowDown className="w-3.5 h-3.5 text-cyan-300" />
        </button>
      </div>

      {/* Touch / Drag Gesture Instructions Badge */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-400 pointer-events-none">
        <Move className="w-3 h-3 text-purple-400" />
        <span>Pinch, scroll wheel, or drag to pan/zoom</span>
      </div>
    </div>
  );
};
