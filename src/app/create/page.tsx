"use client";

import { useState } from "react";
import { useWorlds } from "@/context/WorldsContext";
import { WorldGenerator } from "@/engine/WorldGenerator";
import type { WorldData } from "@/engine/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const WorldPreview = dynamic(() => import("@/components/WorldPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-roblox-dark/50 rounded-2xl animate-pulse" />
  ),
});

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [generatedWorld, setGeneratedWorld] = useState<WorldData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { worlds, saveWorld, deleteWorld } = useWorlds();
  const router = useRouter();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const worldData = WorldGenerator.generate(prompt);
      setGeneratedWorld(worldData);
      setIsGenerating(false);
    }, 800);
  };

  const handleSave = () => {
    if (!generatedWorld) return;
    saveWorld(prompt, generatedWorld);
    setGeneratedWorld(null);
    setPrompt("");
  };

  const handlePlayPreview = () => {
    if (!generatedWorld) return;
    const id = saveWorld(prompt, generatedWorld);
    router.push(`/play?world=${id}`);
  };

  return (
    <div className="min-h-screen bg-roblox-darker">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-white mb-2">
          AI World Builder
        </h1>
        <p className="text-gray-400 mb-8">
          Describe your dream world and watch it come to life. Try keywords
          like: castle, forest, mountain, lake, desert, village, tower, bridge.
        </p>

        {/* Prompt Input */}
        <div className="bg-roblox-card border-2 border-roblox-border rounded-2xl p-6 mb-6">
          <label className="text-white text-sm font-bold mb-2 block">
            Describe your world
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A mountain kingdom with a castle surrounded by forests and a lake..."
            className="w-full bg-roblox-darker/50 border-2 border-roblox-border/60 rounded-xl p-4 text-white placeholder:text-gray-600 resize-none h-24 focus:outline-none focus:border-roblox-red/40 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="mt-3 bg-roblox-red hover:bg-roblox-red/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            {isGenerating ? "Generating..." : "Generate World"}
          </button>
        </div>

        {/* Preview */}
        {generatedWorld && (
          <div className="bg-roblox-card border-2 border-roblox-border rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Preview</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-roblox-green/20 hover:bg-roblox-green/30 text-roblox-green border-2 border-roblox-green/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                  Save World
                </button>
                <button
                  onClick={handlePlayPreview}
                  className="bg-roblox-red hover:bg-roblox-red/80 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                >
                  Play Now
                </button>
              </div>
            </div>
            <WorldPreview worldData={generatedWorld} />
            <p className="text-gray-400 text-sm mt-3">
              {generatedWorld.blocks.length.toLocaleString()} blocks generated
            </p>
          </div>
        )}

        {/* My Worlds Gallery */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">My Worlds</h2>
          {worlds.length === 0 ? (
            <div className="bg-roblox-card border-2 border-roblox-border/60 rounded-2xl p-8 text-center">
              <p className="text-gray-500 text-sm">
                No saved worlds yet. Generate one above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {worlds.map((world) => (
                <div
                  key={world.id}
                  className="bg-roblox-card border-2 border-roblox-border/60 rounded-2xl p-4 hover:border-roblox-red/40 transition-colors"
                >
                  <h3 className="text-white font-bold text-sm mb-1 truncate">
                    {world.worldData.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-1 line-clamp-2">
                    {world.prompt}
                  </p>
                  <p className="text-gray-600 text-[10px] mb-3">
                    {world.worldData.blocks.length.toLocaleString()} blocks
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/play?world=${world.id}`}
                      className="text-roblox-red text-xs hover:underline font-bold"
                    >
                      Play
                    </Link>
                    <button
                      onClick={() => deleteWorld(world.id)}
                      className="text-red-400/60 text-xs hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
