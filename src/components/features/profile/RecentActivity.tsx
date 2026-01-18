'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
    Activity, 
    CheckCircle, 
    Award, 
    Zap, 
    TrendingUp,
    Clock
} from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Badge {
    id: number;
    name: string;
    icon: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ActivityItem {
    id: number;
    type: 'task_completed' | 'badge_earned' | 'streak_milestone' | 'level_up';
    title: string;
    description: string;
    timestamp: Date;
    points?: number;
    badge?: Badge;
}

interface RecentActivityProps {
    activities: ActivityItem[];
    showAll?: boolean;
}

export default function RecentActivity({ activities, showAll = false }: RecentActivityProps) {
    const activityRef = useRef<HTMLDivElement>(null);

    const displayedActivities = showAll ? activities : activities.slice(0, 5);

    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'task_completed':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'badge_earned':
                return <Award className="w-5 h-5 text-yellow-400" />;
            case 'streak_milestone':
                return <Zap className="w-5 h-5 text-orange-400" />;
            case 'level_up':
                return <TrendingUp className="w-5 h-5 text-purple-400" />;
            default:
                return <Activity className="w-5 h-5 text-gray-400" />;
        }
    };

    const getActivityColor = (type: ActivityItem['type']) => {
        switch (type) {
            case 'task_completed':
                return 'border-green-500/30 bg-green-500/10';
            case 'badge_earned':
                return 'border-yellow-500/30 bg-yellow-500/10';
            case 'streak_milestone':
                return 'border-orange-500/30 bg-orange-500/10';
            case 'level_up':
                return 'border-purple-500/30 bg-purple-500/10';
            default:
                return 'border-gray-500/30 bg-gray-500/10';
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Только что';
        if (diffInMinutes < 60) return `${diffInMinutes} мин. назад`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} ч. назад`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} дн. назад`;
        
        return date.toLocaleDateString('ru-RU');
    };

    useGSAP(() => {
        if (!activityRef.current) return;

        const activityItems = activityRef.current.querySelectorAll('.activity-item');
        
        gsap.set(activityItems, { opacity: 0, x: 30 });

        activityItems.forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 90%',
                end: 'bottom 10%',
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: 'power2.out',
                    });
                },
                onLeaveBack: () => {
                    gsap.to(item, {
                        opacity: 0,
                        x: 30,
                        duration: 0.3,
                        ease: 'power2.in',
                    });
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && activityRef.current?.contains(trigger.trigger)) {
                    trigger.kill();
                }
            });
        };
    }, { dependencies: [displayedActivities.length] });

    return (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>Недавняя активность</span>
                </h3>
                {!showAll && activities.length > 5 && (
                    <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        Показать все
                    </button>
                )}
            </div>

            <div ref={activityRef} className="space-y-4">
                {displayedActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Пока нет активности</p>
                    </div>
                ) : (
                    displayedActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`activity-item p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${getActivityColor(activity.type)}`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    {getActivityIcon(activity.type)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-medium text-white truncate">
                                            {activity.title}
                                        </h4>
                                        <div className="flex items-center space-x-1 text-xs text-gray-400 flex-shrink-0 ml-2">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatTimeAgo(activity.timestamp)}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-300 mb-2">
                                        {activity.description}
                                    </p>
                                    
                                    <div className="flex items-center space-x-4">
                                        {activity.points && (
                                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">
                                                +{activity.points} очков
                                            </span>
                                        )}
                                        
                                        {activity.badge && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{activity.badge.icon}</span>
                                                <span className="text-xs text-gray-400">
                                                    {activity.badge.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAll && displayedActivities.length > 10 && (
                <div className="mt-6 text-center">
                    <button className="px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-all duration-300">
                        Загрузить еще
                    </button>
                </div>
            )}
        </div>
    );
}