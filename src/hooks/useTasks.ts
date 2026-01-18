import { useState, useEffect, useCallback } from 'react';
import { useApiWithCache } from './useApiWithCache';

export interface Task {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  price: number;
  preview?: string;
  languageId: number;
  startCode: string;
  solutionCode?: string;
  testCases?: string;
  hints?: string;
  tags?: string;
  isActive: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  language: {
    id: number;
    name: string;
    icon: string;
  };
  solvedCount: number;
  attemptsCount: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateTaskData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  price: number;
  languageId: number;
  startCode: string;
  solutionCode?: string;
  testCases?: string;
  hints?: string;
  tags?: string;
  preview?: string;
  isActive?: boolean;
}

export interface TaskFilters {
  search: string;
  difficulty: 'ALL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  languageId: string;
}

export function useTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]); // Все задачи с сервера
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Отфильтрованные задачи
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    difficulty: 'ALL',
    languageId: '',
  });

  const { request, loading, error, fromCache, clearCache } = useApiWithCache<TasksResponse>();

  // Загружаем все задачи один раз при инициализации
  const fetchAllTasks = useCallback(async () => {
    try {
      const response = await request('/api/tasks?all=true', {
        cache: true,
        cacheTTL: 10 * 60 * 1000, // 10 минут для задач
        persistent: true, // Сохраняем в localStorage
      });
      setAllTasks(response.tasks);
      setFilteredTasks(response.tasks); // Изначально показываем все задачи
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [request]);

  // Клиентская фильтрация
  const applyFilters = useCallback(() => {
    let filtered = [...allTasks];

    // Поиск по названию и описанию
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.shortDescription.toLowerCase().includes(searchLower) ||
        task.fullDescription.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по сложности
    if (filters.difficulty !== 'ALL') {
      filtered = filtered.filter(task => task.difficulty === filters.difficulty);
    }

    // Фильтр по языку программирования
    if (filters.languageId) {
      const languageIdNum = parseInt(filters.languageId);
      filtered = filtered.filter(task => task.languageId === languageIdNum);
    }

    // Показываем только активные задачи для обычных пользователей
    filtered = filtered.filter(task => task.isActive);

    setFilteredTasks(filtered);
  }, [allTasks, filters]);

  // Применяем фильтры при изменении фильтров или задач
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Загружаем задачи при инициализации
  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  const createTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      await request('/api/tasks', {
        method: 'POST',
        body: taskData,
        cache: false, // Не кешируем POST запросы
      });
      // Очищаем кеш задач после создания
      clearCache('/api/tasks?all=true');
      await fetchAllTasks(); // Перезагружаем все задачи
    } catch (error) {
      throw error;
    }
  }, [request, fetchAllTasks, clearCache]);

  const updateTask = useCallback(async (id: number, taskData: Partial<CreateTaskData>) => {
    try {
      await request(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: taskData,
        cache: false,
      });
      // Очищаем кеш после обновления
      clearCache('/api/tasks?all=true');
      clearCache(`/api/tasks/${id}`);
      await fetchAllTasks(); // Перезагружаем все задачи
    } catch (error) {
      throw error;
    }
  }, [request, fetchAllTasks, clearCache]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await request(`/api/tasks/${id}`, {
        method: 'DELETE',
        cache: false,
      });
      // Очищаем кеш после удаления
      clearCache('/api/tasks?all=true');
      clearCache(`/api/tasks/${id}`);
      await fetchAllTasks(); // Перезагружаем все задачи
    } catch (error) {
      throw error;
    }
  }, [request, fetchAllTasks, clearCache]);

  const toggleTaskActive = useCallback(async (id: number, isActive: boolean) => {
    try {
      await updateTask(id, { isActive });
    } catch (error) {
      throw error;
    }
  }, [updateTask]);

  return {
    tasks: filteredTasks, // Возвращаем отфильтрованные задачи
    allTasks, // Для админки может понадобиться доступ ко всем задачам
    pagination: {
      page: 1,
      limit: filteredTasks.length,
      total: filteredTasks.length,
      pages: 1,
    },
    filters,
    loading,
    error,
    fromCache, // Показывает, загружены ли данные из кеша
    setFilters,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskActive,
    clearCache,
  };
}