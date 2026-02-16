"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { WorldData } from "@/engine/types";

export interface SavedWorld {
  id: string;
  prompt: string;
  worldData: WorldData;
  createdAt: number;
}

interface WorldsContextType {
  worlds: SavedWorld[];
  saveWorld: (prompt: string, worldData: WorldData) => string;
  deleteWorld: (id: string) => void;
  getWorld: (id: string) => SavedWorld | undefined;
}

const WorldsContext = createContext<WorldsContextType | null>(null);

const STORAGE_KEY = "storysdao-worlds";

export function WorldsProvider({ children }: { children: React.ReactNode }) {
  const [worlds, setWorlds] = useState<SavedWorld[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWorlds(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds));
  }, [worlds, hydrated]);

  const saveWorld = useCallback((prompt: string, worldData: WorldData) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setWorlds((prev) => [
      { id, prompt, worldData, createdAt: Date.now() },
      ...prev,
    ]);
    return id;
  }, []);

  const deleteWorld = useCallback((id: string) => {
    setWorlds((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const getWorld = useCallback(
    (id: string) => worlds.find((w) => w.id === id),
    [worlds]
  );

  const value = useMemo(
    () => ({ worlds, saveWorld, deleteWorld, getWorld }),
    [worlds, saveWorld, deleteWorld, getWorld]
  );

  return (
    <WorldsContext.Provider value={value}>{children}</WorldsContext.Provider>
  );
}

export function useWorlds() {
  const ctx = useContext(WorldsContext);
  if (!ctx) throw new Error("useWorlds must be used within WorldsProvider");
  return ctx;
}
