import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Globe,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Lock,
  Zap,
  Info,
  Copy,
  Check
} from "lucide-react";
import { UserProfile, SocialAccounts } from "../types";
import { sfx } from "../utils/sfx";

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const PROVIDERS = [
  {
    id: "google",
    name: "Google",
    icon: "🌐",
    color: "from-red-600 to-amber-600",
    bgColor: "bg-red-950/40 border-red-500/40",
    textColor: "text-red-400"
  },
  {
    id: "discord",
    name: "Discord",
    icon: "💬",
    color: "from-indigo-600 to-purple-600",
    bgColor: "bg-indigo-950/40 border-indigo-500/40",
    textColor: "text-indigo-400"
  },
  {
    id: "github",
    name: "GitHub",
    icon: "🐙",
    color: "from-slate-700 to-slate-900",
    bgColor: "bg-slate-900 border-slate-700",
    textColor: "text-slate-300"
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: "🐦",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-950/40 border-blue-500/40",
    textColor: "text-blue-400"
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: "👾",
    color: "from-purple-600 to-fuchsia-600",
    bgColor: "bg-purple-950/40 border-purple-500/40",
    textColor: "text-purple-400"
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: "🤖",
    color: "from-orange-600 to-red-600",
    bgColor: "bg-orange-950/40 border-orange-500/40",
    textColor: "text-orange-400"
  }
];

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  updateProfile,
}) => {
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const redirectUri = `${window.location.origin}/auth/callback`;

  // Listen for OAuth postMessage callbacks from popups
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
        return;
      }

      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        sfx.playBadgeUnlock();
        const provider = event.data.provider || "google";
        const userData = event.data.user || {};

        const updatedSocials: SocialAccounts = {
          ...userProfile.socialAccounts,
          [provider]: {
            connected: true,
            username: userData.username || `${provider}_otaku`,
            avatar: userData.avatarUrl || userProfile.avatarUrl,
          },
        };

        updateProfile({
          socialAccounts: updatedSocials,
          verifiedSocial: true,
          loginMethod: provider,
          badge: `${provider.toUpperCase()} Verified Otaku`,
        });

        setConnectingProvider(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [userProfile, updateProfile]);

  if (!isOpen) return null;

  const handleOAuthConnect = async (providerId: string) => {
    try {
      sfx.playClick();
      setConnectingProvider(providerId);

      const res = await fetch(`/api/auth/url?provider=${providerId}`);
      const data = await res.json();

      if (data.url) {
        const authWindow = window.open(
          data.url,
          `oauth_${providerId}`,
          "width=600,height=700,scrollbars=yes"
        );

        if (!authWindow) {
          alert("Popup blocked! Please allow popups for this app to complete social login.");
          setConnectingProvider(null);
        }
      }
    } catch (e) {
      console.error("OAuth error:", e);
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = (providerId: string) => {
    sfx.playClick();
    const updatedSocials = { ...userProfile.socialAccounts };
    delete updatedSocials[providerId as keyof SocialAccounts];

    updateProfile({
      socialAccounts: updatedSocials,
      verifiedSocial: Object.keys(updatedSocials).length > 0,
    });
  };

  const copyCallbackUrl = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopiedUrl(true);
    sfx.playClick();
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide uppercase">
                Social Media Sign-In & Verification
              </h2>
              <p className="text-xs text-slate-300">
                Connect your social accounts to unlock verified otaku badges and cross-platform sync.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Active Verified Badge Notice */}
          {userProfile.verifiedSocial && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-2 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Verified Account Active via {userProfile.loginMethod?.toUpperCase()}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[10px] uppercase font-bold">
                Verified
              </span>
            </div>
          )}

          {/* Social Providers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROVIDERS.map((provider) => {
              const isConnected = userProfile.socialAccounts?.[provider.id as keyof SocialAccounts]?.connected;
              const isConnecting = connectingProvider === provider.id;

              return (
                <div
                  key={provider.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${provider.bgColor}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-2xl">{provider.icon}</span>
                    <div className="truncate">
                      <span className="text-sm font-bold text-white block">{provider.name}</span>
                      <span className={`text-[10px] font-mono font-semibold ${isConnected ? "text-emerald-400" : "text-slate-400"}`}>
                        {isConnected ? "Connected" : "Not Linked"}
                      </span>
                    </div>
                  </div>

                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnect(provider.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono font-bold transition-all shrink-0 cursor-pointer"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOAuthConnect(provider.id)}
                      disabled={isConnecting}
                      className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${provider.color} hover:opacity-90 text-white font-mono font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50`}
                    >
                      {isConnecting ? "Connecting..." : "Connect"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Developer Instructions & Callback URI Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/20 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>OAuth Redirect Callback URI</span>
              </span>
              <button
                onClick={() => setShowDocs(!showDocs)}
                className="text-indigo-400 hover:text-white underline font-mono text-[11px]"
              >
                {showDocs ? "Hide Docs" : "Setup Instructions"}
              </button>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300">
              <span className="truncate flex-1">{redirectUri}</span>
              <button
                onClick={copyCallbackUrl}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1 shrink-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {showDocs && (
              <div className="space-y-2 pt-2 text-slate-300 border-t border-slate-800 text-[11px] leading-relaxed">
                <p className="font-bold text-amber-300">📋 OAuth Provider Setup Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Open developer portal (Google Console, Discord Developer Portal, or GitHub OAuth Apps).</li>
                  <li>Set Redirect URI to: <code className="text-cyan-300 font-mono">{redirectUri}</code></li>
                  <li>Provide <code className="text-purple-300 font-mono">GOOGLE_CLIENT_ID</code> or <code className="text-purple-300 font-mono">OAUTH_CLIENT_ID</code> in workspace environment settings.</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
