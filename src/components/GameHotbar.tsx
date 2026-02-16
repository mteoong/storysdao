"use client";

import { useEffect, useCallback } from "react";
import { useInventory } from "@/context/InventoryContext";
import ItemIcon from "./ItemIcon";

export default function GameHotbar() {
  const { items, equippedItemId, equipItem } = useInventory();

  const hotbarItems = items.slice(0, 9);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const match = e.code.match(/^Digit([1-9])$/);
      if (match) {
        const idx = parseInt(match[1]) - 1;
        if (idx < hotbarItems.length) {
          const item = hotbarItems[idx];
          equipItem(equippedItemId === item.id ? null : item.id);
        }
      }
    },
    [hotbarItems, equippedItemId, equipItem]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (hotbarItems.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-auto z-10">
      {hotbarItems.map((item, index) => {
        const isEquipped = equippedItemId === item.id;
        return (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              equipItem(isEquipped ? null : item.id);
            }}
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${
              isEquipped
                ? "bg-roblox-red/40 border-2 border-roblox-red shadow-[0_0_15px_rgba(226,35,26,0.5)]"
                : "bg-black/60 border border-white/20 hover:border-white/40"
            }`}
            title={item.name}
          >
            <ItemIcon
              itemId={item.id}
              color={item.color}
              size={32}
              glow={isEquipped}
            />
            <span className="text-[9px] text-white/70 mt-0.5">
              {index + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
