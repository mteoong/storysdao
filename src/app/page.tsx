import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-roblox-darker">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-roblox-red/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-roblox-red/10 border border-roblox-red/30 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-roblox-green rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">
              Live on Monad Testnet
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Build, Play &amp; Earn
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-roblox-red to-red-400">
              Onchain
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Storysdao is a Roblox-style 3D game platform powered by the Monad
            blockchain. Create worlds, trade assets, and earn $SDAO tokens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/play"
              className="bg-roblox-red hover:bg-roblox-red/80 text-white px-8 py-3.5 rounded-xl font-bold transition-all text-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-roblox-red/25"
            >
              Play Now
            </Link>
            <Link
              href="/create"
              className="bg-roblox-card hover:bg-roblox-hover border-2 border-roblox-border text-white px-8 py-3.5 rounded-xl font-bold transition-all text-lg hover:-translate-y-0.5"
            >
              Create a World
            </Link>
            <Link
              href="/marketplace"
              className="bg-roblox-card hover:bg-roblox-hover border-2 border-roblox-border text-white px-8 py-3.5 rounded-xl font-bold transition-all text-lg hover:-translate-y-0.5"
            >
              Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="3D Worlds"
            description="Explore immersive voxel worlds built by creators. Walk around, jump, and interact with the environment in your browser."
            icon="🌍"
          />
          <FeatureCard
            title="AI World Builder"
            description="Describe your dream world in plain text and watch it generate. Build castles, forests, mountains, and more."
            icon="🤖"
          />
          <FeatureCard
            title="Own Your Assets"
            description="Game items, avatars, and worlds are yours. Trade them on the marketplace or take them to other games."
            icon="🏗️"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-t border-roblox-border/30 bg-roblox-dark/30">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem label="Worlds" value="Coming Soon" />
          <StatItem label="Token" value="$SDAO" />
          <StatItem label="Chain" value="Monad" />
          <StatItem label="Engine" value="Three.js" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-roblox-card border-2 border-roblox-border rounded-2xl p-6 hover:border-roblox-red/40 hover:shadow-lg hover:shadow-roblox-red/5 transition-all">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}
