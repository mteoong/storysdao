# Storysdao

A Roblox-style 3D game platform with an onchain economy on Monad. Build worlds, trade assets, and earn $SDAO tokens.

# Demo
https://github.com/user-attachments/assets/e2d78132-1235-4d14-8498-07d7cf434edc

## What It Does

**Storysdao** is a browser-based 3D voxel game engine with a built-in marketplace and AI world builder, all connected to the Monad blockchain.

### Features

- **3D Voxel Engine** — First-person exploration with WASD movement, mouse look, jumping, and physics. Built with Three.js using instanced mesh rendering for performance.
- **AI World Builder** — Type a text prompt like "a castle surrounded by forest and a lake" and get a procedurally generated voxel world you can walk through.
- **Marketplace** — 8 game items (weapons, tools, wearables, cosmetics) with unique hand-drawn icons. Buy items and they appear in your inventory.
- **Inventory System** — Items persist in localStorage. Equip items from a hotbar (click or press 1-9) and see them rendered as 3D models in your hand while you play.
- **Held Item Display** — Equipped items appear as 3D meshes in the bottom-right of your view (Minecraft-style) with walk bobbing animation.
- **Wallet Integration** — Connect via MetaMask or WalletConnect using RainbowKit, targeting Monad Testnet.
- **$SDAO Token** — ERC-20 smart contract (StorydaoToken) with 1B supply and a faucet function.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, feature cards, and CTAs |
| `/play` | Full-screen 3D game engine |
| `/create` | AI World Builder — generate worlds from text prompts |
| `/marketplace` | Browse and buy game items |
| `/dashboard` | View wallet info and inventory |

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **3D Engine**: Three.js with custom voxel renderer, physics, and player controller
- **Wallet**: wagmi v2, RainbowKit, viem
- **Chain**: Monad Testnet (chain ID 10143)
- **Smart Contract**: Solidity 0.8.20, OpenZeppelin, Hardhat
- **Styling**: Roblox-inspired dark theme with Nunito font

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — deploy with zero config
4. Optionally set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in environment variables (get one at [cloud.walletconnect.com](https://cloud.walletconnect.com))

### Smart Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network monadTestnet
```

Requires `DEPLOYER_PRIVATE_KEY` in `.env.local`. See `.env.local.example`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Optional | WalletConnect project ID. Falls back to "demo" if unset. |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | Optional | Deployed SDAO token contract address |
| `DEPLOYER_PRIVATE_KEY` | For deploy only | Private key for contract deployment |

## Project Structure

```
src/
  app/              # Next.js pages (landing, play, create, marketplace, dashboard)
  components/       # React components (Navbar, GameCanvas, GameHotbar, ItemIcon, etc.)
  engine/           # Three.js game engine
    Engine.ts         # Main orchestrator (game loop, lifecycle)
    SceneManager.ts   # Scene, camera, renderer, lights
    PlayerController.ts # First-person movement + mouse look
    Physics.ts        # AABB collision detection + gravity
    WorldBuilder.ts   # Voxel world renderer (instanced meshes)
    WorldGenerator.ts # Procedural world generation from text prompts
    HeldItemManager.ts # 3D held item display with bobbing
    InputManager.ts   # Keyboard + mouse state tracking
    types.ts          # BlockType, WorldData, etc.
  context/          # React contexts (Inventory, Worlds) with localStorage
  config/           # Chain, contract, wagmi config
  data/             # marketplace.json (item definitions)
  utils/            # itemIcons.ts (canvas-drawn item icons)
contracts/          # Solidity smart contract (StorydaoToken/SDAO)
```

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look around |
| Space | Jump |
| 1-9 | Equip hotbar item |
| Click | Lock cursor for mouse look |
| ESC | Release cursor |

## License

MIT
