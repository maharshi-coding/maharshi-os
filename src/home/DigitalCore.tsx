"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const ACCENT_1 = "#6d5cff";
const ACCENT_2 = "#4d9fff";

/**
 * The reactive "digital core": a distorted icosahedron inside a wireframe
 * shell, wrapped in a drifting point field. It eases toward the pointer and
 * brightens/energises when `energy` rises (a hero node is hovered).
 */
function Core({ energy }: { energy: number }) {
  const group = useRef<THREE.Group>(null);
  const distort = useRef<any>(null);
  const shell = useRef<THREE.Mesh>(null);
  const eased = useRef(0);

  useFrame((state, delta) => {
    eased.current += (energy - eased.current) * Math.min(1, delta * 4);
    const e = eased.current;
    if (group.current) {
      // Ease rotation toward the pointer for a parallax feel.
      const px = state.pointer.x;
      const py = state.pointer.y;
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, py * 0.35, 0.05);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -px * 0.2, 0.05);
      const s = 1 + e * 0.12;
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x || 1, s, 0.1));
    }
    if (distort.current) {
      distort.current.distort = 0.28 + e * 0.22;
      distort.current.emissiveIntensity = 0.35 + e * 0.9;
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.12;
      const m = shell.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.12 + e * 0.16;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
        {/* Solid distorted core */}
        <Icosahedron args={[1.15, 8]}>
          <MeshDistortMaterial
            ref={distort}
            color="#12122a"
            emissive={ACCENT_1}
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.6}
            distort={0.3}
            speed={1.6}
          />
        </Icosahedron>
        {/* Wireframe shell */}
        <Icosahedron ref={shell} args={[1.55, 2]}>
          <meshBasicMaterial color={ACCENT_2} wireframe transparent opacity={0.14} />
        </Icosahedron>
      </Float>
    </group>
  );
}

function PointField({ energy }: { energy: number }) {
  const ref = useRef<THREE.Points>(null);
  const count = 520;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    const m = ref.current.material as THREE.PointsMaterial;
    m.opacity = 0.35 + energy * 0.35;
    m.size = 0.02 + energy * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT_2}
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function DigitalCore({ energy = 0 }: { energy?: number }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 5]} intensity={40} distance={20} color={ACCENT_1} />
      <pointLight position={[-5, -2, 3]} intensity={30} distance={20} color={ACCENT_2} />
      <Core energy={energy} />
      <PointField energy={energy} />
    </Canvas>
  );
}
