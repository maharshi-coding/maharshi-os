import { Center, Text3D } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Renders a wrapped block of 3D text for a project description.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 *
 * @param {string} description - the text to render.
 */
function DescriptionText3D({ description, ...props }) {
  const [textMatcap] = useLoader(THREE.TextureLoader, ["/matcaps/greyClay.png"]);

  const projectDesc = wrapTextByCharCount(description);
  return (
    <mesh {...props}>
      <boxGeometry args={[0.1, 0.1, 0.1]} key={`CenteringBoxGeom`} />
      <meshBasicMaterial color={"#FFFFFF"} key={`CenteringBoxMat`} visible={false} />
      <Center key={projectDesc.slice(0, 5)}>
        <Text3D
          scale={0.05}
          curveSegments={5}
          height={0.5}
          lineHeight={0.75}
          letterSpacing={0}
          size={1}
          font="/fonts/Inter_Bold.json"
        >
          {projectDesc}
          <meshMatcapMaterial matcap={textMatcap} />
        </Text3D>
      </Center>
    </mesh>
  );
}

export default DescriptionText3D;

/**
 * Wraps text to a max number of characters per line, keeping whole words.
 * @param {string} text - input text.
 * @param {number} [maxCharsPerLine=45] - max characters per line.
 * @returns {string} the wrapped text with line breaks inserted.
 */
function wrapTextByCharCount(text, maxCharsPerLine = 45) {
  if (typeof text !== "string") return "";
  return text
    .split(" ")
    .reduce((lines, word) => {
      const lastLine = lines[lines.length - 1];
      if (lastLine && (lastLine + " " + word).length <= maxCharsPerLine) {
        lines[lines.length - 1] = lastLine + " " + word;
      } else {
        lines.push(word);
      }
      return lines;
    }, [])
    .join("\n");
}
