import React from "react";
import { motion } from "motion/react";

interface TurnIndicatorProps {
  isPlayerTurn: boolean;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ isPlayerTurn }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer Glow Ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
          }}
          className={`absolute inset-0 rounded-full border-4 border-t-transparent ${
            isPlayerTurn ? "border-emerald-500/50" : "border-red-500/50"
          }`}
        />
        
        {/* Inner Label */}
        <div className={`text-xs font-mono font-bold uppercase tracking-widest ${
          isPlayerTurn ? "text-emerald-400" : "text-red-400"
        }`}>
          {isPlayerTurn ? "YOUR TURN" : "OPPONENT"}
        </div>
      </div>
    </div>
  );
};
