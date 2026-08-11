import React, { useState, useEffect } from "react";
import {
  Globe,
  Check,
  ChevronUp,
  Sparkles,
  Info,
  RefreshCw,
  Cpu,
  ArrowRight,
  Minimize2,
  X
} from "lucide-react";
import { SUPPORTED_LANGUAGES, LanguageOption } from "../utils/i18n";
import { AppSettings, LanguageCode } from "../types";
import { sfx } from "../utils/sfx";

interface FloatingLanguageWidgetProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export function FloatingLanguageWidget({ settings, updateSettings }: FloatingLanguageWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [googleTranslateLoaded, setGoogleTranslateLoaded] = useState(false);
  const [isTranslatingPage, setIsTranslatingPage] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<string | null>(null);

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === settings.language
  ) || SUPPORTED_LANGUAGES[0];

  const handleLanguageSelect = (code: LanguageCode) => {
    sfx.playWarp();
    updateSettings({ language: code });
    setTranslationStatus(`Switched to ${code.toUpperCase()}`);
    setTimeout(() => setTranslationStatus(null), 3000);
  };

  // Dynamically load Google Translate Script
  const initGoogleTranslate = () => {
    sfx.playClick();
    if (window.googleTranslateElementInit) {
      setTranslationStatus("Google Translate already active");
      setTimeout(() => setTranslationStatus(null), 3000);
      return;
    }

    setTranslationStatus("Loading Google Translate...");

    // Create target wrapper div at the bottom left if missing
    let targetDiv = document.getElementById("google_translate_element");
    if (!targetDiv) {
      targetDiv = document.createElement("div");
      targetDiv.id = "google_translate_element";
      targetDiv.className = "fixed bottom-4 left-4 z-50 p-2 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl scale-90";
      document.body.appendChild(targetDiv);
    }

    // Set callback
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ja,es,fr,de,ko,zh,it,pt,ru,ar,hi",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: true,
        },
        "google_translate_element"
      );
    };

    // Load Translate Element Script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    setGoogleTranslateLoaded(true);
    setTranslationStatus("Google Translate Mounted!");
    setTimeout(() => setTranslationStatus(null), 3000);
  };

  // Custom client-side AI page node text translator
  const handleAiFullPageTranslate = async () => {
    sfx.playWarp();
    setIsTranslatingPage(true);
    setTranslationStatus("Scanning page nodes...");

    try {
      // Find visible page text to translate dynamically
      const textNodes: { element: HTMLElement; text: string }[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            // Ignore scripts, styles, embeds, widgets, or input text
            const tag = parent.tagName.toLowerCase();
            if (
              tag === "script" ||
              tag === "style" ||
              tag === "noscript" ||
              tag === "iframe" ||
              parent.id === "google_translate_element" ||
              parent.closest("#language-widget")
            ) {
              return NodeFilter.FILTER_REJECT;
            }
            const txt = node.nodeValue?.trim();
            if (txt && txt.length > 2 && /[a-zA-Z]{2,}/.test(txt)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        const text = node.nodeValue?.trim();
        if (text && node.parentElement) {
          textNodes.push({ element: node.parentElement, text });
        }
      }

      // Translate in batches of 15 to prevent overload
      const batchSize = 15;
      const totalToTranslate = Math.min(textNodes.length, 60); // Limit to top 60 items for latency
      setTranslationStatus(`Translating ${totalToTranslate} elements...`);

      for (let i = 0; i < totalToTranslate; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize);
        const textsToTranslate = batch.map((n) => n.text);

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetLang: currentLanguage.name,
            texts: textsToTranslate,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.translatedTexts && Array.isArray(json.translatedTexts)) {
            batch.forEach((nodeObj, index) => {
              const transText = json.translatedTexts[index];
              if (transText && nodeObj.element) {
                nodeObj.element.textContent = transText;
              }
            });
          }
        }
      }

      setTranslationStatus("AI Page Translation Complete!");
    } catch (err) {
      console.error(err);
      setTranslationStatus("AI Translation Failed");
    } finally {
      setIsTranslatingPage(false);
      setTimeout(() => setTranslationStatus(null), 3000);
    }
  };

  return (
    <div id="language-widget" className="fixed bottom-6 right-6 z-50">
      {/* Expanded Widget Body */}
      {isOpen ? (
        <div className="w-80 rounded-3xl bg-slate-950/95 border border-indigo-500/30 p-5 shadow-2xl backdrop-blur-xl space-y-4 text-left animate-in fade-in slide-in-from-bottom-5 duration-350">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400 animate-spin-slow" />
              <h4 className="text-xs font-black uppercase text-white tracking-wider">
                Multiverse Translator
              </h4>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                setIsOpen(false);
              }}
              className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active status */}
          {translationStatus && (
            <div className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-300 flex items-center justify-between">
              <span className="animate-pulse">{translationStatus}</span>
              <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
            </div>
          )}

          {/* Core Language Selection Grid */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-bold text-slate-450 uppercase block tracking-wider">
              1. Toggle Native Language Code:
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = settings.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold transition-all ${
                      isActive
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/10"
                        : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850 hover:text-white hover:border-indigo-500/20"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-xs">{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </span>
                    {isActive && <Check className="w-3 h-3 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced / Auto Translation integrations */}
          <div className="space-y-2 pt-1.5 border-t border-slate-850/60">
            <span className="text-[9px] font-mono font-bold text-slate-450 uppercase block tracking-wider">
              2. Advanced Integration Triggers:
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* Google Translate Integration Button */}
              <button
                onClick={initGoogleTranslate}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl text-[10px] font-mono font-bold uppercase border border-slate-800 hover:border-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Inject Google Translate</span>
              </button>

              {/* AI Real-time full page scraper batch translator */}
              <button
                onClick={handleAiFullPageTranslate}
                disabled={isTranslatingPage}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white rounded-xl text-[10px] font-mono font-bold uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
                <span>AI Live Page Translatron</span>
              </button>
            </div>
          </div>

          {/* Footer Explainer */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-1.5 text-[9px] text-slate-450 leading-relaxed font-mono">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Google Translate automatically detects standard paragraphs. Use **AI Page Translatron** to translate custom real-time chat widgets and data cards!
            </span>
          </div>
        </div>
      ) : (
        /* Floating Button Trigger */
        <button
          onClick={() => {
            sfx.playClick();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-950 border border-indigo-500/30 hover:border-indigo-400 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group backdrop-blur-xl"
        >
          <Globe className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
            {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
          </span>
          <ChevronUp className="w-3 h-3 text-slate-400 group-hover:translate-y-[-1px] transition-transform" />
        </button>
      )}
    </div>
  );
}

// Add declaration to Window interface for global Google Translate callback
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}
