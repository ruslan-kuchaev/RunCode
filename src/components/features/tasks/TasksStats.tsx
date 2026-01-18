'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Task } from '@/hooks/useTasks';
import { UserTask } from '@/hooks/useUserTasks';

interface TaskWithUserData extends Task {
    userTask?: UserTask;
}

interface TasksStatsProps {
    tasks: TaskWithUserData[];
}

export default function TasksStats({ tasks }: TasksStatsProps) {
    const statsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (statsRef.current) {
            const statCards = statsRef.current.querySelectorAll('div[class*="bg-gradient"]');
            gsap.set(statCards, { opacity: 0, y: 10 });

            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            tl.to(statsRef.current, {
                opacity: 1,
                duration: 0.15,
            }, '-=0.05');

            tl.to(statCards, {
                opacity: 1,
                y: 0,
                duration: 0.15,
                stagger: 0.02,
            }, '-=0.1');
        }
    }, []);

    const totalTasks = tasks.length;
    const solvedTasks = tasks.filter((t) => t.userTask?.status === 'SOLVED').length;
    const inProgressTasks = tasks.filter((t) => t.userTask?.status === 'STARTED').length;
    const earnedPoints = tasks.reduce((sum, t) => sum + (t.userTask?.status === 'SOLVED' ? t.price : 0), 0);

    return (
        <div ref={statsRef} className="max-w-6xl mx-auto mt-16" style={{ opacity: 0 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                    <div className="text-3xl font-bold text-white mb-2">{totalTasks}</div>
                    <div className="text-sm text-gray-400">Всего заданий</div>
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                    <div className="text-3xl font-bold text-white mb-2">{solvedTasks}</div>
                    <div className="text-sm text-gray-400">Решено</div>
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                    <div className="text-3xl font-bold text-white mb-2">{inProgressTasks}</div>
                    <div className="text-sm text-gray-400">В процессе</div>
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                    <div className="text-3xl font-bold text-white mb-2">{earnedPoints}</div>
                    <div className="text-sm text-gray-400">Заработано очков</div>
                </div>
            </div>
        </div>
    );
}