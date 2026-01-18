'use client';

import { useState } from 'react';
import LightRays from '@/components/shared/LightRays';
import FPSCounter from "@/components/debug/FpsCounter";
import { AchievementsList, ActivityCalendar, LearningProgress, ProfileHeader, ProfileSettings, ProfileStats, ProfileTabs, RecentActivity, SkillsChart } from '@/components/features/profile';


// Типы данных
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
    badges: Badge[];
    skills: Skill[];
    preferences: UserPreferences;
}

interface Badge {
    id: number;
    name: string;
    icon: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlockedAt: Date;
}

interface Skill {
    id: number;
    name: string;
    level: number;
    experience: number;
    maxExperience: number;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}

interface UserPreferences {
    theme: 'dark' | 'light' | 'auto';
    language: 'ru' | 'en';
    notifications: {
        email: boolean;
        push: boolean;
        achievements: boolean;
        reminders: boolean;
    };
    privacy: {
        showEmail: boolean;
        showStats: boolean;
        showActivity: boolean;
    };
}

interface LearningData {
    totalHours: number;
    weeklyGoal: number;
    currentWeekHours: number;
    dailyActivity: { date: string; hours: number; tasks: number }[];
    monthlyProgress: { month: string; tasks: number; hours: number }[];
}

interface Activity {
    id: number;
    type: 'task_completed' | 'badge_earned' | 'streak_milestone' | 'level_up';
    title: string;
    description: string;
    timestamp: Date;
    points?: number;
    badge?: Badge;
}

// Моковые данные
const mockUser: UserProfile = {
    id: 1,
    username: 'CodeMaster2024',
    email: 'codemaster@example.com',
    avatar: '👨‍💻',
    bio: 'Passionate full-stack developer with 5+ years of experience. Love solving complex problems and learning new technologies.',
    location: 'Москва, Россия',
    website: 'https://codemaster.dev',
    github: 'codemaster2024',
    linkedin: 'codemaster-dev',
    twitter: 'codemaster_dev',
    rating: 15420,
    level: 'Легенда',
    totalPoints: 15420,
    solvedTasks: 127,
    streak: 45,
    joinedAt: new Date('2024-01-15'),
    lastActive: new Date('2025-01-18'),
    badges: [
        { id: 1, name: 'Первые шаги', icon: '🚀', description: 'Решил первое задание', rarity: 'common', unlockedAt: new Date('2024-01-16') },
        { id: 2, name: 'Марафонец', icon: '🏃', description: 'Решал задания 30 дней подряд', rarity: 'rare', unlockedAt: new Date('2024-02-15') },
        { id: 3, name: 'Мастер JS', icon: '🟨', description: 'Решил 50 заданий по JavaScript', rarity: 'epic', unlockedAt: new Date('2024-03-20') },
        { id: 4, name: 'Легенда', icon: '👑', description: 'Достиг топ-10 в рейтинге', rarity: 'legendary', unlockedAt: new Date('2024-12-01') },
        { id: 5, name: 'Скоростной', icon: '⚡', description: 'Решил задание за 5 минут', rarity: 'rare', unlockedAt: new Date('2024-05-10') },
        { id: 6, name: 'Перфекционист', icon: '💎', description: 'Решил 100 заданий без ошибок', rarity: 'epic', unlockedAt: new Date('2024-11-15') },
    ],
    skills: [
        { id: 1, name: 'JavaScript', level: 8, experience: 2400, maxExperience: 3000, category: 'frontend' },
        { id: 2, name: 'React', level: 7, experience: 1800, maxExperience: 2500, category: 'frontend' },
        { id: 3, name: 'Node.js', level: 6, experience: 1200, maxExperience: 2000, category: 'backend' },
        { id: 4, name: 'TypeScript', level: 7, experience: 1600, maxExperience: 2500, category: 'frontend' },
        { id: 5, name: 'Python', level: 5, experience: 800, maxExperience: 1500, category: 'backend' },
        { id: 6, name: 'PostgreSQL', level: 4, experience: 600, maxExperience: 1200, category: 'database' },
    ],
    preferences: {
        theme: 'dark',
        language: 'ru',
        notifications: {
            email: true,
            push: true,
            achievements: true,
            reminders: false,
        },
        privacy: {
            showEmail: false,
            showStats: true,
            showActivity: true,
        },
    },
};

const mockLearningData: LearningData = {
    totalHours: 342,
    weeklyGoal: 10,
    currentWeekHours: 7.5,
    dailyActivity: [
        { date: '2025-01-12', hours: 2.5, tasks: 3 },
        { date: '2025-01-13', hours: 1.5, tasks: 2 },
        { date: '2025-01-14', hours: 3.0, tasks: 4 },
        { date: '2025-01-15', hours: 0.5, tasks: 1 },
        { date: '2025-01-16', hours: 2.0, tasks: 2 },
        { date: '2025-01-17', hours: 1.5, tasks: 2 },
        { date: '2025-01-18', hours: 2.5, tasks: 3 },
    ],
    monthlyProgress: [
        { month: 'Сен', tasks: 15, hours: 28 },
        { month: 'Окт', tasks: 22, hours: 35 },
        { month: 'Ноя', tasks: 18, hours: 32 },
        { month: 'Дек', tasks: 25, hours: 42 },
        { month: 'Янв', tasks: 20, hours: 38 },
    ],
};

const mockRecentActivity: Activity[] = [
    {
        id: 1,
        type: 'task_completed',
        title: 'Задание выполнено',
        description: 'Создание React компонента',
        timestamp: new Date('2025-01-18T14:30:00'),
        points: 100,
    },
    {
        id: 2,
        type: 'badge_earned',
        title: 'Новое достижение',
        description: 'Получена награда "Перфекционист"',
        timestamp: new Date('2025-01-17T16:45:00'),
        badge: mockUser.badges[5],
    },
    {
        id: 3,
        type: 'streak_milestone',
        title: 'Серия продолжается',
        description: '45 дней подряд решения заданий',
        timestamp: new Date('2025-01-17T09:15:00'),
    },
    {
        id: 4,
        type: 'level_up',
        title: 'Повышение уровня',
        description: 'Достигнут уровень "Легенда"',
        timestamp: new Date('2025-01-15T20:20:00'),
    },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'activity' | 'achievements'>('overview');
    const [user, setUser] = useState<UserProfile>(mockUser);
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdateProfile = (updates: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...updates }));
        setIsEditing(false);
    };

    const handleUpdatePreferences = (preferences: UserPreferences) => {
        setUser(prev => ({ ...prev, preferences }));
    };

    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -20,
                }}
            >
                <FPSCounter />
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#00ffff"
                    raysSpeed={1}
                    lightSpread={2}
                    rayLength={1.5}
                    followMouse={false}
                    mouseInfluence={0.1}
                    noiseAmount={0.08}
                    distortion={0.04}
                    className="custom-rays z-10"
                />
            </div>

            <section className="w-full min-h-screen relative z-10">
                <div className="container mx-auto px-4 py-8">
                    <ProfileHeader 
                        user={user}
                        isEditing={isEditing}
                        onEdit={() => setIsEditing(true)}
                        onSave={handleUpdateProfile}
                        onCancel={() => setIsEditing(false)}
                    />

                    <ProfileTabs 
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <div className="mt-8">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <ProfileStats user={user} />
                                        <LearningProgress data={mockLearningData} />
                                        <ActivityCalendar data={mockLearningData.dailyActivity} />
                                    </div>
                                    <div className="space-y-8">
                                        <SkillsChart skills={user.skills} />
                                        <RecentActivity activities={mockRecentActivity} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <ProfileSettings 
                                user={user}
                                onUpdateProfile={handleUpdateProfile}
                                onUpdatePreferences={handleUpdatePreferences}
                            />
                        )}

                        {activeTab === 'activity' && (
                            <div className="space-y-8">
                                <ActivityCalendar data={mockLearningData.dailyActivity} />
                                <RecentActivity activities={mockRecentActivity} showAll />
                            </div>
                        )}

                        {activeTab === 'achievements' && (
                            <AchievementsList badges={user.badges} />
                        )}
                    </div>

                    <footer className="border-t border-gray-800 mt-16">
                        <div className="container mx-auto px-4 py-8">
                            <div className="text-center text-gray-500">
                                <p>&copy; 2025 RunCode. Interactive programming trainer platform.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </section>
        </>
    );
}