"use client"
// убери
import HelloRunAnimate from "@/components/animate/HelloRunAnimate";
import { FixedMenu } from "@/components/main/header/FixedMenu/FixedMenu";
import { Canvas } from '@react-three/fiber'
import HolographicGrid from '@/components/threejs/HolographicGrid'

export default function Home() {
    return (
        <>
            <HelloRunAnimate />
            <FixedMenu />
            <div style={{ 
                width: '100vw', 
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1
            }}>
                <Canvas 
                    camera={{ 
                        position: [20, 15, 20], 
                        fov: 60,
                        near: 0.1,
                        far: 1000
                    }}
                    shadows
                >
                    <HolographicGrid />
                </Canvas>
            </div>
        </>
    );
}
