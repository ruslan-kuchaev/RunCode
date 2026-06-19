'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Loader2, Trophy, CheckCircle, Clock, LogOut, Calendar, Mail, User as UserIcon } from 'lucide-react';
import LightRays from '@/components/shared/LightRays';

type TaskStatus = 'STARTED' | 'SOLVED' | 'UNFINISHED';

interface UserTask {
    id: number;
    status: TaskStatus;
    startedAt: string;
    solvedAt?: string;
    task: {
        id: number;
        title: string;
        difficulty: string;
        price: number;
        language: {
            name: string;
            icon: string;
        };
    };
}

interface Profile {
    id: number;
    email: string;
    username: string;
    avatar?: string;
    rating: number;
    createdAt: string;
    role: string;
    solvedTasks: UserTask[];
    stats: {
        solved: number;
        started: number;
        totalEarned: number;
        total: number;
    };
}

const difficultyColor: Record<string, string> = {
    EASY: 'bg-green-500/20 text-green-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HARD: 'bg-orange-500/20 text-orange-400',
    EXPERT: 'bg-red-500/20 text-red-400',
};

const statusLabel: Record<TaskStatus, string> = {
    SOLVED: '✅ Решено',
    STARTED: '🔄 В процессе',
    UNFINISHED: '❌ Не завершено',
};

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
            return;
        }

        if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, router]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/user/profile');
            if (!res.ok) throw new Error('Ошибка загрузки');
            const data: Profile = await res.json();
            setProfile(data);
        } catch {
            setError('Не удалось загрузить профиль');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    const handleTaskClick = (taskId: number) => {
        router.push(`/tasks/${taskId}`);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-400 text-xl mb-4">{error || 'Профиль не найден'}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                    На главную
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 z-[-20]">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#00ffff"
                    raysSpeed={1}
                    lightSpread={3}
                    rayLength={2}
                    followMouse={false}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                    className="custom-rays z-10"
                />
            </div>

            <section className="w-full min-h-screen relative z-10">
                <div className="container mx-auto px-4 py-16">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 mb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.username}
                                        className="w-32 h-32 rounded-full border-4 border-cyan-500/30"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-4 border-cyan-500/30 flex items-center justify-center">
                                        <UserIcon size={48} className="text-cyan-400" />
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
                                    <Trophy size={14} />
                                    {profile.rating}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">{profile.username}</h1>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} />
                                        <span>{profile.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>
                                            С {new Date(profile.createdAt).toLocaleDateString('ru-RU', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {profile.role === 'ADMIN' && (
                                    <span className="inline-block bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-full px-3 py-1 text-sm font-medium">
                                        👑 Администратор
                                    </span>
                                )}
                            </div>

                            {/* Logout button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                                <LogOut size={18} />
                                Выйти
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">{profile.stats.solved}</div>
                            <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                                <CheckCircle size={14} />
                                Решено
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">{profile.stats.started}</div>
                            <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                                <Clock size={14} />
                                В процессе
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-cyan-400 mb-2">{profile.stats.totalEarned}</div>
                            <div className="text-sm text-gray-400">Очков заработано</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-white mb-2">{profile.stats.total}</div>
                            <div className="text-sm text-gray-400">Всего попыток</div>
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Мои задачи</h2>

                        {profile.solvedTasks.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 mb-4">У вас пока нет решённых задач</p>
                                <button
                                    onClick={() => router.push('/tasks')}
                                    className="px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors"
                                >
                                    Перейти к задачам
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {profile.solvedTasks.map((userTask) => (
                                    <div
                                        key={userTask.id}
                                        onClick={() => handleTaskClick(userTask.task.id)}
                                        className="group bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                    {userTask.task.title}
                                                </h3>
                                                <span className={`${difficultyColor[userTask.task.difficulty]} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                                                    {userTask.task.difficulty}
                                                </span>
                                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                                    {userTask.task.language.icon} {userTask.task.language.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                                <span className={`${
                                                    userTask.status === 'SOLVED' ? 'text-green-400' :
                                                    userTask.status === 'STARTED' ? 'text-blue-400' : 'text-red-400'
                                                }`}>
                                                    {statusLabel[userTask.status]}
                                                </span>
                                                <span className="text-gray-500">
                                                    {userTask.status === 'SOLVED' && userTask.solvedAt
                                                        ? `Решено ${new Date(userTask.solvedAt).toLocaleDateString('ru-RU')}`
                                                        : `Начато ${new Date(userTask.startedAt).toLocaleDateString('ru-RU')}`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            {userTask.status === 'SOLVED' && (
                                                <span className="text-cyan-400 font-bold text-lg">
                                                    +{userTask.task.price}
                                                </span>
                                            )}
                                            <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm">
                                                {userTask.status === 'SOLVED' ? 'Посмотреть' : 'Продолжить'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <footer className="border-t border-gray-800 mt-16">
                        <div className="container mx-auto px-4 py-8 text-center text-gray-600 text-sm">
                            &copy; {new Date().getFullYear()} RunCode. Interactive programming trainer platform.
                        </div>
                    </footer>
                </div>
            </section>
        </>
    );
}
