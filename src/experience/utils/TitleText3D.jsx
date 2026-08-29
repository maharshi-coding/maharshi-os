import { Center, Text3D } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { forwardRef, useMemo, useRef } from "react";

/**
 * Holds a chunk of 3D text (project titles, arrows, headings), centered inside
 * an invisible box via the drei <Center> helper.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 *
 * @param {string} title       text to render.
 * @param {boolean} useNormal  use a rainbow normal material (arrows).
 * @param {boolean} useStandard use a flat lambert material (headings).
 * @param {string} color       colour for the standard material.
 */
const TitleText3D = forwardRef(
  ({ title, useNormal, useStandard, color = "#fdf0ff", ...props }, ref) => {
    // Load the 3D text matcap
    const [textMatcap] = useLoader(THREE.TextureLoader, ["/matcaps/greyClay.png"]);

    // Wrap the title so long project names sit on multiple lines
    const projectTitle = useMemo(() => {
      if (typeof title !== "string") return "";
      return title
        .split(" ")
        .reduce((acc, word) => {
          const lastLine = acc[acc.length - 1];
          if (lastLine && (lastLine + " " + word).length <= 45) {
            acc[acc.length - 1] = lastLine + " " + word;
          } else {
            acc.push(word);
          }
          return acc;
        }, [])
        .join("\n");
    }, [title]);

    // Attach the forwarded ref to the group
    const groupRef = useRef();
    if (ref) {
      ref.current = groupRef.current;
    }

    return (
      <mesh {...props} ref={groupRef}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color={"#FFFFFF"} visible={false} />
        {/* Centered text within the box */}
        <Center key={projectTitle.slice(0, 5)}>
          <Text3D
            scale={0.1}
            curveSegments={6}
            bevelEnabled
            bevelSegments={2}
            bevelSize={0.04}
            bevelThickness={0.1}
            height={0.5}
            lineHeight={0.5}
            letterSpacing={-0.06}
            size={1}
            font="/fonts/Inter_Bold.json"
          >
            {projectTitle}
            {useNormal ? (
              <meshNormalMaterial />
            ) : useStandard ? (
              <meshLambertMaterial color={color} emissive={color} emissiveIntensity={0.35} />
            ) : (
              <meshMatcapMaterial matcap={textMatcap} />
            )}
          </Text3D>
        </Center>
      </mesh>
    );
  }
);

export default TitleText3D;
