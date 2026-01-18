'use client';

import Link from 'next/link';
import { Task } from '@/hooks/useTasks';
import { UserTask } from '@/hooks/useUserTasks';

interface TaskWithUserData extends Task {
    userTask?: UserTask;
}

interface TaskListItemProps {
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

const getStatusColor = (status?: UserTask['status']) => {
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

const getStatusLabel = (status?: UserTask['status']) => {
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

export default function TaskListItem({ task }: TaskListItemProps) {
    return (
        <Link href={`/tasks/${task.id}`}>
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.005] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 task-card">
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                            {task.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`${getDifficultyColor(task.difficulty)} text-xs font-semibold px-3 py-1 rounded-full border`}
                            >
                                {getDifficultyLabel(task.difficulty)}
                            </span>
                            <div className="flex items-center space-x-2">
                                <span className="text-xl">{task.language.icon}</span>
                                <span className="text-gray-300 font-medium">{task.language.name}</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-400 mb-3">
                        {task.shortDescription}
                    </p>
                    {task.userTask && (
                        <span
                            className={`${getStatusColor(task.userTask.status)} text-xs font-medium px-3 py-1 rounded-full border inline-block`}
                        >
                            {getStatusLabel(task.userTask.status)}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-cyan-400 whitespace-nowrap">
                        {task.price} <span className="text-sm text-gray-400">очков</span>
                    </div>
                    <button className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 font-semibold py-2 px-4 rounded-lg border border-cyan-500/50 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500 transition-all duration-300">
                        {task.userTask?.status === 'STARTED' ? 'Продолжить →' : 'Начать'}
                    </button>
                </div>
            </div>
        </Link>
    );
}