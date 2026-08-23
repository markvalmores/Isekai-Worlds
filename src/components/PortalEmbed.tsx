import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PortalEmbedProps {
  url: string;
  title?: string;
}

/**
 * A component designed for embedding the Isekai Worlds applet 
 * into external websites (Wix, Squarespace, etc.).
 * Provides full-screen iframe styling, a responsive container,
 * and a 'Copy Code' helper feature for users.
 */
export const PortalEmbed: React.FC<PortalEmbedProps> = ({ 
  url, 
  title = "Isekai Worlds Portal" 
}) => {
  const [copied, setCopied] = useState(false);
  const embedCode = `<iframe src="${url}" width="100%" height="600px" frameborder="0" allow="fullscreen; accelerometer; camera; microphone; geolocation" title="${title}"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* The Iframe Container */}
      <div className="w-full h-[500px] overflow-hidden bg-slate-950 rounded-xl border border-indigo-500/30">
        <iframe
          src={url}
          className="w-full h-full border-none"
          title={title}
          allow="fullscreen; accelerometer; camera; microphone; geolocation"
          loading="lazy"
        />
      </div>

      {/* Copy Code Helper */}
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
        <code className="text-xs text-indigo-300 font-mono overflow-x-auto whitespace-nowrap">
          {embedCode}
        </code>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
    </div>
  );
};
