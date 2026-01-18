'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X, Calendar, Clock, Trophy, Target, Zap, Award } from 'lucide-react';
import { RatingUser, Badge } from '@/hooks/useRating';

interface UserProfileModalProps {
    user: RatingUser | null;
    isOpen: boolean;
    onClose: () => void;
}

const getBadgeRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
        case 'legendary':
            return 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50 text-purple-300';
        case 'epic':
            return 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border-orange-500/50 text-orange-300';
        case 'rare':
            return 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-500/50 text-blue-300';
        case 'common':
            return 'bg-gradient-to-r from-gray-500/30 to-gray-600/30 border-gray-500/50 text-gray-300';
        default:
            return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
};

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

export default function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && modalRef.current && backdropRef.current && contentRef.current) {
            gsap.set(modalRef.current, { display: 'flex' });
            gsap.set(backdropRef.current, { opacity: 0 });
            gsap.set(contentRef.current, { opacity: 0, scale: 0.8, y: 50 });

            const tl = gsap.timeline();
            tl.to(backdropRef.current, { opacity: 1, duration: 0.3 })
              .to(contentRef.current, { 
                  opacity: 1, 
                  scale: 1, 
                  y: 0, 
                  duration: 0.4, 
                  ease: 'back.out(1.7)' 
              }, '-=0.1');
        } else if (!isOpen && modalRef.current && backdropRef.current && contentRef.current) {
            const tl = gsap.timeline();
            tl.to(contentRef.current, { 
                opacity: 0, 
                scale: 0.8, 
                y: 50, 
                duration: 0.3 
            })
              .to(backdropRef.current, { opacity: 0, duration: 0.2 }, '-=0.1')
              .set(modalRef.current, { display: 'none' });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!user) return null;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Только что';
        if (diffInHours < 24) return `${diffInHours} ч. назад`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} дн. назад`;
        
        return formatDate(date);
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ display: 'none' }}
        >
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div
                ref={contentRef}
                className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-700/50"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-4xl border-4 border-gray-600 mx-auto mb-4 overflow-hidden">
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
                    <h2 className="text-3xl font-bold text-white mb-2">{user.username}</h2>
                    <div className="flex items-center justify-center space-x-4">
                        <span className={`text-lg font-medium px-4 py-2 rounded-full border ${getLevelColor(user.level)}`}>
                            {user.level}
                        </span>
                        <span className="text-2xl font-bold text-yellow-400">#{user.rank}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 text-center border border-gray-600/50">
                        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{user.totalPoints.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Очков</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 text-center border border-gray-600/50">
                        <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{user.solvedTasks}</div>
                        <div className="text-sm text-gray-400">Заданий</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 text-center border border-gray-600/50">
                        <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{user.streak}</div>
                        <div className="text-sm text-gray-400">Дней подряд</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 text-center border border-gray-600/50">
                        <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{user.badges.length}</div>
                        <div className="text-sm text-gray-400">Наград</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                            <Award className="w-6 h-6 text-purple-400" />
                            <span>Достижения</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {user.badges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className={`p-4 rounded-xl border flex items-center space-x-3 ${getBadgeRarityColor(badge.rarity)}`}
                                >
                                    <div className="text-2xl">{badge.icon}</div>
                                    <div>
                                        <div className="font-semibold">{badge.name}</div>
                                        <div className="text-sm opacity-80">{badge.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span>Дата регистрации</span>
                            </h4>
                            <p className="text-gray-300">{formatDate(user.joinedAt)}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-green-400" />
                                <span>Последняя активность</span>
                            </h4>
                            <p className="text-gray-300">{getTimeAgo(user.lastActive)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}