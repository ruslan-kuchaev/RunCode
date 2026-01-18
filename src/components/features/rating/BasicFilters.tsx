'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface BasicFiltersProps {
    selectedPeriod: 'week' | 'month' | 'all';
    onPeriodChange: (period: 'week' | 'month' | 'all') => void;
    showAdvancedFilters: boolean;
    onToggleAdvancedFilters: () => void;
}

export default function BasicFilters({
    selectedPeriod,
    onPeriodChange,
    showAdvancedFilters,
    onToggleAdvancedFilters
}: BasicFiltersProps) {
    const filtersRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (filtersRef.current) {
            const filterButtons = filtersRef.current.querySelectorAll('button');
            gsap.set(filterButtons, { opacity: 0, scale: 0.95 });
            
            const tl = gsap.timeline();
            tl.to(filtersRef.current, { opacity: 1, duration: 0.3 })
              .to(filterButtons, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.3,
                  stagger: 0.05,
              }, '-=0.2');
        }
    }, []);

    return (
        <div ref={filtersRef} className="max-w-4xl mx-auto mb-8" style={{ opacity: 0 }}>
            <div className="flex flex-wrap gap-4 justify-center items-center">
                <div className="flex gap-2">
                    {(['week', 'month', 'all'] as const).map((period) => (
                        <button
                            key={period}
                            onClick={() => onPeriodChange(period)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border ${
                                selectedPeriod === period
                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 scale-105'
                                    : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                            }`}
                        >
                            {period === 'week' && 'За неделю'}
                            {period === 'month' && 'За месяц'}
                            {period === 'all' && 'За все время'}
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={onToggleAdvancedFilters}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border flex items-center space-x-2 ${
                        showAdvancedFilters
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                            : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                    }`}
                >
                    <span>Расширенные фильтры</span>
                    <span className={`transform transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>
            </div>
        </div>
    );
}