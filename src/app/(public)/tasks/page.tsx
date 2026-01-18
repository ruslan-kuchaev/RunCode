'use client';

import { useState } from 'react';
import LightRays from '@/components/shared/LightRays';
import FPSCounter from "@/components/debug/FpsCounter";
import CacheDebug from "@/components/debug/CacheDebug";
import {
    TasksHeader,
    TasksFilters,
    TasksGrid,
    TasksList,
    TasksStats
} from '@/components/features/tasks';
import { useTasks } from '@/hooks/useTasks';
import { useLanguages } from '@/hooks/useLanguages';
import { useUserTasks } from '@/hooks/useUserTasks';

type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export default function TasksPage() {
    const { 
        tasks, 
        filters, 
        loading, 
        error, 
        setFilters 
    } = useTasks();
    const { languages } = useLanguages();
    const { getUserTaskForTask } = useUserTasks();
    
    const [menuSelectedLayout, setMenuSelectedLayout] = useState<"grid" | "list">("grid");

    // Combine tasks with user task data
    const tasksWithUserData = tasks.map(task => ({
        ...task,
        userTask: getUserTaskForTask(task.id)
    }));

    const handleDifficultyChange = (difficulty: TaskDifficulty | 'ALL') => {
        setFilters({ ...filters, difficulty });
    };

    const handleLanguageChange = (languageId: number | 'ALL') => {
        setFilters({ ...filters, languageId: languageId === 'ALL' ? '' : languageId.toString() });
    };

    const handleSearchChange = (search: string) => {
        setFilters({ ...filters, search });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Загрузка заданий...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-4">Ошибка загрузки</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

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
                <FPSCounter/>
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
                    <TasksHeader 
                        searchQuery={filters.search}
                        onSearchChange={handleSearchChange}
                    />

                    <TasksFilters
                        selectedDifficulty={filters.difficulty as TaskDifficulty | 'ALL'}
                        onDifficultyChange={handleDifficultyChange}
                        selectedLanguage={filters.languageId ? parseInt(filters.languageId) : 'ALL'}
                        onLanguageChange={handleLanguageChange}
                        menuSelectedLayout={menuSelectedLayout}
                        onLayoutChange={setMenuSelectedLayout}
                        languages={languages}
                    />

                    <div className="max-w-7xl mx-auto">
                        {tasksWithUserData.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-gray-400 mb-2">Заданий не найдено</h3>
                                <p className="text-gray-500">Попробуйте изменить фильтры поиска</p>
                            </div>
                        ) : menuSelectedLayout === "grid" ? (
                            <TasksGrid tasks={tasksWithUserData} />
                        ) : (
                            <TasksList tasks={tasksWithUserData} />
                        )}
                    </div>

                    <TasksStats tasks={tasksWithUserData} />

                    <footer className="border-t border-gray-800 mt-16">
                        <div className="container mx-auto px-4 py-8">
                            <div className="text-center text-gray-500">
                                <p>&copy; 2025 RunCode. Interactive programming trainer platform.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </section>

            <CacheDebug />
        </>
    );
}