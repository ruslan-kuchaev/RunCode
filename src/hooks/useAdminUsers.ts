import { useState, useEffect, useCallback } from 'react';
import { useApiWithCache } from './useApiWithCache';

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  rating: number;
  totalPoints: number;
  country?: string;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  solvedTasks: number;
  totalAttempts: number;
  _count: {
    solvedTasks: number;
    submissions: number;
  };
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserFilters {
  search: string;
  role: UserRole | 'ALL';
  status: UserStatus | 'ALL';
  page: number;
  limit: number;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 20,
  });

  const { request, loading, error, fromCache, clearCache } = useApiWithCache<UsersResponse>();

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search || '',
        role: filters.role,
        status: filters.status,
      });

      const url = `/api/users?${params}`;
      const response = await request(url, {
        cache: true,
        cacheTTL: 5 * 60 * 1000, // 5 минут для пользователей
        persistent: false, // Не сохраняем в localStorage (данные админа)
      });
      
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [request, filters]);

  const updateUser = useCallback(async (userId: number, updateData: Partial<{
    role: UserRole;
    status: UserStatus;
    username: string;
    email: string;
    country: string;
  }>) => {
    try {
      await request(`/api/users/${userId}`, {
        method: 'PATCH',
        body: updateData,
        cache: false,
      });
      
      // Очищаем кеш и обновляем список
      clearCache();
      await fetchUsers();
    } catch (error) {
      throw error;
    }
  }, [request, fetchUsers, clearCache]);

  const deleteUser = useCallback(async (userId: number) => {
    try {
      await request(`/api/users/${userId}`, {
        method: 'DELETE',
        cache: false,
      });
      
      // Очищаем кеш и обновляем список
      clearCache();
      await fetchUsers();
    } catch (error) {
      throw error;
    }
  }, [request, fetchUsers, clearCache]);

  const blockUser = useCallback(async (userId: number, block: boolean) => {
    try {
      await updateUser(userId, { status: block ? 'BLOCKED' : 'ACTIVE' });
    } catch (error) {
      throw error;
    }
  }, [updateUser]);

  const changeUserRole = useCallback(async (userId: number, role: UserRole) => {
    try {
      await updateUser(userId, { role });
    } catch (error) {
      throw error;
    }
  }, [updateUser]);

  const refreshUsers = useCallback(async () => {
    clearCache();
    await fetchUsers();
  }, [clearCache, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    pagination,
    filters,
    loading,
    error,
    fromCache,
    setFilters,
    fetchUsers,
    updateUser,
    deleteUser,
    blockUser,
    changeUserRole,
    refreshUsers,
  };
}