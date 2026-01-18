'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TaskCard from './TaskCard';
import { Task } from '@/hooks/useTasks';
import { UserTask } from '@/hooks/useUserTasks';

interface TaskWithUserData extends Task {
    userTask?: UserTask;
}

interface TasksGridProps {
    tasks: TaskWithUserData[];
}

export default function TasksGrid({ tasks }: TasksGridProps) {
    const tasksGridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (tasksGridRef.current) {
            const taskCards = Array.from(tasksGridRef.current.children) as HTMLElement[];
            if (taskCards.length > 0) {
                gsap.set(taskCards, { opacity: 0, y: 15 });

                gsap.to(taskCards, {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    stagger: 0.015,
                    ease: 'power2.out',
                });
            }
        }
    }, { dependencies: [tasks] });

    if (tasks.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 text-xl">Задания не найдены</p>
            </div>
        );
    }

    return (
        <div ref={tasksGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}