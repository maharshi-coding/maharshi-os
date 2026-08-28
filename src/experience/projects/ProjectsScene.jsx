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
import { Environment, Float, MeshPortalMaterial, Text, useGLTF } from "@react-three/drei";
import { VICE, PROJECT_PALETTE } from "../theme";

/* Scene layout constants (previously Leva debug controls in the original). */
const SP = { x: 0.0, y: -0.15, z: -0.2 };
const SR = { x: -0.1177, y: -0.0544, z: -0 };
const MONITOR = { x: 0, y: -0.28, scale: 0.5 };
const KBRD = { x: 0, y: -0.3, z: 0.57, scale: 0.0036 };
const PLNT = { x: -1.19, y: -0.31, z: -0.07, scale: 0.00106 };
const PORTAL = { x: 0, y: 1.45, z: -0.22, scale: 1.89 };

/**
 * Projects scene: a low-poly monitor whose screen is a portal into the current
 * project (3D title, description and links), with arrows to cycle through them.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio, populated with
 * Maharshi Barot's projects and reskinned for the Vice City theme.
 */
const ProjectsScene = forwardRef((_props, ref) => {
  const monitorModel = useGLTF(`/models/computer_monitor_lowpoly/monitor.glb`);
  const teenyBoardModel = useGLTF("/models/teenyBoard/cartoon_mini_keyboard.glb");
  const plantModel = useGLTF("/models/plant/low_poly_style_plant.glb");

  // Maharshi's real projects (concise copy for the 3D screen).
  const [projects] = useState([
    {
      name: "Seller Shield",
      description:
        "Four-agent AI team on AWS Bedrock that guards Amazon sellers: detects suspension and return-fraud risk and auto-drafts evidence-backed, policy-cited appeals.",
      siteReference: "https://maharshi-coding.github.io/seller-shield/",
      github: "https://github.com/maharshi-coding/seller-shield",
      id: 0,
    },
    {
      name: "DataHub Steward Squad",
      description:
        "Five AI agents read live DataHub metadata over MCP, find governance risks, and write approval-gated fixes back to the catalog, verified by re-reading.",
      siteReference: "https://maharshi-coding.github.io/datahub-steward-squad/",
      github: "https://github.com/maharshi-coding/datahub-steward-squad",
      id: 1,
    },
    {
      name: "Overturn",
      description:
        "Autonomous agent that fights wrongful insurance denials: it drafts a clause-cited appeal, files it, and keeps following up in the background for weeks.",
      siteReference: "https://overturn-368045431718.us-central1.run.app",
      github: "https://github.com/maharshi-coding/overturn",
      id: 2,
    },
    {
      name: "Campus Ride Pooling",
      description:
        "Full-stack campus ride-sharing app: real-time ride creation and chat, Stripe payments and identity, and Mapbox route-aware ride matching.",
      siteReference: "",
      github: "https://github.com/maharshi-coding/ride-share",
      id: 3,
    },
    {
      name: "Face Recognition Attendance",
      description:
        "Attendance platform using 128-d face embeddings, blink-based liveness anti-spoofing, JWT + RBAC, and CSV / XLSX analytics.",
      siteReference: "",
      github: "https://github.com/maharshi-coding/face-attendance-app",
      id: 4,
    },
    {
      name: "AI Tutor",
      description:
        "AI tutoring mobile app built with React Native and OpenAI APIs, with prompts tuned specifically for teaching quality.",
      siteReference: "",
      github: "https://github.com/maharshi-coding/ai-tutor-app",
      id: 5,
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

    toggleAnimateOut: () => {
      toggleAnimation(scene, camera, isAnimating, setIsAnimating, {
        onOpenStart: () => setPortalActive(true),
        onCloseComplete: () => setPortalActive(false),
      });
    },

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
                <ambientLight intensity={0.6} key={`monitorPortalAmbLi`} />
                <Environment preset="night" key={`monitorPortalEnv`} />
                {/* Neon backdrop box that recolours per project */}
                <mesh rotation-y={-Math.PI * 0.5} scale={[0.5, 0.5, 1]} key={`innerBox`}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial
                    color={PROJECT_PALETTE[projectNumber % PROJECT_PALETTE.length]}
                    key={`innerBoxMat`}
                  />
                  <spotLight
                    color={PROJECT_PALETTE[projectNumber % PROJECT_PALETTE.length]}
                    intensity={2}
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    key={`innerBoxSpotLight`}
                  />
                </mesh>

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
