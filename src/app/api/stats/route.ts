import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    // Get basic counts
    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      totalTasks,
      activeTasks,
      totalLanguages,
      activeLanguages,
      totalSubmissions,
      acceptedSubmissions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'BLOCKED' } }),
      prisma.task.count(),
      prisma.task.count({ where: { isActive: true } }),
      prisma.language.count(),
      prisma.language.count({ where: { isActive: true } }),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: 'ACCEPTED' } }),
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      newUsersThisWeek,
      newTasksThisWeek,
      submissionsThisWeek,
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } }
      }),
      prisma.task.count({
        where: { createdAt: { gte: sevenDaysAgo } }
      }),
      prisma.submission.count({
        where: { createdAt: { gte: sevenDaysAgo } }
      }),
    ]);

    // Get top languages by task count
    const topLanguages = await prisma.language.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        _count: {
          select: {
            tasks: true,
          }
        }
      },
      orderBy: {
        tasks: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Get recent submissions
    const recentSubmissions = await prisma.submission.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            avatar: true,
          }
        },
        task: {
          select: {
            title: true,
            difficulty: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get difficulty distribution
    const difficultyStats = await prisma.task.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true,
      }
    });

    // Get submission status distribution
    const submissionStatusStats = await prisma.submission.groupBy({
      by: ['status'],
      _count: {
        status: true,
      }
    });

    // Calculate total points awarded
    const totalPointsAwarded = await prisma.user.aggregate({
      _sum: {
        totalPoints: true,
      }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalTasks,
        activeTasks,
        totalLanguages,
        activeLanguages,
        totalSubmissions,
        acceptedSubmissions,
        totalPointsAwarded: totalPointsAwarded._sum.totalPoints || 0,
      },
      recentActivity: {
        newUsersThisWeek,
        newTasksThisWeek,
        submissionsThisWeek,
      },
      topLanguages: topLanguages.map(lang => ({
        ...lang,
        tasksCount: lang._count.tasks,
      })),
      recentSubmissions,
      distributions: {
        difficulty: difficultyStats.map(stat => ({
          difficulty: stat.difficulty,
          count: stat._count.difficulty,
        })),
        submissionStatus: submissionStatusStats.map(stat => ({
          status: stat.status,
          count: stat._count.status,
        })),
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}