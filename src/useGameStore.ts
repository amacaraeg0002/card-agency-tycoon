import { create } from "zustand";
import { GameState } from "./types";
import { CARD_CATALOG } from "./cardData";
import { getFloorExpansionCost, getQuicksellValue } from "./economy";

interface GameStoreActions {
  addCash: (amount: number) => void;
  spendCash: (amount: number) => boolean;
  addViews: (amount: number) => void;
  setActiveCard: (cardId: string) => void;
  toggleLineupCard: (cardId: string) => void;
  expandFloor: () => boolean;
  hireStaff: (staffId: string, cost: number) => boolean;
  addCardToInventory: (cardId: string) => void;
  quicksellCard: (cardId: string) => void;
  checkAndClaimCollectionReward: () => boolean;
}

export const useGameStore = create<GameState & GameStoreActions>((set, get) => ({
  cash: 10000,
  totalViews: 0,
  agencyLevel: 1,
  levelXp: 0,
  floorSize: 15,
  activeCardId: "shohei_ohtani_live",
  lineupCardIds: ["shohei_ohtani_live"],
  hiredStaff: [],
  unlockedRewards: [],
  inventory: [
    { cardId: "shohei_ohtani_live", tier: 5, xp: 300000 },
  ],
  addCash: (amount) => set((state) => ({ cash: state.cash + amount })),
  spendCash: (amount) => {
    if (get().cash < amount) return false;
    set((state) => ({ cash: state.cash - amount }));
    return true;
  },
  addViews: (amount) => {
    set((state) => {
      const newViews = state.totalViews + amount;
      const newLevelXp = state.levelXp + Math.floor(amount / 100);
      const newLevel = Math.floor(newLevelXp / 1000) + 1;
      return { totalViews: newViews, levelXp: newLevelXp, agencyLevel: newLevel };
    });
  },
  setActiveCard: (cardId) => set({ activeCardId: cardId }),
  toggleLineupCard: (cardId) => {
    const current = get().lineupCardIds;
    if (current.includes(cardId)) {
      if (current.length > 1) {
        set({ lineupCardIds: current.filter((id) => id !== cardId) });
      }
    } else {
      if (current.length < 5) {
        set({ lineupCardIds: [...current, cardId] });
      }
    }
  },
  expandFloor: () => {
    const cost = getFloorExpansionCost(get().floorSize);
    if (get().cash < cost) return false;
    set((state) => ({
      cash: state.cash - cost,
      floorSize: state.floorSize + 10,
    }));
    return true;
  },
  hireStaff: (staffId, cost) => {
    if (get().cash < cost) return false;
    if (get().hiredStaff.includes(staffId)) return false;
    set((state) => ({
      cash: state.cash - cost,
      hiredStaff: [...state.hiredStaff, staffId],
    }));
    return true;
  },
  addCardToInventory: (cardId) => {
    set((state) => {
      const existing = state.inventory.find((item) => item.cardId === cardId);
      if (existing) {
        return {
          inventory: state.inventory.map((item) =>
            item.cardId === cardId ? { ...item, xp: item.xp + 1000 } : item
          ),
        };
      }
      return {
        inventory: [...state.inventory, { cardId, tier: 0, xp: 0 }],
      };
    });
    get().checkAndClaimCollectionReward();
  },
  quicksellCard: (cardId) => {
    const card = CARD_CATALOG.find((c) => c.id === cardId);
    if (!card) return;
    const value = getQuicksellValue(card.ovr);
    set((state) => ({
      cash: state.cash + value,
      inventory: state.inventory.filter((item) => item.cardId !== cardId),
      lineupCardIds: state.lineupCardIds.filter((id) => id !== cardId),
      activeCardId: state.activeCardId === cardId ? null : state.activeCardId,
    }));
  },
  checkAndClaimCollectionReward: () => {
    const inv = get().inventory;
    const championCards = CARD_CATALOG.filter((c) => c.theme === "Champion Heroes");
    const hasAllChampions = championCards.every((c) => inv.some((i) => i.cardId === c.id));
    if (hasAllChampions && !inv.some((i) => i.cardId === "tom_brady_reward")) {
      set((state) => ({
        inventory: [
          ...state.inventory,
          { cardId: "tom_brady_reward", tier: 5, xp: 300000 },
        ],
        unlockedRewards: [...state.unlockedRewards, "tom_brady_reward"],
      }));
      return true;
    }
    return false;
  },
}));
