"use client";

import Link from "next/link";
import ConnectButton from "./ConnectButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-roblox-surface/95 backdrop-blur-md border-b border-roblox-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-black text-white">
            <span className="text-roblox-red">Storys</span>dao
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/play"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Play
            </Link>
            <Link
              href="/create"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Create
            </Link>
            <Link
              href="/marketplace"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Dashboard
            </Link>
          </div>
        </div>
        <ConnectButton />
      </div>
    </nav>
  );
}
