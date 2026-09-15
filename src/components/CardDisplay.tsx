import React from "react";
import { Card } from "../types";
import { getTierMultiplier } from "../economy";

const TIER_NAMES = ["Base Raw", "Bronze Foil", "Silver Refractor", "Gold Sparkle", "Diamond Prismatic", "1/1 Superfractor"];
const TIER_BORDERS = [
  "border-slate-700 bg-slate-900",
  "border-amber-700 bg-gradient-to-b from-amber-950/60 to-slate-900",
  "border-slate-300 bg-gradient-to-b from-slate-700/60 to-slate-900",
  "border-amber-400 bg-gradient-to-b from-amber-900/60 to-slate-900 shadow-amber-400/20",
  "border-cyan-400 bg-gradient-to-b from-cyan-950/60 via-slate-900 to-slate-900 shadow-cyan-400/30",
  "border-fuchsia-500 bg-gradient-to-b from-fuchsia-950 via-amber-950 to-slate-900 shadow-fuchsia-500/40 animate-pulse",
];

export default function CardDisplay({ card, tier }: { card: Card; tier: number }) {
  const mult = getTierMultiplier(tier);

  return (
    <div className={`w-56 h-80 rounded-2xl border-2 ${TIER_BORDERS[tier]} p-3 flex flex-col justify-between shadow-2xl relative select-none`}>
      <div className="flex justify-between items-start">
        <div className="bg-amber-400 text-black font-black text-sm px-2 py-0.5 rounded shadow">
          {card.ovr}
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.sport}</span>
          <span className="text-[9px] text-amber-300 font-mono font-bold">{TIER_NAMES[tier]}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-2">
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} className="w-28 h-28 object-cover rounded-xl shadow-lg border border-slate-800" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-3xl font-black text-amber-400">
            {card.name.charAt(0)}
          </div>
        )}
        <h4 className="font-black text-white text-sm mt-3 text-center truncate w-full px-1">{card.name}</h4>
        <span className="text-[10px] text-slate-400">{card.theme}</span>
      </div>

      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2 text-center">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Base CPM: ${card.cpm.toFixed(2)}</span>
          <span className="text-amber-400 font-bold">{mult}x Yield</span>
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {card.quirks.map((q) => (
            <span key={q} className="bg-slate-800 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
              {q}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
