'use client';

import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface Task {
    id: number;
    title: string;
    shortDescription: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
    price: number;
    preview?: string;
    language?: {
        name: string;
        icon: string;
    };
    userTask?: {
        status: 'STARTED' | 'SOLVED' | 'UNFINISHED';
    };
}

interface BrickTaskProps {
    task: Task;
    index: number;
    totalTasks: number;
}

export const BrickTask = ({ task, index, totalTasks }: BrickTaskProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Генерируем случайные позиции и повороты для эффекта разбросанных карт
    const position = useMemo(() => {
        // Используем индекс для детерминированности, но добавляем случайность
        const seed = task.id * 1000 + index;
        const random = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        // Позиция по X (0-90% ширины контейнера)
        const xPercent = random(seed) * 90;
        // Позиция по Y (0-85% высоты контейнера)
        const yPercent = random(seed * 2) * 85;
        // Поворот (-15 до +15 градусов)
        const rotation = (random(seed * 3) - 0.5) * 30;
        // Небольшой масштаб для вариации (0.9-1.1)
        const scale = 0.9 + random(seed * 4) * 0.2;

        return { xPercent, yPercent, rotation, scale };
    }, [task.id, index]);

    useEffect(() => {
        if (!cardRef.current) return;

        const { xPercent, yPercent, rotation, scale } = position;

        // Устанавливаем абсолютное позиционирование
        gsap.set(cardRef.current, {
            position: 'absolute',
            left: `${xPercent}%`,
            top: `${yPercent}%`,
            transformOrigin: 'center center',
            width: '320px',
            maxWidth: '90vw'
        });

        // Начальное состояние - карта невидима и смещена
        gsap.set(cardRef.current, {
            opacity: 0,
            y: 100,
            rotation: rotation - 20,
            scale: 0.5
        });

        // Анимация появления как карты на столе
        gsap.to(cardRef.current, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            rotation: rotation,
            scale: scale,
            delay: index * 0.08 + 0.4,
            ease: 'back.out(1.4)'
        });
    }, [index, task.id]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return 'bg-green-500';
            case 'MEDIUM': return 'bg-yellow-500';
            case 'HARD': return 'bg-orange-500';
            case 'EXPERT': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'SOLVED': return 'bg-green-100 text-green-800';
            case 'STARTED': return 'bg-blue-100 text-blue-800';
            case 'UNFINISHED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            ref={cardRef}
            className="bg-white rounded-xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300 cursor-pointer hover:z-50"
            style={{
                transformStyle: 'preserve-3d'
            }}
            onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.3,
                    scale: 1.05,
                    rotation: 0,
                    y: -10,
                    z: 50,
                    ease: 'power2.out'
                });
            }}
            onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.3,
                    scale: position.scale,
                    rotation: position.rotation,
                    y: 0,
                    z: 0,
                    ease: 'power2.out'
                });
            }}
        >
            {/* Заголовок и сложность */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                    {task.title}
                </h3>
                <span className={`${getDifficultyColor(task.difficulty)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
          {task.difficulty}
        </span>
            </div>

            {/* Описание */}
            <p className="text-gray-600 mb-4 line-clamp-2">
                {task.shortDescription}
            </p>

            {/* Язык и цена */}
            <div className="flex items-center justify-between mb-4">
                {task.language && (
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{task.language.icon}</span>
                        <span className="text-gray-700 font-medium">{task.language.name}</span>
                    </div>
                )}
                <div className="text-lg font-bold text-blue-600">
                    {task.price} <span className="text-sm">очков</span>
                </div>
            </div>

            {/* Статус */}
            {task.userTask && (
                <div className="mt-4">
          <span className={`${getStatusColor(task.userTask.status)} text-xs font-medium px-3 py-1 rounded-full`}>
            {task.userTask.status === 'SOLVED' ? '✅ Решено' :
                task.userTask.status === 'STARTED' ? '🔄 В процессе' : '❌ Не завершено'}
          </span>
                </div>
            )}

            {/* Кнопка начать/продолжить */}
            <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                {task.userTask?.status === 'STARTED' ? 'Продолжить →' : 'Начать задание'}
            </button>

            {/* Декоративные элементы */}
            <div className="absolute top-2 right-2 w-8 h-8 bg-blue-100 rounded-full opacity-20"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 bg-green-100 rounded-full opacity-20"></div>
        </div>
    );
};