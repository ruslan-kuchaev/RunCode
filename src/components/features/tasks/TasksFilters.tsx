'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LayoutDashboard, LayoutGrid, Menu } from "lucide-react";

type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
type LayoutType = "grid" | "list";

interface Language {
    id: number;
    name: string;
    icon: string;
}

interface TasksFiltersProps {
    selectedDifficulty: TaskDifficulty | 'ALL';
    onDifficultyChange: (difficulty: TaskDifficulty | 'ALL') => void;
    selectedLanguage: number | 'ALL';
    onLanguageChange: (languageId: number | 'ALL') => void;
    menuSelectedLayout: LayoutType;
    onLayoutChange: (layout: LayoutType) => void;
    languages: Language[];
}

const getDifficultyColor = (difficulty: TaskDifficulty) => {
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

const getDifficultyLabel = (difficulty: TaskDifficulty) => {
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

export default function TasksFilters({
    selectedDifficulty,
    onDifficultyChange,
    selectedLanguage,
    onLanguageChange,
    menuSelectedLayout,
    onLayoutChange,
    languages
}: TasksFiltersProps) {
    const filtersRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (filtersRef.current) {
            const filterButtons = filtersRef.current.querySelectorAll('button');
            gsap.set(filterButtons, { opacity: 0, scale: 0.95 });

            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            tl.to(filtersRef.current, {
                opacity: 1,
                duration: 0.15,
            }, '-=0.1');

            tl.to(filterButtons, {
                opacity: 1,
                scale: 1,
                duration: 0.15,
                stagger: 0.01,
            }, '-=0.1');
        }
    }, []);

    return (
        <div ref={filtersRef} className="max-w-6xl mx-auto mb-8" style={{ opacity: 0 }}>
            <div className="flex flex-wrap gap-6 justify-center">
                {/* Layout buttons */}
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => onLayoutChange("grid")}
                        className={`p-2 rounded-lg border transition-all duration-300 ${
                            menuSelectedLayout === "grid"
                                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                                : "bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50"
                        }`}
                    >
                        <LayoutGrid />
                    </button>

                    <button
                        onClick={() => onLayoutChange("list")}
                        className={`p-2 rounded-lg border transition-all duration-300 ${
                            menuSelectedLayout === "list"
                                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                                : "bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50"
                        }`}
                    >
                        <Menu />
                    </button>

                    <button
                        disabled
                        className="p-2 rounded-lg border bg-gray-900/50 text-gray-500 border-gray-800/50 cursor-not-allowed opacity-50"
                        title="В разработке"
                    >
                        <LayoutDashboard />
                    </button>
                </div>

                {/* Difficulty filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onDifficultyChange('ALL')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedDifficulty === 'ALL'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600/50'
                        }`}
                    >
                        Все
                    </button>
                    {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as TaskDifficulty[]).map((difficulty) => (
                        <button
                            key={difficulty}
                            onClick={() => onDifficultyChange(difficulty)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                                selectedDifficulty === difficulty
                                    ? `${getDifficultyColor(difficulty)} scale-105`
                                    : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                            }`}
                        >
                            {getDifficultyLabel(difficulty)}
                        </button>
                    ))}
                </div>

                {/* Language filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onLanguageChange('ALL')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedLanguage === 'ALL'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600/50'
                        }`}
                    >
                        Все языки
                    </button>
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => onLanguageChange(lang.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border flex items-center gap-2 ${
                                selectedLanguage === lang.id
                                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 scale-105'
                                    : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                            }`}
                        >
                            <span>{lang.icon}</span>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}