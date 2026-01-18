'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Calendar, Flame } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface DailyActivity {
    date: string;
    hours: number;
    tasks: number;
}

interface ActivityCalendarProps {
    data: DailyActivity[];
}

export default function ActivityCalendar({ data }: ActivityCalendarProps) {
    const calendarRef = useRef<HTMLDivElement>(null);

    // Генерируем данные для календаря (последние 12 недель)
    const generateCalendarData = () => {
        const weeks = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 83); // 12 недель назад

        for (let week = 0; week < 12; week++) {
            const weekData = [];
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);
                
                const dateString = currentDate.toISOString().split('T')[0];
                const activityData = data.find(d => d.date === dateString);
                
                weekData.push({
                    date: currentDate,
                    hours: activityData?.hours || 0,
                    tasks: activityData?.tasks || 0,
                    intensity: getIntensity(activityData?.hours || 0),
                });
            }
            weeks.push(weekData);
        }
        return weeks;
    };

    const getIntensity = (hours: number): number => {
        if (hours === 0) return 0;
        if (hours < 1) return 1;
        if (hours < 2) return 2;
        if (hours < 3) return 3;
        return 4;
    };

    const getIntensityColor = (intensity: number): string => {
        switch (intensity) {
            case 0: return 'bg-gray-800/50';
            case 1: return 'bg-cyan-500/20';
            case 2: return 'bg-cyan-500/40';
            case 3: return 'bg-cyan-500/60';
            case 4: return 'bg-cyan-500/80';
            default: return 'bg-gray-800/50';
        }
    };

    const weeks = generateCalendarData();
    const totalDays = weeks.flat().length;
    const activeDays = weeks.flat().filter(day => day.hours > 0).length;
    const totalHours = weeks.flat().reduce((sum, day) => sum + day.hours, 0);
    const currentStreak = calculateCurrentStreak(weeks.flat());

    useGSAP(() => {
        if (!calendarRef.current) return;

        const calendarCells = calendarRef.current.querySelectorAll('.calendar-cell');
        
        gsap.set(calendarCells, { opacity: 0, scale: 0 });

        ScrollTrigger.create({
            trigger: calendarRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                gsap.to(calendarCells, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.05,
                    stagger: {
                        amount: 1.5,
                        from: 'start',
                    },
                    ease: 'back.out(1.7)',
                });
            },
            onLeaveBack: () => {
                gsap.to(calendarCells, {
                    opacity: 0,
                    scale: 0,
                    duration: 0.02,
                    stagger: {
                        amount: 0.5,
                        from: 'end',
                    },
                    ease: 'power2.in',
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && calendarRef.current?.contains(trigger.trigger)) {
                    trigger.kill();
                }
            });
        };
    }, { dependencies: [data.length] });

    return (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span>Календарь активности</span>
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Меньше</span>
                    <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4].map(intensity => (
                            <div
                                key={intensity}
                                className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
                            />
                        ))}
                    </div>
                    <span>Больше</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{activeDays}</div>
                    <div className="text-sm text-gray-400">Активных дней</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{totalHours.toFixed(1)}ч</div>
                    <div className="text-sm text-gray-400">Всего часов</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 flex items-center justify-center space-x-1">
                        <Flame className="w-5 h-5" />
                        <span>{currentStreak}</span>
                    </div>
                    <div className="text-sm text-gray-400">Текущая серия</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                        {((activeDays / totalDays) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-400">Активность</div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div ref={calendarRef} className="space-y-2">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                        <div key={day} className="text-center py-1">{day}</div>
                    ))}
                </div>

                {/* Calendar weeks */}
                <div className="space-y-1">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-1">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={`calendar-cell w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-cyan-400/50 ${getIntensityColor(day.intensity)}`}
                                    title={`${day.date.toLocaleDateString('ru-RU')}: ${day.hours}ч, ${day.tasks} заданий`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 text-xs text-gray-500 text-center">
                Наведите курсор на квадрат, чтобы увидеть детали активности
            </div>
        </div>
    );
}

function calculateCurrentStreak(days: { hours: number; date: Date }[]): number {
    const sortedDays = days.sort((a, b) => b.date.getTime() - a.date.getTime());
    let streak = 0;
    
    for (const day of sortedDays) {
        if (day.hours > 0) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}