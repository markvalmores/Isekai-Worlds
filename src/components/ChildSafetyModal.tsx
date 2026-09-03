import React, { useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  Lock,
  CheckCircle2,
  ExternalLink,
  Users,
  PhoneCall,
  X,
  Sparkles,
  BookOpen,
  EyeOff,
  Flag,
  Info
} from "lucide-react";
import { sfx } from "../utils/sfx";

interface ChildSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge?: () => void;
  isMandatoryFirstOpen?: boolean;
}

export function ChildSafetyModal({
  isOpen,
  onClose,
  onAcknowledge,
  isMandatoryFirstOpen = false
}: ChildSafetyModalProps) {
  const [activeTab, setActiveTab] = useState<"safety" | "rules" | "reporting">("safety");
  const [hasAgreedCheck, setHasAgreedCheck] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleProceed = () => {
    sfx.playBadgeUnlock();
    try {
      localStorage.setItem("isekai_child_safety_acknowledged", "true");
      localStorage.setItem("isekai_child_safety_acknowledged_date", new Date().toISOString());
    } catch {}
    if (onAcknowledge) {
      onAcknowledge();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={() => {
        if (!isMandatoryFirstOpen) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-blue-500/40 shadow-2xl shadow-blue-900/40 overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 border-b border-indigo-500/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-rose-600 p-[2px] shrink-0 shadow-lg shadow-blue-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300">
                    Official Guidelines
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-400" /> Zero Tolerance Policy
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1 tracking-wide flex items-center gap-2">
                  Child Safety Policy & Community Guidelines
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Protecting minors, fostering respect, and ensuring a safe anime multiverse experience for everyone.
                </p>
              </div>
            </div>

            {!isMandatoryFirstOpen && (
              <button
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0"
                title="Close Window"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Section Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab("safety");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "safety"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
              }`}
            >
              <Shield className="w-4 h-4 text-blue-300" />
              <span>1. Safety & COPPA Policy</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab("rules");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "rules"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
              }`}
            >
              <Users className="w-4 h-4 text-purple-300" />
              <span>2. Community Rules & Privacy</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab("reporting");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "reporting"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
              }`}
            >
              <PhoneCall className="w-4 h-4 text-rose-300" />
              <span>3. Reporting & Hotlines</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 max-h-[52vh] bg-slate-900/95 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: SAFETY & COPPA POLICY */}
          {activeTab === "safety" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">Zero Tolerance for Child Harm & CSAM</h3>
                  <p className="text-xs text-blue-200">
                    Isekai Worlds strictly prohibits any Child Sexual Abuse Material (CSAM), exploitation, grooming, or harm of any kind. Any user attempting to upload, share, link to, or discuss illegal material involving minors will be permanently banned and immediately reported to international law enforcement authorities (including NCMEC and INHOPE).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Lock className="w-4 h-4 text-indigo-400" />
                    <span>COPPA & Global Minor Compliance</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    We adhere to the Children's Online Privacy Protection Act (COPPA) and international standards. We do not knowingly collect personal contact information (real names, physical addresses, telephone numbers) from children under the age of 13 without parental consent.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Age-Appropriate Content Curation</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    All anime streams, 4K wallpapers, GIFs, and community cosplay galleries are actively monitored and curated to maintain a family-safe, creative, and inspiring environment suitable for global anime fans.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Automated AI moderation filters all text and media uploads in real time.</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  ACTIVE 24/7
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: COMMUNITY RULES & PRIVACY */}
          {activeTab === "rules" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">Community Code of Conduct & Respect</h3>
                  <p className="text-xs text-purple-200">
                    We believe in an inclusive, kind, and supportive multiverse for all creators, gamers, cosplayers, and anime fans. Bullying, harassment, hate speech, and predatory behaviors are strictly banned.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-mono text-xs font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs">Anti-Bullying & Anti-Harassment</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Never engage in targeted harassment, hate speech, cyberbullying, doxxing, or threats. Treat every member with kindness and encouragement.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-mono text-xs font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs">Protecting Minor Privacy & Data</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Never ask for or share real-world personal identifiable info (PII) such as phone numbers, home locations, school names, or social security numbers in public posts or chats.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs">Safe Cosplay & Creative Expression</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cosplay photography and artwork must respect subjects and adhere to modesty and age-appropriate guidelines. Non-consensual imagery is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REPORTING & HOTLINES */}
          {activeTab === "reporting" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">Emergency Child Protection Resources</h3>
                  <p className="text-xs text-rose-200">
                    If you encounter any situation involving child exploitation, abuse, or urgent safety concerns anywhere on the internet, report it immediately to the official organizations below:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* NCMEC */}
                <a
                  href="https://report.cybertip.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-850 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors">
                        NCMEC CyberTipline
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      National Center for Missing & Exploited Children. Report child sexual exploitation & abuse.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-rose-300 font-bold bg-rose-950/60 px-2 py-1 rounded-lg border border-rose-500/30 self-start">
                    1-800-843-5678 • report.cybertip.org
                  </div>
                </a>

                {/* IWF */}
                <a
                  href="https://www.iwf.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">
                        Internet Watch Foundation (IWF)
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      International reporting portal to remove child sexual abuse content online anonymously.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-blue-300 font-bold bg-blue-950/60 px-2 py-1 rounded-lg border border-blue-500/30 self-start">
                    report.iwf.org.uk
                  </div>
                </a>

                {/* INHOPE */}
                <a
                  href="https://www.inhope.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs group-hover:text-indigo-400 transition-colors">
                        INHOPE Global Hotlines
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Worldwide network of 50+ national hotlines dedicated to stamping out CSAM globally.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-500/30 self-start">
                    inhope.org
                  </div>
                </a>

                {/* Direct Platform Safety Channel */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        Isekai Worlds Safety Trust Team
                      </span>
                      <Flag className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Flag any suspicious content directly to our safety moderators for instant review.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30 self-start">
                    safety@isekaiworlds.app
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300">
            <input
              type="checkbox"
              checked={hasAgreedCheck}
              onChange={(e) => setHasAgreedCheck(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 cursor-pointer"
            />
            <span>I confirm that I have read and agree to uphold all safety policies and community rules.</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isMandatoryFirstOpen && (
              <button
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                Close
              </button>
            )}

            <button
              onClick={handleProceed}
              disabled={!hasAgreedCheck}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                hasAgreedCheck
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-blue-600/30 hover:scale-105"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>I Understand & Proceed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
