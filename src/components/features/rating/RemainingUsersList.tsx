'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Trophy } from 'lucide-react';
import { RatingUser, Badge } from '@/hooks/useRating';

// Регистрируем ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface RemainingUsersListProps {
    users: RatingUser[];
    onUserClick: (user: RatingUser) => void;
}

const getLevelColor = (level: string) => {
    switch (level) {
        case 'Легенда':
            return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/50';
        case 'Мастер':
            return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/50';
        case 'Эксперт':
            return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/50';
        case 'Продвинутый':
            return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/50';
        case 'Средний':
            return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/50';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
};

const getBadgeRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
        case 'legendary':
            return 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50';
        case 'epic':
            return 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border-orange-500/50';
        case 'rare':
            return 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-500/50';
        case 'common':
            return 'bg-gradient-to-r from-gray-500/30 to-gray-600/30 border-gray-500/50';
        default:
            return 'bg-gray-500/20 border-gray-500/50';
    }
};

export default function RemainingUsersList({ users, onUserClick }: RemainingUsersListProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Берем пользователей начиная с 4-го места
    const remainingUsers = users.slice(3);

    useGSAP(() => {
        if (!containerRef.current || remainingUsers.length === 0) return;

        const userCards = containerRef.current.querySelectorAll('.user-card');
        
        // Устанавливаем начальное состояние
        gsap.set(userCards, { opacity: 0, x: -50, scale: 0.95 });
        
        // Анимация заголовка
        if (titleRef.current) {
            gsap.set(titleRef.current, { opacity: 0, y: 30 });
            
            ScrollTrigger.create({
                trigger: titleRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    gsap.to(titleRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                },
                onLeaveBack: () => {
                    gsap.to(titleRef.current, {
                        opacity: 0,
                        y: 30,
                        duration: 0.4,
                        ease: 'power2.in'
                    });
                }
            });
        }

        // Анимация карточек пользователей
        userCards.forEach((card, index) => {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                end: 'bottom 15%',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: 'power2.out'
                    });
                },
                onLeaveBack: () => {
                    gsap.to(card, {
                        opacity: 0,
                        x: -50,
                        scale: 0.95,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                }
            });
        });

        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && containerRef.current?.contains(trigger.trigger)) {
                    trigger.kill();
                }
            });
        };
    }, { dependencies: [remainingUsers.length] });

    if (remainingUsers.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto mt-16">
            <h3 
                ref={titleRef}
                className="text-2xl font-bold text-white mb-8 text-center"
            >
                Остальные участники
            </h3>
            
            <div className="space-y-4">
                {remainingUsers.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => onUserClick(user)}
                        className="user-card group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-12 h-12">
                                        <Trophy className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-white min-w-[3rem]">
                                        #{user.rank}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl border-2 border-gray-600 overflow-hidden">
                                        {user.avatar.startsWith('http') ? (
                                            <img 
                                                src={user.avatar} 
                                                alt={user.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white">
                                                {user.avatar}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                                            {user.username}
                                        </h3>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getLevelColor(user.level)}`}>
                                                {user.level}
                                            </span>
                                            {user.streak > 0 && (
                                                <span className="text-sm text-orange-400 flex items-center space-x-1">
                                                    <span>🔥</span>
                                                    <span>{user.streak} дней</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400">
                                        {user.totalPoints.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-400">очков</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-green-400">
                                        {user.solvedTasks}
                                    </div>
                                    <div className="text-sm text-gray-400">заданий</div>
                                </div>
                                <div className="flex space-x-1">
                                    {user.badges.slice(0, 3).map((badge) => (
                                        <div
                                            key={badge.id}
                                            className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg ${getBadgeRarityColor(badge.rarity)}`}
                                            title={`${badge.name}: ${badge.description}`}
                                        >
                                            {badge.icon}
                                        </div>
                                    ))}
                                    {user.badges.length > 3 && (
                                        <div className="w-10 h-10 rounded-lg border border-gray-500/50 bg-gray-500/20 flex items-center justify-center text-sm text-gray-400">
                                            +{user.badges.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}