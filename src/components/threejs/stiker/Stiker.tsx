import { Decal, useTexture } from "@react-three/drei";

type Props = {
  url: string;
};

export function Sticker({ url, ...props }: Props) {
  const emoji = useTexture(url);
  return (
    <Decal {...props}>
      <meshPhysicalMaterial
        transparent
        polygonOffset
        polygonOffsetFactor={-10}
        map={emoji}
        map-flipY={false}
        map-anisotropy={16}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
        roughness={1}
        clearcoat={0.5}
        metalness={0.75}
        toneMapped={false}
      />
    </Decal>
  );
}
