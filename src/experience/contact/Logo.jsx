import { useGLTF } from "@react-three/drei";
import { forwardRef, useRef } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * A floating 3D social/link logo (github / email / website / linkedin).
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 * Chiclet models by pengedarseni, Ahmad Riazi & Sparrow (CC-BY).
 *
 * @param {string} kind - which logo to render.
 */
const Logo = forwardRef(({ kind, ...props }, ref) => {
  const logoKind = kind || "linkedin";
  let logoPath;

  if (logoKind === "github") {
    logoPath = "/models/socialMediaIcons/github.glb";
  } else if (logoKind === "email") {
    logoPath = "/models/socialMediaIcons/email.glb";
  } else if (logoKind === "website") {
    logoPath = "/models/socialMediaIcons/website-icon/source/website.glb";
  } else {
    logoPath = "/models/socialMediaIcons/linkedin.glb";
  }

  const logoModel = useGLTF(logoPath);
  let clonedLogo;

  // Each source model is nested differently — dig to the mesh, then normalise it
  if (logoKind === "email") {
    clonedLogo = clone(
      logoModel.scene.children[0].children[0].children[0].children[0]
    );
  } else {
    clonedLogo = clone(logoModel.scene.children[0]);
  }

  clonedLogo.position.set(0, 0, 0);
  clonedLogo.rotation.set(Math.PI / 2, 0, Math.PI / 2);

  if (logoKind === "github") {
    clonedLogo.scale.set(10, 10, 10);
  } else if (logoKind === "email") {
    clonedLogo.position.set(0, -0.1, 0);
    clonedLogo.scale.set(0.03, 0.03, 0.03);
    clonedLogo.rotation.set(0, -Math.PI / 2, 0);
  } else if (logoKind === "website") {
    clonedLogo.scale.set(0.035, 0.035, 0.035);
    clonedLogo.position.set(0.15, 0, 0);
  } else {
    clonedLogo.scale.set(0.3, 0.3, 0.3);
  }

  const groupRef = useRef();
  if (ref) {
    ref.current = groupRef.current;
  }

  return (
    <group {...props} ref={groupRef}>
      {/* Invisible box gives an easy hover/click target */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={"#FFFFFF"} visible={false} />
      </mesh>
      <primitive object={clonedLogo} />
    </group>
  );
});

export default Logo;

useGLTF.preload("/models/socialMediaIcons/github.glb");
useGLTF.preload("/models/socialMediaIcons/email.glb");
useGLTF.preload("/models/socialMediaIcons/website-icon/source/website.glb");
