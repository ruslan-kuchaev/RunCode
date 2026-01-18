'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { 
    LayoutDashboard,
    FileText,
    Code,
    Users,
    Settings,
    BarChart3,
    Database,
    Shield
} from 'lucide-react';

type AdminTab = 'dashboard' | 'tasks' | 'languages' | 'users';

interface AdminSidebarProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
}

const menuItems = [
    { id: 'dashboard', label: 'Панель управления', icon: LayoutDashboard },
    { id: 'tasks', label: 'Управление заданиями', icon: FileText },
    { id: 'languages', label: 'Языки программирования', icon: Code },
    { id: 'users', label: 'Пользователи', icon: Users },
] as const;

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { stats } = useAdminStats();

    useGSAP(() => {
        if (sidebarRef.current) {
            const menuItems = sidebarRef.current.querySelectorAll('.menu-item');
            gsap.set(menuItems, { opacity: 0, x: -20 });
            gsap.to(menuItems, {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            });
        }
    }, []);

    return (
        <aside ref={sidebarRef} className="w-64 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700/50 min-h-screen">
            <div className="p-6">
                {/* Admin badge */}
                <div className="flex items-center space-x-2 mb-8 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <Shield className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-medium">Режим администратора</span>
                </div>

                {/* Navigation menu */}
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id as AdminTab)}
                                className={`menu-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    activeTab === item.id
                                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                                }`}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Quick stats */}
                <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Быстрая статистика</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Всего заданий:</span>
                            <span className="text-white font-medium">{stats?.overview.totalTasks || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Пользователей:</span>
                            <span className="text-white font-medium">{stats?.overview.totalUsers || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Языков:</span>
                            <span className="text-white font-medium">{stats?.overview.totalLanguages || 0}</span>
                        </div>
                    </div>
                </div>

                {/* System status */}
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">Система работает</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}