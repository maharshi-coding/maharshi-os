import { useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { Text } from "@react-three/drei";
import { VICE } from "../theme";

/**
 * A spinning icosahedron button that toggles the camera between a wide view and
 * a focused close-up of the current scene.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 *
 * @param {string} page - which scene this button lives on (drives the target view).
 */
export default function ToggleFocusButton({ page, ...props }) {
  const { camera } = useThree();

  // Remember where the camera started so we can return to it
  const [initialPosition] = useState(() => camera.position.clone());
  const [initialRotation] = useState(() => camera.rotation.clone());

  // Whether we're currently zoomed in
  const [focus, setFocus] = useState(false);

  const button = useState(() => ({ current: null }))[0];
  const [isAnimating, setIsAnimating] = useState(false);

  // Spin the button
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    if (button.current) {
      button.current.rotation.x = a;
      button.current.rotation.y = a;
    }
  });

  function toggleFocus() {
    if (isAnimating) return;
    setIsAnimating(true);

    const focusPosition =
      page === "projects" ? new THREE.Vector3(0, 1, 3) : new THREE.Vector3(0, 1, 2);
    const focusRotation =
      page === "projects" ? new THREE.Euler(-0.1, 0, 0.0) : new THREE.Euler(-0.1, 0.05, 0);

    const targetPosition = focus ? initialPosition : focusPosition;
    const targetRotation = focus ? initialRotation : focusRotation;

    gsap.to(camera.position, {
      duration: 1,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: "power2.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
      onComplete: () => setIsAnimating(false),
    });

    gsap.to(camera.rotation, {
      duration: 1,
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      ease: "power2.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
      onComplete: () => setIsAnimating(false),
    });

    setFocus(!focus);
  }

  return (
    <group {...props}>
      <mesh ref={(el) => (button.current = el)} onClick={toggleFocus}>
        <icosahedronGeometry args={[0.2, 0]} />
        {/* Neon faceted crystal — catches the scene's pink/cyan point lights
            (replaces the rainbow normal material, which clashed with the theme). */}
        <meshStandardMaterial
          color={VICE.purple}
          emissive={VICE.pink}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
          flatShading
        />
      </mesh>
      <Text
        font="/fonts/anek-bangla-v5-latin-500.woff"
        fontSize={0.1}
        position={[0, 0.25, 0]}
        maxWidth={2}
        lineHeight={1}
        color={VICE.cyan}
      >
        ⌄ Click to Focus ⌄
      </Text>
    </group>
  );
}
