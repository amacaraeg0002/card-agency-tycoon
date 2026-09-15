export type Sport = "Baseball" | "Basketball" | "Football" | "Soccer" | "Tennis" | "Combat" | "NHL";
export type CollectionTheme = "Live Series" | "Champion Heroes" | "Reward";

export type CardRarity = "Common" | "Bronze" | "Silver" | "Gold" | "Diamond" | "Mythic";

export interface Card {
  id: string;
  name: string;
  sport: Sport;
  theme: CollectionTheme;
  ovr: number;
  baseViews: number;
  cpm: number;
  quirks: string[];
  imageUrl?: string;
}

export interface PlayerInventory {
  cardId: string;
  tier: 0 | 1 | 2 | 3 | 4 | 5;
  xp: number;
}

export interface PackOption {
  id: string;
  name: string;
  cost: number;
  description: string;
  sportFilter?: Sport;
  minOvr?: number;
  themeFilter?: CollectionTheme;
}

export interface GameState {
  cash: number;
  totalViews: number;
  agencyLevel: number;
  levelXp: number;
  floorSize: number;
  inventory: PlayerInventory[];
  activeCardId: string | null;
  lineupCardIds: string[];
  hiredStaff: string[];
  unlockedRewards: string[];
}
