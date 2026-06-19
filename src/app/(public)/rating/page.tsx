'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trophy, Medal, Award, User } from 'lucide-react';
import LightRays from '@/components/shared/LightRays';

interface RatingUser {
    rank: number;
    id: number;
    username: string;
    avatar?: string;
    rating: number;
    solved: number;
}

export default function RatingPage() {
    const [users, setUsers] = useState<RatingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRatings();
    }, []);

    const fetchRatings = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/ratings');
            if (!res.ok) throw new Error('Ошибка загрузки');
            const data: RatingUser[] = await res.json();
            setUsers(data);
        } catch {
            setError('Не удалось загрузить рейтинг');
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
        if (rank === 2) return <Medal className="text-gray-300" size={24} />;
        if (rank === 3) return <Award className="text-orange-400" size={24} />;
        return null;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'border-yellow-500/50 bg-yellow-500/10';
        if (rank === 2) return 'border-gray-400/50 bg-gray-400/10';
        if (rank === 3) return 'border-orange-500/50 bg-orange-400/10';
        return 'border-gray-700/50';
    };

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
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Trophy className="text-yellow-400" size={40} />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Рейтинг</h1>
                        </div>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Лучшие программисты платформы RunCode
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto">
                        {loading ? (
                            <div className="flex justify-center py-24">
                                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <p className="text-red-400 text-xl mb-4">{error}</p>
                                <button
                                    onClick={fetchRatings}
                                    className="px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors"
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-gray-400 text-xl">Рейтинг пока пуст</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border ${getRankColor(user.rank)} rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-300`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Rank */}
                                            <div className="flex-shrink-0 w-12 text-center">
                                                {getRankIcon(user.rank) || (
                                                    <span className="text-2xl font-bold text-gray-400">
                                                        #{user.rank}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="w-14 h-14 rounded-full border-2 border-cyan-500/30"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 flex items-center justify-center">
                                                        <User size={24} className="text-cyan-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                                                    {user.username}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    Решено задач: <span className="text-green-400 font-semibold">{user.solved}</span>
                                                </p>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex-shrink-0 text-right">
                                                <div className="text-2xl font-bold text-cyan-400 mb-1">
                                                    {user.rating}
                                                </div>
                                                <div className="text-xs text-gray-500">очков</div>
                                            </div>
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
