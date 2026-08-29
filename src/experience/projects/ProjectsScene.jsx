import { handleClick, animateIn, animateOut } from "../utils/Helpers.js";
import ToggleFocusButton from "../utils/ToggleFocusButton.jsx";
import { useFrame, useThree } from "@react-three/fiber";
import DescriptionText3D from "./DescriptionText3D";
import TitleText3D from "../utils/TitleText3D.jsx";
import Logo from "../contact/Logo.jsx";
import gsap from "gsap";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Float, MeshPortalMaterial, Text, useGLTF } from "@react-three/drei";
import { VICE, PROJECT_PALETTE, PROJECT_BACKDROP } from "../theme";

/* Scene layout constants. */
const SP = { x: 0.0, y: -0.15, z: -0.2 };
const SR = { x: -0.1177, y: -0.0544, z: -0 };
const MONITOR = { x: 0, y: -0.28, scale: 0.5 };
const KBRD = { x: 0, y: -0.3, z: 0.57, scale: 0.0036 };
const PLNT = { x: -1.19, y: -0.31, z: -0.07, scale: 0.00106 };
const PORTAL = { x: 0, y: 1.45, z: -0.22, scale: 1.89 };

/**
 * Projects scene: a low-poly monitor whose screen is a portal into the current
 * project — a recessed neon box with floating 3D title/description, prev/next
 * arrows, and 3D GitHub/website logos. Adapted faithfully from Eli Parker's
 * MIT-licensed interactive portfolio, populated with Maharshi Barot's projects.
 */
const ProjectsScene = forwardRef((_props, ref) => {
  const monitorModel = useGLTF(`/models/computer_monitor_lowpoly/monitor.glb`);
  const teenyBoardModel = useGLTF("/models/teenyBoard/cartoon_mini_keyboard.glb");
  const plantModel = useGLTF("/models/plant/low_poly_style_plant.glb");
  const { nodes } = useGLTF("/aobox-transformed.glb");

  // Maharshi's real projects (concise copy for the 3D screen).
  const [projects] = useState([
    {
      name: "Seller Shield",
      description:
        "Four-agent AI team on AWS Bedrock that guards Amazon sellers: detects suspension and return-fraud risk and auto-drafts evidence-backed, policy-cited appeals.",
      siteReference: "https://maharshi-coding.github.io/seller-shield/",
      github: "https://github.com/maharshi-coding/seller-shield",
    },
    {
      name: "DataHub Steward Squad",
      description:
        "Five AI agents read live DataHub metadata over MCP, find governance risks, and write approval-gated fixes back to the catalog, verified by re-reading.",
      siteReference: "https://maharshi-coding.github.io/datahub-steward-squad/",
      github: "https://github.com/maharshi-coding/datahub-steward-squad",
    },
    {
      name: "Overturn",
      description:
        "Autonomous agent that fights wrongful insurance denials: it drafts a clause-cited appeal, files it, and keeps following up in the background for weeks.",
      siteReference: "https://overturn-368045431718.us-central1.run.app",
      github: "https://github.com/maharshi-coding/overturn",
    },
    {
      name: "Campus Ride Pooling",
      description:
        "Full-stack campus ride-sharing app: real-time ride creation and chat, Stripe payments and identity, and Mapbox route-aware ride matching.",
      siteReference: "",
      github: "https://github.com/maharshi-coding/ride-share",
    },
    {
      name: "Face Recognition Attendance",
      description:
        "Attendance platform using 128-d face embeddings, blink-based liveness anti-spoofing, JWT + RBAC, and CSV / XLSX analytics.",
      siteReference: "",
      github: "https://github.com/maharshi-coding/face-attendance-app",
    },
    {
      name: "AI Tutor",
      description:
        "AI tutoring mobile app built with React Native and OpenAI APIs, with prompts tuned specifically for teaching quality.",
      siteReference: "",
      github: "https://github.com/maharshi-coding/ai-tutor-app",
    },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [portalActive, setPortalActive] = useState(false);

  const scene = useRef();
  const { camera } = useThree();

  const githubLogoRef = useRef();
  const siteLogoRef = useRef();

  // Gently bob the link logos
  useFrame((state) => {
    if (scene.current && scene.current.visible) {
      if (githubLogoRef.current) {
        githubLogoRef.current.position.y =
          0.01 * Math.sin(state.clock.getElapsedTime() * 1.8) - 0.35;
      }
      if (siteLogoRef.current) {
        siteLogoRef.current.position.y =
          0.01 * Math.cos(state.clock.getElapsedTime() * 1.75) - 0.35;
      }
    }
  });

  useImperativeHandle(ref, () => ({
    scale: scene.current.scale,
    toggleAnimateOut: () =>
      toggleAnimation(scene, camera, isAnimating, setIsAnimating, {
        onOpenStart: () => setPortalActive(true),
        onCloseComplete: () => setPortalActive(false),
      }),
    toggleOut: () => {
      const opening = scene.current.scale.x === 0;
      if (opening) setPortalActive(true);
      ToggleNoAnimation(scene, isAnimating, setIsAnimating);
      if (!opening) setPortalActive(false);
    },
  }));

  const [projectButtonCooldown, setProjectButtonCooldown] = useState(false);

  async function setProjNum(number) {
    if (projectButtonCooldown) return;
    setProjectButtonCooldown(true);

    const max = projects.length;
    let formattedNumber = number % max;
    if (formattedNumber === -1) formattedNumber = max - 1;

    setProjectNumber(formattedNumber);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProjectButtonCooldown(false);
  }

  const [projectNumber, setProjectNumber] = useState(0);
  const [projectTitle, setProjTitle] = useState(projects[0].name);
  const [projectDesc, setProjDesc] = useState(projects[0].description);
  const [projectSite, setProjSite] = useState(projects[0].siteReference);
  const [projectGitHub, setProjGitHub] = useState(projects[0].github);

  useEffect(() => {
    setProjTitle(projects[projectNumber].name);
    setProjDesc(projects[projectNumber].description);
    setProjSite(projects[projectNumber].siteReference);
    setProjGitHub(projects[projectNumber].github);
  }, [projectNumber]);

  // Centre a lone logo when the project only has one link
  const [githubPositionX, setGithubPositionX] = useState(-0.3);
  const [sitePositionX, setSitePositionX] = useState(0.3);

  useEffect(() => {
    if (projectGitHub !== "" && projectSite !== "") {
      setGithubPositionX(-0.3);
      setSitePositionX(0.3);
    } else if (projectGitHub !== "") {
      setGithubPositionX(0);
    } else if (projectSite !== "") {
      setSitePositionX(0);
    }
  }, [projectGitHub, projectSite]);

  const [recentClick, setRecentClick] = useState(false);
  const [focusedLogo, setFocusedLogo] = useState("start");

  const rightArrow = useRef();
  const leftArrow = useRef();

  useEffect(() => {
    switch (focusedLogo) {
      case "none":
        animateOut([leftArrow, rightArrow]);
        break;
      case "left":
        animateOut([rightArrow]);
        animateIn([leftArrow]);
        break;
      case "right":
        animateOut([leftArrow]);
        animateIn([rightArrow]);
        break;
      default:
        break;
    }
  }, [focusedLogo]);

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
        {/* Monitor with a portal screen */}
        <primitive
          key={`projectMonitor`}
          object={monitorModel.scene}
          position={[MONITOR.x, MONITOR.y, 0]}
          scale={MONITOR.scale}
        >
          {portalActive && (
            <mesh key={`monitorPortal`} position={[PORTAL.x, PORTAL.y, PORTAL.z]} scale={PORTAL.scale}>
              <planeGeometry key={`monitorPortalPlane`} args={[2, 1]} />
              <MeshPortalMaterial key={`monitorPortalMat`}>
                {/* Lit by ambient + a neon spotlight (no HDR env — cheaper) */}
                <ambientLight intensity={1.1} key={`monitorPortalAmbLi`} />
                <pointLight position={[0, 2, 3]} intensity={6} key={`monitorPortalFill`} />
                {/* Dark recessed box the light text sits inside (high contrast) */}
                <mesh
                  castShadow
                  receiveShadow
                  rotation-y={-Math.PI * 0.5}
                  geometry={nodes.Cube.geometry}
                  scale-y={0.5}
                  scale-x={0.5}
                  key={`innerBox`}
                >
                  <meshStandardMaterial
                    color={PROJECT_BACKDROP[projectNumber % PROJECT_BACKDROP.length]}
                    key={`innerBoxMat`}
                  />
                  <spotLight
                    color={PROJECT_PALETTE[projectNumber % PROJECT_PALETTE.length]}
                    intensity={2.2}
                    position={[6, 8, 10]}
                    angle={0.35}
                    penumbra={1}
                    key={`innerBoxSpotLight`}
                  />
                </mesh>

                {/* Title + description */}
                <TitleText3D title={projectTitle} position={[0, 0.35, -0.1]} />
                <DescriptionText3D position={[0, 0, -0.25]} description={projectDesc} />

                {/* Prev / next arrows */}
                <TitleText3D
                  ref={leftArrow}
                  title={"←"}
                  useNormal
                  position={[-0.9, 0, -0.2]}
                  onClick={() => setProjNum(projectNumber - 1)}
                  onPointerEnter={() => setFocusedLogo("left")}
                  onPointerLeave={() => setFocusedLogo("none")}
                />
                <TitleText3D
                  ref={rightArrow}
                  title={"→"}
                  useNormal
                  position={[0.9, 0, -0.2]}
                  onClick={() => setProjNum(projectNumber + 1)}
                  onPointerEnter={() => setFocusedLogo("right")}
                  onPointerLeave={() => setFocusedLogo("none")}
                />

                {/* GitHub + live-site links */}
                <Logo
                  ref={githubLogoRef}
                  key={`githubRef`}
                  kind="github"
                  position={[githubPositionX, -0.35, -0.2]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={0.3}
                  visible={projectGitHub !== ""}
                  onClick={() => handleClick(projectGitHub, recentClick, setRecentClick)}
                />
                <Logo
                  ref={siteLogoRef}
                  key={`siteref`}
                  kind="website"
                  position={[sitePositionX, -0.35, -0.2]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={0.3}
                  visible={projectSite !== ""}
                  onClick={() => handleClick(projectSite, recentClick, setRecentClick)}
                />
              </MeshPortalMaterial>
            </mesh>
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

        {/* Focus button */}
        <ToggleFocusButton scale={0.5} rotation={[-0.3, 0, 0]} position={[0, -0.23, -0.1]} page={"projects"} />

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
useGLTF.preload("/aobox-transformed.glb");

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
