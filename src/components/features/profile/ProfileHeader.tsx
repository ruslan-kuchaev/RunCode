'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { signOut } from 'next-auth/react';
import { 
    Edit3, 
    Save, 
    X, 
    MapPin, 
    Globe, 
    Github, 
    Linkedin, 
    Twitter,
    Calendar,
    Trophy,
    Target,
    Zap,
    Camera,
    LogOut,
    Settings
} from 'lucide-react';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    rating: number;
    level: string;
    totalPoints: number;
    solvedTasks: number;
    streak: number;
    joinedAt: Date;
    lastActive: Date;
}

interface ProfileHeaderProps {
    user: UserProfile;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (updates: Partial<UserProfile>) => void;
    onCancel: () => void;
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

export default function ProfileHeader({ user, isEditing, onEdit, onSave, onCancel }: ProfileHeaderProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: user.username,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
    });

    const headerRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (headerRef.current) {
            gsap.set(headerRef.current, { opacity: 0, y: 30 });
            gsap.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
            });
        }

        if (avatarRef.current) {
            gsap.set(avatarRef.current, { opacity: 0, scale: 0.8 });
            gsap.to(avatarRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.2,
            });
        }

        if (statsRef.current) {
            const statCards = statsRef.current.querySelectorAll('.stat-card');
            gsap.set(statCards, { opacity: 0, y: 20 });
            gsap.to(statCards, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.4,
            });
        }
    }, []);

    const handleSave = () => {
        onSave(formData);
    };

    const handleLogout = async () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            await signOut({ 
                callbackUrl: '/',
                redirect: true 
            });
        }
    };

    const handleAdminPanel = () => {
        router.push('/admin');
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
        }).format(date);
    };

    return (
        <div ref={headerRef} className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Avatar and basic info */}
                    <div className="flex flex-col items-center lg:items-start">
                        <div ref={avatarRef} className="relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-6xl border-4 border-gray-600 group-hover:border-cyan-500/50 transition-all duration-300">
                                {user.avatar}
                            </div>
                            <button className="absolute bottom-2 right-2 w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-full flex items-center justify-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 text-center lg:text-left">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className="text-3xl font-bold text-white bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:border-cyan-500"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                            )}
                            
                            <div className="flex items-center justify-center lg:justify-start space-x-3 mt-2">
                                <span className={`text-lg font-medium px-4 py-2 rounded-full border ${getLevelColor(user.level)}`}>
                                    {user.level}
                                </span>
                                <span className="text-gray-400 flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>С {formatDate(user.joinedAt)}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 space-y-6">
                        {/* Bio */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">О себе</h3>
                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    placeholder="Расскажите о себе..."
                                    className="w-full h-24 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                                />
                            ) : (
                                <p className="text-gray-300 leading-relaxed">
                                    {user.bio || 'Пользователь пока не добавил информацию о себе.'}
                                </p>
                            )}
                        </div>

                        {/* Contact info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Location */}
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        placeholder="Местоположение"
                                        className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-1 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                    />
                                ) : (
                                    <span className="text-gray-300">{user.location || 'Не указано'}</span>
                                )}
                            </div>

                            {/* Website */}
                            <div className="flex items-center space-x-2">
                                <Globe className="w-5 h-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        placeholder="Веб-сайт"
                                        className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-1 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                    />
                                ) : user.website ? (
                                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                        {user.website}
                                    </a>
                                ) : (
                                    <span className="text-gray-500">Не указано</span>
                                )}
                            </div>

                            {/* GitHub */}
                            <div className="flex items-center space-x-2">
                                <Github className="w-5 h-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.github}
                                        onChange={(e) => handleInputChange('github', e.target.value)}
                                        placeholder="GitHub username"
                                        className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-1 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                    />
                                ) : user.github ? (
                                    <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                        @{user.github}
                                    </a>
                                ) : (
                                    <span className="text-gray-500">Не указано</span>
                                )}
                            </div>

                            {/* LinkedIn */}
                            <div className="flex items-center space-x-2">
                                <Linkedin className="w-5 h-5 text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.linkedin}
                                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                        placeholder="LinkedIn username"
                                        className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-1 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                    />
                                ) : user.linkedin ? (
                                    <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                        @{user.linkedin}
                                    </a>
                                ) : (
                                    <span className="text-gray-500">Не указано</span>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end space-x-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={onCancel}
                                        className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-lg border border-gray-500 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Отмена</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/50 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Сохранить</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Показываем кнопку админ панели только для админов и модераторов */}
                                    {session && (session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                                        <button
                                            onClick={handleAdminPanel}
                                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/50 transition-all duration-300 flex items-center space-x-2"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Админ панель</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/50 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Выйти</span>
                                    </button>
                                    <button
                                        onClick={onEdit}
                                        className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg border border-gray-600 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        <span>Редактировать</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div ref={statsRef} className="lg:w-80">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="stat-card bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-yellow-400">{user.totalPoints.toLocaleString()}</div>
                                <div className="text-sm text-gray-400">Рейтинг</div>
                            </div>
                            
                            <div className="stat-card bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-400">{user.solvedTasks}</div>
                                <div className="text-sm text-gray-400">Заданий решено</div>
                            </div>
                            
                            <div className="stat-card bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 text-center lg:col-span-1 col-span-2">
                                <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-orange-400">{user.streak}</div>
                                <div className="text-sm text-gray-400">Дней подряд</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}