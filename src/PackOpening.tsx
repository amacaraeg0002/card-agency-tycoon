import React, { useState } from "react";
import { useGameStore } from "../useGameStore";
import { CARD_CATALOG } from "../cardData";
import { Card, PackOption } from "../types";
import CardDisplay from "./CardDisplay";

const PACKS: PackOption[] = [
  { id: "ls_standard", name: "Live Series Standard", cost: 1000, description: "All sports included (OVR 60-99)." },
  { id: "ls_jumbo", name: "Live Series Jumbo Rarity", cost: 7500, description: "Guaranteed 85+ Diamond or higher across all sports.", minOvr: 85 },
  { id: "champion_heroes_pack", name: "Champion Heroes Vault", cost: 25000, description: "Contains 2016-2026 Title Champions & Finals MVPs (LeBron, McDavid, etc.).", themeFilter: "Champion Heroes" },
  { id: "baseball_pack", name: "MLB Diamond Pack", cost: 3500, description: "Exclusively Baseball Live Series cards.", sportFilter: "Baseball" },
  { id: "basketball_pack", name: "NBA Hardwood Pack", cost: 3500, description: "Exclusively Basketball Live Series cards.", sportFilter: "Basketball" },
  { id: "football_pack", name: "NFL Gridiron Pack", cost: 3500, description: "Exclusively Football Live Series cards.", sportFilter: "Football" },
  { id: "nhl_pack", name: "NHL Slapshot Pack", cost: 3500, description: "Exclusively NHL Live Series cards.", sportFilter: "NHL" },
  { id: "soccer_pack", name: "Soccer Pitch Pack", cost: 3500, description: "Exclusively Soccer Live Series cards.", sportFilter: "Soccer" },
  { id: "combat_pack", name: "Combat Octagon Pack", cost: 3500, description: "Exclusively Combat Sports cards.", sportFilter: "Combat" },
  { id: "tennis_pack", name: "Grand Slam Tennis Pack", cost: 3500, description: "Exclusively Tennis Live Series cards.", sportFilter: "Tennis" },
];

export default function PackOpening() {
  const { cash, spendCash, addCardToInventory } = useGameStore();
  const [pulledCard, setPulledCard] = useState<Card | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleRipPack = (pack: PackOption) => {
    if (cash < pack.cost) {
      alert("Insufficient Cash!");
      return;
    }

    let pool = CARD_CATALOG.filter((c) => c.theme !== "Reward");

    if (pack.themeFilter) pool = pool.filter((c) => c.theme === pack.themeFilter);
    if (pack.sportFilter) pool = pool.filter((c) => c.sport === pack.sportFilter);
    if (pack.minOvr) pool = pool.filter((c) => c.ovr >= pack.minOvr);

    if (pool.length === 0) return;
    if (!spendCash(pack.cost)) return;

    const randomCard = pool[Math.floor(Math.random() * pool.length)];
    setPulledCard(randomCard);
    setIsRevealed(false);
    addCardToInventory(randomCard.id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-3xl font-black text-white">The Card Vault</h2>
          <p className="text-slate-400">Rip packs to grow your agency roster and complete collections.</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-slate-400 uppercase tracking-wider block">Agency Balance</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">
            ${cash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {pulledCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="flex flex-col items-center max-w-md w-full text-center">
            <h3 className="text-2xl font-bold text-amber-400 mb-6 uppercase tracking-wider">
              {isRevealed ? "Card Unlocked!" : "Pack Pulled — Tap to Reveal!"}
            </h3>

            <div onClick={() => setIsRevealed(true)} className="cursor-pointer transition-transform duration-500 hover:scale-105">
              {isRevealed ? (
                <CardDisplay card={pulledCard} tier={0} />
              ) : (
                <div className="w-64 h-96 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-800 to-black border-4 border-amber-400/50 flex flex-col items-center justify-center shadow-2xl p-6">
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-black text-2xl mb-4 border border-amber-400/40">?</div>
                  <span className="text-white font-black text-xl tracking-wider">AGENCY ROW</span>
                  <span className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Click to Flip</span>
                </div>
              )}
            </div>

            {isRevealed && (
              <button
                onClick={() => setPulledCard(null)}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black rounded-xl hover:from-amber-400 hover:to-amber-500 shadow-lg"
              >
                Send to Collection Binder
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PACKS.map((pack) => (
          <div key={pack.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-xl font-bold text-white">{pack.name}</h4>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-lg text-sm">
                  ${pack.cost.toLocaleString()}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6">{pack.description}</p>
            </div>
            <button
              onClick={() => handleRipPack(pack)}
              disabled={cash < pack.cost}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                cash >= pack.cost ? "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/10" : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {cash >= pack.cost ? "Rip Pack" : "Need Cash"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
