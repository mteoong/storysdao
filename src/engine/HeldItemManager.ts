import * as THREE from "three";

export interface HeldItemData {
  id: string;
  name: string;
  category: string;
  color: string;
}

export class HeldItemManager {
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private currentMesh: THREE.Group | null = null;
  private currentItemId: string | null = null;
  private bobPhase = 0;

  // Base position offset from camera (bottom-right of viewport)
  private readonly BASE_OFFSET = new THREE.Vector3(0.35, -0.3, -0.5);

  constructor(camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    this.camera = camera;
    this.scene = scene;
  }

  setItem(item: HeldItemData | null): void {
    // Remove existing
    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
      this.disposeMesh(this.currentMesh);
      this.currentMesh = null;
      this.currentItemId = null;
    }

    if (!item) return;

    this.currentItemId = item.id;
    this.currentMesh = this.createItemMesh(item);
    this.scene.add(this.currentMesh);
  }

  update(dt: number, isMoving: boolean): void {
    if (!this.currentMesh) return;

    // Bob animation
    if (isMoving) {
      this.bobPhase += dt * 6;
    } else {
      this.bobPhase *= 0.92;
      if (Math.abs(this.bobPhase) < 0.01) this.bobPhase = 0;
    }

    const bobX = Math.sin(this.bobPhase) * 0.015;
    const bobY = Math.sin(this.bobPhase * 2) * 0.02;

    // Position relative to camera
    const offset = this.BASE_OFFSET.clone();
    offset.x += bobX;
    offset.y += bobY;

    // Transform from camera-local to world space
    const worldOffset = offset.applyQuaternion(this.camera.quaternion);
    this.currentMesh.position.copy(this.camera.position).add(worldOffset);
    this.currentMesh.quaternion.copy(this.camera.quaternion);

    // Slight tilt for natural look
    this.currentMesh.rotateZ(-0.1);
    this.currentMesh.rotateX(0.05);
  }

  private createItemMesh(item: HeldItemData): THREE.Group {
    const group = new THREE.Group();
    const color = new THREE.Color(item.color);

    switch (item.id) {
      case "1":
        this.buildSword(group, color);
        break;
      case "2":
        this.buildBoots(group, color);
        break;
      case "3":
        this.buildCape(group, color);
        break;
      case "4":
        this.buildPickaxe(group, color);
        break;
      case "5":
        this.buildHalo(group, color);
        break;
      case "6":
        this.buildHammer(group, color);
        break;
      case "7":
        this.buildWings(group, color);
        break;
      case "8":
        this.buildShield(group, color);
        break;
      default:
        this.buildFallbackCube(group, color);
    }

    // Make all meshes render on top and ignore fog
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.renderOrder = 999;
        const mat = child.material as THREE.MeshLambertMaterial;
        mat.depthTest = false;
        if ("fog" in mat) {
          mat.fog = false;
        }
      }
    });

    return group;
  }

  // 1: Diamond Sword — blade + crossguard + handle
  private buildSword(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({ color });
    const highlightMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0xffffff), 0.4),
    });
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });

    // Blade
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.04), mat);
    blade.position.y = 0.15;
    group.add(blade);

    // Blade edge highlight
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.48, 0.05), highlightMat);
    edge.position.y = 0.15;
    group.add(edge);

    // Tip
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 4), highlightMat);
    tip.position.y = 0.42;
    group.add(tip);

    // Crossguard
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.04), mat);
    guard.position.y = -0.1;
    group.add(guard);

    // Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.14, 0.035), handleMat);
    handle.position.y = -0.2;
    group.add(handle);

    // Pommel
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), mat);
    pommel.position.y = -0.28;
    group.add(pommel);
  }

  // 2: Rocket Boots — boot shape with flame accent
  private buildBoots(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({ color });
    const flameMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });

    // Boot body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.18), mat);
    group.add(body);

    // Toe
    const toe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.08), mat);
    toe.position.set(0, -0.03, -0.12);
    group.add(toe);

    // Sole
    const soleMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0x000000), 0.4),
    });
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.2), soleMat);
    sole.position.y = -0.08;
    group.add(sole);

    // Flame accent
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 6), flameMat);
    flame.position.set(0, -0.14, 0.06);
    flame.rotation.x = Math.PI;
    group.add(flame);

    // Stripe
    const stripeMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0xffffff), 0.5),
    });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.19), stripeMat);
    stripe.position.x = -0.04;
    group.add(stripe);
  }

  // 3: Shadow Cape — flat draped shape
  private buildCape(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({
      color,
      side: THREE.DoubleSide,
    });

    const shape = new THREE.Shape();
    shape.moveTo(-0.12, 0.2);
    shape.lineTo(0.12, 0.2);
    shape.quadraticCurveTo(0.14, 0, 0.1, -0.15);
    shape.quadraticCurveTo(0.06, -0.22, 0, -0.2);
    shape.quadraticCurveTo(-0.06, -0.22, -0.1, -0.15);
    shape.quadraticCurveTo(-0.14, 0, -0.12, 0.2);

    const geo = new THREE.ShapeGeometry(shape);
    const cape = new THREE.Mesh(geo, mat);
    group.add(cape);

    // Collar
    const collarMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0x000000), 0.3),
    });
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.03), collarMat);
    collar.position.y = 0.2;
    group.add(collar);
  }

  // 4: Crystal Pickaxe — T-shape
  private buildPickaxe(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({ color });
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });

    // Shaft
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.4, 0.035), handleMat);
    shaft.position.y = -0.05;
    group.add(shaft);

    // Pick head left
    const headL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.04), mat);
    headL.position.set(-0.06, 0.15, 0);
    headL.rotation.z = 0.15;
    group.add(headL);

    // Pick head right
    const headR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.04), mat);
    headR.position.set(0.06, 0.15, 0);
    headR.rotation.z = -0.15;
    group.add(headR);

    // Crystal facets (lighter accents)
    const facetMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0xffffff), 0.4),
    });
    const facet1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.05), facetMat);
    facet1.position.set(-0.12, 0.15, 0);
    group.add(facet1);
    const facet2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.05), facetMat);
    facet2.position.set(0.12, 0.15, 0);
    group.add(facet2);
  }

  // 5: Neon Halo — torus ring
  private buildHalo(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
    });

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 24), mat);
    halo.rotation.x = Math.PI / 6;
    group.add(halo);

    // Inner ring (brighter)
    const innerMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0xffffff), 0.5),
      emissive: color,
      emissiveIntensity: 0.8,
    });
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.01, 8, 24), innerMat);
    inner.rotation.x = Math.PI / 6;
    group.add(inner);
  }

  // 6: Builder's Hammer — shaft + rectangular head
  private buildHammer(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({ color });
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });

    // Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.35, 0.035), handleMat);
    handle.position.y = -0.05;
    group.add(handle);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.08), mat);
    head.position.y = 0.15;
    group.add(head);

    // Face highlight
    const faceMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0xffffff), 0.3),
    });
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.09), faceMat);
    face.position.set(-0.08, 0.15, 0);
    group.add(face);

    // Top highlight
    const topMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0xffffff), 0.15),
    });
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.08), topMat);
    top.position.y = 0.2;
    group.add(top);
  }

  // 7: Fire Wings — two angled planes
  private buildWings(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({
      color,
      side: THREE.DoubleSide,
      emissive: color,
      emissiveIntensity: 0.3,
    });

    // Wing shape
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.05, -0.15, 0.18, -0.14);
    wingShape.quadraticCurveTo(0.2, -0.06, 0.16, 0);
    wingShape.quadraticCurveTo(0.14, -0.04, 0.12, 0.02);
    wingShape.quadraticCurveTo(0.1, 0, 0.08, 0.04);
    wingShape.quadraticCurveTo(0.04, 0.02, 0, 0.06);
    wingShape.lineTo(0, 0);

    const wingGeo = new THREE.ShapeGeometry(wingShape);

    // Right wing
    const rightWing = new THREE.Mesh(wingGeo, mat);
    rightWing.position.set(0.02, 0, 0);
    rightWing.rotation.y = -0.3;
    group.add(rightWing);

    // Left wing (mirrored)
    const leftWing = new THREE.Mesh(wingGeo.clone(), mat);
    leftWing.position.set(-0.02, 0, 0);
    leftWing.rotation.y = 0.3;
    leftWing.scale.x = -1;
    group.add(leftWing);

    // Center orb
    const orbMat = new THREE.MeshLambertMaterial({
      color: 0xfbbf24,
      emissive: new THREE.Color(0xfbbf24),
      emissiveIntensity: 0.6,
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), orbMat);
    group.add(orb);
  }

  // 8: Stone Shield — rounded box
  private buildShield(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({ color });

    // Shield body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.04), mat);
    group.add(body);

    // Border (darker)
    const borderMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0x000000), 0.3),
    });
    const borderTop = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.05), borderMat);
    borderTop.position.y = 0.14;
    group.add(borderTop);
    const borderBot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.05), borderMat);
    borderBot.position.y = -0.14;
    group.add(borderBot);
    const borderL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.05), borderMat);
    borderL.position.x = -0.1;
    group.add(borderL);
    const borderR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.05), borderMat);
    borderR.position.x = 0.1;
    group.add(borderR);

    // Cross emblem
    const emblemMat = new THREE.MeshLambertMaterial({
      color: color.clone().lerp(new THREE.Color(0x000000), 0.15),
    });
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.05), emblemMat);
    group.add(crossV);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.05), emblemMat);
    crossH.position.y = 0.02;
    group.add(crossH);
  }

  // Fallback: simple colored cube
  private buildFallbackCube(group: THREE.Group, color: THREE.Color): void {
    const mat = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), mat);
    group.add(cube);
  }

  private disposeMesh(group: THREE.Group): void {
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  dispose(): void {
    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
      this.disposeMesh(this.currentMesh);
      this.currentMesh = null;
    }
  }
}
