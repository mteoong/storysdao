"use client";

import { useAccount } from "wagmi";
import ConnectButton from "@/components/ConnectButton";
import { useInventory } from "@/context/InventoryContext";
import ItemIcon from "@/components/ItemIcon";
import Link from "next/link";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { items, removeItem } = useInventory();

  return (
    <div className="min-h-screen bg-roblox-darker">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-white mb-8">Dashboard</h1>

        {!isConnected ? (
          <div className="bg-roblox-card border-2 border-roblox-border rounded-2xl p-12 text-center">
            <h2 className="text-xl font-bold text-white mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to manage your inventory and game assets.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wallet Info */}
            <div className="bg-roblox-card border-2 border-roblox-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Wallet
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-roblox-red to-red-500" />
                <div>
                  <p className="text-white font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  <p className="text-gray-500 text-xs">Monad Testnet</p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-roblox-card border-2 border-roblox-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Inventory ({items.length} items)
              </h2>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No items yet.</p>
                  <Link
                    href="/marketplace"
                    className="text-roblox-red text-sm hover:underline mt-2 inline-block font-bold"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-roblox-dark/50 border-2 border-roblox-border/60 rounded-2xl p-3 hover:border-roblox-red/40 transition-colors"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-2">
                          <ItemIcon
                            itemId={item.id}
                            color={item.color}
                            size={56}
                            glow
                          />
                        </div>
                        <p className="text-white text-xs font-bold text-center">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          {item.rarity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 text-xs transition-opacity"
                        title="Remove item"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
