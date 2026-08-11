import React, { useState } from "react";
import { sfx } from "../utils/sfx";
import {
  Heart,
  X,
  ExternalLink,
  Copy,
  Check,
  CreditCard,
  QrCode,
  Sparkles,
  Users,
  Shield,
  Star
} from "lucide-react";

interface DonationCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGoldMode?: boolean;
}

export const DonationCreditsModal: React.FC<DonationCreditsModalProps> = ({
  isOpen,
  onClose,
  isGoldMode = false,
}) => {
  if (!isOpen) return null;

  const [copiedGcash, setCopiedGcash] = useState(false);

  const gcashNumber = "09763329358";
  const gcashName = "Mark David";

  const handleCopyGcash = () => {
    sfx.playClick();
    navigator.clipboard.writeText(gcashNumber);
    setCopiedGcash(true);
    setTimeout(() => setCopiedGcash(false), 2500);
  };

  const creators = [
    { name: "Mark David Valmores", role: "Creator & Lead Architect", avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80" },
    { name: "Usagyuun VTuber", role: "Official VTuber Streamer & Ambassador", avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80" },
    { name: "Junichi555", role: "Co-Developer & Shader Specialist", avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80" },
    { name: "Eleventh Gyuuun", role: "Community Director & Quality Specialist", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div
        className={`relative max-w-xl w-full rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border ${
          isGoldMode
            ? "bg-amber-950/90 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
            : "bg-slate-900 border-indigo-500/30"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-amber-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500/30" />
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-black uppercase tracking-wider font-mono ${isGoldMode ? "text-amber-300" : "text-white"}`}>
                Support & Official Credits
              </h3>
              <p className="text-xs text-slate-400 font-mono">Donations directly empower project development</p>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Donation Options */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold font-mono uppercase text-rose-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Support Isekai Worlds Project</span>
          </h4>

          {/* Streamlabs Tip Option */}
          <a
            href="https://streamlabs.com/usagyuunvtuber/tip"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sfx.playClick()}
            className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-rose-950/80 border border-purple-500/40 hover:border-rose-400 transition-all flex items-center justify-between group shadow-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                  Streamlabs Tip / Donation
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                  PayPal / Credit Card
                </span>
              </div>
              <p className="text-xs text-slate-400">https://streamlabs.com/usagyuunvtuber/tip</p>
            </div>
            <ExternalLink className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* GCash Option */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-cyan-400">GCash Mobile Transfer</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  Direct Philippines
                </span>
              </div>
              <p className="text-xs text-slate-200 font-mono">
                Account Name: <strong>{gcashName}</strong> | Number: <strong>{gcashNumber}</strong>
              </p>
            </div>

            <button
              onClick={handleCopyGcash}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copiedGcash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copiedGcash ? "Number Copied!" : "Copy GCash"}</span>
            </button>
          </div>
        </div>

        {/* Project Credits */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold font-mono uppercase text-purple-300 flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Honorable Creators & Credits</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {creators.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3"
              >
                <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-purple-500/40 shrink-0" />
                <div className="overflow-hidden">
                  <h5 className="font-bold text-xs text-white truncate">{c.name}</h5>
                  <p className="text-[10px] text-purple-300 font-mono truncate">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
