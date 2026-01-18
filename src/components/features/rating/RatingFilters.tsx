'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Filter, SortAsc, SortDesc, Calendar, Trophy, Target, Zap } from 'lucide-react';

interface RatingFiltersProps {
    selectedPeriod: 'week' | 'month' | 'all';
    onPeriodChange: (period: 'week' | 'month' | 'all') => void;
    sortBy: 'points' | 'tasks' | 'streak' | 'joined';
    onSortChange: (sort: 'points' | 'tasks' | 'streak' | 'joined') => void;
    sortOrder: 'asc' | 'desc';
    onSortOrderChange: (order: 'asc' | 'desc') => void;
    levelFilter: string;
    onLevelFilterChange: (level: string) => void;
}

export default function RatingFilters({
    selectedPeriod,
    onPeriodChange,
    sortBy,
    onSortChange,
    sortOrder,
    onSortOrderChange,
    levelFilter,
    onLevelFilterChange
}: RatingFiltersProps) {
    const filtersRef = useRef<HTMLDivElement>(null);

    const levels = ['Все уровни', 'Легенда', 'Мастер', 'Эксперт', 'Продвинутый', 'Средний'];
    
    const sortOptions = [
        { value: 'points', label: 'По очкам', icon: Trophy },
        { value: 'tasks', label: 'По заданиям', icon: Target },
        { value: 'streak', label: 'По серии', icon: Zap },
        { value: 'joined', label: 'По дате', icon: Calendar }
    ];

    useGSAP(() => {
        if (filtersRef.current) {
            const filterGroups = filtersRef.current.querySelectorAll('.filter-group');
            gsap.set(filterGroups, { opacity: 0, y: -10 });
            
            gsap.to(filterGroups, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }
    }, { dependencies: [] });

    return (
        <div ref={filtersRef} className="max-w-6xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-6">
                    <Filter className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Фильтры и сортировка</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Период */}
                    <div className="filter-group">
                        <label className="block text-sm font-medium text-gray-300 mb-3">Период</label>
                        <div className="space-y-2">
                            {(['week', 'month', 'all'] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => onPeriodChange(period)}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 border text-left ${
                                        selectedPeriod === period
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                            : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                    }`}
                                >
                                    {period === 'week' && 'За неделю'}
                                    {period === 'month' && 'За месяц'}
                                    {period === 'all' && 'За все время'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Сортировка */}
                    <div className="filter-group">
                        <label className="block text-sm font-medium text-gray-300 mb-3">Сортировать</label>
                        <div className="space-y-2">
                            {sortOptions.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => onSortChange(option.value as any)}
                                        className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 border text-left flex items-center space-x-2 ${
                                            sortBy === option.value
                                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                                : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                        }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span>{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Порядок сортировки */}
                    <div className="filter-group">
                        <label className="block text-sm font-medium text-gray-300 mb-3">Порядок</label>
                        <div className="space-y-2">
                            <button
                                onClick={() => onSortOrderChange('desc')}
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 border text-left flex items-center space-x-2 ${
                                    sortOrder === 'desc'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                        : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                }`}
                            >
                                <SortDesc className="w-4 h-4" />
                                <span>По убыванию</span>
                            </button>
                            <button
                                onClick={() => onSortOrderChange('asc')}
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 border text-left flex items-center space-x-2 ${
                                    sortOrder === 'asc'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                        : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                }`}
                            >
                                <SortAsc className="w-4 h-4" />
                                <span>По возрастанию</span>
                            </button>
                        </div>
                    </div>

                    {/* Уровень */}
                    <div className="filter-group">
                        <label className="block text-sm font-medium text-gray-300 mb-3">Уровень</label>
                        <div className="space-y-2">
                            {levels.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => onLevelFilterChange(level)}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 border text-left ${
                                        levelFilter === level
                                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                                            : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}