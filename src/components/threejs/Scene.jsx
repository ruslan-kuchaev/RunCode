"use client";
import { Keyboard } from "@/components/threejs/Keyboard";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { useControls } from "leva";

export function Scene() {
  const {
    KpositionX,
    KpositionY,
    KpositionZ,
    KrotationX,
    KrotationY,
    KrotationZ,
  } = useControls({
    KpositionX: 0,
    KpositionY: 0,
    KpositionZ: 0,
    KrotationX: 0,
    KrotationY: 0,
    KrotationZ: 0,
  });

  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <Keyboard scale={9} position={[0, -0.5, 8]} rotation={[1.6, 0, 0]} />

      <Environment
        files={"/hdr/studio-small.hdr"}
        background={false}
        environmentIntensity={0.7}
        environmentRotation={[0, 1.0, -4.42]}
      />
    </group>
  );
}
