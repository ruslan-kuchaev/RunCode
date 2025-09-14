import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { OrbitControls, Text, Decal, useTexture } from "@react-three/drei";
import * as THREE from "three";
import HackerBackground from "./HackerBackground";
import gsap from "gsap";

function CubeModel({ position, index }) {
  const gltf = useLoader(GLTFLoader, "/cubi.glb");
  const meshRef = useRef();

  const minHeight = -0.5;
  const maxHeight = 1.0;
  const noiseScale = 0.02;
  const speed = 0.3;

  const marbleMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.9, 0.85, 0.8),
      roughness: 0.8,
      metalness: 0.0,
      normalScale: new THREE.Vector2(0.5, 0.5),
      envMapIntensity: 0.3,
    });
  }, []);

  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = marbleMaterial;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return cloned;
  }, [gltf.scene, marbleMaterial]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      const x = position[0] * noiseScale;
      const z = position[2] * noiseScale;

      const noise1 = Math.sin(time + x * 10 + z * 10) * 0.5;
      const noise2 = Math.cos(time * 0.7 + x * 15 + z * 15) * 0.3;
      const noise3 = Math.sin(time * 1.3 + x * 8 + z * 8) * 0.2;

      const totalNoise = noise1 + noise2 + noise3;
      const normalizedNoise = (totalNoise + 1) * 0.5;

      const newHeight = minHeight + (maxHeight - minHeight) * normalizedNoise;
      meshRef.current.position.y = newHeight;
    }
  });

  return (
    <group>
      <primitive
        ref={meshRef}
        object={clonedScene}
        scale={[1.5, 1.5, 1.5]}
        position={position}
      />
      <Text
        position={[position[0], position[1] + 1.2, position[2]]}
        fontSize={0.3}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        {index}
      </Text>
    </group>
  );
}

// Упрощенный компонент Sticker с плавным свечением
function Sticker({ url, hovered, ...props }) {
  const emoji = useTexture(url);
  const materialRef = useRef();

  useEffect(() => {
    if (!materialRef.current) return;

    if (hovered) {
      // Плавное появление свечения
      gsap.to(materialRef.current, {
        emissiveIntensity: 2.0,
        duration: 0.6,
        ease: "power2.out",
      });
    } else {
      // Плавное исчезновение свечения
      gsap.to(materialRef.current, {
        emissiveIntensity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [hovered]);

  return (
    <Decal {...props}>
      <meshPhysicalMaterial
        ref={materialRef}
        transparent
        polygonOffset
        polygonOffsetFactor={-10}
        map={emoji}
        map-flipY={false}
        map-anisotropy={16}
        roughness={0.7}
        clearcoat={0.6}
        metalness={0.7}
        emissive={new THREE.Color(82 / 255, 148 / 255, 255 / 255)} // RGB 82, 148, 255
        emissiveIntensity={0}
        toneMapped={false}
      />
    </Decal>
  );
}

// Упрощенный BigCubeModel
function BigCubeModel({ position, index }) {
  const meshRef = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

  const minHeight = -0.5;
  const maxHeight = 1.0;
  const noiseScale = 0.02;
  const speed = 0.3;

  const marbleMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.9, 0.85, 0.8),
      roughness: 0.8,
      metalness: 0.0,
      normalScale: new THREE.Vector2(0.5, 0.5),
      envMapIntensity: 0.3,
    });
  }, []);

  const bigCubeGeometry = useMemo(() => {
    return new THREE.BoxGeometry(8.5, 1.5, 2.5);
  }, []);

  // Анимация текста
  useEffect(() => {
    if (!textRef.current) return;

    if (hovered) {
      gsap.to(textRef.current, {
        color: new THREE.Color(82 / 255, 148 / 255, 255 / 255),
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(textRef.current, {
        color: new THREE.Color(0, 1, 0),
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }, [hovered]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      const x = position[0] * noiseScale;
      const z = position[2] * noiseScale;

      const noise1 = Math.sin(time + x * 10 + z * 10) * 0.5;
      const noise2 = Math.cos(time * 0.7 + x * 15 + z * 15) * 0.3;
      const noise3 = Math.sin(time * 1.3 + x * 8 + z * 8) * 0.2;

      const totalNoise = noise1 + noise2 + noise3;
      const normalizedNoise = (totalNoise + 1) * 0.5;

      const newHeight = minHeight + (maxHeight - minHeight) * normalizedNoise;
      meshRef.current.position.y = newHeight;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={bigCubeGeometry}
        material={marbleMaterial}
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Sticker
          url="RunCode.svg"
          position={[0, 1, 0]}
          rotation={[90, 0, 109.96]}
          scale={[7, 0.9, 1]}
          hovered={hovered}
        />
      </mesh>

      <Text
        ref={textRef}
        position={[position[0], position[1] + 1.2, position[2]]}
        fontSize={0.3}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        {index}
      </Text>
    </group>
  );
}

function CameraTracker() {
  const { camera } = useThree();

  useFrame(() => {
    console.log("Camera position:", {
      x: camera.position.x.toFixed(2),
      y: camera.position.y.toFixed(2),
      z: camera.position.z.toFixed(2),
    });
  });

  return null;
}

export default function HolographicGrid() {
  const cubePositions = useMemo(() => {
    const positions = [];
    const gridSize = 15;
    const spacing = 3.0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        positions.push([
          (x - (gridSize - 1) / 2) * spacing,
          0,
          (z - (gridSize - 1) / 2) * spacing,
        ]);
      }
    }
    return positions;
  }, []);

  return (
    <Suspense fallback={null}>
      <CameraTracker />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} />

      <HackerBackground />

      {cubePositions.map((position, index) => {
        if (index === 127 || index === 97) {
          return null;
        }

        if (index === 112) {
          return <BigCubeModel key={index} position={position} index={index} />;
        }

        return <CubeModel key={index} position={position} index={index} />;
      })}
    </Suspense>
  );
}
