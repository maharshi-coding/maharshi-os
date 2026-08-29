import { Text } from "@react-three/drei";

/**
 * Project description as flat, crisp SDF text (troika via drei <Text>).
 * Extruded 3D text looks broken/ghosted for a small paragraph, so the body
 * copy is rendered flat for maximum readability while the 3D title, arrows and
 * logos keep the portal's depth.
 *
 * @param {string} description - the text to render.
 */
export default function DescriptionText3D({ description, ...props }) {
  return (
    <Text
      {...props}
      font="/fonts/anek-bangla-v5-latin-500.woff"
      fontSize={0.082}
      maxWidth={1.55}
      lineHeight={1.34}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
      color="#f5eeff"
      material-toneMapped={false}
    >
      {description}
    </Text>
  );
}
