import React, { useState } from "react";
import { useGameStore } from "../useGameStore";
import { CARD_CATALOG } from "../cardData";
import { Sport } from "../types";
import CardDisplay from "./CardDisplay";
import { getQuicksellValue } from "../economy";

const SPORTS: (Sport | "All")[] = ["All", "Baseball", "Basketball", "Football", "NHL", "Soccer", "Tennis", "Combat"];

export default function Binder() {
  const { inventory, lineupCardIds, activeCardId, setActiveCard, toggleLineupCard, quicksellCard } = useGameStore();
  const [selectedSport, setSelectedSport] = useState<Sport | "All">("All");

  const ownedMap = new Map(inventory.map((i) => [i.cardId, i]));

  const filteredCards = CARD_CATALOG.filter((c) => {
    if (selectedSport === "All") return true;
    return c.sport === selectedSport;
  });

  const championCards = CARD_CATALOG.filter((c) => c.theme === "Champion Heroes");
  const championsOwned = championCards.filter((c) => ownedMap.has(c.id)).length;
  const isBradyUnlocked = ownedMap.has("tom_brady_reward");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 text-black text-xs font-black px-2.5 py-1 rounded">FEATURED COLLECTION</span>
              <h3 className="text-2xl font-black text-white">Champion Heroes (2016–2026)</h3>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Collect all {championCards.length} championship title defenders & Finals MVPs to unlock the maxed-out 99 OVR Superfractor Tom Brady!
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 px-5 py-3 rounded-xl">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Collection Status</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {championsOwned} / {championCards.length} Collected
              </span>
            </div>
            {isBradyUnlocked && (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-bold">
                COMPLETED
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-2">Active Production Lineup ({lineupCardIds.length}/5)</h4>
        <p className="text-slate-400 text-sm mb-4">Cards active on your studio edit floor earning views.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {lineupCardIds.map((cardId) => {
            const card = CARD_CATALOG.find((c) => c.id === cardId);
            if (!card) return null;
            return (
              <div key={cardId} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-xs text-amber-400 font-bold block truncate">{card.name}</span>
                <span className="text-xs text-slate-400">{card.sport} • {card.ovr} OVR</span>
                <button
                  onClick={() => setActiveCard(cardId)}
                  className={`mt-3 w-full py-1 rounded text-xs font-bold ${
                    activeCardId === cardId ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {activeCardId === cardId ? "Active Needle" : "Select Needle"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {SPORTS.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              selectedSport === sport ? "bg-amber-400 text-black" : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCards.map((card) => {
          const invItem = ownedMap.get(card.id);
          const isOwned = !!invItem;
          const isInLineup = lineupCardIds.includes(card.id);

          return (
            <div
              key={card.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col items-center transition-all ${
                isOwned ? "border-slate-800 hover:border-slate-700" : "border-slate-800/40 opacity-40 grayscale"
              }`}
            >
              <CardDisplay card={card} tier={invItem ? invItem.tier : 0} />

              <div className="mt-4 w-full flex flex-col gap-2">
                {isOwned ? (
                  <>
                    <button
                      onClick={() => toggleLineupCard(card.id)}
                      className={`w-full py-2 rounded-xl text-xs font-bold ${
                        isInLineup ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-slate-800 text-white"
                      }`}
                    >
                      {isInLineup ? "Remove from Lineup" : "Add to Lineup"}
                    </button>
                    {card.theme !== "Reward" && (
                      <button
                        onClick={() => quicksellCard(card.id)}
                        className="w-full py-1.5 text-slate-500 hover:text-rose-400 text-xs transition-colors"
                      >
                        Quicksell (${getQuicksellValue(card.ovr).toLocaleString()})
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-center text-xs font-bold text-slate-500 py-2">Not Collected</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
