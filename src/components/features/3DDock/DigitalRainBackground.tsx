'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export  const DigitalRainBackground = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color('#001220') },
            color2: { value: new THREE.Color('#00264d') },
            color3: { value: new THREE.Color('#004080') },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // Создаем волны
        float wave1 = sin(uv.x * 10.0 + time) * 0.05;
        float wave2 = sin(uv.y * 8.0 + time * 1.2) * 0.03;
        
        // Смешиваем цвета с волнами
        vec3 col = mix(color1, color2, uv.y + wave1);
        col = mix(col, color3, uv.x + wave2);
        
        // Добавляем точки (звезды)
        float stars = step(0.995, fract(sin(uv.x * 1000.0) * sin(uv.y * 1000.0) * 10000.0));
        col += stars * 0.3;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `,
        side: THREE.DoubleSide,
    }), []);

    useFrame((state) => {
        material.uniforms.time.value = state.clock.elapsedTime;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -30]}>
            <planeGeometry args={[100, 100]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};