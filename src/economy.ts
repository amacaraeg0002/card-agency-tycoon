export const METER_CYCLE_DURATION = 1.2;

export function getTimingMultiplier(needlePosition: number): number {
  if (needlePosition >= 0.465 && needlePosition <= 0.535) return 100.0;
  if ((needlePosition >= 0.400 && needlePosition < 0.465) || (needlePosition > 0.535 && needlePosition <= 0.600)) return 10.0;
  return 1.0;
}

export function getTierMultiplier(tier: number): number {
  switch (tier) {
    case 5: return 2.25;
    case 4: return 1.75;
    case 3: return 1.45;
    case 2: return 1.25;
    case 1: return 1.10;
    default: return 1.00;
  }
}

export function calculateRevenue(baseViews: number, cpm: number, timingMult: number, tierMult: number): { views: number; cash: number } {
  const calculatedViews = Math.floor(baseViews * timingMult * tierMult);
  const grossCash = ((calculatedViews / 1000) * cpm) * 2.5;
  return { views: calculatedViews, cash: grossCash };
}

export function getFloorExpansionCost(currentSize: number): number {
  return currentSize * 1000;
}

export function getQuicksellValue(ovr: number): number {
  if (ovr >= 95) return 25000;
  if (ovr >= 90) return 10000;
  if (ovr >= 85) return 4000;
  if (ovr >= 80) return 1000;
  if (ovr >= 75) return 250;
  if (ovr >= 65) return 50;
  return 10;
}
