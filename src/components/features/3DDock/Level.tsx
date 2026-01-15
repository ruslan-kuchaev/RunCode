// 3DDock/Level.tsx (обновленная версия)
'use client';

import {useRef, useState, forwardRef, useImperativeHandle, useEffect,} from 'react';
import { Mesh, Vector3 } from 'three';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface Task {
    id: string;
    title: string;
    color?: string;
    description?: string;
}

interface LevelProps {
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
    onTaskPositionsReady?: (positions: Vector3[]) => void;
    selectedTaskId?: string;
}

export interface LevelRef {
    getTaskPositions: () => Vector3[];
    getTaskCenter: (id: string) => Vector3 | null;
}

const Level = forwardRef<LevelRef, LevelProps>(({
                                                    tasks,
                                                    onTaskClick,
                                                    onTaskPositionsReady,
                                                    selectedTaskId
                                                }, ref) => {
    const [taskPositions, setTaskPositions] = useState<Vector3[]>([]);

    // Параметры плитки
    const BRICK_WIDTH = 1.8;
    const BRICK_HEIGHT = 1.0;
    const MORTAR = 0.2;
    const DEPTH = 0.1;

    const getBrickWallPosition = (index: number): Vector3 => {
        const bricksPerEvenRow = 4;
        const bricksPerOddRow = 3;

        let currentIndex = index;
        let row = 0;
        let col = 0;

        while (currentIndex >= 0) {
            const bricksInThisRow = (row % 2 === 0) ? bricksPerEvenRow : bricksPerOddRow;

            if (currentIndex < bricksInThisRow) {
                col = currentIndex;
                break;
            }

            currentIndex -= bricksInThisRow;
            row++;
        }

        const rowOffset = (row % 2 === 1) ? (BRICK_WIDTH + MORTAR) / 2 : 0;

        const x = col * (BRICK_WIDTH + MORTAR) + rowOffset -
            ((row % 2 === 0 ? bricksPerEvenRow : bricksPerOddRow) * (BRICK_WIDTH + MORTAR) - MORTAR) / 2;
        const y = -row * (BRICK_HEIGHT + MORTAR);

        return new Vector3(x, y, 0);
    };

    // Сохраняем позиции всех плиток
    useEffect(() => {
        const positions = tasks.map((_, index) => getBrickWallPosition(index));
        setTaskPositions(positions);
        onTaskPositionsReady?.(positions);
    }, [tasks]);

    // Методы для внешнего доступа
    useImperativeHandle(ref, () => ({
        getTaskPositions: () => taskPositions,
        getTaskCenter: (id: string) => {
            const index = tasks.findIndex(task => task.id === id);
            return index >= 0 ? taskPositions[index] : null;
        }
    }));

    // Компонент плитки
    const Brick = ({ task, position, index }: { task: Task; position: Vector3; index: number }) => {
        const meshRef = useRef<Mesh>(null);
        const isSelected = selectedTaskId === task.id;
        const isHovered = useRef(false);

        useFrame((state) => {
            if (meshRef.current) {
                // Анимация для выбранной плитки
                if (isSelected) {
                    meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2;
                    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
                }
                // Анимация при наведении (если не выбранная)
                else if (isHovered.current) {
                    meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 0.1;
                }
                // Исходное положение
                else {
                    meshRef.current.position.z = 0;
                    meshRef.current.rotation.z = 0;
                }
            }
        });

        return (
            <group position={position}>
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick?.(task);
                    }}
                    onPointerOver={() => {
                        isHovered.current = true;
                    }}
                    onPointerOut={() => {
                        isHovered.current = false;
                    }}
                    castShadow
                    receiveShadow
                >
                    <boxGeometry args={[BRICK_WIDTH, BRICK_HEIGHT, DEPTH]} />
                    <meshStandardMaterial
                        color={task.color || '#4f8ff7'}
                        roughness={0.4}
                        metalness={0.1}
                        emissive={isSelected ? '#ffffff' : '#000000'}
                        emissiveIntensity={isSelected ? 0.3 : 0}
                    />
                </mesh>

                <Text
                    position={[0, 0, DEPTH / 2 + 0.01]}
                    fontSize={0.15}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={BRICK_WIDTH * 0.9}
                    outlineWidth={0.01}
                    outlineColor="black"
                >
                    {task.title}
                </Text>

                {/* Подсветка выбранной плитки */}
                {isSelected && (
                    <mesh position={[0, 0, 0.1]}>
                        <ringGeometry args={[BRICK_WIDTH * 0.6, BRICK_WIDTH * 0.7, 32]} />
                        <meshBasicMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                )}
            </group>
        );
    };

    return (
        <group position={[0, 0, 0]}>
            {tasks.map((task, index) => (
                <Brick
                    key={task.id}
                    task={task}
                    position={getBrickWallPosition(index)}
                    index={index}
                />
            ))}
        </group>
    );
});

Level.displayName = 'Level';
export default Level;