'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TaskListItem from './TaskListItem';
import { Task } from '@/hooks/useTasks';
import { UserTask } from '@/hooks/useUserTasks';

interface TaskWithUserData extends Task {
    userTask?: UserTask;
}

interface TasksListProps {
    tasks: TaskWithUserData[];
}

export default function TasksList({ tasks }: TasksListProps) {
    const tasksListRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (tasksListRef.current) {
            const listItems = Array.from(tasksListRef.current.children) as HTMLElement[];
            if (listItems.length > 0) {
                gsap.set(listItems, { opacity: 0, x: -20 });

                gsap.to(listItems, {
                    opacity: 1,
                    x: 0,
                    duration: 0.2,
                    stagger: 0.02,
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
        <div ref={tasksListRef} className="space-y-4">
            {tasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
            ))}
        </div>
    );
}