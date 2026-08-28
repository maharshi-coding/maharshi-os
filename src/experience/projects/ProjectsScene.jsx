import { Float, Html, Text, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { VICE, PROJECT_PALETTE } from "../theme";

/* Scene layout constants. */
const SP = { x: 0.0, y: -0.15, z: -0.2 };
const SR = { x: -0.1177, y: -0.0544, z: -0 };
const MONITOR = { x: 0, y: -0.28, scale: 0.5 };
const KBRD = { x: 0, y: -0.3, z: 0.57, scale: 0.0036 };
const PLNT = { x: -1.19, y: -0.31, z: -0.07, scale: 0.00106 };
// Screen area on the monitor (monitor-local space).
const SCREEN = { x: 0, y: 1.45, z: -0.2 };

// Maharshi's real projects.
const PROJECTS = [
  {
    name: "Seller Shield",
    kind: "AI Agents · AWS",
    description:
      "A four-agent AI team on AWS Bedrock that guards Amazon sellers — it detects suspension and return-fraud risk, then auto-drafts an evidence-backed, policy-cited appeal.",
    tags: ["Python", "Strands", "Bedrock", "FastAPI", "React"],
    github: "https://github.com/maharshi-coding/seller-shield",
    live: "https://maharshi-coding.github.io/seller-shield/",
    liveLabel: "Live Demo",
  },
  {
    name: "DataHub Steward Squad",
    kind: "AI Agents · Data Governance",
    description:
      "Five AI agents read live DataHub metadata over MCP, find governance risks, and write approval-gated fixes back to the catalog — then re-read to prove they landed.",
    tags: ["Python", "Claude API", "MCP", "Multi-Agent"],
    github: "https://github.com/maharshi-coding/datahub-steward-squad",
    live: "https://maharshi-coding.github.io/datahub-steward-squad/",
    liveLabel: "Walkthrough",
  },
  {
    name: "Overturn",
    kind: "AI Agents · Autonomous",
    description:
      "An autonomous agent that fights wrongful insurance denials — it drafts a clause-cited appeal, files it, and keeps following up in the background for weeks until it's resolved.",
    tags: ["TypeScript", "Gemini", "Cloud Run", "Firestore"],
    github: "https://github.com/maharshi-coding/overturn",
    live: "https://overturn-368045431718.us-central1.run.app",
    liveLabel: "Live Demo",
  },
  {
    name: "Campus Ride Pooling",
    kind: "Mobile · Full-Stack",
    description:
      "A full-stack campus ride-sharing app with real-time ride creation and chat, Stripe payments and identity verification, and Mapbox route-aware ride matching.",
    tags: ["React Native", "Firebase", "Stripe", "Mapbox"],
    github: "https://github.com/maharshi-coding/ride-share",
    live: "",
    liveLabel: "Live Demo",
  },
  {
    name: "Face Recognition Attendance",
    kind: "Computer Vision · Backend",
    description:
      "An attendance platform using 128-dimensional face embeddings, blink-based liveness detection to defeat photo spoofing, JWT + role-based access, and CSV / XLSX analytics.",
    tags: ["Python", "FastAPI", "OpenCV", "JWT"],
    github: "https://github.com/maharshi-coding/face-attendance-app",
    live: "",
    liveLabel: "Live Demo",
  },
  {
    name: "AI Tutor",
    kind: "Mobile · AI",
    description:
      "An AI tutoring mobile app built with React Native and OpenAI APIs, with prompts engineered and iterated specifically for teaching quality.",
    tags: ["React Native", "OpenAI API", "Prompt Eng."],
    github: "https://github.com/maharshi-coding/ai-tutor-app",
    live: "",
    liveLabel: "Live Demo",
  },
];

/**
 * Projects scene: a low-poly monitor whose screen shows a clean neon HTML card
 * for each project, with prev/next and link buttons. Reskinned for Vice City.
 * Scene choreography adapted from Eli Parker's MIT-licensed interactive portfolio.
 */
const ProjectsScene = forwardRef((_props, ref) => {
  const monitorModel = useGLTF(`/models/computer_monitor_lowpoly/monitor.glb`);
  const teenyBoardModel = useGLTF("/models/teenyBoard/cartoon_mini_keyboard.glb");
  const plantModel = useGLTF("/models/plant/low_poly_style_plant.glb");

  const [isAnimating, setIsAnimating] = useState(false);
  const [active, setActive] = useState(false); // card mounted only while shown
  const [index, setIndex] = useState(0);

  const scene = useRef();
  const { camera } = useThree();

  const project = PROJECTS[index];
  const color = PROJECT_PALETTE[index % PROJECT_PALETTE.length];

  const go = (dir) => {
    setIndex((i) => (i + dir + PROJECTS.length) % PROJECTS.length);
  };

  useImperativeHandle(ref, () => ({
    scale: scene.current.scale,
    toggleAnimateOut: () =>
      toggleAnimation(scene, camera, isAnimating, setIsAnimating, {
        onOpenStart: () => setActive(true),
        onCloseComplete: () => setActive(false),
      }),
    toggleOut: () => {
      const opening = scene.current.scale.x === 0;
      if (opening) setActive(true);
      ToggleNoAnimation(scene, isAnimating, setIsAnimating);
      if (!opening) setActive(false);
    },
  }));

  return (
    <group
      key={"FullProjectScene"}
      ref={scene}
      scale={0}
      visible={false}
      position={[SP.x, SP.y, SP.z]}
      rotation={[SR.x, Math.PI - SR.y, SR.z]}
    >
      <Float rotationIntensity={0.4} floatIntensity={0.1}>
        {/* Monitor */}
        <primitive
          key={`projectMonitor`}
          object={monitorModel.scene}
          position={[MONITOR.x, MONITOR.y, 0]}
          scale={MONITOR.scale}
        >
          {/* Per-project screen glow behind the card */}
          <mesh position={[SCREEN.x, SCREEN.y, SCREEN.z - 0.02]} scale={1.86}>
            <planeGeometry args={[2, 1]} />
            <meshBasicMaterial color={color} transparent opacity={0.22} />
          </mesh>

          {/* Clean neon HTML card on the screen */}
          {active && (
            <Html
              center
              distanceFactor={6}
              position={[SCREEN.x, SCREEN.y, SCREEN.z]}
              zIndexRange={[20, 0]}
              className="viceProjWrap"
            >
              <article className="viceProj" style={{ "--proj": color }}>
                <header className="viceProj__top">
                  <span className="viceProj__count">
                    {String(index + 1).padStart(2, "0")}
                    <em> / {String(PROJECTS.length).padStart(2, "0")}</em>
                  </span>
                  <span className="viceProj__kind">{project.kind}</span>
                </header>

                <h2 className="viceProj__name">{project.name}</h2>
                <p className="viceProj__desc">{project.description}</p>

                <ul className="viceProj__tags">
                  {project.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>

                <footer className="viceProj__foot">
                  <div className="viceProj__links">
                    <a href={project.github} target="_blank" rel="noreferrer" className="viceProj__btn">
                      GitHub ↗
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="viceProj__btn viceProj__btn--solid"
                      >
                        {project.liveLabel} ↗
                      </a>
                    )}
                  </div>
                  <div className="viceProj__nav">
                    <button type="button" aria-label="Previous project" onClick={() => go(-1)}>
                      ←
                    </button>
                    <button type="button" aria-label="Next project" onClick={() => go(1)}>
                      →
                    </button>
                  </div>
                </footer>
              </article>
            </Html>
          )}
        </primitive>

        {/* Section label */}
        <Text
          font={"/fonts/anek-bangla-v5-latin-600.woff"}
          fontSize={0.3}
          position={[1.4, 0.5, 0.4]}
          rotation-y={-1}
          rotation-z={0}
          maxWidth={2}
          lineHeight={1}
          color={VICE.pink}
        >
          Projects
        </Text>

        {/* Desk plant */}
        <primitive
          key={"projectPlant"}
          object={plantModel.scene}
          position={[PLNT.x, PLNT.y, PLNT.z]}
          scale={PLNT.scale}
        />

        {/* Tiny keyboard, floated separately */}
        <Float rotationIntensity={0.4} floatIntensity={0}>
          <primitive
            key={`projectTeenyBoard`}
            object={teenyBoardModel.scene}
            position={[KBRD.x, KBRD.y, KBRD.z]}
            scale={KBRD.scale}
          />
        </Float>
      </Float>
    </group>
  );
});

export default ProjectsScene;

useGLTF.preload("/models/computer_monitor_lowpoly/monitor.glb");
useGLTF.preload("/models/teenyBoard/cartoon_mini_keyboard.glb");
useGLTF.preload("/models/plant/low_poly_style_plant.glb");

/** Springy scale + flip animation to reveal / hide the scene. */
function toggleAnimation(scene, camera, isAnimating, setIsAnimating, callbacks = {}) {
  if (isAnimating) return;
  setIsAnimating(true);
  scene.current.visible = true;

  const opening = scene.current.scale.x === 0;
  const targetScale = opening ? { x: 2, y: 2, z: 2 } : { x: 0, y: 0, z: 0 };
  const targetRotation = opening ? -0.1575 : Math.PI - 0.1575;

  if (opening && callbacks.onOpenStart) callbacks.onOpenStart();

  gsap.to(scene.current.scale, {
    duration: 0.5,
    x: targetScale.x,
    y: targetScale.y,
    z: targetScale.z,
    ease: "power2.inOut",
    onUpdate: () => camera.updateProjectionMatrix(),
    onComplete: () => {
      if (!opening) {
        scene.current.visible = false;
        if (callbacks.onCloseComplete) callbacks.onCloseComplete();
      }
      setIsAnimating(false);
    },
  });

  gsap.to(scene.current.rotation, {
    duration: 0.5,
    y: targetRotation,
    ease: "power2.inOut",
    onUpdate: () => camera.updateProjectionMatrix(),
    onComplete: () => setIsAnimating(false),
  });
}

/** Instant show / hide used when jumping between pages. */
function ToggleNoAnimation(scene, isAnimating, setIsAnimating) {
  if (isAnimating) return;
  setIsAnimating(true);
  scene.current.visible = true;
  if (scene.current.scale.x > 0) {
    scene.current.scale.set(0, 0, 0);
    scene.current.visible = false;
  } else {
    scene.current.scale.set(2, 2, 2);
  }
  setIsAnimating(false);
}
