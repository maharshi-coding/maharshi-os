import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * A single 3D pedestal that a social logo floats above.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 * Model: "Pedestal" by elouisetrewartha (CC-BY).
 */
export default function Pedestal({ ...props }) {
  const pedestalModel = useGLTF(`/models/pedestal/pedestal.glb`);
  const clonedPedestal = clone(pedestalModel.scene);

  return <primitive object={clonedPedestal} {...props} />;
}

useGLTF.preload("/models/pedestal/pedestal.glb");
