'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
    Play, 
    Send, 
    ArrowLeft, 
    Clock, 
    Trophy, 
    Target,
    ChevronDown,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Task {
    id: number;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
    price: number;
    userTask?: {
        status: 'STARTED' | 'SOLVED' | 'UNFINISHED';
        startedAt: Date;
        attempts?: number; // Make attempts optional
    };
}

interface Language {
    id: number;
    name: string;
    icon: string;
    extension?: string; // Make extension optional
    monacoLanguage?: string; // Make monacoLanguage optional
}

interface TaskHeaderProps {
    task: Task;
    selectedLanguage: Language | null;
    availableLanguages: Language[];
    onLanguageChange: (language: Language) => void;
    onRunCode: () => void;
    onSubmit: () => void;
    isRunning: boolean;
}

const getDifficultyColor = (difficulty: Task['difficulty']) => {
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

const getDifficultyLabel = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
        case 'EASY': return 'Легко';
        case 'MEDIUM': return 'Средне';
        case 'HARD': return 'Сложно';
        case 'EXPERT': return 'Эксперт';
        default: return difficulty;
    }
};

export default function TaskHeader({
    task,
    selectedLanguage,
    availableLanguages,
    onLanguageChange,
    onRunCode,
    onSubmit,
    isRunning
}: TaskHeaderProps) {
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
        }
    }, []);

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
        <div ref={headerRef} className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left section */}
                <div className="flex items-center space-x-6">
                    <Link 
                        href="/tasks"
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад к заданиям</span>
                    </Link>

                    <div className="h-6 w-px bg-gray-600" />

                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-white">{task.title}</h1>
                        
                        <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getDifficultyColor(task.difficulty)}`}>
                            {getDifficultyLabel(task.difficulty)}
                        </span>

                        <div className="flex items-center space-x-1 text-yellow-400">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">{task.price} очков</span>
                        </div>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-4">
                    {/* Task stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{getElapsedTime()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{task.userTask?.attempts || 0} попыток</span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-gray-600" />

                    {/* Language selector */}
                    <div className="relative group">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 rounded-lg transition-all duration-200">
                            <span className="text-xl">{selectedLanguage?.icon}</span>
                            <span className="text-white font-medium">{selectedLanguage?.name}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            {availableLanguages.map((language) => (
                                <button
                                    key={language.id}
                                    onClick={() => onLanguageChange(language)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700/50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                                        selectedLanguage?.id === language.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                                    }`}
                                >
                                    <span className="text-xl">{language.icon}</span>
                                    <span className="font-medium">{language.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onRunCode}
                            disabled={isRunning}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isRunning ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            <span className="font-medium">Запустить</span>
                        </button>

                        <button
                            onClick={onSubmit}
                            disabled={isRunning}
                            className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                            <span className="font-medium">Отправить</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}