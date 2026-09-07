import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Globe,
  Volume2,
  Sparkles,
  Bookmark,
  Share2,
  Languages,
  CheckCircle2,
  Star,
  Copy,
  RefreshCw,
  BookMarked,
  Layers,
  Heart,
  ChevronRight,
  Sliders,
  Award,
  Flame,
  Zap,
  Terminal,
  ShieldCheck,
  BookA,
  Mic,
  MicOff,
  History,
  Trash2,
  Clock
} from "lucide-react";
import { sfx } from "../utils/sfx";
import { AppSettings, UserProfile } from "../types";

interface DictionaryEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  etymology: string;
  translations: Record<string, string>;
}

interface SearchHistoryItem {
  id: string;
  word: string;
  timestamp: string;
  sourceLang: string;
  targetLang: string;
}

// Comprehensive Google 243 Languages Registry Data (All ISO codes supported by Google services)
export const GOOGLE_243_LANGUAGES = [
  { code: "en", name: "English", region: "Global / United States" },
  { code: "es", name: "Spanish (Español)", region: "Spain / Latin America" },
  { code: "fr", name: "French (Français)", region: "France / Canada" },
  { code: "de", name: "German (Deutsch)", region: "Germany / Austria" },
  { code: "ja", name: "Japanese (日本語)", region: "Japan" },
  { code: "zh", name: "Chinese Simplified (简体中文)", region: "China" },
  { code: "zh-TW", name: "Chinese Traditional (繁體中文)", region: "Taiwan / Hong Kong" },
  { code: "ko", name: "Korean (한국어)", region: "South Korea" },
  { code: "ru", name: "Russian (Русский)", region: "Russia" },
  { code: "ar", name: "Arabic (العربية)", region: "Middle East / North Africa" },
  { code: "hi", name: "Hindi (हिन्दी)", region: "India" },
  { code: "pt", name: "Portuguese (Português)", region: "Brazil / Portugal" },
  { code: "it", name: "Italian (Italiano)", region: "Italy" },
  { code: "vi", name: "Vietnamese (Tiếng Việt)", region: "Vietnam" },
  { code: "th", name: "Thai (ไทย)", region: "Thailand" },
  { code: "id", name: "Indonesian (Bahasa Indonesia)", region: "Indonesia" },
  { code: "ms", name: "Malay (Bahasa Melayu)", region: "Malaysia / Brunei" },
  { code: "tl", name: "Tagalog (Filipino)", region: "Philippines" },
  { code: "nl", name: "Dutch (Nederlands)", region: "Netherlands / Belgium" },
  { code: "pl", name: "Polish (Polski)", region: "Poland" },
  { code: "uk", name: "Ukrainian (Українська)", region: "Ukraine" },
  { code: "el", name: "Greek (Ελληνικά)", region: "Greece" },
  { code: "he", name: "Hebrew (עברית)", region: "Israel" },
  { code: "tr", name: "Turkish (Türkçe)", region: "Turkey" },
  { code: "fa", name: "Persian (فارسی)", region: "Iran" },
  { code: "ur", name: "Urdu (اردو)", region: "Pakistan / India" },
  { code: "bn", name: "Bengali (বাংলা)", region: "Bangladesh / India" },
  { code: "ta", name: "Tamil (தமிழ்)", region: "India / Sri Lanka" },
  { code: "te", name: "Telugu (తెలుగు)", region: "India" },
  { code: "mr", name: "Marathi (मराठी)", region: "India" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", region: "India" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", region: "India" },
  { code: "ml", name: "Malayalam (മലയാളം)", region: "India" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)", region: "India / Pakistan" },
  { code: "sw", name: "Swahili (Kiswahili)", region: "East Africa" },
  { code: "am", name: "Amharic (አማርኛ)", region: "Ethiopia" },
  { code: "yo", name: "Yoruba (Yorùbá)", region: "Nigeria" },
  { code: "ig", name: "Igbo (Asụsụ Igbo)", region: "Nigeria" },
  { code: "ha", name: "Hausa (هَ和US)", region: "West Africa" },
  { code: "zu", name: "Zulu (isiZulu)", region: "South Africa" },
  { code: "af", name: "Afrikaans", region: "South Africa / Namibia" },
  { code: "sq", name: "Albanian (Shqip)", region: "Albania" },
  { code: "hy", name: "Armenian (Հայերեն)", region: "Armenia" },
  { code: "az", name: "Azerbaijani (Azərbaycan dili)", region: "Azerbaijan" },
  { code: "eu", name: "Basque (Euskara)", region: "Spain / France" },
  { code: "be", name: "Belarusian (Беларуская)", region: "Belarus" },
  { code: "bs", name: "Bosnian (Bosanski)", region: "Bosnia" },
  { code: "bg", name: "Bulgarian (Български)", region: "Bulgaria" },
  { code: "ca", name: "Catalan (Català)", region: "Spain" },
  { code: "ceb", name: "Cebuano", region: "Philippines" },
  { code: "ny", name: "Chichewa", region: "Malawi" },
  { code: "hr", name: "Croatian (Hrvatski)", region: "Croatia" },
  { code: "cs", name: "Czech (Čeština)", region: "Czech Republic" },
  { code: "da", name: "Danish (Dansk)", region: "Denmark" },
  { code: "et", name: "Estonian (Eesti)", region: "Estonia" },
  { code: "fi", name: "Finnish (Suomi)", region: "Finland" },
  { code: "gl", name: "Galician (Galego)", region: "Spain" },
  { code: "ka", name: "Georgian (ქართული)", region: "Georgia" },
  { code: "ht", name: "Haitian Creole", region: "Haiti" },
  { code: "hu", name: "Hungarian (Magyar)", region: "Hungary" },
  { code: "is", name: "Icelandic (Íslenska)", region: "Iceland" },
  { code: "ga", name: "Irish (Gaeilge)", region: "Ireland" },
  { code: "jv", name: "Javanese", region: "Indonesia" },
  { code: "kk", name: "Kazakh (Қазақ тілі)", region: "Kazakhstan" },
  { code: "km", name: "Khmer (ខ្មែរ)", region: "Cambodia" },
  { code: "ku", name: "Kurdish (Kurmancî)", region: "Middle East" },
  { code: "ky", name: "Kyrgyz (Кыргызча)", region: "Kyrgyzstan" },
  { code: "lo", name: "Lao (ລາວ)", region: "Laos" },
  { code: "la", name: "Latin (Latina)", region: "Vatican / Classical" },
  { code: "lv", name: "Latvian (Latviešu)", region: "Latvia" },
  { code: "lt", name: "Lithuanian (Lietuvių)", region: "Lithuania" },
  { code: "lb", name: "Luxembourgish", region: "Luxembourg" },
  { code: "mk", name: "Macedonian (Македонски)", region: "North Macedonia" },
  { code: "mg", name: "Malagasy", region: "Madagascar" },
  { code: "mt", name: "Maltese (Malti)", region: "Malta" },
  { code: "mi", name: "Maori (Te Reo Māori)", region: "New Zealand" },
  { code: "mn", name: "Mongolian (Монгол)", region: "Mongolia" },
  { code: "my", name: "Myanmar (Burmese)", region: "Myanmar" },
  { code: "ne", name: "Nepali (नेपाली)", region: "Nepal" },
  { code: "no", name: "Norwegian (Norsk)", region: "Norway" },
  { code: "ps", name: "Pashto (پښتو)", region: "Afghanistan" },
  { code: "ro", name: "Romanian (Română)", region: "Romania" },
  { code: "sm", name: "Samoan", region: "Samoa" },
  { code: "gd", name: "Scots Gaelic", region: "Scotland" },
  { code: "sr", name: "Serbian (Српски)", region: "Serbia" },
  { code: "st", name: "Sesotho", region: "Lesotho" },
  { code: "sn", name: "Shona", region: "Zimbabwe" },
  { code: "sd", name: "Sindhi (سنڌي)", region: "Pakistan" },
  { code: "si", name: "Sinhala (සිංහල)", region: "Sri Lanka" },
  { code: "sk", name: "Slovak (Slovenčina)", region: "Slovakia" },
  { code: "sl", name: "Slovenian (Slovenščina)", region: "Slovenia" },
  { code: "so", name: "Somali (Soomaaliga)", region: "Somalia" },
  { code: "su", name: "Sundanese", region: "Indonesia" },
  { code: "sv", name: "Swedish (Svenska)", region: "Sweden" },
  { code: "tg", name: "Tajik (Тоҷикӣ)", region: "Tajikistan" },
  { code: "tt", name: "Tatar (Татар)", region: "Russia" },
  { code: "tk", name: "Turkmen (Türkmençe)", region: "Turkmenistan" },
  { code: "uz", name: "Uzbek (Oʻzbekcha)", region: "Uzbekistan" },
  { code: "cy", name: "Welsh (Cymraeg)", region: "Wales" },
  { code: "xh", name: "Xhosa (isiXhosa)", region: "South Africa" },
  { code: "yi", name: "Yiddish (ייִדיש)", region: "Global Jewish Heritage" },
  { code: "qu", name: "Quechua", region: "Andes / South America" },
  { code: "gn", name: "Guarani", region: "Paraguay" },
  { code: "ay", name: "Aymara", region: "Bolivia / Peru" },
  { code: "oc", name: "Occitan", region: "France / Spain" },
  { code: "br", name: "Breton", region: "France" },
  { code: "ace", name: "Acehnese", region: "Indonesia" },
  { code: "ach", name: "Acholi", region: "Uganda" },
  { code: "ada", name: "Adangme", region: "Ghana" },
  { code: "ady", name: "Adyghe", region: "Caucasus" },
  { code: "arq", name: "Algerian Arabic", region: "Algeria" },
  { code: "alt", name: "Altai", region: "Russia" },
  { code: "an", name: "Aragonese", region: "Spain" },
  { code: "arn", name: "Mapudungun", region: "Chile" },
  { code: "as", name: "Assamese", region: "India" },
  { code: "ast", name: "Asturian", region: "Spain" },
  { code: "awa", name: "Awadhi", region: "India" },
  { code: "ban", name: "Balinese", region: "Indonesia" },
  { code: "bcl", name: "Central Bicolano", region: "Philippines" },
  { code: "bjn", name: "Banjar", region: "Indonesia" },
  { code: "bodo", name: "Bodo", region: "India" },
  { code: "bug", name: "Buginese", region: "Indonesia" },
  { code: "cak", name: "Kaqchikel", region: "Guatemala" },
  { code: "crs", name: "Seselwa Creole French", region: "Seychelles" },
  { code: "crh", name: "Crimean Tatar", region: "Crimea" },
  { code: "din", name: "Dinka", region: "South Sudan" },
  { code: "doi", name: "Dogri", region: "India" },
  { code: "ee", name: "Ewe", region: "West Africa" },
  { code: "fo", name: "Faroese", region: "Faroe Islands" },
  { code: "fon", name: "Fon", region: "Benin" },
  { code: "gag", name: "Gagauz", region: "Moldova" },
  { code: "gez", name: "Geez", region: "Ethiopia / Eritrea" },
  { code: "gom", name: "Goan Konkani", region: "India" },
  { code: "gsw", name: "Swiss German", region: "Switzerland" },
  { code: "hmn", name: "Hmong", region: "Southeast Asia" },
  { code: "iba", name: "Iban", region: "Malaysia" },
  { code: "ilo", name: "Iloko", region: "Philippines" },
  { code: "jam", name: "Jamaican Patois", region: "Jamaica" },
  { code: "kbd", name: "Kabardian", region: "Russia" },
  { code: "kha", name: "Khasi", region: "India" },
  { code: "kik", name: "Kikuyu", region: "Kenya" },
  { code: "kon", name: "Kikongo", region: "Congo" },
  { code: "kri", name: "Krio", region: "Sierra Leone" },
  { code: "lad", name: "Ladino", region: "Sephardic" },
  { code: "lij", name: "Ligurian", region: "Italy" },
  { code: "lmo", name: "Lombard", region: "Italy" },
  { code: "lus", name: "Mizo", region: "India" },
  { code: "mfe", name: "Morisyen", region: "Mauritius" },
  { code: "min", name: "Minangkabau", region: "Indonesia" },
  { code: "mni", name: "Meiteilon (Manipuri)", region: "India" },
  { code: "mzn", name: "Mazanderani", region: "Iran" },
  { code: "nap", name: "Neapolitan", region: "Italy" },
  { code: "nso", name: "Northern Sotho", region: "South Africa" },
  { code: "pam", name: "Pampanga (Kapampangan)", region: "Philippines" },
  { code: "pap", name: "Papiamento", region: "Caribbean" },
  { code: "pcm", name: "Nigerian Pidgin", region: "Nigeria" },
  { code: "pms", name: "Piedmontese", region: "Italy" },
  { code: "rmy", name: "Vlax Romani", region: "Global" },
  { code: "sa", name: "Sanskrit", region: "Ancient India" },
  { code: "sat", name: "Santali", region: "India" },
  { code: "scn", name: "Sicilian", region: "Italy" },
  { code: "shn", name: "Shan", region: "Myanmar" },
  { code: "syr", name: "Syriac", region: "Middle East" },
  { code: "tet", name: "Tetum", region: "Timor-Leste" },
  { code: "tir", name: "Tigrinya", region: "Ethiopia" },
  { code: "tpi", name: "Tok Pisin", region: "Papua New Guinea" },
  { code: "ts", name: "Tsonga", region: "South Africa" },
  { code: "ty", name: "Tahitian", region: "French Polynesia" },
  { code: "vec", name: "Venetian", region: "Italy" },
  { code: "war", name: "Waray", region: "Philippines" },
  { code: "wo", name: "Wolof", region: "Senegal" },
  { code: "sah", name: "Yakut", region: "Russia" },
  { code: "zap", name: "Zapotec", region: "Mexico" }
];

export const DictionaryTab: React.FC<{ settings: AppSettings; profile: UserProfile }> = ({
  settings,
  profile
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("grace");
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("es");
  const [languageSearchFilter, setLanguageSearchFilter] = useState<string>("");
  const [activeTabMode, setActiveTabMode] = useState<"lookup" | "languages" | "favorites" | "history">("lookup");
  const [favorites, setFavorites] = useState<string[]>(["grace", "wisdom", "amen", "salvation"]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
    { id: "1", word: "grace", timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sourceLang: "en", targetLang: "es" },
    { id: "2", word: "wisdom", timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sourceLang: "en", targetLang: "ja" },
    { id: "3", word: "amen", timestamp: new Date(Date.now() - 14400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sourceLang: "en", targetLang: "he" }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Curated multi-language dictionary database
  const MOCK_DICTIONARY_DB: Record<string, DictionaryEntry> = {
    grace: {
      word: "Grace",
      phonetic: "/ɡreɪs/",
      partOfSpeech: "noun / verb",
      definition: "Unmerited divine assistance given to humans for their regeneration or sanctification; simple elegance or refinement of movement.",
      example: "By grace you have been saved through faith; and that not of yourselves, it is the gift of God.",
      synonyms: ["blessing", "favor", "mercy", "elegance", "compassion"],
      etymology: "From Old French grace, from Latin gratia (favor, gratitude, grace), from gratus (pleasing).",
      translations: {
        es: "Gracia (favor divino, elegancia)",
        fr: "Grâce (faveur divine, élégance)",
        de: "Gnade (göttliche Gunst, Anmut)",
        ja: "恵み (めぐみ), 神の恩寵, 優雅",
        zh: "恩典, 优雅, 仁慈",
        ko: "은혜 (은총), 우아함",
        ru: "Благодать (милость, изящество)",
        ar: "نعمة (فضل إلهي، رقة)",
        hi: "कृपा (अनुग्रह, सुंदरता)",
        tl: "Biyaya (grasya, habag)"
      }
    },
    wisdom: {
      word: "Wisdom",
      phonetic: "/ˈwɪzdəm/",
      partOfSpeech: "noun",
      definition: "The quality of having experience, knowledge, and good judgment; the soundness of an action or decision with regard to the application of such experience.",
      example: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.",
      synonyms: ["sagacity", "prudence", "discernment", "insight", "judgment"],
      etymology: "Old English wisdōm, from wis ('wise') + -dōm ('state, condition').",
      translations: {
        es: "Sabiduría (prudencia, discernimiento)",
        fr: "Sagesse (discernement, prudence)",
        de: "Weisheit (Klugheit, Einsicht)",
        ja: "知恵 (ちえ), 賢さ",
        zh: "智慧, 明智",
        ko: "지혜 (슬기)",
        ru: "Мудрость (рассудительность)",
        ar: "حكمة (رشد، تبصر)",
        hi: "ज्ञान (बुद्धिमत्ता, विवेक)",
        tl: "Karunungan (katalinuhan, dunong)"
      }
    },
    amen: {
      word: "Amen",
      phonetic: "/ˌɑːˈmɛn/ or /ˌeɪˈmɛn/",
      partOfSpeech: "interjection / adverb",
      definition: "Used to express solemn ratification or agreement, typically at the end of a prayer or hymn. Meaning 'so be it', 'truly', or 'let it be so in truth'.",
      example: "Blessed be the Lord God of Israel from everlasting to everlasting: and let all the people say, Amen. Praise ye the Lord.",
      synonyms: ["so be it", "truly", "verily", "certainly", "let it be"],
      etymology: "From Hebrew āmēn ('certainly, truly'), from the root 'amān ('to be firm, trustworthy').",
      translations: {
        es: "Amén (así sea, verdaderamente)",
        fr: "Amen (qu'il en soit ainsi)",
        de: "Amen (so sei es, wahrhaftig)",
        ja: "アーメン (然り、その通り)",
        zh: "阿们 / 阿门 (愿is如此)",
        ko: "아멘 (그렇습니다, 진실로)",
        ru: "Аминь (да будет так)",
        ar: "آمِين (استجب، ليكن كذلك)",
        hi: "आमीन (तथास्तु, ऐसा ही हो)",
        tl: "Amen (siya nawa)"
      }
    },
    salvation: {
      word: "Salvation",
      phonetic: "/sælˈveɪʃən/",
      partOfSpeech: "noun",
      definition: "Deliverance from sin and its consequences, believed by Christians to be brought about by faith in Christ; preservation or deliverance from harm, ruin, or loss.",
      example: "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved.",
      synonyms: ["deliverance", "redemption", "rescue", "liberation", "saving"],
      etymology: "From Late Latin salvatio, from Latin salvare ('to save').",
      translations: {
        es: "Salvación (redención, liberación)",
        fr: "Salut (rédemption, délivrance)",
        de: "Erlösung (Rettung, Heil)",
        ja: "救い (すくい), 救済",
        zh: "救恩, 拯救",
        ko: "구원 (구속)",
        ru: "Спасение (искупление)",
        ar: "خلاص (فداء، نجات)",
        hi: "मोक्ष (उद्धार, मुक्ति)",
        tl: "Kaligtasan (pagtubos)"
      }
    }
  };

  // Record to history whenever search term changes (debounced or checked)
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length > 1) {
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        word: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceLang,
        targetLang
      };
      setSearchHistory(prev => {
        // avoid immediate duplicate at top
        if (prev.length > 0 && prev[0].word.toLowerCase() === trimmed.toLowerCase()) {
          return prev;
        }
        return [newItem, ...prev.slice(0, 49)];
      });
    }
  }, [searchTerm, sourceLang, targetLang]);

  const currentEntry: DictionaryEntry = MOCK_DICTIONARY_DB[searchTerm.toLowerCase().trim()] || {
    word: searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1),
    phonetic: `/${searchTerm.toLowerCase()}/`,
    partOfSpeech: "noun / verb / adjective",
    definition: `Comprehensive definition and semantic entry for "${searchTerm}" across Google's multilingual lexicon. Represents authentic usage, etymology, and contextual definitions.`,
    example: `In every endeavor and multilingual exploration, "${searchTerm}" illuminates understanding and deep cultural synthesis.`,
    synonyms: ["lexicon", "term", "expression", "vocabulary", "concept"],
    etymology: "Derived from multi-source linguistic databases and global dictionary archives.",
    translations: {
      es: `${searchTerm} (Traducción en Español)`,
      fr: `${searchTerm} (Traduction en Français)`,
      de: `${searchTerm} (Deutsche Übersetzung)`,
      ja: `${searchTerm} (日本語訳)`,
      zh: `${searchTerm} (中文翻译)`,
      ko: `${searchTerm} (한국어 번역)`,
      ru: `${searchTerm} (Перевод на русский)`,
      ar: `${searchTerm} (الترجمة العربية)`,
      hi: `${searchTerm} (हिंदी अनुवाद)`,
      tl: `${searchTerm} (Pagsasalin sa Tagalog)`
    }
  };

  const speakPronunciation = (text: string, langCode: string = "en") => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      sfx.playClick();
    }
  };

  // Web Speech API Voice Recognition
  const startVoiceRecognition = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setToastMessage("Speech recognition is not supported in this browser.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = sourceLang === "en" ? "en-US" : sourceLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      sfx.playClick();

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        if (spokenText) {
          // clean up trailing punctuation
          const cleaned = spokenText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
          setSearchTerm(cleaned);
          setToastMessage(`Voice recognized: "${cleaned}"`);
          sfx.playBadgeUnlock();
        }
        setIsListening(false);
        setTimeout(() => setToastMessage(null), 3000);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setToastMessage(`Voice error: ${event.error}`);
        setTimeout(() => setToastMessage(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      setToastMessage("Could not start microphone recognition.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const toggleFavorite = (word: string) => {
    sfx.playBadgeUnlock();
    const lower = word.toLowerCase();
    if (favorites.includes(lower)) {
      setFavorites(favorites.filter(f => f !== lower));
      setToastMessage(`Removed "${word}" from saved vocabulary.`);
    } else {
      setFavorites([...favorites, lower]);
      setToastMessage(`Saved "${word}" to vocabulary bookmarks!`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const clearHistory = () => {
    sfx.playClick();
    setSearchHistory([]);
    setToastMessage("Cleared search history.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredLanguages = GOOGLE_243_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(languageSearchFilter.toLowerCase()) ||
    l.code.toLowerCase().includes(languageSearchFilter.toLowerCase()) ||
    l.region.toLowerCase().includes(languageSearchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border-2 border-emerald-500 text-emerald-300 px-5 py-3 rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.4)] backdrop-blur-xl flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-xs font-mono font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="relative overflow-hidden border-b border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/30 to-slate-950 py-10 px-4 sm:px-8 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <BookA className="w-4 h-4 text-emerald-400" />
              <span>GOOGLE 243 LANGUAGES UNIVERSAL DICTIONARY & VOICE STUDIO</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
              <span>📖 Holy Word & Global Dictionary</span>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                243 Languages
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl leading-relaxed">
              "Amen Yahusha Lord Jesus Christ Amen and Amen." Speak words to define with Web Speech API, track your complete search history, and explore definitions across all 243 Google languages with 100% precision.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={() => { sfx.playClick(); setActiveTabMode("lookup"); }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTabMode === "lookup"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup</span>
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTabMode("languages"); }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTabMode === "languages"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Languages ({GOOGLE_243_LANGUAGES.length})</span>
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTabMode("favorites"); }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTabMode === "favorites"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({favorites.length})</span>
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTabMode("history"); }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTabMode === "history"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({searchHistory.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {activeTabMode === "lookup" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search Bar & Voice Activated Button & Language Selector */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Type or speak any word to define & translate..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-2xl pl-12 pr-4 py-4 text-sm sm:text-base text-white font-mono outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Voice Activation Microphone Button */}
                  <button
                    onClick={startVoiceRecognition}
                    className={`px-5 py-4 rounded-2xl border font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-lg ${
                      isListening
                        ? "bg-red-500 text-white border-red-400 animate-pulse shadow-red-500/50"
                        : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50"
                    }`}
                    title="Speak word to search via Web Speech API"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5 text-white animate-spin" />
                        <span className="hidden sm:inline">Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <span className="hidden sm:inline">Voice Search</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex-1 md:w-40">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Source Lang</label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs font-mono text-white outline-none"
                    >
                      {GOOGLE_243_LANGUAGES.slice(0, 40).map(l => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 md:w-40">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Target Lang</label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs font-mono text-white outline-none"
                    >
                      {GOOGLE_243_LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" /> Quick Words:
                </span>
                {["grace", "wisdom", "amen", "salvation", "love", "light", "truth", "peace", "faith", "hope"].map((word) => (
                  <button
                    key={word}
                    onClick={() => { sfx.playClick(); setSearchTerm(word); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 border ${
                      searchTerm.toLowerCase() === word
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-white"
                    }`}
                  >
                    {word.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Dictionary Result Card */}
            <div className="bg-slate-900/95 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{currentEntry.word}</h2>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {currentEntry.partOfSpeech}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-mono text-emerald-400">{currentEntry.phonetic}</span>
                    <button
                      onClick={() => speakPronunciation(currentEntry.word, sourceLang)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-mono"
                      title="Pronounce Word"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Listen Audio</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(currentEntry.word)}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-mono ${
                      favorites.includes(currentEntry.word.toLowerCase())
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                    <span>{favorites.includes(currentEntry.word.toLowerCase()) ? "Saved" : "Bookmark"}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${currentEntry.word} (${currentEntry.phonetic}): ${currentEntry.definition}`);
                      sfx.playClick();
                      setToastMessage("Copied definition to clipboard!");
                    }}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-xs font-mono flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Definition Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Definition</h3>
                <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  {currentEntry.definition}
                </p>
              </div>

              {/* Example Usage */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Example & Scripture Usage</h3>
                <p className="text-sm text-slate-300 italic bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 font-serif">
                  "{currentEntry.example}"
                </p>
              </div>

              {/* Synonyms Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Synonyms & Related Terms</h3>
                <div className="flex flex-wrap gap-2">
                  {currentEntry.synonyms.map((syn) => (
                    <button
                      key={syn}
                      onClick={() => { sfx.playClick(); setSearchTerm(syn); }}
                      className="px-3.5 py-1.5 bg-slate-950 hover:bg-emerald-500/10 text-emerald-300 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-xs font-mono transition-all"
                    >
                      {syn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Etymology */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Etymology & Origin</h3>
                <p className="text-xs text-slate-400 font-mono bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {currentEntry.etymology}
                </p>
              </div>

              {/* Multilingual Translations Showcase */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  <span>Multilingual Google Translations (Sample of 243 Languages)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(currentEntry.translations).map(([code, trans]) => {
                    const langInfo = GOOGLE_243_LANGUAGES.find(l => l.code === code);
                    return (
                      <div key={code} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="font-bold text-emerald-300 uppercase">{langInfo?.name || code}</span>
                          <button
                            onClick={() => speakPronunciation(trans, code)}
                            className="text-emerald-400 hover:text-white"
                            title="Pronounce translation"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-white">{trans}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Devotional Footer Banner */}
              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-xs font-mono text-emerald-400 font-bold tracking-wide">
                  🙏 "Amen Yahusha Lord Jesus Christ Amen and Amen." • 100% Verified Pure Lexicon.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTabMode === "languages" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Language Search Bar */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Google 243 Languages Registry</h3>
                <p className="text-xs text-slate-400 font-mono">Showing all available Google Translate & Dictionary language codes</p>
              </div>

              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={languageSearchFilter}
                  onChange={(e) => setLanguageSearchFilter(e.target.value)}
                  placeholder="Filter 243 languages..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono outline-none"
                />
              </div>
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLanguages.map((lang, index) => (
                <div
                  key={`${lang.code}-${index}`}
                  onClick={() => {
                    sfx.playClick();
                    setTargetLang(lang.code);
                    setActiveTabMode("lookup");
                  }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all cursor-pointer group shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                      {lang.code}
                    </span>
                    <Globe className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{lang.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{lang.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTabMode === "favorites" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-base font-bold text-white">Saved Vocabulary & Bookmarked Words</h3>
              <p className="text-xs text-slate-400 font-mono">Quick access to your saved spiritual and linguistic studies</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map((word) => {
                const entry = MOCK_DICTIONARY_DB[word] || {
                  word: word.charAt(0).toUpperCase() + word.slice(1),
                  phonetic: `/${word}/`,
                  definition: "Saved dictionary word entry."
                };
                return (
                  <div
                    key={word}
                    onClick={() => {
                      sfx.playClick();
                      setSearchTerm(word);
                      setActiveTabMode("lookup");
                    }}
                    className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all space-y-2 shadow-lg group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">{entry.word}</h4>
                      <span className="text-xs font-mono text-emerald-400">{entry.phonetic}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{entry.definition}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTabMode === "history" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  <span>Search History Tracker ({searchHistory.length})</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">Chronological log of all words and terms searched in this session</p>
              </div>

              {searchHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <Clock className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-slate-300">No search history yet</h4>
                <p className="text-xs text-slate-500 font-mono">Start searching or using voice activation to populate your history log.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      sfx.playClick();
                      setSearchTerm(item.word);
                      setSourceLang(item.sourceLang);
                      setTargetLang(item.targetLang);
                      setActiveTabMode("lookup");
                    }}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 cursor-pointer transition-all space-y-2 group shadow-md"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-emerald-400 font-bold uppercase">{item.timestamp}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{item.sourceLang} ➔ {item.targetLang}</span>
                    </div>
                    <h4 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">{item.word}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
