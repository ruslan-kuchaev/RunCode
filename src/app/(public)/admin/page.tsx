'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Shield, Users, BookOpen, BarChart3 } from 'lucide-react';
import LightRays from '@/components/shared/LightRays';

export default function AdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
            return;
        }

        // Check if user is admin
        if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
            router.push('/');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (!session || (session?.user as any)?.role !== 'ADMIN') {
        return null;
    }

    const stats = [
        { label: 'Всего пользователей', value: '—', icon: Users, color: 'text-cyan-400' },
        { label: 'Всего задач', value: '—', icon: BookOpen, color: 'text-green-400' },
        { label: 'Решённых задач', value: '—', icon: BarChart3, color: 'text-yellow-400' },
    ];

    return (
        <>
            <div className="fixed inset-0 z-[-20]">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#9333ea"
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
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Shield className="text-purple-400" size={40} />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Admin Panel</h1>
                        </div>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Панель управления платформой RunCode
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-gray-800/50">
                                        <stat.icon className={stat.color} size={24} />
                                    </div>
                                    <h3 className="text-gray-400 text-sm">{stat.label}</h3>
                                </div>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Admin sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Users management */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Users size={24} className="text-cyan-400" />
                                Управление пользователями
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Просмотр, редактирование и удаление пользователей
                            </p>
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-700/50 text-gray-500 rounded-lg cursor-not-allowed"
                            >
                                В разработке
                            </button>
                        </div>

                        {/* Tasks management */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <BookOpen size={24} className="text-green-400" />
                                Управление задачами
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Создание, редактирование и удаление задач
                            </p>
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-700/50 text-gray-500 rounded-lg cursor-not-allowed"
                            >
                                В разработке
                            </button>
                        </div>

                        {/* Statistics */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <BarChart3 size={24} className="text-yellow-400" />
                                Статистика платформы
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Аналитика активности пользователей и решений
                            </p>
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-700/50 text-gray-500 rounded-lg cursor-not-allowed"
                            >
                                В разработке
                            </button>
                        </div>

                        {/* System settings */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Shield size={24} className="text-purple-400" />
                                Настройки системы
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Конфигурация платформы и безопасность
                            </p>
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-700/50 text-gray-500 rounded-lg cursor-not-allowed"
                            >
                                В разработке
                            </button>
                        </div>
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
