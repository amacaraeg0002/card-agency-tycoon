import React, { useState } from "react";
import { useGameStore } from "./useGameStore";
import Binder from "./components/Binder";
import PackOpening from "./components/PackOpening";
import Meter from "./components/Meter";
import OfficeCanvas from "./components/OfficeCanvas";

type Tab = "floor" | "studio" | "vault" | "binder";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("floor");
  const { cash, totalViews, agencyLevel } = useGameStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-black font-black text-xl">
            A
          </div>
          <div>
            <h1 className="font-black text-lg tracking-wider">AGENCY ROW</h1>
            <span className="text-xs text-amber-400 font-bold">LVL {agencyLevel} DIGITAL AGENCY</span>
          </div>
        </div>

        <nav className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl gap-1">
          {(["floor", "studio", "vault", "binder"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab ? "bg-amber-400 text-black shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "floor" ? "Agency Floor" : tab === "studio" ? "Edit Studio" : tab === "vault" ? "Card Vault" : "Collection"}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Total Views</span>
            <span className="font-mono font-bold text-slate-200 text-sm">{totalViews.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Cash Balance</span>
            <span className="font-mono font-black text-emerald-400 text-base">
              ${cash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {activeTab === "floor" && <OfficeCanvas />}
        {activeTab === "studio" && <Meter />}
        {activeTab === "vault" && <PackOpening />}
        {activeTab === "binder" && <Binder />}
      </main>
    </div>
  );
}
