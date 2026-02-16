import { AABB, BLOCK_SIZE } from "./types";

export const GRAVITY = -20;
export const JUMP_VELOCITY = 8;
export const PLAYER_HEIGHT = 1.7;
export const PLAYER_WIDTH = 0.6;

export class Physics {
  private blockPositions: Set<string> = new Set();

  setBlocks(blocks: { x: number; y: number; z: number }[]) {
    this.blockPositions.clear();
    for (const b of blocks) {
      this.blockPositions.add(`${b.x},${b.y},${b.z}`);
    }
  }

  private hasBlock(x: number, y: number, z: number): boolean {
    return this.blockPositions.has(
      `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`
    );
  }

  getPlayerAABB(x: number, y: number, z: number): AABB {
    const hw = PLAYER_WIDTH / 2;
    return {
      minX: x - hw,
      minY: y,
      minZ: z - hw,
      maxX: x + hw,
      maxY: y + PLAYER_HEIGHT,
      maxZ: z + hw,
    };
  }

  checkCollision(aabb: AABB): boolean {
    const startX = Math.floor(aabb.minX);
    const endX = Math.floor(aabb.maxX);
    const startY = Math.floor(aabb.minY);
    const endY = Math.floor(aabb.maxY);
    const startZ = Math.floor(aabb.minZ);
    const endZ = Math.floor(aabb.maxZ);

    for (let bx = startX; bx <= endX; bx++) {
      for (let by = startY; by <= endY; by++) {
        for (let bz = startZ; bz <= endZ; bz++) {
          if (this.hasBlock(bx, by, bz)) {
            // Block AABB
            const blockMin = { x: bx, y: by, z: bz };
            const blockMax = {
              x: bx + BLOCK_SIZE,
              y: by + BLOCK_SIZE,
              z: bz + BLOCK_SIZE,
            };
            // AABB overlap test
            if (
              aabb.maxX > blockMin.x &&
              aabb.minX < blockMax.x &&
              aabb.maxY > blockMin.y &&
              aabb.minY < blockMax.y &&
              aabb.maxZ > blockMin.z &&
              aabb.minZ < blockMax.z
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Move the player with collision resolution.
   * Returns the resolved position and whether the player is on the ground.
   */
  moveWithCollision(
    posX: number,
    posY: number,
    posZ: number,
    velX: number,
    velY: number,
    velZ: number,
    dt: number
  ): { x: number; y: number; z: number; onGround: boolean; velY: number } {
    let newX = posX + velX * dt;
    let newY = posY + velY * dt;
    let newZ = posZ + velZ * dt;
    let onGround = false;
    let resolvedVelY = velY;

    // Resolve Y axis first (gravity)
    const aabbY = this.getPlayerAABB(posX, newY, posZ);
    if (this.checkCollision(aabbY)) {
      if (velY < 0) {
        // Falling - snap to top of block
        newY = Math.floor(posY) + (posY === Math.floor(posY) ? 0 : 0);
        // Find the ground level
        for (let testY = Math.floor(newY); testY >= newY - 1; testY -= 0.1) {
          const testAABB = this.getPlayerAABB(posX, testY, posZ);
          if (!this.checkCollision(testAABB)) {
            newY = testY;
            break;
          }
        }
        onGround = true;
      } else {
        // Hitting ceiling
        newY = posY;
      }
      resolvedVelY = 0;
    } else {
      // Check if standing on ground
      const groundCheck = this.getPlayerAABB(posX, newY - 0.05, posZ);
      onGround = this.checkCollision(groundCheck);
    }

    // Resolve X axis
    const aabbX = this.getPlayerAABB(newX, newY, posZ);
    if (this.checkCollision(aabbX)) {
      newX = posX;
    }

    // Resolve Z axis
    const aabbZ = this.getPlayerAABB(newX, newY, newZ);
    if (this.checkCollision(aabbZ)) {
      newZ = posZ;
    }

    return { x: newX, y: newY, z: newZ, onGround, velY: resolvedVelY };
  }
}
