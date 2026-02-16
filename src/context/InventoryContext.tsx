"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: string;
  rarity: string;
  category: string;
  color: string;
  acquiredAt: number;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (asset: Omit<InventoryItem, "acquiredAt">) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  equippedItemId: string | null;
  equipItem: (id: string | null) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

const STORAGE_KEY = "storysdao-inventory";
const EQUIPPED_KEY = "storysdao-equipped";

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [equippedItemId, setEquippedItemId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
      const equipped = localStorage.getItem(EQUIPPED_KEY);
      if (equipped) setEquippedItemId(equipped);
    } catch {}
    setHydrated(true);
  }, []);

  // Persist items to localStorage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // Persist equipped item
  useEffect(() => {
    if (!hydrated) return;
    if (equippedItemId) {
      localStorage.setItem(EQUIPPED_KEY, equippedItemId);
    } else {
      localStorage.removeItem(EQUIPPED_KEY);
    }
  }, [equippedItemId, hydrated]);

  const addItem = useCallback(
    (asset: Omit<InventoryItem, "acquiredAt">) => {
      setItems((prev) => {
        if (prev.some((i) => i.id === asset.id)) return prev;
        return [...prev, { ...asset, acquiredAt: Date.now() }];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setEquippedItemId((prev) => (prev === id ? null : prev));
  }, []);

  const hasItem = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const equipItem = useCallback((id: string | null) => {
    setEquippedItemId(id);
  }, []);

  const value = useMemo(
    () => ({ items, addItem, removeItem, hasItem, equippedItemId, equipItem }),
    [items, addItem, removeItem, hasItem, equippedItemId, equipItem]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
