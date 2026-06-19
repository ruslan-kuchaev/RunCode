import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const [totalUsers, totalTasks, totalSolved, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.userTask.count({ where: { status: 'SOLVED' } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, username: true, email: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalTasks,
      totalSolved,
      recentUsers,
    });
  } catch (error) {
    console.error('Admin stats GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки статистики' }, { status: 500 });
  }
}
