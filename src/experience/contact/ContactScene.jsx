import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import TitleText3D from "../utils/TitleText3D.jsx";
import { handleClick, animateIn, animateOut } from "../utils/Helpers.js";
import { useThree } from "@react-three/fiber";
import Pedestal from "./Pedestal";
import Logo from "./Logo";
import gsap from "gsap";
import { person } from "@/data/resume";
import { VICE } from "../theme";

/* Scene layout constants (previously Leva debug controls in the original). */
const SP = { x: 0.0, y: 0.0, z: -0.2 };
const SR = { x: -0.11, y: 1.0, z: 0 };
const PED = { x: 0, y: -0.8, z: 0.01 };
const PEDR = { x: 0.0, y: 0.01, z: 0 };
const TXT = { x: 1.38, y: 1.6, z: -0.01 };

const LIVE_SITE = "https://maharshi-os.netlify.app";

/**
 * Contact scene: three pedestals topped with floating link logos (website,
 * GitHub, email). Adapted from Eli Parker's MIT-licensed interactive portfolio,
 * wired to Maharshi Barot's links and reskinned neon.
 */
const ContactScene = forwardRef((_props, ref) => {
  const scene = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const { camera } = useThree();

  useImperativeHandle(
    ref,
    () => ({
      scale: scene.current.scale,
      toggleAnimateOut: () => toggleAnimation(scene, camera, isAnimating, setIsAnimating),
      toggleOut: () => ToggleNoAnimation(scene, isAnimating, setIsAnimating),
    }),
    []
  );

  const pointLightRef = useRef();

  const websiteLogo = useRef();
  const githubLogo = useRef();
  const emailLogo = useRef();

  const [focusedLogo, setFocusedLogo] = useState("none");

  useEffect(() => {
    switch (focusedLogo) {
      case "none":
        if (websiteLogo.current && emailLogo.current && githubLogo.current) {
          animateOut([websiteLogo, emailLogo, githubLogo]);
        }
        if (pointLightRef.current) {
          gsap.to(pointLightRef.current.color, { duration: 0.3, r: 3, g: 3, b: 3, ease: "power4.inOut" });
        }
        break;

      case "website":
        animateOut([emailLogo, githubLogo]);
        animateIn([websiteLogo]);
        gsap.to(pointLightRef.current.color, { duration: 0.3, r: 1, g: 40, b: 55, ease: "power4.inOut" });
        break;

      case "github":
        animateOut([emailLogo, websiteLogo]);
        animateIn([githubLogo]);
        gsap.to(pointLightRef.current.color, { duration: 0.3, r: 60, g: 4, b: 40, ease: "power4.inOut" });
        break;

      case "email":
        animateOut([websiteLogo, githubLogo]);
        animateIn([emailLogo]);
        gsap.to(pointLightRef.current.color, { duration: 0.3, r: 60, g: 30, b: 4, ease: "power4.inOut" });
        break;

      default:
        break;
    }
  }, [focusedLogo]);

  const [recentClick, setRecentClick] = useState(false);

  return (
    <group ref={scene} scale={0} visible={false} position={[SP.x, SP.y, SP.z]} rotation={[SR.x, SR.y, SR.z]}>
      {/* Pedestals */}
      <group position={[PED.x, PED.y, PED.z]} rotation={[PEDR.x, PEDR.y, PEDR.z]} scale={0.1}>
        <Pedestal position={[0, 0, -20]} />
        <Pedestal />
        <Pedestal position={[0, 0, 20]} />
      </group>

      {/* Website / live portfolio */}
      <Logo
        ref={websiteLogo}
        kind={"website"}
        position={[-0.1, 0.9, -2]}
        onClick={() => handleClick(LIVE_SITE, recentClick, setRecentClick)}
        onPointerEnter={() => setFocusedLogo("website")}
        onPointerLeave={() => setFocusedLogo("none")}
      />
      {/* GitHub */}
      <Logo
        ref={githubLogo}
        kind={"github"}
        position={[-0.1, 0.9, 0]}
        onClick={() => handleClick(person.github, recentClick, setRecentClick)}
        onPointerEnter={() => setFocusedLogo("github")}
        onPointerLeave={() => setFocusedLogo("none")}
      />
      {/* Email */}
      <Logo
        ref={emailLogo}
        kind={"email"}
        position={[-0.1, 0.9, 2]}
        onClick={() => handleClick(`mailto:${person.email}`, recentClick, setRecentClick)}
        onPointerEnter={() => setFocusedLogo("email")}
        onPointerLeave={() => setFocusedLogo("none")}
      />

      {/* Heading */}
      <TitleText3D
        title="Get In Touch"
        position={[TXT.x, TXT.y, TXT.z]}
        scale={5}
        rotation={[0, -Math.PI / 2, 0]}
        useStandard
        color={VICE.pink}
      />

      <pointLight
        ref={pointLightRef}
        color={"rgb(255, 255, 255)"}
        position={[-1, 1.5, 0]}
        intensity={0.5}
        distance={4}
        decay={0.9}
      />
    </group>
  );
});

export default ContactScene;

/** Springy scale animation to reveal / hide the scene. */
function toggleAnimation(scene, camera, isAnimating, setIsAnimating) {
  if (isAnimating) return;
  setIsAnimating(true);
  scene.current.visible = true;

  const animatedIn = scene.current.scale.x === 1;
  const targetScale = animatedIn ? { x: 0, y: 0, z: 0 } : { x: 1, y: 1, z: 1 };

  gsap.to(scene.current.scale, {
    duration: 0.5,
    x: targetScale.x,
    y: targetScale.y,
    z: targetScale.z,
    ease: animatedIn ? "elastic.out(1,1)" : "elastic.out(1,0.5)",
    onUpdate: () => camera.updateProjectionMatrix(),
    onComplete: () => {
      if (targetScale.x === 0) scene.current.visible = false;
      setIsAnimating(false);
    },
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
    scene.current.scale.set(1, 1, 1);
  }
  setIsAnimating(false);
}
