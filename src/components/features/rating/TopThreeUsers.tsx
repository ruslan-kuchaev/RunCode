'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Crown, Medal, Award, Trophy, Target, Zap } from 'lucide-react';
import { RatingUser, Badge } from '@/hooks/useRating';

interface TopThreeUsersProps {
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

const getRankConfig = (rank: number) => {
    switch (rank) {
        case 1:
            return {
                icon: Crown,
                color: 'text-yellow-400',
                bgGradient: 'from-yellow-500/20 via-amber-500/20 to-orange-500/20',
                borderColor: 'border-yellow-500/50',
                shadowColor: 'shadow-yellow-500/30',
                height: 'h-80',
                iconSize: 'w-12 h-12',
                title: '👑 Чемпион'
            };
        case 2:
            return {
                icon: Medal,
                color: 'text-gray-300',
                bgGradient: 'from-gray-400/20 via-gray-500/20 to-gray-600/20',
                borderColor: 'border-gray-400/50',
                shadowColor: 'shadow-gray-400/30',
                height: 'h-72',
                iconSize: 'w-10 h-10',
                title: '🥈 Вице-чемпион'
            };
        case 3:
            return {
                icon: Award,
                color: 'text-amber-600',
                bgGradient: 'from-amber-600/20 via-orange-600/20 to-red-600/20',
                borderColor: 'border-amber-600/50',
                shadowColor: 'shadow-amber-600/30',
                height: 'h-64',
                iconSize: 'w-8 h-8',
                title: '🥉 Призёр'
            };
        default:
            return {
                icon: Trophy,
                color: 'text-gray-500',
                bgGradient: 'from-gray-500/20 to-gray-600/20',
                borderColor: 'border-gray-500/50',
                shadowColor: 'shadow-gray-500/30',
                height: 'h-56',
                iconSize: 'w-6 h-6',
                title: 'Участник'
            };
    }
};

export default function TopThreeUsers({ users, onUserClick }: TopThreeUsersProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const topThree = users.slice(0, 3);

    useGSAP(() => {
        if (containerRef.current) {
            const cards = containerRef.current.querySelectorAll('.top-user-card');
            
            gsap.set(cards, { opacity: 0, y: 50, scale: 0.8 });
            
            // Анимация появления с разными задержками для создания эффекта подиума
            gsap.to(cards[1], { // 2 место появляется первым
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.7)',
                delay: 0.2
            });
            
            gsap.to(cards[2], { // 3 место
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.7)',
                delay: 0.4
            });
            
            gsap.to(cards[0], { // 1 место появляется последним с особым эффектом
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'back.out(2)',
                delay: 0.6
            });
        }
    }, { dependencies: [users.length] });

    if (topThree.length === 0) return null;

    // Переупорядочиваем для отображения: 2-1-3
    const displayOrder = topThree.length >= 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto mb-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">🏆 Топ-3 лидера</h2>
                <p className="text-gray-400">Лучшие программисты платформы RunCode</p>
            </div>
            
            <div className="flex justify-center items-end space-x-4 md:space-x-8">
                {displayOrder.map((user, displayIndex) => {
                    const config = getRankConfig(user.rank);
                    const IconComponent = config.icon;
                    
                    return (
                        <div
                            key={user.id}
                            onClick={() => onUserClick(user)}
                            className={`top-user-card relative bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm border ${config.borderColor} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${config.shadowColor} ${config.height} flex flex-col justify-between group`}
                            style={{ 
                                opacity: 0,
                                width: user.rank === 1 ? '280px' : '240px',
                                minWidth: user.rank === 1 ? '280px' : '240px'
                            }}
                        >
                            {/* Ранг и иконка */}
                            <div className="text-center">
                                <div className={`flex items-center justify-center mb-4 ${config.color}`}>
                                    <IconComponent className={config.iconSize} />
                                </div>
                                <div className={`text-sm font-semibold mb-2 ${config.color}`}>
                                    {config.title}
                                </div>
                                <div className={`text-3xl font-bold mb-1 ${config.color}`}>
                                    #{user.rank}
                                </div>
                            </div>

                            {/* Аватар и имя */}
                            <div className="text-center flex-1 flex flex-col justify-center">
                                <div className={`mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-4 ${config.borderColor} group-hover:scale-110 transition-transform duration-300 overflow-hidden`}
                                     style={{ 
                                         width: user.rank === 1 ? '80px' : '64px',
                                         height: user.rank === 1 ? '80px' : '64px'
                                     }}>
                                    {user.avatar.startsWith('http') ? (
                                        <img 
                                            src={user.avatar} 
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white" style={{ fontSize: user.rank === 1 ? '2rem' : '1.5rem' }}>
                                            {user.avatar}
                                        </span>
                                    )}
                                </div>
                                <h3 className={`font-bold text-white group-hover:${config.color.replace('text-', 'text-')} transition-colors duration-300 mb-2`}
                                    style={{ fontSize: user.rank === 1 ? '1.25rem' : '1.1rem' }}>
                                    {user.username}
                                </h3>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getLevelColor(user.level)}`}>
                                    {user.level}
                                </span>
                            </div>

                            {/* Статистика */}
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                        <span className="text-sm text-gray-300">Очки</span>
                                    </div>
                                    <span className="font-bold text-yellow-400">
                                        {user.totalPoints.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-gray-300">Задач</span>
                                    </div>
                                    <span className="font-bold text-green-400">
                                        {user.solvedTasks}
                                    </span>
                                </div>
                                {user.streak > 0 && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Zap className="w-4 h-4 text-orange-400" />
                                            <span className="text-sm text-gray-300">Серия</span>
                                        </div>
                                        <span className="font-bold text-orange-400">
                                            {user.streak} дн.
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Эффекты для первого места */}
                            {user.rank === 1 && (
                                <>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400/20 rounded-full animate-pulse"></div>
                                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400/20 rounded-full animate-pulse delay-1000"></div>
                                    <div className="absolute top-1/2 -left-1 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse delay-500"></div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}