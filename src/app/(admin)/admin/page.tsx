'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LightRays from '@/components/shared/LightRays';
import FPSCounter from "@/components/debug/FpsCounter";
import {
    AdminHeader,
    AdminSidebar,
    AdminDashboard,
    TasksManagement,
    LanguagesManagement,
    UsersManagement
} from '@/components/features/admin';

type AdminTab = 'dashboard' | 'tasks' | 'languages' | 'users';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [autoOpenTaskModal, setAutoOpenTaskModal] = useState(false);
    const [autoOpenLanguageModal, setAutoOpenLanguageModal] = useState(false);

    useEffect(() => {
        if (status === 'loading') return; // Still loading

        if (!session) {
            router.push('/');
            return;
        }

        // Check if user has admin or moderator role
        if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
            router.push('/');
            return;
        }
    }, [session, status, router]);

    // Show loading while checking authentication
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Проверка доступа...</p>
                </div>
            </div>
        );
    }

    // Show access denied if not authenticated or not admin/moderator
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-4">Доступ запрещен</h1>
                    <p className="text-gray-400 mb-4">У вас нет прав для доступа к этой странице</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        );
    }

    const handleTabChange = (tab: AdminTab) => {
        setActiveTab(tab);
        // Reset modal states when changing tabs
        setAutoOpenTaskModal(false);
        setAutoOpenLanguageModal(false);
    };

    const handleQuickAction = (action: 'tasks' | 'languages' | 'users') => {
        switch (action) {
            case 'tasks':
                setActiveTab('tasks');
                setAutoOpenTaskModal(true);
                break;
            case 'languages':
                setActiveTab('languages');
                setAutoOpenLanguageModal(true);
                break;
            case 'users':
                setActiveTab('users');
                break;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard onTabChange={handleQuickAction} />;
            case 'tasks':
                return (
                    <TasksManagement 
                        autoOpenCreateModal={autoOpenTaskModal}
                        onModalClose={() => setAutoOpenTaskModal(false)}
                    />
                );
            case 'languages':
                return (
                    <LanguagesManagement 
                        autoOpenCreateModal={autoOpenLanguageModal}
                        onModalClose={() => setAutoOpenLanguageModal(false)}
                    />
                );
            case 'users':
                return <UsersManagement />;
            default:
                return <AdminDashboard onTabChange={handleQuickAction} />;
        }
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
                    raysOrigin="top-left"
                    raysColor="#ff6b35"
                    raysSpeed={0.5}
                    lightSpread={2}
                    rayLength={1.5}
                    followMouse={false}
                    mouseInfluence={0.05}
                    noiseAmount={0.15}
                    distortion={0.03}
                    className="custom-rays z-10"
                />
            </div>

            <div className="min-h-screen bg-gray-900 relative z-10">
                <AdminHeader />
                
                <div className="flex">
                    <AdminSidebar 
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                    
                    <main className="flex-1 p-6">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </>
    );
}