'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DigitalRainBackground = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            color1: { value: new THREE.Color('#001220') },
            color2: { value: new THREE.Color('#00264d') },
            color3: { value: new THREE.Color('#004080') },
        },
        vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      // Шум для эффекта дождя
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Эффект цифрового дождя
        float speed = time * 0.5;
        float rain = 0.0;
        
        // Создаем несколько слоев дождя
        for (float i = 0.0; i < 5.0; i++) {
          float layer = i * 0.2;
          vec2 rainUV = uv * vec2(1.0, 3.0) + vec2(layer, speed * (0.5 + i * 0.1));
          rain += step(0.99, random(floor(rainUV * vec2(50.0, 100.0))));
        }
        
        // Волны на фоне
        float wave1 = sin(uv.x * 5.0 + time * 0.3) * 0.1;
        float wave2 = sin(uv.y * 3.0 + time * 0.5) * 0.05;
        
        // Градиентный фон
        vec3 background = mix(color1, color2, uv.y + wave1);
        background = mix(background, color3, uv.x + wave2);
        
        // Добавляем дождь
        background += rain * 0.3;
        
        // Добавляем "звезды"
        float stars = step(0.998, random(uv * 1000.0 + time));
        background += stars * 0.5;
        
        // Легкое мерцание
        float flicker = sin(time * 10.0 + uv.x * 20.0) * 0.02 + 0.98;
        
        gl_FragColor = vec4(background * flicker, 1.0);
      }
    `,
        side: THREE.DoubleSide,
        transparent: true,
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
            materialRef.current.uniforms.resolution.value.set(
                state.size.width * state.viewport.dpr,
                state.size.height * state.viewport.dpr
            );
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -20]}>
            <planeGeometry args={[100, 100]} />
            <primitive ref={materialRef} object={material} attach="material" />
        </mesh>
    );
};