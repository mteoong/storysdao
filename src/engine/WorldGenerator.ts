import { WorldData, BlockInstance } from "./types";

interface GenerationParams {
  hasCastle: boolean;
  hasForest: boolean;
  hasMountain: boolean;
  hasLake: boolean;
  hasDesert: boolean;
  hasVillage: boolean;
  hasTower: boolean;
  hasBridge: boolean;
  isFlat: boolean;
  worldSize: number;
  seed: number;
}

export class WorldGenerator {
  static generate(prompt: string): WorldData {
    const params = WorldGenerator.parsePrompt(prompt);
    const blocks: BlockInstance[] = [];

    WorldGenerator.generateTerrain(blocks, params);

    if (params.hasMountain) WorldGenerator.generateMountain(blocks, params);
    if (params.hasLake) WorldGenerator.generateLake(blocks, params);
    if (params.hasDesert) WorldGenerator.generateDesert(blocks, params);
    if (params.hasForest) WorldGenerator.generateForest(blocks, params);
    if (params.hasCastle) WorldGenerator.generateCastle(blocks, params);
    if (params.hasVillage) WorldGenerator.generateVillage(blocks, params);
    if (params.hasTower) WorldGenerator.generateTower(blocks, params);
    if (params.hasBridge) WorldGenerator.generateBridge(blocks, params);

    return {
      name: prompt.slice(0, 50) || "Custom World",
      spawnPoint: [0, 3, -5],
      blocks,
    };
  }

  private static hash(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  private static seededRandom(seed: number, index: number): number {
    const x = Math.sin(seed * 9301 + index * 49297) * 49297;
    return x - Math.floor(x);
  }

  private static parsePrompt(prompt: string): GenerationParams {
    const p = prompt.toLowerCase();
    let worldSize = 20;
    if (/large|big|huge|vast/.test(p)) worldSize = 30;
    if (/small|tiny|little/.test(p)) worldSize = 15;

    return {
      hasCastle: /castle|fortress|kingdom|palace/.test(p),
      hasForest: /forest|trees|woods|jungle/.test(p),
      hasMountain: /mountain|hill|peak|cliff|highlands/.test(p),
      hasLake: /lake|water|ocean|river|pond|sea/.test(p),
      hasDesert: /desert|sand|dune|beach/.test(p),
      hasVillage: /village|town|houses|buildings|city/.test(p),
      hasTower: /tower|pillar|monument|obelisk|spire/.test(p),
      hasBridge: /bridge|path|road|walkway/.test(p),
      isFlat: /flat|plain|empty/.test(p),
      worldSize,
      seed: WorldGenerator.hash(prompt),
    };
  }

  private static generateTerrain(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const s = params.worldSize;
    for (let x = -s; x < s; x++) {
      for (let z = -s; z < s; z++) {
        let height = 0;
        if (!params.isFlat) {
          height = Math.floor(
            Math.sin(x * 0.15 + params.seed * 0.01) *
              Math.cos(z * 0.15 + params.seed * 0.007) *
              1.5
          );
        }
        blocks.push({ x, y: height, z, type: "grass" });
        blocks.push({ x, y: height - 1, z, type: "dirt" });
        blocks.push({ x, y: height - 2, z, type: "stone" });
      }
    }
  }

  private static generateMountain(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const cx = Math.floor(
      WorldGenerator.seededRandom(params.seed, 100) * 10 + 5
    );
    const cz = Math.floor(
      WorldGenerator.seededRandom(params.seed, 101) * 10 + 5
    );
    const radius = 8;
    const maxHeight = 12;

    for (let x = cx - radius; x <= cx + radius; x++) {
      for (let z = cz - radius; z <= cz + radius; z++) {
        const dist = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
        if (dist > radius) continue;
        const height = Math.floor(maxHeight * (1 - dist / radius));
        for (let y = 1; y <= height; y++) {
          blocks.push({
            x,
            y,
            z,
            type: y > height - 2 ? "stone" : y > 0 ? "dirt" : "grass",
          });
        }
      }
    }
  }

  private static generateLake(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const cx = Math.floor(
      WorldGenerator.seededRandom(params.seed, 200) * 8 - 12
    );
    const cz = Math.floor(
      WorldGenerator.seededRandom(params.seed, 201) * 8 - 12
    );
    const rx = 5 + Math.floor(WorldGenerator.seededRandom(params.seed, 202) * 3);
    const rz = 4 + Math.floor(WorldGenerator.seededRandom(params.seed, 203) * 3);

    for (let x = cx - rx; x <= cx + rx; x++) {
      for (let z = cz - rz; z <= cz + rz; z++) {
        const dx = (x - cx) / rx;
        const dz = (z - cz) / rz;
        if (dx * dx + dz * dz <= 1) {
          // Replace surface grass with water
          const idx = blocks.findIndex(
            (b) => b.x === x && b.z === z && b.type === "grass"
          );
          if (idx !== -1) {
            blocks[idx].type = "water";
          }
        }
      }
    }
  }

  private static generateDesert(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const startX =
      -params.worldSize +
      Math.floor(WorldGenerator.seededRandom(params.seed, 300) * 5);
    const startZ = Math.floor(params.worldSize * 0.4);

    for (let x = startX; x < startX + 12; x++) {
      for (let z = startZ; z < startZ + 12; z++) {
        const idx = blocks.findIndex(
          (b) => b.x === x && b.z === z && b.type === "grass"
        );
        if (idx !== -1) {
          blocks[idx].type = "sand";
        }
      }
    }
  }

  private static generateForest(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const numTrees = 8 + Math.floor(params.worldSize * 0.4);
    for (let i = 0; i < numTrees; i++) {
      const tx =
        Math.floor(
          WorldGenerator.seededRandom(params.seed, 400 + i) *
            params.worldSize *
            1.4
        ) -
        params.worldSize * 0.7;
      const tz =
        Math.floor(
          WorldGenerator.seededRandom(params.seed, 500 + i) *
            params.worldSize *
            1.4
        ) -
        params.worldSize * 0.7;

      // Trunk
      for (let y = 1; y <= 4; y++) {
        blocks.push({ x: Math.floor(tx), y, z: Math.floor(tz), type: "wood" });
      }
      // Leaves
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          for (let dy = 4; dy <= 6; dy++) {
            if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === 6) continue;
            if (dx === 0 && dz === 0 && dy <= 4) continue;
            blocks.push({
              x: Math.floor(tx) + dx,
              y: dy,
              z: Math.floor(tz) + dz,
              type: "grass",
            });
          }
        }
      }
    }
  }

  private static generateCastle(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const cx = 8;
    const cz = 8;
    const size = 7;

    // Walls
    for (let x = cx - size; x <= cx + size; x++) {
      for (let z = cz - size; z <= cz + size; z++) {
        const isWall =
          x === cx - size ||
          x === cx + size ||
          z === cz - size ||
          z === cz + size;
        if (isWall) {
          for (let y = 1; y <= 5; y++) {
            // Gate opening
            if (
              x >= cx - 1 &&
              x <= cx + 1 &&
              z === cz - size &&
              y <= 3
            )
              continue;
            blocks.push({ x, y, z, type: "stone" });
          }
          // Crenellations
          if ((x + z) % 2 === 0) {
            blocks.push({ x, y: 6, z, type: "stone" });
          }
        }
      }
    }

    // Corner towers
    for (const [tx, tz] of [
      [cx - size, cz - size],
      [cx + size, cz - size],
      [cx - size, cz + size],
      [cx + size, cz + size],
    ]) {
      for (let y = 1; y <= 8; y++) {
        blocks.push({ x: tx, y, z: tz, type: "stone" });
        blocks.push({ x: tx + 1, y, z: tz, type: "stone" });
        blocks.push({ x: tx, y, z: tz + 1, type: "stone" });
      }
    }

    // Floor
    for (let x = cx - size + 1; x < cx + size; x++) {
      for (let z = cz - size + 1; z < cz + size; z++) {
        blocks.push({ x, y: 0, z, type: "brick" });
      }
    }
  }

  private static generateVillage(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const houses = [
      [-6, -6],
      [-6, -1],
      [-1, -6],
      [4, -8],
    ];

    for (const [hx, hz] of houses) {
      // Walls (4x4 house)
      for (let x = hx; x <= hx + 4; x++) {
        for (let z = hz; z <= hz + 4; z++) {
          for (let y = 1; y <= 3; y++) {
            const isWall =
              x === hx || x === hx + 4 || z === hz || z === hz + 4;
            if (isWall) {
              // Door
              if (x === hx + 2 && z === hz && y <= 2) continue;
              blocks.push({ x, y, z, type: "wood" });
            }
          }
          // Roof
          blocks.push({ x, y: 4, z, type: "brick" });
        }
      }
    }
  }

  private static generateTower(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    const tx = -8;
    const tz = 8;
    const height = 12;

    for (let y = 1; y <= height; y++) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          // Hollow inside above ground
          if (dx === 0 && dz === 0 && y > 1 && y < height) continue;
          blocks.push({ x: tx + dx, y, z: tz + dz, type: "stone" });
        }
      }
    }

    // Platform on top
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        blocks.push({ x: tx + dx, y: height, z: tz + dz, type: "stone" });
      }
    }
  }

  private static generateBridge(
    blocks: BlockInstance[],
    params: GenerationParams
  ) {
    // Bridge across Z axis at x=0
    for (let z = -8; z <= 8; z++) {
      blocks.push({ x: -1, y: 3, z, type: "wood" });
      blocks.push({ x: 0, y: 3, z, type: "wood" });
      blocks.push({ x: 1, y: 3, z, type: "wood" });
    }
    // Railings
    for (let z = -8; z <= 8; z += 2) {
      blocks.push({ x: -2, y: 4, z, type: "wood" });
      blocks.push({ x: 2, y: 4, z, type: "wood" });
    }
    // Support pillars
    for (const pz of [-6, 0, 6]) {
      for (let y = 0; y <= 3; y++) {
        blocks.push({ x: -1, y, z: pz, type: "stone" });
        blocks.push({ x: 1, y, z: pz, type: "stone" });
      }
    }
  }
}
