// 3DDock/SnapOrbitControls.tsx
'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3, Vector2 } from 'three';
import { useEffect, useRef, useState } from 'react';

interface SnapOrbitControlsProps {
    targets: Vector3[]; // Позиции всех плиток
    onTargetChange?: (index: number) => void; // Колбэк при смене плитки
    snapDistance?: number; // Дистанция для прилипания
}

export function SnapOrbitControls({
                                      targets,
                                      onTargetChange,
                                      snapDistance = 1.5
                                  }: SnapOrbitControlsProps) {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    // Состояния для снаппинга
    const [isMoving, setIsMoving] = useState(false);
    const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

    // Вектор для скорости инерции
    const velocity = useRef(new Vector2(0, 0));
    const lastMousePos = useRef(new Vector2(0, 0));
    const isDragging = useRef(false);

    // Находим ближайшую плитку к текущей позиции камеры
    const findNearestTarget = (cameraPosition: Vector3): { index: number, position: Vector3 } => {
        let minDistance = Infinity;
        let nearestIndex = 0;

        targets.forEach((target, index) => {
            // Проекция на плоскость XY (игнорируем Z для 2D плоскости)
            const cameraPos2D = new Vector3(cameraPosition.x, cameraPosition.y, 0);
            const targetPos2D = new Vector3(target.x, target.y, 0);

            const distance = cameraPos2D.distanceTo(targetPos2D);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = index;
            }
        });

        return { index: nearestIndex, position: targets[nearestIndex] };
    };

    // Плавное движение к целевой позиции
    const smoothMoveToTarget = (targetPos: Vector3, speed: number = 0.1) => {
        const currentPos = new Vector3(camera.position.x, camera.position.y, camera.position.z);
        const newPos = currentPos.lerp(targetPos, speed);

        // Двигаем камеру
        camera.position.set(newPos.x, newPos.y, camera.position.z);

        // Обновляем controls target (точка, куда смотрит камера)
        if (controlsRef.current) {
            controlsRef.current.target.lerp(new Vector3(targetPos.x, targetPos.y, 0), speed);
            controlsRef.current.update();
        }
    };

    // Обработка событий мыши
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const onMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            setIsMoving(true);
            lastMousePos.current.set(e.clientX, e.clientY);
            velocity.current.set(0, 0);
        };

        const onMouseUp = () => {
            isDragging.current = false;

            // При отпускании запускаем инерцию
            setTimeout(() => {
                setIsMoving(false);

                // Находим ближайшую плитку для прилипания
                const nearest = findNearestTarget(camera.position);
                setTargetPosition(nearest.position);
                setCurrentTargetIndex(nearest.index);
                onTargetChange?.(nearest.index);
            }, 50);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging.current) {
                const deltaX = e.clientX - lastMousePos.current.x;
                const deltaY = e.clientY - lastMousePos.current.y;

                // Сохраняем скорость для инерции
                velocity.current.set(deltaX * 0.05, deltaY * 0.05);

                lastMousePos.current.set(e.clientX, e.clientY);
            }
        };

        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mousemove', onMouseMove);

        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('mousemove', onMouseMove);
        };
    }, [camera]);

    // Анимация кадра
    useFrame(() => {
        if (!controlsRef.current) return;

        // Если двигаемся вручную
        if (isDragging.current) {
            // Применяем инерцию от мыши
            controlsRef.current.target.x -= velocity.current.x * 0.01;
            controlsRef.current.target.y += velocity.current.y * 0.01;
            controlsRef.current.update();
        }
        // Если отпустили и есть инерция
        else if (velocity.current.length() > 0.01) {
            // Постепенно замедляемся
            velocity.current.multiplyScalar(0.92);

            controlsRef.current.target.x -= velocity.current.x * 0.01;
            controlsRef.current.target.y += velocity.current.y * 0.01;
            controlsRef.current.update();

            // Если почти остановились - начинаем прилипать
            if (velocity.current.length() < 0.1) {
                const nearest = findNearestTarget(camera.position);
                setTargetPosition(nearest.position);
                setCurrentTargetIndex(nearest.index);
                onTargetChange?.(nearest.index);
                velocity.current.set(0, 0);
            }
        }
        // Если есть цель для прилипания
        else if (targetPosition && !isMoving) {
            smoothMoveToTarget(new Vector3(targetPosition.x, targetPosition.y, camera.position.z), 0.05);

            // Если достаточно близко к цели - считаем что "прилипли"
            const distance = camera.position.distanceTo(
                new Vector3(targetPosition.x, targetPosition.y, camera.position.z)
            );

            if (distance < 0.1) {
                setTargetPosition(null);
            }
        }
    });

    // Инициализация - находим ближайшую плитку при загрузке
    useEffect(() => {
        if (targets.length > 0) {
            const nearest = findNearestTarget(camera.position);
            setCurrentTargetIndex(nearest.index);
            onTargetChange?.(nearest.index);

            // Плавно двигаемся к ней
            setTimeout(() => {
                setTargetPosition(nearest.position);
            }, 500);
        }
    }, [targets]);

    return (
        <OrbitControls
            ref={controlsRef}
            enableRotate={true}
            enableZoom={true}
            enablePan={true}
            zoomSpeed={0.5}
            panSpeed={0.8}
            minDistance={5}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            // Отключаем стандартные события - обрабатываем сами
            mouseButtons={{
                LEFT: 0, // Отключаем левую кнопку
                MIDDLE: 0,
                RIGHT: 0
            }}
        />
    );
}