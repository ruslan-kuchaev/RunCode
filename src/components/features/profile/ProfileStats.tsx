'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
    Trophy, 
    Target, 
    Zap, 
    Calendar, 
    Clock, 
    TrendingUp,
    Award,
    Star
} from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface UserProfile {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    rating: number;
    level: string;
    totalPoints: number;
    solvedTasks: number;
    streak: number;
    joinedAt: Date;
    lastActive: Date;
}

interface ProfileStatsProps {
    user: UserProfile;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
    const statsRef = useRef<HTMLDivElement>(null);

    // Вычисляем дополнительную статистику
    const daysSinceJoined = Math.floor((new Date().getTime() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
    const averagePointsPerDay = Math.round(user.totalPoints / daysSinceJoined);
    const averageTasksPerDay = (user.solvedTasks / daysSinceJoined).toFixed(1);

    const stats = [
        {
            icon: Trophy,
            label: 'Общий рейтинг',
            value: user.totalPoints.toLocaleString(),
            color: 'text-yellow-400',
            bgColor: 'from-yellow-500/10 to-amber-500/10',
            borderColor: 'border-yellow-500/30',
            description: 'Накопленные очки'
        },
        {
            icon: Target,
            label: 'Решено заданий',
            value: user.solvedTasks.toString(),
            color: 'text-green-400',
            bgColor: 'from-green-500/10 to-emerald-500/10',
            borderColor: 'border-green-500/30',
            description: 'Всего выполнено'
        },
        {
            icon: Zap,
            label: 'Текущая серия',
            value: `${user.streak} дн.`,
            color: 'text-orange-400',
            bgColor: 'from-orange-500/10 to-red-500/10',
            borderColor: 'border-orange-500/30',
            description: 'Дней подряд'
        },
        {
            icon: Calendar,
            label: 'Дней на платформе',
            value: daysSinceJoined.toString(),
            color: 'text-blue-400',
            bgColor: 'from-blue-500/10 to-cyan-500/10',
            borderColor: 'border-blue-500/30',
            description: 'С момента регистрации'
        },
        {
            icon: TrendingUp,
            label: 'Очков в день',
            value: averagePointsPerDay.toString(),
            color: 'text-purple-400',
            bgColor: 'from-purple-500/10 to-pink-500/10',
            borderColor: 'border-purple-500/30',
            description: 'В среднем'
        },
        {
            icon: Star,
            label: 'Заданий в день',
            value: averageTasksPerDay,
            color: 'text-cyan-400',
            bgColor: 'from-cyan-500/10 to-teal-500/10',
            borderColor: 'border-cyan-500/30',
            description: 'В среднем'
        },
        {
            icon: Award,
            label: 'Уровень',
            value: user.level,
            color: 'text-indigo-400',
            bgColor: 'from-indigo-500/10 to-purple-500/10',
            borderColor: 'border-indigo-500/30',
            description: 'Текущий ранг'
        },
        {
            icon: Clock,
            label: 'Последняя активность',
            value: getTimeAgo(user.lastActive),
            color: 'text-emerald-400',
            bgColor: 'from-emerald-500/10 to-green-500/10',
            borderColor: 'border-emerald-500/30',
            description: 'Был в сети'
        }
    ];

    useGSAP(() => {
        if (!statsRef.current) return;

        const statCards = statsRef.current.querySelectorAll('.stat-card');
        
        gsap.set(statCards, { opacity: 0, y: 30, scale: 0.95 });

        statCards.forEach((card, index) => {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                end: 'bottom 15%',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'back.out(1.7)',
                    });
                },
                onLeaveBack: () => {
                    gsap.to(card, {
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                        duration: 0.4,
                        ease: 'power2.in',
                    });
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && statsRef.current?.contains(trigger.trigger)) {
                    trigger.kill();
                }
            });
        };
    }, { dependencies: [user.totalPoints, user.solvedTasks, user.streak] });

    return (
        <div ref={statsRef}>
            <h2 className="text-2xl font-bold text-white mb-6">📊 Статистика</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`stat-card bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <IconComponent className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                                <div className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-white font-medium">{stat.label}</div>
                                <div className="text-sm text-gray-400">{stat.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн. назад`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} нед. назад`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} мес. назад`;
}