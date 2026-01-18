import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useApi } from './useApi';

export interface UserTask {
  id: number;
  userId: number;
  taskId: number;
  status: 'STARTED' | 'SOLVED' | 'UNFINISHED';
  startedAt: Date;
  solvedAt?: Date;
  code?: string;
  attempts?: number; // Add attempts property
}

export function useUserTasks() {
  const { data: session } = useSession();
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const { request, loading, error } = useApi<{ userTasks: UserTask[] }>();

  const fetchUserTasks = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await request(`/api/users/${session.user.id}/tasks`);
      setUserTasks(response.userTasks || []);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  }, [request, session?.user?.id]);

  const getUserTaskForTask = useCallback((taskId: number) => {
    return userTasks.find(ut => ut.taskId === taskId);
  }, [userTasks]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserTasks();
    }
  }, [fetchUserTasks, session?.user?.id]);

  return {
    userTasks,
    loading,
    error,
    fetchUserTasks,
    getUserTaskForTask,
  };
}