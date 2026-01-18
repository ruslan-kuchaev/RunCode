'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface LearningData {
    totalHours: number;
    weeklyGoal: number;
    currentWeekHours: number;
    dailyActivity: { date: string; hours: number; tasks: number }[];
    monthlyProgress: { month: string; tasks: number; hours: number }[];
}

interface LearningProgressProps {
    data: LearningData;
}

export default function LearningProgress({ data }: LearningProgressProps) {
    const progressRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    const weeklyProgress = (data.currentWeekHours / data.weeklyGoal) * 100;
    const maxMonthlyTasks = Math.max(...data.monthlyProgress.map(m => m.tasks));
    const maxMonthlyHours = Math.max(...data.monthlyProgress.map(m => m.hours));

    useGSAP(() => {
        if (!progressRef.current) return;

        const progressCards = progressRef.current.querySelectorAll('.progress-card');
        
        gsap.set(progressCards, { opacity: 0, x: -30 });

        ScrollTrigger.create({
            trigger: progressRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                gsap.to(progressCards, {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                });

                // Анимация прогресс-бара
                const progressBar = progressRef.current?.querySelector('.progress-bar');
                if (progressBar) {
                    gsap.fromTo(progressBar, 
                        { width: '0%' },
                        { width: `${Math.min(weeklyProgress, 100)}%`, duration: 1.5, ease: 'power2.out', delay: 0.5 }
                    );
                }
            },
            onLeaveBack: () => {
                gsap.to(progressCards, {
                    opacity: 0,
                    x: -30,
                    duration: 0.4,
                    ease: 'power2.in',
                });
            }
        });

        // Анимация графика
        if (chartRef.current) {
            const bars = chartRef.current.querySelectorAll('.chart-bar');
            
            ScrollTrigger.create({
                trigger: chartRef.current,
                start: 'top 85%',
                onEnter: () => {
                    gsap.fromTo(bars,
                        { scaleY: 0, transformOrigin: 'bottom' },
                        { scaleY: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.3 }
                    );
                },
                onLeaveBack: () => {
                    gsap.to(bars, {
                        scaleY: 0,
                        duration: 0.4,
                        ease: 'power2.in',
                    });
                }
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && (progressRef.current?.contains(trigger.trigger) || chartRef.current?.contains(trigger.trigger))) {
                    trigger.kill();
                }
            });
        };
    }, { dependencies: [data.currentWeekHours, data.weeklyGoal] });

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">📈 Прогресс обучения</h2>
            
            {/* Weekly Progress */}
            <div ref={progressRef} className="space-y-6">
                <div className="progress-card bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <Target className="w-5 h-5 text-cyan-400" />
                            <span>Недельная цель</span>
                        </h3>
                        <span className="text-sm text-gray-400">
                            {data.currentWeekHours} / {data.weeklyGoal} часов
                        </span>
                    </div>
                    
                    <div className="relative">
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                            <div 
                                className="progress-bar bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: '0%' }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-400">0 ч</span>
                            <span className={`font-medium ${weeklyProgress >= 100 ? 'text-green-400' : 'text-cyan-400'}`}>
                                {weeklyProgress.toFixed(0)}%
                            </span>
                            <span className="text-gray-400">{data.weeklyGoal} ч</span>
                        </div>
                    </div>
                    
                    {weeklyProgress >= 100 && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-400 text-sm font-medium">🎉 Недельная цель достигнута!</p>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="progress-card bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                            <Clock className="w-8 h-8 text-blue-400" />
                            <div>
                                <div className="text-2xl font-bold text-blue-400">{data.totalHours}</div>
                                <div className="text-sm text-gray-400">Всего часов</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="progress-card bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                            <BookOpen className="w-8 h-8 text-green-400" />
                            <div>
                                <div className="text-2xl font-bold text-green-400">
                                    {data.monthlyProgress[data.monthlyProgress.length - 1]?.tasks || 0}
                                </div>
                                <div className="text-sm text-gray-400">Заданий в месяце</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="progress-card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                            <TrendingUp className="w-8 h-8 text-purple-400" />
                            <div>
                                <div className="text-2xl font-bold text-purple-400">
                                    {(data.currentWeekHours / 7).toFixed(1)}
                                </div>
                                <div className="text-sm text-gray-400">Часов в день</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Progress Chart */}
            <div ref={chartRef} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Прогресс по месяцам</h3>
                
                <div className="space-y-6">
                    {/* Tasks Chart */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Решенные задания</h4>
                        <div className="flex items-end space-x-3 h-32">
                            {data.monthlyProgress.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div className="w-full bg-gray-700/30 rounded-t relative overflow-hidden" style={{ height: '100px' }}>
                                        <div 
                                            className="chart-bar absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t transition-all duration-300"
                                            style={{ height: `${(month.tasks / maxMonthlyTasks) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <div className="text-sm font-medium text-green-400">{month.tasks}</div>
                                        <div className="text-xs text-gray-500">{month.month}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hours Chart */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Часы обучения</h4>
                        <div className="flex items-end space-x-3 h-32">
                            {data.monthlyProgress.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div className="w-full bg-gray-700/30 rounded-t relative overflow-hidden" style={{ height: '100px' }}>
                                        <div 
                                            className="chart-bar absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-300"
                                            style={{ height: `${(month.hours / maxMonthlyHours) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <div className="text-sm font-medium text-blue-400">{month.hours}ч</div>
                                        <div className="text-xs text-gray-500">{month.month}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}