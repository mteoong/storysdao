export interface BlockType {
  id: string;
  color: number;
  name: string;
}

export interface BlockInstance {
  x: number;
  y: number;
  z: number;
  type: string;
}

export interface WorldData {
  name: string;
  spawnPoint: [number, number, number];
  blocks: BlockInstance[];
}

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export const BLOCK_SIZE = 1;

export const BLOCK_TYPES: Record<string, BlockType> = {
  grass: { id: "grass", color: 0x4caf50, name: "Grass" },
  dirt: { id: "dirt", color: 0x8d6e63, name: "Dirt" },
  stone: { id: "stone", color: 0x9e9e9e, name: "Stone" },
  wood: { id: "wood", color: 0xa1887f, name: "Wood" },
  sand: { id: "sand", color: 0xfdd835, name: "Sand" },
  water: { id: "water", color: 0x29b6f6, name: "Water" },
  brick: { id: "brick", color: 0xc62828, name: "Brick" },
  glass: { id: "glass", color: 0xb3e5fc, name: "Glass" },
};
