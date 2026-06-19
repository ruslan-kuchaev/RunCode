import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        rating: true,
        createdAt: true,
        role: true,
        solvedTasks: {
          include: {
            task: {
              include: { language: true },
            },
          },
          orderBy: { startedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const solved = user.solvedTasks.filter((t) => t.status === 'SOLVED').length;
    const started = user.solvedTasks.filter((t) => t.status === 'STARTED').length;
    const totalEarned = user.solvedTasks
      .filter((t) => t.status === 'SOLVED')
      .reduce((acc, t) => acc + t.task.price, 0);

    return NextResponse.json({
      ...user,
      stats: { solved, started, totalEarned, total: user.solvedTasks.length },
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки профиля' }, { status: 500 });
  }
}
