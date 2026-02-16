import * as THREE from "three";
import { WorldData, BLOCK_TYPES, BLOCK_SIZE, BlockInstance } from "./types";
import { Physics } from "./Physics";

export class WorldBuilder {
  private meshes: THREE.Mesh[] = [];
  private scene: THREE.Scene;
  private physics: Physics;

  constructor(scene: THREE.Scene, physics: Physics) {
    this.scene = scene;
    this.physics = physics;
  }

  loadWorld(worldData: WorldData) {
    this.clear();

    // Group blocks by type for instanced rendering
    const blocksByType: Record<string, BlockInstance[]> = {};
    for (const block of worldData.blocks) {
      if (!blocksByType[block.type]) {
        blocksByType[block.type] = [];
      }
      blocksByType[block.type].push(block);
    }

    // Create instanced meshes per block type
    const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

    for (const [typeId, blocks] of Object.entries(blocksByType)) {
      const blockType = BLOCK_TYPES[typeId];
      if (!blockType) continue;

      const material = new THREE.MeshLambertMaterial({
        color: blockType.color,
      });

      const instancedMesh = new THREE.InstancedMesh(
        geometry,
        material,
        blocks.length
      );
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;

      const matrix = new THREE.Matrix4();
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        matrix.setPosition(
          b.x + BLOCK_SIZE / 2,
          b.y + BLOCK_SIZE / 2,
          b.z + BLOCK_SIZE / 2
        );
        instancedMesh.setMatrixAt(i, matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      this.scene.add(instancedMesh);
      this.meshes.push(instancedMesh as unknown as THREE.Mesh);
    }

    // Register blocks with physics
    this.physics.setBlocks(worldData.blocks);
  }

  /**
   * Generate a simple flat world with some features for demo purposes.
   */
  static generateDefaultWorld(): WorldData {
    const blocks: BlockInstance[] = [];

    // Ground plane (grass on top, dirt below)
    for (let x = -20; x < 20; x++) {
      for (let z = -20; z < 20; z++) {
        blocks.push({ x, y: 0, z, type: "grass" });
        blocks.push({ x, y: -1, z, type: "dirt" });
        blocks.push({ x, y: -2, z, type: "stone" });
      }
    }

    // A small house
    for (let x = 3; x <= 7; x++) {
      for (let z = 3; z <= 7; z++) {
        for (let y = 1; y <= 4; y++) {
          // Walls only (hollow inside)
          if (x === 3 || x === 7 || z === 3 || z === 7) {
            // Door opening
            if (x === 5 && z === 3 && (y === 1 || y === 2)) continue;
            // Window openings
            if ((x === 3 || x === 7) && z === 5 && y === 2) continue;
            blocks.push({ x, y, z, type: "brick" });
          }
        }
        // Roof
        blocks.push({ x, y: 5, z, type: "wood" });
      }
    }

    // Some trees
    const treePositions = [
      [-8, -5],
      [-12, 3],
      [12, -8],
      [10, 12],
      [-5, 14],
      [-15, -12],
    ];
    for (const [tx, tz] of treePositions) {
      // Trunk
      for (let y = 1; y <= 4; y++) {
        blocks.push({ x: tx, y, z: tz, type: "wood" });
      }
      // Leaves
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          for (let dy = 4; dy <= 6; dy++) {
            if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === 6) continue;
            if (dx === 0 && dz === 0 && dy <= 4) continue;
            blocks.push({ x: tx + dx, y: dy, z: tz + dz, type: "grass" });
          }
        }
      }
    }

    // A small pond
    for (let x = -6; x <= -3; x++) {
      for (let z = -8; z <= -5; z++) {
        blocks.push({ x, y: 0, z, type: "water" });
      }
    }

    // Stone pillars / ruins
    for (const [px, pz] of [
      [14, 3],
      [14, 6],
      [17, 3],
      [17, 6],
    ] as [number, number][]) {
      for (let y = 1; y <= 3; y++) {
        blocks.push({ x: px, y, z: pz, type: "stone" });
      }
    }

    // Sand area
    for (let x = -20; x < -15; x++) {
      for (let z = 10; z < 20; z++) {
        // Replace the grass block at y=0 with sand
        const grassIdx = blocks.findIndex(
          (b) => b.x === x && b.y === 0 && b.z === z && b.type === "grass"
        );
        if (grassIdx !== -1) {
          blocks[grassIdx].type = "sand";
        }
      }
    }

    return {
      name: "Storysdao Default World",
      spawnPoint: [0, 2, -5],
      blocks,
    };
  }

  clear() {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
    this.meshes = [];
  }

  dispose() {
    this.clear();
  }
}
