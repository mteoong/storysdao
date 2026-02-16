"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useWorlds } from "@/context/WorldsContext";
import { Suspense } from "react";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-roblox-darker">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-roblox-red/30 border-t-roblox-red rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading Storysdao Engine...</p>
      </div>
    </div>
  ),
});

function PlayContent() {
  const searchParams = useSearchParams();
  const worldId = searchParams.get("world");
  const { getWorld } = useWorlds();

  const savedWorld = worldId ? getWorld(worldId) : undefined;
  const worldData = savedWorld?.worldData;

  return (
    <div className="fixed inset-0 pt-16">
      <GameCanvas worldData={worldData} />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 pt-16 bg-roblox-darker flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
