import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useGLTF, Html, Float } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import ToggleFocusButton from "../utils/ToggleFocusButton.jsx";
import { person } from "@/data/resume";
import { VICE } from "../theme";

/* Same desk layout as the Projects scene, so Home reads consistently. */
const SP = { x: 0.0, y: -0.15, z: -0.2 };
const SR = { x: -0.1177, y: -0.0544, z: 0 };
const MONITOR = { x: 0, y: -0.28, scale: 0.5 };
const KBRD = { x: 0, y: -0.3, z: 0.57, scale: 0.0036 };
const PLNT = { x: -1.19, y: -0.31, z: -0.07, scale: 0.00106 };
// Screen centre in group space = monitor position + Projects' portal position
// scaled by the monitor's scale ([0, 1.45, -0.22] * 0.5).
const SCREEN = { x: 0, y: MONITOR.y + 1.45 * MONITOR.scale, z: -0.22 * MONITOR.scale };

/**
 * Home scene: the same low-poly monitor/desk used by the Projects scene, with
 * MAHARSHI.OS booting on its screen. Adapted from Eli Parker's MIT-licensed
 * interactive portfolio and reskinned for the Vice City theme.
 *
 * @param {Function} onLoad - called the first time the scene mounts.
 */
const LaptopScene = forwardRef(({ onLoad = () => {}, active = true }, ref) => {
  const monitorGltf = useGLTF("/models/computer_monitor_lowpoly/monitor.glb");
  const keyboardGltf = useGLTF("/models/teenyBoard/cartoon_mini_keyboard.glb");
  const plantGltf = useGLTF("/models/plant/low_poly_style_plant.glb");
  // Clone so Home and Projects can each mount their own copy of the shared model
  // (a single GLTF object can't live in two places in the scene graph at once).
  const monitor = useMemo(() => monitorGltf.scene.clone(), [monitorGltf.scene]);
  const keyboard = useMemo(() => keyboardGltf.scene.clone(), [keyboardGltf.scene]);
  const plant = useMemo(() => plantGltf.scene.clone(), [plantGltf.scene]);

  // Tell Experience we exist so it can animate us in
  useEffect(() => {
    onLoad();
  }, []);

  const scene = useRef();
  const { camera } = useThree();

  useImperativeHandle(
    ref,
    () => ({
      scale: scene.current.scale,

      // Springy scale toggle between hidden (0) and shown (1). Deliberately has
      // no re-entrancy state flag: an earlier version guarded on an `isAnimating`
      // state whose gsap onComplete could be dropped (StrictMode remount), which
      // left the flag stuck true and the scene frozen at scale 0 (invisible).
      // Killing any in-flight tween first makes every call resolve cleanly.
      toggleAnimateOut: () => {
        const g = scene.current;
        if (!g) return;
        const target = g.scale.x < 0.5 ? 1 : 0;
        gsap.killTweensOf(g.scale);
        g.visible = true;
        gsap.to(g.scale, {
          duration: 0.5,
          x: target,
          y: target,
          z: target,
          ease: "power2.inOut",
          onUpdate: () => camera.updateProjectionMatrix(),
          onComplete: () => {
            if (target === 0) g.visible = false;
          },
        });
      },

      // Instant toggle used when switching pages
      toggleOut: () => {
        const g = scene.current;
        if (!g) return;
        gsap.killTweensOf(g.scale);
        const v = g.scale.x >= 0.5 ? 0 : 1;
        g.scale.set(v, v, v);
        g.visible = v === 1;
      },
    }),
    []
  );

  return (
    // Home starts fully visible (scale 1). It's the first scene shown, so there
    // is no orchestrated spring-in to miss; navigation still hides/reveals it
    // via the imperative toggle above.
    <group
      ref={scene}
      scale={1}
      position={[SP.x, SP.y, SP.z]}
      rotation={[SR.x, Math.PI - SR.y, SR.z]}
    >
      <Float rotationIntensity={0.4} floatIntensity={0.1}>
        {/* Monitor */}
        <primitive object={monitor} position={[MONITOR.x, MONITOR.y, 0]} scale={MONITOR.scale} />

        {/* MAHARSHI.OS boot screen, pinned to the monitor's screen as a
            camera-facing `sprite` billboard so it stays readable at any angle.
            Only rendered on Home; a sprite is sized by its own local scale, so it
            wouldn't shrink away with the scene on navigation — gating hides it. */}
        {active && (
          <Html
            transform
            sprite
            wrapperClass="htmlScreen"
            distanceFactor={0.62}
            position={[SCREEN.x, SCREEN.y, SCREEN.z]}
            style={{ pointerEvents: "none" }}
          >
            <div className="viceScreen">
              <div className="viceScreen__bar">
                <span className="viceScreen__dot" style={{ background: VICE.pink }} />
                <span className="viceScreen__dot" style={{ background: VICE.gold }} />
                <span className="viceScreen__dot" style={{ background: VICE.cyan }} />
                <span className="viceScreen__title">MAHARSHI.OS — vice://boot</span>
              </div>
              <div className="viceScreen__body">
                <p className="viceScreen__line">&gt; booting neon runtime…</p>
                <p className="viceScreen__line">&gt; loading identity.pkg</p>
                <h1 className="viceScreen__name">{person.name}</h1>
                <p className="viceScreen__role">{person.role}</p>
                <p className="viceScreen__tag">&quot;{person.tagline}&quot;</p>
                <p className="viceScreen__hint">
                  drag to look around · use the nav to explore
                  <span className="viceScreen__caret">▋</span>
                </p>
              </div>
            </div>
          </Html>
        )}

        {/* Move closer / away */}
        <ToggleFocusButton
          scale={0.5}
          rotation={[-0.3, 0, 0]}
          position={[0, -0.23, -0.1]}
          page="home"
        />

        {/* Desk plant */}
        <primitive object={plant} position={[PLNT.x, PLNT.y, PLNT.z]} scale={PLNT.scale} />

        {/* Tiny keyboard, floated separately */}
        <Float rotationIntensity={0.4} floatIntensity={0}>
          <primitive object={keyboard} position={[KBRD.x, KBRD.y, KBRD.z]} scale={KBRD.scale} />
        </Float>
      </Float>
    </group>
  );
});

export default LaptopScene;

useGLTF.preload("/models/computer_monitor_lowpoly/monitor.glb");
useGLTF.preload("/models/teenyBoard/cartoon_mini_keyboard.glb");
useGLTF.preload("/models/plant/low_poly_style_plant.glb");
