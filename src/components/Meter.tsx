import React, { useState, useEffect, useRef } from "react";
import { useGameStore } from "../useGameStore";
import { CARD_CATALOG } from "../cardData";
import { METER_CYCLE_DURATION, getTimingMultiplier, getTierMultiplier, calculateRevenue } from "../economy";
import CardDisplay from "./CardDisplay";

export default function Meter() {
  const { activeCardId, inventory, addCash, addViews } = useGameStore();
  const [needle, setNeedle] = useState(0.5);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  const activeCard = CARD_CATALOG.find((c) => c.id === activeCardId) || CARD_CATALOG[0];
  const activeInv = inventory.find((i) => i.cardId === activeCard.id) || { cardId: activeCard.id, tier: 0, xp: 0 };

  useEffect(() => {
    const loop = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const progress = (elapsed % METER_CYCLE_DURATION) / METER_CYCLE_DURATION;
      const pos = Math.abs(2 * progress - 1);
      setNeedle(pos);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleClip = () => {
    const timingMult = getTimingMultiplier(needle);
    const tierMult = getTierMultiplier(activeInv.tier);
    const { views, cash } = calculateRevenue(activeCard.baseViews, activeCard.cpm, timingMult, tierMult);

    addCash(cash);
    addViews(views);

    if (timingMult >= 100) {
      setLastResult(`PERFECT RELEASE (100x)! +${views.toLocaleString()} Views (+$${cash.toFixed(2)})`);
    } else if (timingMult >= 10) {
      setLastResult(`GOOD RELEASE (10x)! +${views.toLocaleString()} Views (+$${cash.toFixed(2)})`);
    } else {
      setLastResult(`FLOP RELEASE (1x). +${views.toLocaleString()} Views (+$${cash.toFixed(2)})`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center text-center">
      <h2 className="text-2xl font-black text-white mb-1">Manual Clip Studio</h2>
      <p className="text-slate-400 text-sm mb-6">Hit the center green zone for a 100x viral multiplier!</p>

      <CardDisplay card={activeCard} tier={activeInv.tier} />

      <div className="w-full max-w-lg mt-8 mb-4">
        <div className="h-8 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden flex shadow-inner">
          <div className="flex-1 bg-rose-950/60 flex items-center justify-center text-[10px] text-rose-400 font-bold">1x</div>
          <div className="w-16 bg-amber-950/60 border-x border-amber-500/30 flex items-center justify-center text-[10px] text-amber-300 font-bold">10x</div>
          <div className="w-12 bg-emerald-500 flex items-center justify-center text-[10px] text-black font-black">100x</div>
          <div className="w-16 bg-amber-950/60 border-x border-amber-500/30 flex items-center justify-center text-[10px] text-amber-300 font-bold">10x</div>
          <div className="flex-1 bg-rose-950/60 flex items-center justify-center text-[10px] text-rose-400 font-bold">1x</div>

          <div
            className="absolute top-0 bottom-0 w-2 bg-white shadow-lg shadow-white transform -translate-x-1/2 transition-none"
            style={{ left: `${needle * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleClip}
        className="px-10 py-4 bg-amber-400 text-black font-black text-lg rounded-2xl shadow-xl shadow-amber-400/20 hover:bg-amber-300 active:scale-95 transition-transform"
      >
        CLIP HIGHLIGHT
      </button>

      {lastResult && (
        <div className="mt-4 text-sm font-bold text-amber-300 font-mono bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
          {lastResult}
        </div>
      )}
    </div>
  );
}
