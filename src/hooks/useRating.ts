import { useState, useEffect, useCallback } from 'react';
import { useApiWithCache } from './useApiWithCache';

export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface RatingUser {
  id: number;
  username: string;
  avatar: string; // Always has a value (either URL or emoji fallback)
  totalPoints: number;
  solvedTasks: number;
  rank: number;
  level: string;
  streak: number;
  joinedAt: Date;
  lastActive: Date;
  badges: Badge[];
  country?: string;
}

export interface RatingStats {
  totalUsers: number;
  totalPoints: number;
  totalSolvedTasks: number;
  averagePoints: number;
}

export interface RatingResponse {
  users: RatingUser[];
  stats: RatingStats;
}

export interface RatingFilters {
  period: 'week' | 'month' | 'all';
  search: string;
  level: string;
  sortBy: 'points' | 'tasks' | 'streak' | 'joined';
  sortOrder: 'asc' | 'desc';
}

export function useRating() {
  const [users, setUsers] = useState<RatingUser[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    totalUsers: 0,
    totalPoints: 0,
    totalSolvedTasks: 0,
    averagePoints: 0,
  });
  const [filters, setFilters] = useState<RatingFilters>({
    period: 'all',
    search: '',
    level: 'Все уровни',
    sortBy: 'points',
    sortOrder: 'desc',
  });

  const { request, loading, error, fromCache, clearCache } = useApiWithCache<RatingResponse>();

  const fetchRating = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        period: filters.period,
        ...(filters.search && { search: filters.search }),
        ...(filters.level !== 'Все уровни' && { level: filters.level }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: '100', // Get top 100 users
      });

      const url = `/api/users/rating?${params}`;
      const response = await request(url, {
        cache: true,
        cacheTTL: 5 * 60 * 1000, // 5 minutes for rating data
        persistent: true, // Save to localStorage
      });

      setUsers(response.users);
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  }, [request, filters]);

  // Fetch rating when filters change
  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const updateFilters = useCallback((newFilters: Partial<RatingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshRating = useCallback(async () => {
    clearCache(); // Clear all cache
    await fetchRating();
  }, [clearCache, fetchRating]);

  return {
    users,
    stats,
    filters,
    loading,
    error,
    fromCache, // Shows if data was loaded from cache
    updateFilters,
    refreshRating,
    clearCache,
  };
}