'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Users, Target, Star, TrendingUp, Calendar, Trophy, Award, Zap } from 'lucide-react';
import { RatingUser, Badge } from '@/hooks/useRating';

interface RatingStatsProps {
    users: RatingUser[];
}

export default function RatingStats({ users }: RatingStatsProps) {
    const statsRef = useRef<HTMLDivElement>(null);

    const totalUsers = users.length;
    const totalSolvedTasks = users.reduce((sum, user) => sum + user.solvedTasks, 0);
    const totalPoints = users.reduce((sum, user) => sum + user.totalPoints, 0);
    const maxStreak = Math.max(...users.map(user => user.streak));
    const totalBadges = users.reduce((sum, user) => sum + user.badges.length, 0);
    const averagePoints = Math.round(totalPoints / totalUsers);
    const activeToday = users.filter(user => {
        const today = new Date();
        const lastActive = new Date(user.lastActive);
        return today.toDateString() === lastActive.toDateString();
    }).length;
    const thisMonth = users.filter(user => {
        const now = new Date();
        const joinedAt = new Date(user.joinedAt);
        return joinedAt.getMonth() === now.getMonth() && joinedAt.getFullYear() === now.getFullYear();
    }).length;

    useGSAP(() => {
        if (statsRef.current) {
            const statCards = statsRef.current.querySelectorAll('.stat-card');
            gsap.set(statCards, { opacity: 0, y: 20, scale: 0.95 });
            
            gsap.to(statCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            });
        }
    }, { dependencies: [users.length] });

    const stats = [
        {
            icon: Users,
            value: totalUsers,
            label: 'Участников',
            color: 'text-yellow-400',
            bgColor: 'from-yellow-500/10 to-amber-500/10',
            borderColor: 'border-yellow-500/30'
        },
        {
            icon: Target,
            value: totalSolvedTasks,
            label: 'Решено заданий',
            color: 'text-green-400',
            bgColor: 'from-green-500/10 to-emerald-500/10',
            borderColor: 'border-green-500/30'
        },
        {
            icon: Star,
            value: totalPoints.toLocaleString(),
            label: 'Общий рейтинг',
            color: 'text-purple-400',
            bgColor: 'from-purple-500/10 to-pink-500/10',
            borderColor: 'border-purple-500/30'
        },
        {
            icon: TrendingUp,
            value: maxStreak,
            label: 'Лучшая серия',
            color: 'text-cyan-400',
            bgColor: 'from-cyan-500/10 to-blue-500/10',
            borderColor: 'border-cyan-500/30'
        },
        {
            icon: Award,
            value: totalBadges,
            label: 'Всего наград',
            color: 'text-orange-400',
            bgColor: 'from-orange-500/10 to-red-500/10',
            borderColor: 'border-orange-500/30'
        },
        {
            icon: Trophy,
            value: averagePoints.toLocaleString(),
            label: 'Средний рейтинг',
            color: 'text-indigo-400',
            bgColor: 'from-indigo-500/10 to-purple-500/10',
            borderColor: 'border-indigo-500/30'
        },
        {
            icon: Zap,
            value: activeToday,
            label: 'Активны сегодня',
            color: 'text-emerald-400',
            bgColor: 'from-emerald-500/10 to-teal-500/10',
            borderColor: 'border-emerald-500/30'
        },
        {
            icon: Calendar,
            value: thisMonth,
            label: 'Новых в этом месяце',
            color: 'text-rose-400',
            bgColor: 'from-rose-500/10 to-pink-500/10',
            borderColor: 'border-rose-500/30'
        }
    ];

    return (
        <div ref={statsRef} className="max-w-7xl mx-auto mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`stat-card bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group`}
                        >
                            <div className="flex items-center justify-center mb-3">
                                <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                            </div>
                            <div className={`text-2xl md:text-3xl font-bold text-white mb-2 ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-xs md:text-sm text-gray-400 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}