'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import Level from './Level';
import {DigitalRainBackground} from './DigitalRainBackground';

interface Task {
    id: string;
    title: string;
    color?: string;
}

const TaskBoard3D = () => {
    const tasks: Task[] = [
        { id: '1', title: 'Задача 1', color: '#4CAF50' },
        { id: '2', title: 'Задача 2', color: '#FFC107' },
        { id: '3', title: 'Задача 3', color: '#F44336' },
        { id: '4', title: 'Задача 4', color: '#2196F3' },
        { id: '5', title: 'Задача 5', color: '#9C27B0' },
        { id: '6', title: 'Задача 6', color: '#00BCD4' },
        { id: '7', title: 'Задача 7', color: '#8BC34A' },
        { id: '8', title: 'Задача 8', color: '#FF9800' },
    ];

    return <Level tasks={tasks} />;
};

export default function TasksBoardPage() {


    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas
                orthographic // ВАЖНО: ортографическая камера для 2D
                camera={{
                    position: [0, 0, 100], // Z для ортографической камеры
                    zoom: 50,
                    near: 0.1,
                    far: 1000,
                }}
            >
                <color attach="background" args={['#f8f9fa']} />

                {/* Свет не нужен для 2D, но пусть будет */}
                <ambientLight intensity={0} />
                <DigitalRainBackground />
                <TaskBoard3D />

                {/* Ортографическая камера */}
                <OrthographicCamera
                    makeDefault
                    position={[0, 0, 2]}
                    zoom={350}
                />

                {/* Контролы ТОЛЬКО для 2D навигации */}
                <OrbitControls

                    enableRotate={false} // ВАЖНО: отключаем вращение
                    enableZoom={true}    // Можно зумировать
                    enablePan={true}     // Можно перемещать
                    zoomSpeed={0.5}
                    panSpeed={0.8}
                    minZoom={5}         // Минимальный зум
                    maxZoom={350}        // Максимальный зум
                    screenSpacePanning={true} // Панорамирование в экранных координатах
                    maxPolarAngle={Math.PI / 2} // Не даем смотреть сверху/снизу
                    minPolarAngle={Math.PI / 2} // Фиксируем угол сверху
                    maxAzimuthAngle={Infinity}  // Бесконечный поворот по горизонтали
                    minAzimuthAngle={-Infinity} // Бесконечный поворот по горизонтали
                />
            </Canvas>



        </div>
    );
}