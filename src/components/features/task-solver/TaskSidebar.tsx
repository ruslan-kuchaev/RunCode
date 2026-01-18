'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
    BookOpen, 
    History, 
    Lightbulb, 
    ChevronLeft, 
    ChevronRight,
    GripVertical
} from 'lucide-react';

interface Task {
    id: number;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
}

interface TaskSidebarProps {
    task: Task;
    activeTab: 'description' | 'submissions' | 'hints';
    onTabChange: (tab: 'description' | 'submissions' | 'hints') => void;
    width: number;
    onWidthChange: (width: number) => void;
    children: React.ReactNode;
}

export default function TaskSidebar({
    task,
    activeTab,
    onTabChange,
    width,
    onWidthChange,
    children
}: TaskSidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const tabs = [
        { id: 'description', label: 'Описание', icon: BookOpen },
        { id: 'submissions', label: 'Попытки', icon: History },
        { id: 'hints', label: 'Подсказки', icon: Lightbulb },
    ] as const;

    useGSAP(() => {
        if (sidebarRef.current) {
            gsap.fromTo(sidebarRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        const startX = e.clientX;
        const startWidth = width;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(300, Math.min(600, startWidth + (e.clientX - startX)));
            onWidthChange(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
            onWidthChange(60); // Collapsed width
        } else {
            onWidthChange(400); // Default width
        }
    };

    return (
        <div
            ref={sidebarRef}
            className="bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col relative"
            style={{ width: isCollapsed ? 60 : width }}
        >
            {/* Resize handle */}
            <div
                className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-cyan-500/50 transition-colors duration-200 ${
                    isResizing ? 'bg-cyan-500/50' : ''
                }`}
                onMouseDown={handleMouseDown}
            >
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                    <GripVertical className="w-4 h-4 text-gray-500" />
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                {!isCollapsed && (
                    <h2 className="text-lg font-semibold text-white truncate">
                        Задача #{task.id}
                    </h2>
                )}
                
                <button
                    onClick={toggleCollapse}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {!isCollapsed && (
                <>
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700/50">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </>
            )}

            {isCollapsed && (
                <div className="flex flex-col items-center py-4 space-y-4">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    onTabChange(tab.id);
                                    toggleCollapse();
                                }}
                                className={`p-3 rounded-lg transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'text-cyan-400 bg-cyan-500/20'
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                                }`}
                                title={tab.label}
                            >
                                <IconComponent className="w-5 h-5" />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}