"use client";

import { useState } from "react";
import AssetCard from "./AssetCard";
import marketplaceData from "@/data/marketplace.json";

const categories = ["All", "Weapon", "Wearable", "Tool", "Cosmetic"];

export default function AssetGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? marketplaceData
      : marketplaceData.filter((a) => a.category === activeCategory);

  return (
    <div>
      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "bg-roblox-red text-white"
                : "bg-roblox-dark/50 text-gray-400 hover:text-white border-2 border-roblox-border/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          No assets found in this category.
        </p>
      )}
    </div>
  );
}
