'use client';

import Link from 'next/link';
import { Task } from '@/hooks/useTasks';
import { UserTask } from '@/hooks/useUserTasks';

interface TaskWithUserData extends Task {
    userTask?: UserTask;
}

interface TaskCardProps {
    task: TaskWithUserData;
}

const getDifficultyColor = (difficulty: TaskWithUserData['difficulty']) => {
    switch (difficulty) {
        case 'EASY':
            return 'bg-green-500/20 text-green-400 border-green-500/50';
        case 'MEDIUM':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
        case 'HARD':
            return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
        case 'EXPERT':
            return 'bg-red-500/20 text-red-400 border-red-500/50';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
};

const getDifficultyLabel = (difficulty: TaskWithUserData['difficulty']) => {
    switch (difficulty) {
        case 'EASY':
            return 'Легко';
        case 'MEDIUM':
            return 'Средне';
        case 'HARD':
            return 'Сложно';
        case 'EXPERT':
            return 'Эксперт';
        default:
            return difficulty;
    }
};

const getStatusColor = (status?: string) => {
    switch (status) {
        case 'SOLVED':
            return 'bg-green-500/20 text-green-400 border-green-500/50';
        case 'STARTED':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
        case 'UNFINISHED':
            return 'bg-red-500/20 text-red-400 border-red-500/50';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
};

const getStatusLabel = (status?: string) => {
    switch (status) {
        case 'SOLVED':
            return '✅ Решено';
        case 'STARTED':
            return '🔄 В процессе';
        case 'UNFINISHED':
            return '❌ Не завершено';
        default:
            return 'Новое';
    }
};

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <Link href={`/tasks/${task.id}`}>
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer task-card">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 flex-1 pr-2">
                        {task.title}
                    </h3>
                    <span
                        className={`${getDifficultyColor(task.difficulty)} text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap`}
                    >
                        {getDifficultyLabel(task.difficulty)}
                    </span>
                </div>

                <p className="text-gray-400 mb-4 line-clamp-2 min-h-[3rem]">
                    {task.shortDescription}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{task.language.icon}</span>
                        <span className="text-gray-300 font-medium">{task.language.name}</span>
                    </div>
                    <div className="text-lg font-bold text-cyan-400">
                        {task.price} <span className="text-sm text-gray-400">очков</span>
                    </div>
                </div>

                {task.userTask && (
                    <div className="mb-4">
                        <span
                            className={`${getStatusColor(task.userTask.status)} text-xs font-medium px-3 py-1 rounded-full border inline-block`}
                        >
                            {getStatusLabel(task.userTask.status)}
                        </span>
                    </div>
                )}

                <button className="w-full mt-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 font-semibold py-3 rounded-lg border border-cyan-500/50 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                    {task.userTask?.status === 'STARTED' ? 'Продолжить задание' : 'Начать задание'}
                </button>

                <div className="absolute top-2 right-2 w-8 h-8 bg-cyan-500/10 rounded-full opacity-50 blur-sm pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 bg-blue-500/10 rounded-full opacity-50 blur-sm pointer-events-none"></div>
            </div>
        </Link>
    );
}