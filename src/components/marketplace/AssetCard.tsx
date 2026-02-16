"use client";

import { useInventory } from "@/context/InventoryContext";
import ItemIcon from "@/components/ItemIcon";

interface Asset {
  id: string;
  name: string;
  description: string;
  price: string;
  rarity: string;
  category: string;
  color: string;
}

const rarityColors: Record<string, string> = {
  Common: "text-gray-400 bg-gray-400/10",
  Rare: "text-blue-400 bg-blue-400/10",
  Epic: "text-purple-400 bg-purple-400/10",
  Legendary: "text-yellow-400 bg-yellow-400/10",
};

export default function AssetCard({ asset }: { asset: Asset }) {
  const { addItem, hasItem } = useInventory();
  const owned = hasItem(asset.id);

  return (
    <div className="bg-roblox-card border-2 border-roblox-border rounded-2xl overflow-hidden hover:border-roblox-red/40 transition-all hover:transform hover:scale-[1.02] hover:shadow-lg">
      {/* Asset Preview */}
      <div
        className="h-48 flex items-center justify-center"
        style={{ backgroundColor: asset.color + "15" }}
      >
        <ItemIcon
          itemId={asset.id}
          color={asset.color}
          size={80}
          glow
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold">{asset.name}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              rarityColors[asset.rarity] || rarityColors.Common
            }`}
          >
            {asset.rarity}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {asset.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-roblox-red font-bold">
              {asset.price}{" "}
              <span className="text-xs font-normal text-gray-500">SDAO</span>
            </p>
          </div>
          <span className="text-gray-500 text-xs">{asset.category}</span>
        </div>

        <button
          onClick={() => !owned && addItem(asset)}
          disabled={owned}
          className={`w-full mt-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            owned
              ? "bg-roblox-green/20 text-roblox-green border-2 border-roblox-green/30 cursor-not-allowed"
              : "bg-roblox-red/20 hover:bg-roblox-red/30 text-roblox-red border-2 border-roblox-red/30 hover:-translate-y-0.5"
          }`}
        >
          {owned ? "Owned" : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
