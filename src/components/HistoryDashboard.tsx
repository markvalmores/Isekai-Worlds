import React, { useState, useEffect } from "react";
import { HistoryEntry, getHistory } from "../lib/historyService";
import { Clock, Globe, Trash2 } from "lucide-react";

export const HistoryDashboard: React.FC = () => {
  const [watchHistory, setWatchHistory] = useState<HistoryEntry[]>([]);
  const [browsingHistory, setBrowsingHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"watch" | "browse">("watch");

  useEffect(() => {
    getHistory("watch").then(setWatchHistory);
    getHistory("browse").then(setBrowsingHistory);
  }, []);

  const history = activeTab === "watch" ? watchHistory : browsingHistory;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900/80 border border-indigo-500/20 rounded-3xl">
      <h2 className="text-2xl font-black uppercase tracking-tight text-white">History</h2>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab("watch")}
          className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === "watch" ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300"}`}
        >
          Watch History
        </button>
        <button 
          onClick={() => setActiveTab("browse")}
          className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === "browse" ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300"}`}
        >
          Browsing History
        </button>
      </div>

      <div className="space-y-2">
        {history.map((entry, idx) => (
          <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
            <div>
              <p className="font-bold text-white">{entry.title}</p>
              <p className="text-[10px] text-slate-500">{new Date(entry.timestamp).toLocaleString()}</p>
            </div>
            <a href={entry.url} target="_blank" className="text-rose-400 font-bold hover:underline">View</a>
          </div>
        ))}
      </div>
    </div>
  );
};
