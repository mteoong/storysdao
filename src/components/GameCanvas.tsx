"use client";

import { useEffect, useRef } from "react";
import { Engine } from "@/engine/Engine";
import type { WorldData } from "@/engine/types";
import { useInventory } from "@/context/InventoryContext";
import GameHotbar from "./GameHotbar";

interface GameCanvasProps {
  worldData?: WorldData;
}

export default function GameCanvas({ worldData }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const { items, equippedItemId } = useInventory();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, worldData);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [worldData]);

  // Bridge: sync equipped item from React context to Engine
  useEffect(() => {
    if (!engineRef.current) return;
    if (equippedItemId) {
      const item = items.find((i) => i.id === equippedItemId);
      if (item) {
        engineRef.current.setEquippedItem({
          id: item.id,
          name: item.name,
          category: item.category,
          color: item.color,
        });
        return;
      }
    }
    engineRef.current.setEquippedItem(null);
  }, [equippedItemId, items]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ cursor: "crosshair" }}
      />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-roblox-surface/80 text-white px-4 py-2 rounded-xl text-sm font-semibold pointer-events-none">
        Click to look around &bull; WASD to move &bull; Space to jump &bull; ESC
        to release cursor
      </div>
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-1 h-6 bg-white/70 absolute -translate-x-1/2 -translate-y-1/2" />
        <div className="w-6 h-1 bg-white/70 absolute -translate-x-1/2 -translate-y-1/2" />
      </div>
      <GameHotbar />
    </div>
  );
}
