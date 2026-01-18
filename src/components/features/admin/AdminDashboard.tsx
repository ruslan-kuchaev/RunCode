'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { 
    Users, 
    FileText, 
    Code, 
    TrendingUp,
    Activity,
    Clock,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
    onTabChange?: (tab: 'tasks' | 'languages' | 'users') => void;
}

export default function AdminDashboard({ onTabChange }: AdminDashboardProps) {
    const dashboardRef = useRef<HTMLDivElement>(null);
    const { stats, loading, error } = useAdminStats();

    useGSAP(() => {
        if (dashboardRef.current) {
            const cards = dashboardRef.current.querySelectorAll('.stat-card');
            gsap.set(cards, { opacity: 0, y: 20 });
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Загрузка статистики...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400">Ошибка загрузки статистики</p>
                    <p className="text-gray-400 text-sm mt-2">Попробуйте обновить страницу</p>
                </div>
            </div>
        );
    }

    const statsCards = [
        { 
            label: 'Всего пользователей', 
            value: stats.overview.totalUsers.toLocaleString(), 
            change: `+${stats.recentActivity.newUsersThisWeek}`, 
            icon: Users, 
            color: 'blue' 
        },
        { 
            label: 'Активных заданий', 
            value: stats.overview.activeTasks.toString(), 
            change: `+${stats.recentActivity.newTasksThisWeek}`, 
            icon: FileText, 
            color: 'green' 
        },
        { 
            label: 'Языков программирования', 
            value: stats.overview.activeLanguages.toString(), 
            change: `${stats.overview.totalLanguages} всего`, 
            icon: Code, 
            color: 'purple' 
        },
        { 
            label: 'Решений за неделю', 
            value: stats.recentActivity.submissionsThisWeek.toString(), 
            change: `${Math.round((stats.overview.acceptedSubmissions / stats.overview.totalSubmissions) * 100)}% принято`, 
            icon: TrendingUp, 
            color: 'orange' 
        },
    ];

    const recentActivity = stats.recentSubmissions.slice(0, 5).map(submission => ({
        type: submission.status === 'ACCEPTED' ? 'success' : submission.status === 'REJECTED' ? 'error' : 'info',
        message: `${submission.user.username} ${submission.status === 'ACCEPTED' ? 'решил' : 'отправил решение'} "${submission.task.title}"`,
        time: new Date(submission.createdAt).toLocaleString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        }),
        status: submission.status === 'ACCEPTED' ? 'success' : submission.status === 'REJECTED' ? 'error' : 'info'
    }));

    const getStatColor = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'green': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user': return Users;
            case 'task': return FileText;
            case 'error': return AlertTriangle;
            default: return Activity;
        }
    };

    const getActivityColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            case 'info': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div ref={dashboardRef} className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Панель управления</h1>
                <p className="text-gray-400">Обзор системы и последние активности</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`stat-card p-6 rounded-xl border backdrop-blur-sm ${getStatColor(stat.color)}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <IconComponent className="w-8 h-8" />
                                <span className="text-sm font-medium">{stat.change}</span>
                            </div>
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm opacity-80">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Последняя активность</h2>
                        <button 
                            onClick={() => onTabChange?.('users')}
                            className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                        >
                            Показать все
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => {
                            const IconComponent = getActivityIcon(activity.type);
                            return (
                                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-700/30 rounded-lg transition-colors">
                                    <div className={`p-2 rounded-lg bg-gray-700/50 ${getActivityColor(activity.status)}`}>
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm">{activity.message}</p>
                                        <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Быстрые действия</h2>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => onTabChange?.('tasks')}
                            className="w-full flex items-center space-x-3 p-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg transition-all duration-200"
                        >
                            <FileText className="w-5 h-5 text-orange-400" />
                            <span className="text-orange-400 font-medium">Добавить задание</span>
                        </button>
                        
                        <button 
                            onClick={() => onTabChange?.('languages')}
                            className="w-full flex items-center space-x-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all duration-200"
                        >
                            <Code className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-medium">Добавить язык</span>
                        </button>
                        
                        <button 
                            onClick={() => onTabChange?.('users')}
                            className="w-full flex items-center space-x-3 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-all duration-200"
                        >
                            <Users className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Управление пользователями</span>
                        </button>
                    </div>

                    {/* System Health */}
                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                        <h3 className="text-lg font-medium text-white mb-4">Состояние системы</h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">База данных</span>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 text-sm">Работает</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">API сервер</span>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 text-sm">Работает</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Система тестирования</span>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-yellow-400" />
                                    <span className="text-yellow-400 text-sm">Загружена</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}