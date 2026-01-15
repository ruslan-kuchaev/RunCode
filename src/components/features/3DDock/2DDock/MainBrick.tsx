'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { BrickTask } from './BrickTask';

interface MainBrickProps {
    id: number;
    title: string;
    color: string;
    description: string;
    tasks: any[]; // Массив заданий для этого раздела
}

export const MainBrick = ({ id, title, color, description, tasks }: MainBrickProps) => {
    const brickRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showTasks, setShowTasks] = useState(false);

    const handleClick = () => {
        // Если уже развернут - возвращаем обратно
        if (isExpanded) {
            handleClose();
            return;
        }

        setIsExpanded(true);

        // Получаем все остальные кирпичи
        const otherBricks = document.querySelectorAll('.main-brick:not(.active)');

        // Анимация остальных кирпичей (улетают вправо и растворяются)
        otherBricks.forEach((brick, idx) => {
            const rect = (brick as HTMLElement).getBoundingClientRect();
            const distance = window.innerWidth - rect.left + 200; // Улетают за правый край экрана
            
            gsap.to(brick, {
                duration: 0.8,
                x: distance,
                opacity: 0,
                scale: 0.8,
                delay: idx * 0.1,
                ease: 'power2.in',
                onComplete: () => {
                    // Показываем задачи после того как все кирпичи скрылись
                    if (idx === otherBricks.length - 1) {
                        setShowTasks(true);
                    }
                }
            });
        });

        // Если нет других кирпичей, сразу показываем задачи
        if (otherBricks.length === 0) {
            setShowTasks(true);
        }
    };

    const handleClose = () => {
        // Скрываем задачи
        setShowTasks(false);

        // Возвращаем остальные кирпичи
        const otherBricks = document.querySelectorAll('.main-brick:not(.active)');
        gsap.to(otherBricks, {
            duration: 0.8,
            x: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            ease: 'power2.out',
            onComplete: () => {
                setIsExpanded(false);
            }
        });
    };

    return (
        <>
            <div
                ref={brickRef}
                className={`main-brick flex flex-col items-center justify-center rounded-xl shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 snap-center ${isExpanded ? 'active' : ''}`}
                style={{
                    width: 'clamp(280px, 80vw, 600px)',
                    height: 'clamp(280px, 80vw, 600px)',
                    minWidth: '280px',
                    minHeight: '280px',
                    backgroundColor: color,
                    flexShrink: 0
                }}
                onClick={handleClick}
            >
                <h2 className="brick-title text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-center px-4">
                    {title}
                </h2>
                <p className="brick-description text-white/90 text-sm md:text-base lg:text-lg opacity-0 translate-y-4 text-center max-w-md px-4">
                    {description}
                </p>
            </div>

            {/* Контейнер для задач - разбросанные как карты на столе */}
            {showTasks && (
                <div className="fixed inset-0 z-40 pt-[180px] pb-8 px-8 overflow-auto">
                    <div className="relative w-full h-full min-h-[calc(100vh-180px)]">
                        {tasks.map((task, index) => (
                            <BrickTask key={task.id} task={task} index={index} totalTasks={tasks.length} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};