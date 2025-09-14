import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Suspense, useMemo, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import HackerBackground from './HackerBackground'

function CubeModel({ position, index }) {
    const gltf = useLoader(GLTFLoader, '/cubi.glb')
    const meshRef = useRef()
    
    // Параметры анимации
    const minHeight = -0.5
    const maxHeight = 2.0
    const noiseScale = 0.02
    const speed = 0.5
    
    // Создаем шершавый мраморный материал
    const marbleMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.9, 0.85, 0.8), // Светло-бежевый базовый цвет
            roughness: 0.8, // Шершавая поверхность
            metalness: 0.0,
            normalScale: new THREE.Vector2(0.5, 0.5),
            envMapIntensity: 0.3, // Меньше отражений
        })
    }, [])
    
    // Клонируем сцену для каждого кубика и применяем материал
    const clonedScene = useMemo(() => {
        const cloned = gltf.scene.clone()
        cloned.traverse((child) => {
            if (child.isMesh) {
                child.material = marbleMaterial
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        return cloned
    }, [gltf.scene, marbleMaterial])
    
    // Анимация с шумом
    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime() * speed
            const x = position[0] * noiseScale
            const z = position[2] * noiseScale
            
            // Простой шум на основе синуса и косинуса
            const noise1 = Math.sin(time + x * 10 + z * 10) * 0.5
            const noise2 = Math.cos(time * 0.7 + x * 15 + z * 15) * 0.3
            const noise3 = Math.sin(time * 1.3 + x * 8 + z * 8) * 0.2
            
            const totalNoise = noise1 + noise2 + noise3
            const normalizedNoise = (totalNoise + 1) * 0.5 // Нормализуем от 0 до 1
            
            // Применяем к высоте
            const newHeight = minHeight + (maxHeight - minHeight) * normalizedNoise
            meshRef.current.position.y = newHeight
        }
    })
    
    return <primitive ref={meshRef} object={clonedScene} scale={[1.5, 1.5, 1.5]} position={position} />
}

export default function HolographicGrid() {
    // Создаем массив позиций для сетки 15x15
    const cubePositions = useMemo(() => {
        const positions = []
        const gridSize = 15
        const spacing = 3.0 // Расстояние между кубиками (1.5x размер + 0.5 зазор)
        
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                positions.push([
                    (x - (gridSize - 1) / 2) * spacing, // Центрируем по X
                    0, // Все кубики на одной высоте (Y = 0)
                    (z - (gridSize - 1) / 2) * spacing  // Центрируем по Z
                ])
            }
        }
        return positions
    }, [])

    return (
        <Suspense fallback={null}>
            {/* Управление камерой */}
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
            />
            
            {/* Освещение */}
            <ambientLight intensity={0.6} />
            <directionalLight 
                position={[10, 10, 5]} 
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.8} />
            
            {/* Хакерский фон */}
            <HackerBackground />
            
            {/* Сетка кубиков */}
            {cubePositions.map((position, index) => (
                <CubeModel key={index} position={position} index={index} />
            ))}
        </Suspense>
    )
}