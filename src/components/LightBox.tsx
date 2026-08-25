import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Heart } from "lucide-react";
import { CosplayItem } from "../types";

interface LightBoxProps {
  item: CosplayItem | null;
  onClose: () => void;
}

export function LightBox({ item, onClose }: LightBoxProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-950/50 hover:bg-slate-950 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full max-h-[80vh] object-contain"
          />
          
          <div className="p-6 bg-slate-900 border-t border-slate-800">
            <h2 className="text-xl font-black text-white">{item.title}</h2>
            <div className="flex items-center justify-between text-sm text-slate-400 mt-2">
              <span>{item.character} • {item.series}</span>
              <span className="font-mono text-pink-400 font-bold">Artist: {item.artist}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
