'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye,
    Copy,
    FileText,
    Code,
    DollarSign,
    Users,
    X
} from 'lucide-react';
import { CreateTaskData, Task } from '@/hooks/useTasks';
import { useAdminTasks } from '@/hooks/useAdminTasks';
import { useLanguages } from '@/hooks/useLanguages';

type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

interface TasksManagementProps {
    autoOpenCreateModal?: boolean;
    onModalClose?: () => void;
}

export default function TasksManagement({ autoOpenCreateModal = false, onModalClose }: TasksManagementProps) {
    const { data: session } = useSession();
    const { 
        tasks, 
        filters, 
        loading, 
        setFilters, 
        createTask, 
        deleteTask, 
        toggleTaskActive 
    } = useAdminTasks();
    const { languages } = useLanguages();
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState<CreateTaskData>({
        title: '',
        shortDescription: '',
        fullDescription: '',
        difficulty: 'EASY',
        price: 100,
        languageId: 1,
        startCode: '',
        preview: '',
    });

    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll('.animate-item');
            gsap.set(elements, { opacity: 0, y: 20 });
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }, []);

    // Auto-open create modal if requested
    useEffect(() => {
        if (autoOpenCreateModal) {
            setShowCreateModal(true);
        }
    }, [autoOpenCreateModal]);

    const handleDeleteTask = async (taskId: number) => {
        if (confirm('Вы уверены, что хотите удалить это задание?')) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                alert('Ошибка при удалении задания');
            }
        }
    };

    const handleToggleActive = async (taskId: number, isActive: boolean) => {
        try {
            await toggleTaskActive(taskId, !isActive);
        } catch (error) {
            alert('Ошибка при изменении статуса задания');
        }
    };

    const handleDuplicateTask = async (task: Task) => {
        try {
            const duplicatedTask: CreateTaskData = {
                title: `${task.title} (копия)`,
                shortDescription: task.shortDescription,
                fullDescription: task.fullDescription,
                difficulty: task.difficulty,
                price: task.price,
                languageId: task.languageId,
                startCode: task.startCode,
                solutionCode: task.solutionCode,
                testCases: task.testCases,
                hints: task.hints,
                tags: task.tags,
                preview: task.preview,
            };
            await createTask(duplicatedTask);
        } catch (error) {
            alert('Ошибка при дублировании задания');
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.shortDescription || !newTask.fullDescription || !newTask.startCode) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        try {
            await createTask(newTask);
            setNewTask({
                title: '',
                shortDescription: '',
                fullDescription: '',
                difficulty: 'EASY',
                price: 100,
                languageId: languages[0]?.id || 1,
                startCode: '',
                preview: '',
            });
            setShowCreateModal(false);
        } catch (error) {
            alert('Ошибка при создании задания');
        }
    };

    const resetNewTask = () => {
        setNewTask({
            title: '',
            shortDescription: '',
            fullDescription: '',
            difficulty: 'EASY',
            price: 100,
            languageId: languages[0]?.id || 1,
            startCode: '',
            preview: '',
        });
        setShowCreateModal(false);
        onModalClose?.();
    };

    const handleSearchChange = (value: string) => {
        setFilters({ ...filters, search: value });
    };

    const handleDifficultyChange = (difficulty: string) => {
        setFilters({ ...filters, difficulty: difficulty as any });
    };

    const getDifficultyColor = (difficulty: TaskDifficulty) => {
        switch (difficulty) {
            case 'EASY': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'HARD': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            case 'EXPERT': return 'bg-red-500/20 text-red-400 border-red-500/50';
        }
    };

    const getDifficultyLabel = (difficulty: TaskDifficulty) => {
        switch (difficulty) {
            case 'EASY': return 'Легко';
            case 'MEDIUM': return 'Средне';
            case 'HARD': return 'Сложно';
            case 'EXPERT': return 'Эксперт';
        }
    };

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Доступ запрещен</h1>
                    <p className="text-gray-400">У вас нет прав для доступа к этой странице</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="space-y-6">
            {/* Header */}
            <div className="animate-item flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Управление заданиями</h1>
                    <p className="text-gray-400">Создавайте, редактируйте и управляйте заданиями</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Создать задание</span>
                </button>
            </div>

            {/* Stats */}
            <div className="animate-item grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{tasks.length}</div>
                            <div className="text-sm text-gray-400">Всего заданий</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-green-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{tasks.reduce((sum, t) => sum + t.solvedCount, 0)}</div>
                            <div className="text-sm text-gray-400">Решений</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Code className="w-8 h-8 text-purple-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{tasks.filter(t => t.isActive).length}</div>
                            <div className="text-sm text-gray-400">Активных</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <DollarSign className="w-8 h-8 text-yellow-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{tasks.reduce((sum, t) => sum + t.price, 0)}</div>
                            <div className="text-sm text-gray-400">Общая стоимость</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="animate-item bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск заданий..."
                            value={filters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                        />
                    </div>

                    {/* Difficulty filter */}
                    <select
                        value={filters.difficulty}
                        onChange={(e) => handleDifficultyChange(e.target.value)}
                        className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                    >
                        <option value="ALL">Все сложности</option>
                        <option value="EASY">Легко</option>
                        <option value="MEDIUM">Средне</option>
                        <option value="HARD">Сложно</option>
                        <option value="EXPERT">Эксперт</option>
                    </select>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="animate-item bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Задание</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Язык</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Сложность</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Цена</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статистика</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статус</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                        Загрузка заданий...
                                    </td>
                                </tr>
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                        Заданий не найдено
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-700/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-white">{task.title}</div>
                                            <div className="text-sm text-gray-400 mt-1 max-w-xs truncate">
                                                {task.shortDescription}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xl">{task.language.icon}</span>
                                            <span className="text-white">{task.language.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(task.difficulty)}`}>
                                            {getDifficultyLabel(task.difficulty)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-yellow-400 font-medium">{task.price} очков</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="text-green-400">{task.solvedCount} решений</div>
                                            <div className="text-gray-400">{task.attemptsCount} попыток</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(task.id, task.isActive)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                task.isActive 
                                                    ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                                                    : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                                            }`}
                                        >
                                            {task.isActive ? 'Активно' : 'Неактивно'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => handleDuplicateTask(task)}
                                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                                                title="Дублировать"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200"
                                                title="Просмотр"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                                title="Удалить"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty state */}
            {!loading && tasks.length === 0 && (
                <div className="animate-item text-center py-12">
                    <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400 mb-2">Заданий не найдено</h3>
                    <p className="text-gray-500">Попробуйте изменить фильтры или создать новое задание</p>
                </div>
            )}

            {/* Create Task Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998]">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Создать новое задание</h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetNewTask();
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Название задания <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                        placeholder="Создание React компонента"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Краткое описание <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={newTask.shortDescription}
                                        onChange={(e) => setNewTask({...newTask, shortDescription: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                        placeholder="Создайте переиспользуемый компонент кнопки с поддержкой различных состояний"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Сложность</label>
                                        <select
                                            value={newTask.difficulty}
                                            onChange={(e) => setNewTask({...newTask, difficulty: e.target.value as TaskDifficulty})}
                                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                        >
                                            <option value="EASY">Легко</option>
                                            <option value="MEDIUM">Средне</option>
                                            <option value="HARD">Сложно</option>
                                            <option value="EXPERT">Эксперт</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Цена (очки)</label>
                                        <input
                                            type="number"
                                            value={newTask.price}
                                            onChange={(e) => setNewTask({...newTask, price: parseInt(e.target.value) || 0})}
                                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Язык программирования</label>
                                    <select
                                        value={newTask.languageId}
                                        onChange={(e) => setNewTask({...newTask, languageId: parseInt(e.target.value)})}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.id} value={lang.id}>
                                                {lang.icon} {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Превью (URL изображения)</label>
                                    <input
                                        type="url"
                                        value={newTask.preview || ''}
                                        onChange={(e) => setNewTask({...newTask, preview: e.target.value})}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                        placeholder="https://example.com/preview.png"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Полное описание <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={newTask.fullDescription}
                                        onChange={(e) => setNewTask({...newTask, fullDescription: e.target.value})}
                                        rows={8}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                        placeholder="Подробное описание задания с требованиями, примерами и критериями оценки..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Стартовый код <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={newTask.startCode}
                                        onChange={(e) => setNewTask({...newTask, startCode: e.target.value})}
                                        rows={12}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-500/50"
                                        placeholder="// Начальный код для задания
function Button(props) {
  // Ваш код здесь
  return null;
}

export default Button;"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-700/50">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetNewTask();
                                }}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleCreateTask}
                                className="px-6 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-all duration-200"
                            >
                                Создать задание
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}