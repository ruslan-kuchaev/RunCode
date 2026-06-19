'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LightRays from '@/components/shared/LightRays';
import { LayoutDashboard, LayoutGrid, Menu, Loader2 } from 'lucide-react';

type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
type TaskStatus = 'STARTED' | 'SOLVED' | 'UNFINISHED';

interface Language {
    id: number;
    name: string;
    icon: string;
}

interface Task {
    id: number;
    title: string;
    shortDescription: string;
    difficulty: TaskDifficulty;
    price: number;
    preview?: string;
    languageId: number;
    language: Language;
    userTask?: { status: TaskStatus };
}

const difficultyColor: Record<TaskDifficulty, string> = {
    EASY:   'bg-green-500/20 text-green-400 border-green-500/50',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    HARD:   'bg-orange-500/20 text-orange-400 border-orange-500/50',
    EXPERT: 'bg-red-500/20 text-red-400 border-red-500/50',
};
const difficultyLabel: Record<TaskDifficulty, string> = {
    EASY: 'Легко', MEDIUM: 'Средне', HARD: 'Сложно', EXPERT: 'Эксперт',
};
const statusColor: Record<TaskStatus, string> = {
    SOLVED:     'bg-green-500/20 text-green-400 border-green-500/50',
    STARTED:    'bg-blue-500/20 text-blue-400 border-blue-500/50',
    UNFINISHED: 'bg-red-500/20 text-red-400 border-red-500/50',
};
const statusLabel: Record<TaskStatus, string> = {
    SOLVED: '✅ Решено', STARTED: '🔄 В процессе', UNFINISHED: '❌ Не завершено',
};

export default function TasksPage() {
    const router = useRouter();

    const [tasks, setTasks]                           = useState<Task[]>([]);
    const [languages, setLanguages]                   = useState<Language[]>([]);
    const [loading, setLoading]                       = useState(true);
    const [error, setError]                           = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<TaskDifficulty | 'ALL'>('ALL');
    const [selectedLanguage, setSelectedLanguage]     = useState<number | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery]               = useState('');
    const [layout, setLayout]                         = useState<'grid' | 'list'>('grid');

    const titleRef     = useRef<HTMLHeadingElement>(null);
    const subtitleRef  = useRef<HTMLParagraphElement>(null);
    const tasksGridRef = useRef<HTMLDivElement>(null);
    const tasksListRef = useRef<HTMLDivElement>(null);
    const statsRef     = useRef<HTMLDivElement>(null);

    // Load tasks from API
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (selectedDifficulty !== 'ALL') params.set('difficulty', selectedDifficulty);
            if (selectedLanguage !== 'ALL') params.set('languageId', String(selectedLanguage));
            if (searchQuery) params.set('search', searchQuery);

            const res = await fetch(`/api/tasks?${params.toString()}`);
            if (!res.ok) throw new Error('Ошибка загрузки');
            const data: Task[] = await res.json();
            setTasks(data);

            // Build unique language list from loaded tasks
            const langMap = new Map<number, Language>();
            data.forEach((t) => langMap.set(t.language.id, t.language));
            setLanguages(Array.from(langMap.values()));
        } catch {
            setError('Не удалось загрузить задачи');
        } finally {
            setLoading(false);
        }
    }, [selectedDifficulty, selectedLanguage, searchQuery]);

    useEffect(() => {
        const t = setTimeout(fetchTasks, searchQuery ? 400 : 0);
        return () => clearTimeout(t);
    }, [fetchTasks, searchQuery]);

    // Entrance animation
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        if (titleRef.current && subtitleRef.current) {
            tl.fromTo(
                [titleRef.current, subtitleRef.current],
                { opacity: 0, y: -16 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
            );
        }
        if (statsRef.current) {
            tl.fromTo(statsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.1');
        }
    }, []);

    // Animate task cards when list or layout changes
    useGSAP(() => {
        if (loading) return;
        const ref = layout === 'grid' ? tasksGridRef.current : tasksListRef.current;
        if (!ref) return;
        const items = Array.from(ref.children) as HTMLElement[];
        if (!items.length) return;
        gsap.fromTo(
            items,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out' }
        );
    }, { dependencies: [tasks, layout, loading] });

    const handleTaskClick = (taskId: number) => {
        if ('startViewTransition' in document) {
            (document as any).startViewTransition(() => router.push(`/tasks/${taskId}`));
        } else {
            router.push(`/tasks/${taskId}`);
        }
    };

    const stats = [
        { value: tasks.length, label: 'Всего заданий' },
        { value: tasks.filter((t) => t.userTask?.status === 'SOLVED').length, label: 'Решено' },
        { value: tasks.filter((t) => t.userTask?.status === 'STARTED').length, label: 'В процессе' },
        { value: tasks.filter((t) => t.userTask?.status === 'SOLVED').reduce((s, t) => s + t.price, 0), label: 'Заработано очков' },
    ];

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
                        <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ opacity: 0 }}>
                            Задания
                        </h1>
                        <p ref={subtitleRef} className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ opacity: 0 }}>
                            Выберите задание и начните свой путь в программировании.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Поиск по названию или описанию..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 pl-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="max-w-6xl mx-auto mb-8">
                        <div className="flex flex-wrap gap-6 justify-center">
                            {/* Layout toggle */}
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setLayout('grid')}
                                    className={`p-2 rounded-lg border transition-colors duration-200 ${layout === 'grid' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setLayout('list')}
                                    className={`p-2 rounded-lg border transition-colors duration-200 ${layout === 'list' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'}`}
                                >
                                    <Menu size={18} />
                                </button>
                                <button disabled className="p-2 rounded-lg border bg-gray-900/50 text-gray-600 border-gray-800/50 cursor-not-allowed opacity-40" title="В разработке">
                                    <LayoutDashboard size={18} />
                                </button>
                            </div>

                            {/* Difficulty filter */}
                            <div className="flex flex-wrap gap-2">
                                {(['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXPERT'] as const).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDifficulty(d)}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm border transition-colors duration-200 ${
                                            selectedDifficulty === d
                                                ? d === 'ALL' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : difficultyColor[d as TaskDifficulty]
                                                : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                                        }`}
                                    >
                                        {d === 'ALL' ? 'Все' : difficultyLabel[d]}
                                    </button>
                                ))}
                            </div>

                            {/* Language filter */}
                            {languages.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedLanguage('ALL')}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm border transition-colors duration-200 ${selectedLanguage === 'ALL' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'}`}
                                    >
                                        Все языки
                                    </button>
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => setSelectedLanguage(lang.id)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm border flex items-center gap-1.5 transition-colors duration-200 ${selectedLanguage === lang.id ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'}`}
                                        >
                                            <span>{lang.icon}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Task list */}
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="flex justify-center py-24">
                                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <p className="text-red-400 text-xl mb-4">{error}</p>
                                <button
                                    onClick={fetchTasks}
                                    className="px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors"
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-gray-400 text-xl">Задания не найдены</p>
                            </div>
                        ) : layout === 'grid' ? (
                            <div ref={tasksGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleTaskClick(task.id)}
                                        className="group relative flex flex-col bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors duration-300 cursor-pointer"
                                        style={{ opacity: 0 }}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 flex-1 pr-2 leading-snug">
                                                {task.preview && <span className="mr-2">{task.preview}</span>}
                                                {task.title}
                                            </h3>
                                            <span className={`${difficultyColor[task.difficulty]} text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0`}>
                                                {difficultyLabel[task.difficulty]}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
                                            {task.shortDescription}
                                        </p>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{task.language.icon}</span>
                                                <span className="text-gray-300 text-sm font-medium">{task.language.name}</span>
                                            </div>
                                            <div className="text-base font-bold text-cyan-400">
                                                {task.price} <span className="text-xs text-gray-500 font-normal">очков</span>
                                            </div>
                                        </div>
                                        {task.userTask && (
                                            <div className="mb-3">
                                                <span className={`${statusColor[task.userTask.status]} text-xs font-medium px-2.5 py-1 rounded-full border inline-block`}>
                                                    {statusLabel[task.userTask.status]}
                                                </span>
                                            </div>
                                        )}
                                        <button className="mt-auto w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 font-semibold py-2.5 rounded-lg border border-cyan-500/50 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500 transition-colors duration-200 text-sm">
                                            {task.userTask?.status === 'STARTED' ? 'Продолжить →' : 'Начать задание'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div ref={tasksListRef} className="space-y-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleTaskClick(task.id)}
                                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-cyan-500/50 transition-colors duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                        style={{ opacity: 0 }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors duration-200">
                                                    {task.preview && <span className="mr-1">{task.preview}</span>}
                                                    {task.title}
                                                </h3>
                                                <span className={`${difficultyColor[task.difficulty]} text-xs font-semibold px-2.5 py-0.5 rounded-full border`}>
                                                    {difficultyLabel[task.difficulty]}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span>{task.language.icon}</span>
                                                    <span className="text-gray-400 text-xs">{task.language.name}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-sm">{task.shortDescription}</p>
                                            {task.userTask && (
                                                <span className={`${statusColor[task.userTask.status]} text-xs font-medium px-2.5 py-0.5 rounded-full border inline-block mt-2`}>
                                                    {statusLabel[task.userTask.status]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <div className="text-base font-bold text-cyan-400 whitespace-nowrap">
                                                {task.price} <span className="text-xs text-gray-500 font-normal">очков</span>
                                            </div>
                                            <button className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 font-semibold py-2 px-4 rounded-lg border border-cyan-500/50 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500 transition-colors duration-200 text-sm whitespace-nowrap">
                                                {task.userTask?.status === 'STARTED' ? 'Продолжить →' : 'Начать'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    {!loading && !error && (
                        <div ref={statsRef} className="max-w-6xl mx-auto mt-16" style={{ opacity: 0 }}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 text-center hover:border-cyan-500/50 transition-colors duration-300">
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
