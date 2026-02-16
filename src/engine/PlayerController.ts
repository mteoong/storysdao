import * as THREE from "three";
import { InputManager } from "./InputManager";
import { Physics, GRAVITY, JUMP_VELOCITY } from "./Physics";

const MOVE_SPEED = 6;
const MOUSE_SENSITIVITY = 0.002;

export class PlayerController {
  position: THREE.Vector3;
  private velocity = new THREE.Vector3(0, 0, 0);
  private euler = new THREE.Euler(0, 0, 0, "YXZ");
  private camera: THREE.PerspectiveCamera;
  private input: InputManager;
  private physics: Physics;
  private onGround = false;
  private _isMoving = false;

  constructor(
    camera: THREE.PerspectiveCamera,
    input: InputManager,
    physics: Physics,
    spawnPoint: [number, number, number]
  ) {
    this.camera = camera;
    this.input = input;
    this.physics = physics;
    this.position = new THREE.Vector3(...spawnPoint);
    this.euler.setFromQuaternion(camera.quaternion);
  }

  update(dt: number) {
    // Mouse look
    if (this.input.pointerLocked) {
      const mouseDelta = this.input.getMouseDelta();
      this.euler.y -= mouseDelta.x * MOUSE_SENSITIVITY;
      this.euler.x -= mouseDelta.y * MOUSE_SENSITIVITY;
      this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    }

    // Movement direction
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(this.camera.quaternion);
    right.y = 0;
    right.normalize();

    const moveDir = new THREE.Vector3(0, 0, 0);

    if (this.input.isKeyDown("KeyW")) moveDir.add(forward);
    if (this.input.isKeyDown("KeyS")) moveDir.sub(forward);
    if (this.input.isKeyDown("KeyD")) moveDir.add(right);
    if (this.input.isKeyDown("KeyA")) moveDir.sub(right);

    this._isMoving = moveDir.length() > 0;
    if (this._isMoving) moveDir.normalize();

    const velX = moveDir.x * MOVE_SPEED;
    const velZ = moveDir.z * MOVE_SPEED;

    // Gravity
    this.velocity.y += GRAVITY * dt;

    // Jump
    if (this.input.isKeyDown("Space") && this.onGround) {
      this.velocity.y = JUMP_VELOCITY;
      this.onGround = false;
    }

    // Physics resolution
    const result = this.physics.moveWithCollision(
      this.position.x,
      this.position.y,
      this.position.z,
      velX,
      this.velocity.y,
      velZ,
      dt
    );

    this.position.set(result.x, result.y, result.z);
    this.velocity.y = result.velY;
    this.onGround = result.onGround;

    // Update camera position (eye height)
    this.camera.position.set(
      this.position.x,
      this.position.y + 1.6,
      this.position.z
    );
  }

  get isMoving(): boolean {
    return this._isMoving;
  }
}
