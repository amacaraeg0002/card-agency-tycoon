import React, { useRef, useEffect } from "react";
import { useGameStore } from "../useGameStore";
import { getFloorExpansionCost } from "../economy";

export default function OfficeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { floorSize, cash, expandFloor } = useGameStore();

  const expansionCost = getFloorExpansionCost(floorSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = canvas.width / 2;
    const originY = 80;
    const tileW = 28;
    const tileH = 14;

    for (let r = 0; r < floorSize; r++) {
      for (let c = 0; c < floorSize; c++) {
        const x = originX + (c - r) * (tileW / 2);
        const y = originY + (c + r) * (tileH / 2);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + tileW / 2, y + tileH / 2);
        ctx.lineTo(x, y + tileH);
        ctx.lineTo(x - tileW / 2, y + tileH / 2);
        ctx.closePath();

        ctx.fillStyle = (r + c) % 2 === 0 ? "#1e293b" : "#0f172a";
        ctx.fill();
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }, [floorSize]);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col items-center text-center">
      <div className="flex justify-between items-center w-full mb-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Agency Edit Floor ({floorSize}×{floorSize} sq ft)</h2>
          <p className="text-xs text-slate-400">Expand your agency studio to house more equipment and editors.</p>
        </div>
        <button
          onClick={expandFloor}
          disabled={cash < expansionCost}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
            cash >= expansionCost ? "bg-amber-400 text-black hover:bg-amber-300" : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          Expand +10 sq ft (${expansionCost.toLocaleString()})
        </button>
      </div>

      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto flex justify-center">
        <canvas ref={canvasRef} width={800} height={500} className="rounded-xl bg-slate-950" />
      </div>
    </div>
  );
}
