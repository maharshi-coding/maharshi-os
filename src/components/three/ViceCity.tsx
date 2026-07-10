"use client";

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ViceCity — a lightweight synthwave scene: a gradient sky, a retro sun with
 * scan gaps, an endlessly scrolling neon grid floor and a field of stars.
 * Everything is built from raw three objects (no drei) and canvas textures,
 * so there are no external assets. Loaded client-side only.
 */

/** Vertical gradient sky texture (purple → pink → orange). */
function makeSkyTexture() {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#150430");
  g.addColorStop(0.42, "#3a0f63");
  g.addColorStop(0.62, "#7b2ff7");
  g.addColorStop(0.78, "#ff2e97");
  g.addColorStop(0.9, "#ff6b3d");
  g.addColorStop(1, "#ffb03a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Retro sun disc with horizontal scan gaps. */
function makeSunTexture() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, s);
  g.addColorStop(0, "#ffe36a");
  g.addColorStop(0.5, "#ff8a3d");
  g.addColorStop(1, "#ff2e97");
  // Circle
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  // Scan gaps in the lower half
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 8; i++) {
    const y = s * 0.52 + i * 10 + i * i * 1.6;
    ctx.fillRect(0, y, s, 3 + i * 1.4);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Scene({ animate }: { animate: boolean }) {
  const sky = useMemo(makeSkyTexture, []);
  const sun = useMemo(makeSunTexture, []);

  const grids = useMemo(() => {
    const make = (z: number) => {
      const g = new THREE.GridHelper(60, 60, "#ff2e97", "#08d9e8");
      (g.material as THREE.Material).transparent = true;
      (g.material as THREE.Material).opacity = 0.38;
      g.position.set(0, -2, z);
      return g;
    };
    return [make(0), make(-2)];
  }, []);

  // Star field.
  const stars = useMemo(() => {
    const count = 320;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 22 + 2;
      positions[i * 3 + 2] = -Math.random() * 40 - 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.06,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (animate) {
      grids.forEach((g) => {
        g.position.z += d * 8;
        if (g.position.z > 2) g.position.z -= 4; // wrap every 2 cells
      });
    }
    // Subtle mouse parallax, applied straight to the camera.
    const cam = state.camera;
    const tx = state.pointer.x * 0.9;
    const ty = 1.4 + state.pointer.y * 0.4;
    cam.position.x += (tx - cam.position.x) * 0.04;
    cam.position.y += (ty - cam.position.y) * 0.04;
    cam.lookAt(0, 1.4, -20);
  });

  return (
    <>
      <fog attach="fog" args={["#ff2e97", 12, 42]} />

      {/* Sky */}
      <mesh position={[0, 6, -34]} scale={[90, 46, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={sky} depthWrite={false} />
      </mesh>

      {/* Sun */}
      <mesh position={[0, 4.2, -30]} scale={[14, 14, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={sun} transparent depthWrite={false} />
      </mesh>

      {/* Stars */}
      <primitive object={stars} />

      {/* Scrolling grid floor */}
      <primitive object={grids[0]} />
      <primitive object={grids[1]} />
    </>
  );
}

export default function ViceCity({
  animate = true,
  className = "",
}: {
  animate?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1.4, 8], fov: 62 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        frameloop={animate ? "always" : "demand"}
      >
        <Scene animate={animate} />
      </Canvas>
    </div>
  );
}
