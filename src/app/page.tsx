"use client";
// убери
import HelloRunAnimate from "@/components/animate/HelloRunAnimate";
import { FixedMenu } from "@/components/main/header/FixedMenu/FixedMenu";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@/components/threejs/Scene"; // Добавьте фигурные скобки

export default function Home() {
  return (
    <>
      <HelloRunAnimate />
      <FixedMenu />
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <Canvas>
          <Scene />
        </Canvas>
      </div>
    </>
  );
}
