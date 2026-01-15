// 3DDock/TaskBoard3D.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, SoftShadows } from '@react-three/drei';
import Level, { LevelRef } from './Level';
import { DigitalRainBackground } from './DigitalRainBackground';
import { SnapOrbitControls } from './SnapOrbitControls';
import { useRef, useState, useCallback } from 'react';
import { Vector3 } from 'three';

interface Task {
    id: string;
    title: string;
    color?: string;
    description?: string;
}

export default function TasksBoardPage() {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskPositions, setTaskPositions] = useState<Vector3[]>([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const levelRef = useRef<LevelRef>(null);

    const tasks: Task[] = [
        { id: '1', title: 'Анализ данных', color: '#4CAF50', description: 'Анализ метрик продукта' },
        { id: '2', title: 'Дизайн UI', color: '#FFC107', description: 'Новый дизайн интерфейса' },
        { id: '3', title: 'Разработка API', color: '#F44336', description: 'Бэкенд для мобильного приложения' },
        { id: '4', title: 'Тестирование', color: '#2196F3', description: 'Автоматические тесты' },
        { id: '5', title: 'Деплой', color: '#9C27B0', description: 'Выпуск новой версии' },
        { id: '6', title: 'Документация', color: '#00BCD4', description: 'Обновление документации' },
        { id: '7', title: 'Оптимизация', color: '#8BC34A', description: 'Улучшение производительности' },
        { id: '8', title: 'Безопасность', color: '#FF9800', description: 'Аудит безопасности' },
        { id: '9', title: 'Мониторинг', color: '#E91E63', description: 'Настройка алертов' },
        { id: '10', title: 'Миграция', color: '#3F51B5', description: 'Перенос на новый сервер' },
        { id: '11', title: 'Резервное копирование', color: '#009688', description: 'Настройка backup системы' },
    ];

    // Когда позиции плиток готовы
    const handleTaskPositionsReady = useCallback((positions: Vector3[]) => {
        setTaskPositions(positions);
    }, []);

    // Когда контролы меняют активную плитку
    const handleTargetChange = useCallback((index: number) => {
        setCurrentTaskIndex(index);
        const task = tasks[index];
        setSelectedTask(task);
    }, [tasks]);

    // Клик по плитке
    const handleTaskClick = useCallback((task: Task) => {
        setSelectedTask(task);
        const index = tasks.findIndex(t => t.id === task.id);
        setCurrentTaskIndex(index);
    }, [tasks]);

    // Кнопка для перехода к следующей плитке
    const goToNextTask = () => {
        const nextIndex = (currentTaskIndex + 1) % tasks.length;
        handleTargetChange(nextIndex);
    };

    // Кнопка для перехода к предыдущей плитке
    const goToPrevTask = () => {
        const prevIndex = (currentTaskIndex - 1 + tasks.length) % tasks.length;
        handleTargetChange(prevIndex);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Canvas
                shadows
                camera={{
                    position: [0, 0, 15],
                    fov: 50,
                    near: 0.1,
                    far: 1000,
                }}
            >
                <color attach="background" args={['#0a0a0f']} />

                {/* Освещение */}
                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* Мягкие тени */}
                <SoftShadows />

                {/* Фон */}
                {/*<DigitalRainBackground />*/}

                {/* Доска с задачами */}
                <Level
                    ref={levelRef}
                    tasks={tasks}
                    onTaskClick={handleTaskClick}
                    onTaskPositionsReady={handleTaskPositionsReady}
                    selectedTaskId={selectedTask?.id}
                />

                {/* Кастомные контролы с эффектом прилипания */}
                {taskPositions.length > 0 && (
                    <SnapOrbitControls
                        targets={taskPositions}
                        onTargetChange={handleTargetChange}
                        snapDistance={1.5}
                    />
                )}

                {/* Окружение */}
                <Environment preset="city" />
            </Canvas>

            {/* UI панель */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                maxWidth: '300px',
            }}>
                <h3 style={{ margin: '0 0 8px 0' }}>3D Доска с Прилипанием</h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
                    Перетащите для перемещения • Отпустите для прилипания
                </p>
                <p style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
                    Автоматически центрируется на плитках
                </p>
            </div>

            {/* Кнопки навигации */}
            <div style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                display: 'flex',
                gap: '12px',
            }}>
                <button
                    onClick={goToPrevTask}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    ←
                </button>
                <button
                    onClick={goToNextTask}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    →
                </button>
            </div>

            {/* Индикатор текущей плитки */}
            {selectedTask && (
                <div style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${selectedTask.color}`,
                    minWidth: '300px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: selectedTask.color,
                        }} />
                        <h3 style={{ margin: 0, color: 'white' }}>
                            {selectedTask.title}
                        </h3>
                        <div style={{
                            padding: '4px 12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            fontSize: '12px',
                        }}>
                            {currentTaskIndex + 1} / {tasks.length}
                        </div>
                    </div>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                        {selectedTask.description}
                    </p>
                </div>
            )}

            {/* Подсказка по управлению */}
            <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#888',
                textAlign: 'center',
            }}>
                <div>Мышь: Перемещение</div>
                <div>Колесо: Зум</div>
                <div>Клик: Выбор плитки</div>
            </div>
        </div>
    );
}