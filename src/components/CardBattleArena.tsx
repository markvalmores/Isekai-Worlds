import React from "react";
import { motion } from "motion/react";
import { sfx } from "../utils/sfx";
import { TurnIndicator } from "./TurnIndicator";
import { GraveyardZone } from "./GraveyardZone";

const SLOT_COUNT = 5;

const CardSlot: React.FC<{ type: "monster" | "spell"; position: number; isOpponent?: boolean; card?: any }> = ({ type, position, isOpponent, card }) => (
  <motion.div
    onMouseEnter={() => sfx.playDigitalChime()}
    whileHover={{ 
        scale: 1.1, 
        rotateX: isOpponent ? -10 : 10, 
        rotateY: isOpponent ? 10 : -10,
        boxShadow: "0 0 20px 5px rgba(168, 85, 247, 0.6)"
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`w-20 h-28 border-2 rounded-xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm transition-all duration-300 ${
      type === "monster" 
        ? "bg-gradient-to-br from-indigo-950/50 to-indigo-900/30 border-indigo-500/50" 
        : "bg-gradient-to-br from-purple-950/50 to-purple-900/30 border-purple-500/50"
    } ${isOpponent ? "rotate-180" : ""}`}
  >
    {card ? (
      <img src={card.imageUrl} className="w-full h-full object-cover" />
    ) : (
      <span className="text-[10px] font-mono text-white/50">{type === "monster" ? "M" : "S"}</span>
    )}
  </motion.div>
);

export const CardBattleArena: React.FC<{ 
  playerCard?: any; 
  opponentCard?: any; 
  battleMode: string;
  isPlayerTurn: boolean;
  destroyedCards: any[];
}> = ({ playerCard, opponentCard, battleMode, isPlayerTurn, destroyedCards }) => {
  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-indigo-500/30 flex flex-col items-center p-6 perspective-1000">
      <div className="absolute top-4 z-20">
        <TurnIndicator isPlayerTurn={isPlayerTurn} />
      </div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <GraveyardZone cards={destroyedCards} />
      </div>
      <motion.div className="w-full h-full flex flex-col justify-around transform-style-3d rotate-x-12">
        {/* Opponent Field */}
        <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-3">
                {Array(SLOT_COUNT).fill(0).map((_, i) => <CardSlot key={i} type="spell" position={i} isOpponent />)}
            </div>
            <div className="flex gap-3">
                <CardSlot type="monster" position={0} isOpponent card={battleMode.includes("active") ? opponentCard : null} />
                {Array(4).fill(0).map((_, i) => <CardSlot key={i+1} type="monster" position={i+1} isOpponent />)}
            </div>
        </div>
        <div className="w-full h-px bg-indigo-500/20 my-4" />
        {/* Player Field */}
        <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-3">
                <CardSlot type="monster" position={0} card={battleMode.includes("active") ? playerCard : null} />
                {Array(4).fill(0).map((_, i) => <CardSlot key={i+1} type="monster" position={i+1} />)}
            </div>
            <div className="flex gap-3">
                {Array(SLOT_COUNT).fill(0).map((_, i) => <CardSlot key={i} type="spell" position={i} />)}
            </div>
        </div>
      </motion.div>
    </div>
  );
};
