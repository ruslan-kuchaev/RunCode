import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const getRatingSchema = z.object({
  period: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  level: z.string().nullable().optional(),
  sortBy: z.string().nullable().optional(),
  sortOrder: z.string().nullable().optional(),
  limit: z.string().nullable().optional(),
}).transform((data) => ({
  period: (data.period && ['week', 'month', 'all'].includes(data.period)) 
    ? data.period as 'week' | 'month' | 'all' 
    : 'all',
  search: data.search || undefined,
  level: data.level || undefined,
  sortBy: (data.sortBy && ['points', 'tasks', 'streak', 'joined'].includes(data.sortBy))
    ? data.sortBy as 'points' | 'tasks' | 'streak' | 'joined'
    : 'points',
  sortOrder: (data.sortOrder && ['asc', 'desc'].includes(data.sortOrder))
    ? data.sortOrder as 'asc' | 'desc'
    : 'desc',
  limit: data.limit || '100',
}));

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { period, search, level, sortBy, sortOrder, limit } = getRatingSchema.parse({
      period: searchParams.get('period'),
      search: searchParams.get('search'),
      level: searchParams.get('level'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      limit: searchParams.get('limit'),
    });

    const limitNum = parseInt(limit);

    // Build where clause for filtering
    const where: any = {
      status: 'ACTIVE', // Only show active users
    };

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Date filtering for period
    let dateFilter = {};
    if (period !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      dateFilter = {
        lastLoginAt: {
          gte: startDate,
        }
      };
    }

    // Get users with their stats
    const users = await prisma.user.findMany({
      where: {
        ...where,
        ...dateFilter,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        totalPoints: true,
        rating: true,
        country: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            solvedTasks: true,
            submissions: true,
          }
        }
      },
      take: limitNum,
      orderBy: { totalPoints: 'desc' } // Default ordering by points
    });

    // Calculate additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user, index) => {
        // Get solved tasks count
        const solvedCount = await prisma.userTask.count({
          where: { 
            userId: user.id, 
            status: 'SOLVED' 
          }
        });

        // Calculate current streak (simplified - you might want to implement proper streak calculation)
        const recentSolvedTasks = await prisma.userTask.findMany({
          where: {
            userId: user.id,
            status: 'SOLVED',
          },
          orderBy: { solvedAt: 'desc' },
          take: 30, // Look at last 30 solved tasks
        });

        // Simple streak calculation - consecutive days with solved tasks
        let streak = 0;
        const today = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        for (let i = 0; i < recentSolvedTasks.length; i++) {
          const taskDate = new Date(recentSolvedTasks[i].solvedAt || new Date());
          const daysDiff = Math.floor((today.getTime() - taskDate.getTime()) / oneDayMs);
          
          if (daysDiff === i) {
            streak++;
          } else {
            break;
          }
        }

        // Determine level based on solved tasks
        let level = 'Новичок';
        if (solvedCount >= 100) level = 'Легенда';
        else if (solvedCount >= 75) level = 'Мастер';
        else if (solvedCount >= 50) level = 'Эксперт';
        else if (solvedCount >= 25) level = 'Продвинутый';
        else if (solvedCount >= 10) level = 'Средний';

        // Get user badges (simplified - you might want to implement proper badge system)
        const badges = [];
        if (solvedCount >= 1) badges.push({ id: 1, name: 'Первые шаги', icon: '🚀', description: 'Решил первое задание', rarity: 'common' });
        if (streak >= 7) badges.push({ id: 2, name: 'Марафонец', icon: '🏃', description: 'Решал задания 7 дней подряд', rarity: 'rare' });
        if (solvedCount >= 50) badges.push({ id: 3, name: 'Мастер кода', icon: '🟨', description: 'Решил 50 заданий', rarity: 'epic' });
        if (index < 10) badges.push({ id: 4, name: 'Топ-10', icon: '👑', description: 'Топ-10 в рейтинге', rarity: 'legendary' });

        return {
          id: user.id,
          username: user.username,
          avatar: user.avatar || '👤',
          totalPoints: user.totalPoints || 0,
          solvedTasks: solvedCount,
          rank: index + 1,
          level,
          streak,
          joinedAt: user.createdAt,
          lastActive: user.lastLoginAt || user.createdAt,
          badges,
          country: user.country,
        };
      })
    );

    // Apply level filter if specified
    let filteredUsers = usersWithStats;
    if (level && level !== 'Все уровни') {
      filteredUsers = usersWithStats.filter(user => user.level === level);
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue: number | Date;
      let bValue: number | Date;
      
      switch (sortBy) {
        case 'points':
          aValue = a.totalPoints;
          bValue = b.totalPoints;
          break;
        case 'tasks':
          aValue = a.solvedTasks;
          bValue = b.solvedTasks;
          break;
        case 'streak':
          aValue = a.streak;
          bValue = b.streak;
          break;
        case 'joined':
          aValue = a.joinedAt;
          bValue = b.joinedAt;
          break;
        default:
          aValue = a.totalPoints;
          bValue = b.totalPoints;
      }
      
      if (sortBy === 'joined') {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      
      const numA = aValue as number;
      const numB = bValue as number;
      return sortOrder === 'desc' ? numB - numA : numA - numB;
    });

    // Update ranks after sorting
    filteredUsers = filteredUsers.map((user, index) => ({ ...user, rank: index + 1 }));

    // Calculate stats for the response
    const totalUsers = filteredUsers.length;
    const totalPoints = filteredUsers.reduce((sum, user) => sum + user.totalPoints, 0);
    const totalSolvedTasks = filteredUsers.reduce((sum, user) => sum + user.solvedTasks, 0);
    const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;

    return NextResponse.json({
      users: filteredUsers,
      stats: {
        totalUsers,
        totalPoints,
        totalSolvedTasks,
        averagePoints,
      }
    });

  } catch (error) {
    console.error('Get rating error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}