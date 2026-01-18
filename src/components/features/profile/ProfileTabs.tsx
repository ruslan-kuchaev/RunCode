'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { User, Settings, Activity, Award } from 'lucide-react';

interface ProfileTabsProps {
    activeTab: 'overview' | 'settings' | 'activity' | 'achievements';
    onTabChange: (tab: 'overview' | 'settings' | 'activity' | 'achievements') => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    const tabsRef = useRef<HTMLDivElement>(null);

    const tabs = [
        { id: 'overview', label: 'Обзор', icon: User },
        { id: 'activity', label: 'Активность', icon: Activity },
        { id: 'achievements', label: 'Достижения', icon: Award },
        { id: 'settings', label: 'Настройки', icon: Settings },
    ] as const;

    useGSAP(() => {
        if (tabsRef.current) {
            const tabButtons = tabsRef.current.querySelectorAll('.tab-button');
            gsap.set(tabButtons, { opacity: 0, y: 20 });
            gsap.to(tabButtons, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.6,
            });
        }
    }, []);

    return (
        <div ref={tabsRef} className="mt-8">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-2">
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`tab-button flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}