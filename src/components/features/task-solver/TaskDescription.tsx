'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BookOpen, Trophy, Clock, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Task {
    id: number;
    title: string;
    shortDescription: string;
    fullDescription: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
    price: number;
    userTask?: {
        status: 'STARTED' | 'SOLVED' | 'UNFINISHED';
        startedAt: Date;
        attempts?: number; // Make attempts optional
    };
}

interface TaskDescriptionProps {
    task: Task;
}

const getDifficultyColor = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
        case 'EASY':
            return 'text-green-400';
        case 'MEDIUM':
            return 'text-yellow-400';
        case 'HARD':
            return 'text-orange-400';
        case 'EXPERT':
            return 'text-red-400';
        default:
            return 'text-gray-400';
    }
};

const getDifficultyLabel = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
        case 'EASY': return 'Легко';
        case 'MEDIUM': return 'Средне';
        case 'HARD': return 'Сложно';
        case 'EXPERT': return 'Эксперт';
        default: return difficulty;
    }
};

export default function TaskDescription({ task }: TaskDescriptionProps) {
    const descriptionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (descriptionRef.current) {
            const elements = descriptionRef.current.querySelectorAll('.animate-item');
            gsap.set(elements, { opacity: 0, y: 20 });
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }
    }, [task.id]);

    const getElapsedTime = () => {
        if (!task.userTask?.startedAt) return '0 мин';
        
        const now = new Date();
        const start = new Date(task.userTask.startedAt);
        const diffInMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) return `${diffInMinutes} мин`;
        
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        return `${hours}ч ${minutes}м`;
    };

    return (
        <div ref={descriptionRef} className="h-full overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="animate-item">
                <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-semibold text-white">Описание задачи</h2>
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-3">{task.title}</h1>
                <p className="text-gray-300 leading-relaxed">{task.shortDescription}</p>
            </div>

            {/* Task stats */}
            <div className="animate-item grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                        <Target className={`w-4 h-4 ${getDifficultyColor(task.difficulty)}`} />
                        <span className="text-sm text-gray-400">Сложность</span>
                    </div>
                    <span className={`font-semibold ${getDifficultyColor(task.difficulty)}`}>
                        {getDifficultyLabel(task.difficulty)}
                    </span>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Награда</span>
                    </div>
                    <span className="font-semibold text-yellow-400">{task.price} очков</span>
                </div>

                {task.userTask && (
                    <>
                        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                            <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-400">Время</span>
                            </div>
                            <span className="font-semibold text-blue-400">{getElapsedTime()}</span>
                        </div>

                        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                            <div className="flex items-center space-x-2 mb-2">
                                <Target className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-gray-400">Попытки</span>
                            </div>
                            <span className="font-semibold text-purple-400">{task.userTask.attempts}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Status */}
            {task.userTask && (
                <div className="animate-item">
                    <div className={`p-4 rounded-lg border ${
                        task.userTask.status === 'SOLVED' 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : task.userTask.status === 'STARTED'
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-orange-500/10 border-orange-500/30'
                    }`}>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                                task.userTask.status === 'SOLVED' 
                                    ? 'bg-green-400' 
                                    : task.userTask.status === 'STARTED'
                                    ? 'bg-blue-400'
                                    : 'bg-orange-400'
                            }`} />
                            <span className={`font-medium ${
                                task.userTask.status === 'SOLVED' 
                                    ? 'text-green-400' 
                                    : task.userTask.status === 'STARTED'
                                    ? 'text-blue-400'
                                    : 'text-orange-400'
                            }`}>
                                {task.userTask.status === 'SOLVED' && 'Задача решена'}
                                {task.userTask.status === 'STARTED' && 'В процессе решения'}
                                {task.userTask.status === 'UNFINISHED' && 'Не завершено'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Full description */}
            <div className="animate-item">
                <div className="prose prose-invert prose-cyan max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: (props: any) => (
                                <h1 className="text-2xl font-bold text-white mb-4 mt-6">{props.children}</h1>
                            ),
                            h2: (props: any) => (
                                <h2 className="text-xl font-semibold text-white mb-3 mt-5">{props.children}</h2>
                            ),
                            h3: (props: any) => (
                                <h3 className="text-lg font-medium text-white mb-2 mt-4">{props.children}</h3>
                            ),
                            p: (props: any) => (
                                <p className="text-gray-300 leading-relaxed mb-4">{props.children}</p>
                            ),
                            ul: (props: any) => (
                                <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">{props.children}</ul>
                            ),
                            ol: (props: any) => (
                                <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-4">{props.children}</ol>
                            ),
                            li: (props: any) => (
                                <li className="text-gray-300">{props.children}</li>
                            ),
                            code: (props: any) => {
                                const isInline = !props.className;
                                if (isInline) {
                                    return (
                                        <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded text-sm font-mono">
                                            {props.children}
                                        </code>
                                    );
                                }
                                return (
                                    <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4">
                                        <code className="text-gray-300 text-sm font-mono">{props.children}</code>
                                    </pre>
                                );
                            },
                            pre: (props: any) => (
                                <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4">
                                    {props.children}
                                </pre>
                            ),
                            blockquote: (props: any) => (
                                <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-500/5 text-gray-300 italic mb-4">
                                    {props.children}
                                </blockquote>
                            ),
                            strong: (props: any) => (
                                <strong className="text-white font-semibold">{props.children}</strong>
                            ),
                            em: (props: any) => (
                                <em className="text-cyan-400 italic">{props.children}</em>
                            ),
                        }}
                    >
                        {task.fullDescription}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Tips */}
            <div className="animate-item">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-semibold mb-2">💡 Совет</h3>
                    <p className="text-blue-300 text-sm">
                        Используйте Ctrl+Enter для быстрого запуска кода и Ctrl+S для сохранения прогресса.
                    </p>
                </div>
            </div>
        </div>
    );
}