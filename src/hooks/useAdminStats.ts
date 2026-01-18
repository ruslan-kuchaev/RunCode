import { useState, useEffect, useCallback } from 'react';
import { useApiWithCache } from './useApiWithCache';

export interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    totalTasks: number;
    activeTasks: number;
    totalLanguages: number;
    activeLanguages: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    totalPointsAwarded: number;
  };
  recentActivity: {
    newUsersThisWeek: number;
    newTasksThisWeek: number;
    submissionsThisWeek: number;
  };
  topLanguages: Array<{
    id: number;
    name: string;
    icon: string;
    tasksCount: number;
  }>;
  recentSubmissions: Array<{
    id: number;
    status: string;
    createdAt: string;
    user: {
      username: string;
      avatar: string | null;
    };
    task: {
      title: string;
      difficulty: string;
    };
  }>;
  distributions: {
    difficulty: Array<{
      difficulty: string;
      count: number;
    }>;
    submissionStatus: Array<{
      status: string;
      count: number;
    }>;
  };
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { request, loading, error, fromCache, clearCache } = useApiWithCache<AdminStats>();

  const fetchStats = useCallback(async () => {
    try {
      const response = await request('/api/stats', {
        cache: true,
        cacheTTL: 2 * 60 * 1000, // 2 минуты для статистики (часто обновляется)
        persistent: false, // Не сохраняем в localStorage (данные админа)
      });
      setStats(response);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  }, [request]);

  const refreshStats = useCallback(async () => {
    clearCache('/api/stats');
    await fetchStats();
  }, [clearCache, fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fromCache,
    refreshStats,
  };
}