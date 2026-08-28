import { Html, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState, Suspense, lazy } from "react";
import { useThree } from "@react-three/fiber";
import { VICE } from "./theme";

const LaptopScene = lazy(() => import("./home/LaptopScene.jsx"));
const ProjectsScene = lazy(() => import("./projects/ProjectsScene.jsx"));
const ContactScene = lazy(() => import("./contact/ContactScene.jsx"));

/**
 * The full R3F world: an in-scene neon nav that animates the camera between
 * three scenes (home / projects / contact), lit for the Vice City theme.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 */
export default function Scene() {
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [currentPageName, setCurrentPageName] = useState("home");

  const home = useRef();
  const projects = useRef();
  const contact = useRef();
  const homeReady = useRef(false);

  const { camera } = useThree();

  // Small delay, then animate the home scene in
  useEffect(() => {
    setLoading(true);
    setAnimating(true);
    const t = setTimeout(() => {
      setLoading(false);
      setAnimating(false);
      if (homeReady.current && home.current && home.current.scale && home.current.scale.x === 0) {
        home.current.toggleAnimateOut();
      }
    }, 750);
    return () => clearTimeout(t);
  }, []);

  const onLoad = useCallback(() => {
    homeReady.current = true;
    if (!loading && home.current && home.current.scale && home.current.scale.x === 0) {
      home.current.toggleAnimateOut();
    }
  }, [loading]);

  async function SetPage(pageName) {
    if (animating) return;
    if (pageName === currentPageName) return;

    setAnimating(true);

    if (home.current && home.current.scale.x > 0) home.current.toggleAnimateOut();
    if (projects.current && projects.current.scale.x > 0) projects.current.toggleAnimateOut();
    if (contact.current && contact.current.scale.x > 0) contact.current.toggleAnimateOut();

    await new Promise((r) => setTimeout(r, 500));

    setCurrentPageName(pageName);

    if (pageName === "home" && home.current && home.current.scale.x === 0)
      home.current.toggleAnimateOut();
    if (pageName === "projects" && projects.current && projects.current.scale.x === 0)
      projects.current.toggleAnimateOut();
    if (pageName === "contact" && contact.current && contact.current.scale.x === 0)
      contact.current.toggleAnimateOut();

    await new Promise((r) => setTimeout(r, 500));
    setAnimating(false);
  }

  const navLink = (name, label) => (
    <button
      type="button"
      onClick={() => SetPage(name)}
      className="viceNav__link"
      data-active={currentPageName === name}
      aria-current={currentPageName === name ? "page" : undefined}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* In-scene neon nav */}
      <Html center position={[0, 2.4, 0]} className="viceNav">
        {navLink("home", "HOME")}
        {navLink("projects", "PROJECTS")}
        {navLink("contact", "CONTACT")}
      </Html>

      {/* Lighting — neon night */}
      <ambientLight intensity={0.7} />
      <hemisphereLight args={[VICE.pink, VICE.cyan, 1.2]} />
      <directionalLight position={[-4, 5, 3]} intensity={2.2} />
      <pointLight position={[6, 2, 4]} intensity={40} distance={22} decay={2} color={VICE.cyan} />
      <pointLight position={[-6, 2, 4]} intensity={40} distance={22} decay={2} color={VICE.pink} />
      <Environment preset="sunset" />

      {/* Neon-night haze the world fades into */}
      <fog attach="fog" args={[VICE.fog, 10, 20]} />

      {/* Back wall so the fog reads as depth */}
      <mesh rotation={[0, -Math.PI * 0.25, 0]} position={[10, -1.5, -30]}>
        <planeGeometry args={[100, 30]} />
        <meshBasicMaterial color={VICE.fog} />
      </mesh>

      {/* Scenes — draggable */}
      <Suspense fallback={null}>
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <LaptopScene ref={home} onLoad={onLoad} />
          <ProjectsScene ref={projects} />
          <ContactScene ref={contact} />
        </PresentationControls>
      </Suspense>

      <ContactShadows position-y={-1.4} opacity={0.4} scale={10} blur={2.4} />
    </>
  );
}
