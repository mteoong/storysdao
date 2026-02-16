"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { WorldData } from "@/engine/types";
import { BLOCK_TYPES, BLOCK_SIZE } from "@/engine/types";

interface Props {
  worldData: WorldData;
}

export default function WorldPreview({ worldData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(30, 25, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(50, 80, 30);
    scene.add(directional);

    // Build blocks with instanced meshes
    const blocksByType: Record<string, typeof worldData.blocks> = {};
    for (const block of worldData.blocks) {
      if (!blocksByType[block.type]) blocksByType[block.type] = [];
      blocksByType[block.type].push(block);
    }

    const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    const meshes: THREE.InstancedMesh[] = [];

    for (const [typeId, blocks] of Object.entries(blocksByType)) {
      const bt = BLOCK_TYPES[typeId];
      if (!bt) continue;
      const material = new THREE.MeshLambertMaterial({ color: bt.color });
      const instanced = new THREE.InstancedMesh(
        geometry,
        material,
        blocks.length
      );
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < blocks.length; i++) {
        matrix.setPosition(
          blocks[i].x + BLOCK_SIZE / 2,
          blocks[i].y + BLOCK_SIZE / 2,
          blocks[i].z + BLOCK_SIZE / 2
        );
        instanced.setMatrixAt(i, matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;
      scene.add(instanced);
      meshes.push(instanced);
    }

    // Slow auto-rotation
    let animId: number;
    const startTime = Date.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (Date.now() - startTime) * 0.0003;
      camera.position.x = 30 * Math.cos(elapsed);
      camera.position.z = 30 * Math.sin(elapsed);
      camera.lookAt(0, 2, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      for (const m of meshes) {
        (m.material as THREE.Material).dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [worldData]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] rounded-lg overflow-hidden"
    />
  );
}
