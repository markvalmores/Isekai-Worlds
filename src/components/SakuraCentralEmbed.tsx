import React from 'react';

export function SakuraCentralEmbed() {
  return (
    <div className="w-full h-screen overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      <div className="absolute top-2 right-2 z-10">
         <button 
            onClick={() => {
              const iframe = document.getElementById('sakura-frame');
              if (iframe?.requestFullscreen) iframe.requestFullscreen();
            }}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
         >
            Full Screen
         </button>
      </div>
      <iframe
        id="sakura-frame"
        src="https://sakuracentral.net/cosplayer-gallery-2/"
        className="w-full h-full"
        title="Sakura Central"
        allowFullScreen
      />
    </div>
  );
}
