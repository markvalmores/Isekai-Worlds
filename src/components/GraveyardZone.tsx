import React from "react";
import { motion } from "motion/react";

export const GraveyardZone: React.FC<{ cards: any[] }> = ({ cards }) => {
  return (
    <div className="w-24 h-32 border-2 border-slate-700/50 rounded-xl bg-slate-950/80 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-[0_0_10px_rgba(30,41,59,0.5)]">
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Graveyard</span>
      
      {cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img 
            src={cards[cards.length - 1].imageUrl} 
            className="w-16 h-20 object-cover grayscale opacity-40 blur-[0.5px]" 
            alt="Destroyed Card"
          />
        </motion.div>
      )}

      {/* Ghostly particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0], 
              y: -50,
              x: (Math.random() - 0.5) * 20
            }}
            transition={{ 
              duration: 2 + Math.random(), 
              repeat: Infinity, 
              delay: i * 0.5 
            }}
            className="absolute bg-indigo-500/30 w-1 h-1 rounded-full"
            style={{ 
              left: `${10 + Math.random() * 80}%`,
              bottom: "10%"
            }}
          />
        ))}
      </div>
    </div>
  );
};
