import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { Task, TasksResponse, CreateTaskData } from './useTasks';

export function useAdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'ALL' as 'ALL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT',
    languageId: '',
    isActive: '',
  });

  const { request, loading, error } = useApi<TasksResponse>();

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.difficulty !== 'ALL' && { difficulty: filters.difficulty }),
        ...(filters.languageId && { languageId: filters.languageId }),
        ...(filters.isActive && { isActive: filters.isActive }),
      });

      const response = await request(`/api/tasks?${params}`);
      setTasks(response.tasks);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [request, pagination.page, pagination.limit, filters]);

  const createTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      await request('/api/tasks', {
        method: 'POST',
        body: taskData,
      });
      await fetchTasks(); // Refresh tasks list
    } catch (error) {
      throw error;
    }
  }, [request, fetchTasks]);

  const updateTask = useCallback(async (id: number, taskData: Partial<CreateTaskData>) => {
    try {
      await request(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: taskData,
      });
      await fetchTasks(); // Refresh tasks list
    } catch (error) {
      throw error;
    }
  }, [request, fetchTasks]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await request(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      await fetchTasks(); // Refresh tasks list
    } catch (error) {
      throw error;
    }
  }, [request, fetchTasks]);

  const toggleTaskActive = useCallback(async (id: number, isActive: boolean) => {
    try {
      await updateTask(id, { isActive });
    } catch (error) {
      throw error;
    }
  }, [updateTask]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    pagination,
    filters,
    loading,
    error,
    setFilters,
    setPagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskActive,
  };
}