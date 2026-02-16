export class InputManager {
  private keys: Set<string> = new Set();
  private mouseMovementX = 0;
  private mouseMovementY = 0;
  private isPointerLocked = false;
  private canvas: HTMLCanvasElement;

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isPointerLocked) {
      this.mouseMovementX += e.movementX;
      this.mouseMovementY += e.movementY;
    }
  };

  private onPointerLockChange = () => {
    this.isPointerLocked = document.pointerLockElement === this.canvas;
  };

  private onClick = () => {
    if (!this.isPointerLocked) {
      this.canvas.requestPointerLock();
    }
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("pointerlockchange", this.onPointerLockChange);
    canvas.addEventListener("click", this.onClick);
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  getMouseDelta(): { x: number; y: number } {
    const delta = { x: this.mouseMovementX, y: this.mouseMovementY };
    this.mouseMovementX = 0;
    this.mouseMovementY = 0;
    return delta;
  }

  get pointerLocked(): boolean {
    return this.isPointerLocked;
  }

  dispose() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    this.canvas.removeEventListener("click", this.onClick);
  }
}
