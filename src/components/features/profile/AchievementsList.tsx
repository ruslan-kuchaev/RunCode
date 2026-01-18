'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Award, Calendar, Lock } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Badge {
    id: number;
    name: string;
    icon: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlockedAt: Date;
}

interface AchievementsListProps {
    badges: Badge[];
}

// Все возможные достижения (включая заблокированные)
const allPossibleBadges: Omit<Badge, 'unlockedAt'>[] = [
    { id: 1, name: 'Первые шаги', icon: '🚀', description: 'Решил первое задание', rarity: 'common' },
    { id: 2, name: 'Марафонец', icon: '🏃', description: 'Решал задания 30 дней подряд', rarity: 'rare' },
    { id: 3, name: 'Мастер JS', icon: '🟨', description: 'Решил 50 заданий по JavaScript', rarity: 'epic' },
    { id: 4, name: 'Легенда', icon: '👑', description: 'Достиг топ-10 в рейтинге', rarity: 'legendary' },
    { id: 5, name: 'Скоростной', icon: '⚡', description: 'Решил задание за 5 минут', rarity: 'rare' },
    { id: 6, name: 'Перфекционист', icon: '💎', description: 'Решил 100 заданий без ошибок', rarity: 'epic' },
    { id: 7, name: 'Ночной кодер', icon: '🌙', description: 'Решил задание после полуночи', rarity: 'common' },
    { id: 8, name: 'Утренняя птичка', icon: '🌅', description: 'Решил задание до 6 утра', rarity: 'common' },
    { id: 9, name: 'Мастер Python', icon: '🐍', description: 'Решил 50 заданий по Python', rarity: 'epic' },
    { id: 10, name: 'React Guru', icon: '⚛️', description: 'Решил 30 заданий по React', rarity: 'rare' },
    { id: 11, name: 'Коллекционер', icon: '🏆', description: 'Получил 10 различных достижений', rarity: 'legendary' },
    { id: 12, name: 'Социальный', icon: '💬', description: 'Оставил 50 комментариев', rarity: 'rare' },
];

const getBadgeRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
        case 'legendary':
            return {
                bg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
                border: 'border-purple-500/50',
                text: 'text-purple-300',
                glow: 'shadow-purple-500/30'
            };
        case 'epic':
            return {
                bg: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
                border: 'border-orange-500/50',
                text: 'text-orange-300',
                glow: 'shadow-orange-500/30'
            };
        case 'rare':
            return {
                bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
                border: 'border-blue-500/50',
                text: 'text-blue-300',
                glow: 'shadow-blue-500/30'
            };
        case 'common':
            return {
                bg: 'bg-gradient-to-br from-gray-500/20 to-gray-600/20',
                border: 'border-gray-500/50',
                text: 'text-gray-300',
                glow: 'shadow-gray-500/30'
            };
        default:
            return {
                bg: 'bg-gray-500/20',
                border: 'border-gray-500/50',
                text: 'text-gray-300',
                glow: 'shadow-gray-500/30'
            };
    }
};

const getRarityLabel = (rarity: Badge['rarity']) => {
    switch (rarity) {
        case 'legendary': return 'Легендарное';
        case 'epic': return 'Эпическое';
        case 'rare': return 'Редкое';
        case 'common': return 'Обычное';
        default: return 'Неизвестно';
    }
};

export default function AchievementsList({ badges }: AchievementsListProps) {
    const achievementsRef = useRef<HTMLDivElement>(null);

    // Объединяем полученные и заблокированные достижения
    const unlockedIds = badges.map(b => b.id);
    const lockedBadges = allPossibleBadges.filter(b => !unlockedIds.includes(b.id));

    // Группируем по редкости
    const groupedBadges = {
        legendary: badges.filter(b => b.rarity === 'legendary'),
        epic: badges.filter(b => b.rarity === 'epic'),
        rare: badges.filter(b => b.rarity === 'rare'),
        common: badges.filter(b => b.rarity === 'common'),
    };

    const groupedLocked = {
        legendary: lockedBadges.filter(b => b.rarity === 'legendary'),
        epic: lockedBadges.filter(b => b.rarity === 'epic'),
        rare: lockedBadges.filter(b => b.rarity === 'rare'),
        common: lockedBadges.filter(b => b.rarity === 'common'),
    };

    useGSAP(() => {
        if (!achievementsRef.current) return;

        const badgeCards = achievementsRef.current.querySelectorAll('.badge-card');
        
        gsap.set(badgeCards, { opacity: 0, y: 30, scale: 0.9 });

        badgeCards.forEach((card, index) => {
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
                        delay: (index % 6) * 0.1,
                        ease: 'back.out(1.7)',
                    });
                },
                onLeaveBack: () => {
                    gsap.to(card, {
                        opacity: 0,
                        y: 30,
                        scale: 0.9,
                        duration: 0.4,
                        ease: 'power2.in',
                    });
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && achievementsRef.current?.contains(trigger.trigger)) {
                    trigger.kill();
                }
            });
        };
    }, { dependencies: [badges.length] });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const renderBadgeSection = (title: string, unlockedBadges: Badge[], lockedBadges: Omit<Badge, 'unlockedAt'>[], rarity: Badge['rarity']) => {
        const colors = getBadgeRarityColor(rarity);
        const allBadges = [...unlockedBadges, ...lockedBadges];
        
        if (allBadges.length === 0) return null;

        return (
            <div key={rarity} className="space-y-4">
                <div className="flex items-center space-x-3">
                    <h3 className={`text-xl font-bold ${colors.text}`}>{title}</h3>
                    <span className="text-sm text-gray-400">
                        {unlockedBadges.length} / {allBadges.length}
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Unlocked badges */}
                    {unlockedBadges.map((badge) => {
                        const badgeColors = getBadgeRarityColor(badge.rarity);
                        return (
                            <div
                                key={badge.id}
                                className={`badge-card ${badgeColors.bg} backdrop-blur-sm border ${badgeColors.border} rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl ${badgeColors.glow}`}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-4xl">{badge.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-white">{badge.name}</h4>
                                            <Award className={`w-5 h-5 ${badgeColors.text}`} />
                                        </div>
                                        <p className="text-sm text-gray-300 mb-3">{badge.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-1 rounded-full ${badgeColors.bg} ${badgeColors.text} border ${badgeColors.border}`}>
                                                {getRarityLabel(badge.rarity)}
                                            </span>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(badge.unlockedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Locked badges */}
                    {lockedBadges.map((badge) => (
                        <div
                            key={badge.id}
                            className="badge-card bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 opacity-60 cursor-pointer hover:opacity-80 transition-all duration-300"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="text-4xl grayscale">{badge.icon}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-gray-400">{badge.name}</h4>
                                        <Lock className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-500 border border-gray-600/50">
                                            {getRarityLabel(badge.rarity)}
                                        </span>
                                        <span className="text-xs text-gray-500">Заблокировано</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div ref={achievementsRef} className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">🏆 Достижения</h2>
                <div className="text-sm text-gray-400">
                    {badges.length} / {allPossibleBadges.length} получено
                </div>
            </div>

            {/* Progress bar */}
            <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-1000"
                    style={{ width: `${(badges.length / allPossibleBadges.length) * 100}%` }}
                />
            </div>

            {/* Achievements by rarity */}
            <div className="space-y-8">
                {renderBadgeSection('🌟 Легендарные', groupedBadges.legendary, groupedLocked.legendary, 'legendary')}
                {renderBadgeSection('🔥 Эпические', groupedBadges.epic, groupedLocked.epic, 'epic')}
                {renderBadgeSection('💎 Редкие', groupedBadges.rare, groupedLocked.rare, 'rare')}
                {renderBadgeSection('⭐ Обычные', groupedBadges.common, groupedLocked.common, 'common')}
            </div>
        </div>
    );
}