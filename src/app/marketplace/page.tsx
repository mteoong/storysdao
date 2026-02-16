"use client";

import AssetGrid from "@/components/marketplace/AssetGrid";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-roblox-darker">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">
            Browse and trade game assets. All items are priced in $SDAO tokens.
          </p>
        </div>
        <AssetGrid />
      </div>
    </div>
  );
}
