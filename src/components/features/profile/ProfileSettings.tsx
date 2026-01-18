'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
    Settings, 
    User, 
    Bell, 
    Shield, 
    Palette, 
    Globe, 
    Save,
    Eye,
    EyeOff,
    Mail,
    Smartphone,
    Award,
    Clock
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
    preferences: UserPreferences;
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

interface ProfileSettingsProps {
    user: UserProfile;
    onUpdateProfile: (updates: Partial<UserProfile>) => void;
    onUpdatePreferences: (preferences: UserPreferences) => void;
}

export default function ProfileSettings({ user, onUpdateProfile, onUpdatePreferences }: ProfileSettingsProps) {
    const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>('profile');
    const [preferences, setPreferences] = useState<UserPreferences>(user.preferences);
    const [profileData, setProfileData] = useState({
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
    });

    const settingsRef = useRef<HTMLDivElement>(null);

    const sections = [
        { id: 'profile', label: 'Профиль', icon: User },
        { id: 'notifications', label: 'Уведомления', icon: Bell },
        { id: 'privacy', label: 'Приватность', icon: Shield },
        { id: 'appearance', label: 'Внешний вид', icon: Palette },
    ] as const;

    useGSAP(() => {
        if (settingsRef.current) {
            const settingsSections = settingsRef.current.querySelectorAll('.settings-section');
            gsap.set(settingsSections, { opacity: 0, x: -30 });
            gsap.to(settingsSections, {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }
    }, []);

    const handlePreferenceChange = (category: keyof UserPreferences, key: string, value: any) => {
        if (category === 'theme' || category === 'language') {
            setPreferences(prev => ({
                ...prev,
                [category]: value,
            }));
        } else {
            setPreferences(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [key]: value,
                },
            }));
        }
    };

    const handleProfileChange = (key: string, value: string) => {
        setProfileData(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveProfile = () => {
        onUpdateProfile(profileData);
    };

    const handleSavePreferences = () => {
        onUpdatePreferences(preferences);
    };

    const renderProfileSettings = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Информация профиля</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Имя пользователя</label>
                    <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => handleProfileChange('username', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">О себе</label>
                <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Расскажите о себе..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Местоположение</label>
                    <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Город, Страна"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Веб-сайт</label>
                    <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => handleProfileChange('website', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="https://example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                    <input
                        type="text"
                        value={profileData.github}
                        onChange={(e) => handleProfileChange('github', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="username"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                    <input
                        type="text"
                        value={profileData.linkedin}
                        onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="username"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                    <input
                        type="text"
                        value={profileData.twitter}
                        onChange={(e) => handleProfileChange('twitter', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="username"
                    />
                </div>
            </div>

            <button
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/50 transition-all duration-300 flex items-center space-x-2"
            >
                <Save className="w-5 h-5" />
                <span>Сохранить профиль</span>
            </button>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Настройки уведомлений</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                            <div className="font-medium text-white">Email уведомления</div>
                            <div className="text-sm text-gray-400">Получать уведомления на email</div>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.notifications.email}
                            onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-green-400" />
                        <div>
                            <div className="font-medium text-white">Push уведомления</div>
                            <div className="text-sm text-gray-400">Уведомления в браузере</div>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.notifications.push}
                            onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <div>
                            <div className="font-medium text-white">Достижения</div>
                            <div className="text-sm text-gray-400">Уведомления о новых достижениях</div>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.notifications.achievements}
                            onChange={(e) => handlePreferenceChange('notifications', 'achievements', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <div>
                            <div className="font-medium text-white">Напоминания</div>
                            <div className="text-sm text-gray-400">Напоминания о решении заданий</div>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.notifications.reminders}
                            onChange={(e) => handlePreferenceChange('notifications', 'reminders', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>
            </div>

            <button
                onClick={handleSavePreferences}
                className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/50 transition-all duration-300 flex items-center space-x-2"
            >
                <Save className="w-5 h-5" />
                <span>Сохранить настройки</span>
            </button>
        </div>
    );

    const renderPrivacySettings = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Настройки приватности</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        {preferences.privacy.showEmail ? <Eye className="w-5 h-5 text-green-400" /> : <EyeOff className="w-5 h-5 text-red-400" />}
                        <div>
                            <div className="font-medium text-white">Показывать email</div>
                            <div className="text-sm text-gray-400">Другие пользователи смогут видеть ваш email</div>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.privacy.showEmail}
                            onChange={(e) => handlePreferenceChange('privacy', 'showEmail', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        {preferences.privacy.showStats ? <Eye className="w-5 h-5 text-green-400" /> : <EyeOff className="w-5 h-5 text-red-400" />}
                        <div>
                            <div className="font-medium text-white">Показывать статистику</div>
                            <div className="text-sm text-gray-400">Публичная статистика решенных заданий</div>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.privacy.showStats}
                            onChange={(e) => handlePreferenceChange('privacy', 'showStats', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        {preferences.privacy.showActivity ? <Eye className="w-5 h-5 text-green-400" /> : <EyeOff className="w-5 h-5 text-red-400" />}
                        <div>
                            <div className="font-medium text-white">Показывать активность</div>
                            <div className="text-sm text-gray-400">Календарь активности и последняя активность</div>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.privacy.showActivity}
                            onChange={(e) => handlePreferenceChange('privacy', 'showActivity', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>
            </div>

            <button
                onClick={handleSavePreferences}
                className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/50 transition-all duration-300 flex items-center space-x-2"
            >
                <Save className="w-5 h-5" />
                <span>Сохранить настройки</span>
            </button>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Внешний вид</h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Тема</label>
                    <div className="grid grid-cols-3 gap-3">
                        {(['dark', 'light', 'auto'] as const).map((theme) => (
                            <button
                                key={theme}
                                onClick={() => handlePreferenceChange('theme', '', theme)}
                                className={`p-4 rounded-lg border transition-all duration-300 ${
                                    preferences.theme === theme
                                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                        : 'bg-gray-800/30 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-2">
                                        {theme === 'dark' && '🌙'}
                                        {theme === 'light' && '☀️'}
                                        {theme === 'auto' && '🔄'}
                                    </div>
                                    <div className="text-sm font-medium">
                                        {theme === 'dark' && 'Темная'}
                                        {theme === 'light' && 'Светлая'}
                                        {theme === 'auto' && 'Авто'}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Язык</label>
                    <div className="grid grid-cols-2 gap-3">
                        {(['ru', 'en'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handlePreferenceChange('language', '', lang)}
                                className={`p-4 rounded-lg border transition-all duration-300 ${
                                    preferences.language === lang
                                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                        : 'bg-gray-800/30 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Globe className="w-5 h-5" />
                                    <span className="font-medium">
                                        {lang === 'ru' ? 'Русский' : 'English'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleSavePreferences}
                className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/50 transition-all duration-300 flex items-center space-x-2"
            >
                <Save className="w-5 h-5" />
                <span>Сохранить настройки</span>
            </button>
        </div>
    );

    return (
        <div ref={settingsRef} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="settings-section lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        <span>Настройки</span>
                    </h2>
                    <nav className="space-y-2">
                        {sections.map((section) => {
                            const IconComponent = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                        activeSection === section.id
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Settings Content */}
            <div className="settings-section lg:col-span-3">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
                    {activeSection === 'profile' && renderProfileSettings()}
                    {activeSection === 'notifications' && renderNotificationSettings()}
                    {activeSection === 'privacy' && renderPrivacySettings()}
                    {activeSection === 'appearance' && renderAppearanceSettings()}
                </div>
            </div>
        </div>
    );
}