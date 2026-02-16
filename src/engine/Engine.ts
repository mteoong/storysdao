import { SceneManager } from "./SceneManager";
import { InputManager } from "./InputManager";
import { PlayerController } from "./PlayerController";
import { WorldBuilder } from "./WorldBuilder";
import { Physics } from "./Physics";
import { HeldItemManager, HeldItemData } from "./HeldItemManager";
import type { WorldData } from "./types";

export class Engine {
  private sceneManager: SceneManager;
  private inputManager: InputManager;
  private playerController: PlayerController;
  private worldBuilder: WorldBuilder;
  private physics: Physics;
  private heldItemManager: HeldItemManager;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private running = false;

  constructor(canvas: HTMLCanvasElement, customWorldData?: WorldData) {
    this.sceneManager = new SceneManager(canvas);
    this.inputManager = new InputManager(canvas);
    this.physics = new Physics();
    this.worldBuilder = new WorldBuilder(this.sceneManager.scene, this.physics);

    // Load custom or default world
    const worldData: WorldData = customWorldData || WorldBuilder.generateDefaultWorld();
    this.worldBuilder.loadWorld(worldData);

    // Initialize player
    this.playerController = new PlayerController(
      this.sceneManager.camera,
      this.inputManager,
      this.physics,
      worldData.spawnPoint
    );

    // Initialize held item manager
    this.heldItemManager = new HeldItemManager(
      this.sceneManager.camera,
      this.sceneManager.scene
    );
  }

  // React bridge: set equipped item from context
  setEquippedItem(item: HeldItemData | null): void {
    this.heldItemManager.setItem(item);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private loop = (time: number) => {
    if (!this.running) return;
    this.animationFrameId = requestAnimationFrame(this.loop);

    const dt = Math.min((time - this.lastTime) / 1000, 0.05); // cap at 50ms
    this.lastTime = time;

    this.playerController.update(dt);
    this.heldItemManager.update(dt, this.playerController.isMoving);
    this.sceneManager.render();
  };

  stop() {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  dispose() {
    this.stop();
    this.heldItemManager.dispose();
    this.inputManager.dispose();
    this.worldBuilder.dispose();
    this.sceneManager.dispose();
  }
}
