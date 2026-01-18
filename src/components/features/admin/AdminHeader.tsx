'use client';

import { useRef, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
    Shield, 
    Bell, 
    Settings, 
    LogOut, 
    User,
    ChevronDown,
    X
} from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
    // Removed onSettingsClick prop
}

export default function AdminHeader({}: AdminHeaderProps) {
    const headerRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const [showNotifications, setShowNotifications] = useState(false);

    // Mock notifications data
    const notifications = [
        { id: 1, message: 'Новый пользователь зарегистрировался', time: '2 мин назад', type: 'info' },
        { id: 2, message: 'Задание "React компонент" было решено', time: '5 мин назад', type: 'success' },
        { id: 3, message: 'Ошибка в системе тестирования', time: '10 мин назад', type: 'error' },
        { id: 4, message: 'Добавлен новый язык программирования', time: '1 час назад', type: 'info' },
    ];

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    useGSAP(() => {
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
        }
    }, []);

    const handleLogout = async () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            await signOut({ callbackUrl: '/' });
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            default: return 'text-blue-400';
        }
    };

    return (
        <header ref={headerRef} className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 relative z-[100]">
            <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors">
                        <Shield className="w-8 h-8" />
                        <span className="text-xl font-bold">RunCode Admin</span>
                    </Link>
                    
                    <div className="h-6 w-px bg-gray-600" />
                    
                    <div className="text-sm text-gray-400">
                        Панель администратора
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationsRef}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-[9999]">
                                <div className="p-4 border-b border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Уведомления</h3>
                                        <button 
                                            onClick={() => setShowNotifications(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div key={notification.id} className="p-3 hover:bg-gray-700/30 border-b border-gray-700/50 last:border-b-0">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(notification.type).replace('text-', 'bg-')}`}></div>
                                                    <div className="flex-1">
                                                        <p className="text-white text-sm">{notification.message}</p>
                                                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-400">
                                            Нет новых уведомлений
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-gray-700">
                                    <button 
                                        onClick={() => {
                                            setShowNotifications(false);
                                            // Здесь можно добавить переход на страницу всех уведомлений
                                            alert('Переход на страницу всех уведомлений (функция будет добавлена)');
                                        }}
                                        className="w-full text-center text-orange-400 hover:text-orange-300 text-sm font-medium"
                                    >
                                        Показать все уведомления
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings button removed */}

                    <div className="h-6 w-px bg-gray-600" />

                    {/* User menu */}
                    <div className="relative group">
                        <button className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-orange-400" />
                            </div>
                            <span className="font-medium">{session?.user?.name || 'Администратор'}</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Dropdown menu */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999]">
                            <div className="p-2">
                                <Link href="/profile" className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                                    <User className="w-4 h-4" />
                                    <span>Профиль</span>
                                </Link>
                                <div className="h-px bg-gray-700 my-2" />
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 w-full"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Выйти</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}