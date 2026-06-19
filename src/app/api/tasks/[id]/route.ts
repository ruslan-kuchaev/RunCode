import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Неверный ID задачи' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        language: true,
        comments: {
          include: {
            user: { select: { id: true, username: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        ...(userId
          ? {
              solutions: {
                where: { userId },
                select: { status: true, code: true, startedAt: true, solvedAt: true },
              },
            }
          : {}),
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 });
    }

    const userTask = userId && (task as any).solutions?.[0]
      ? (task as any).solutions[0]
      : null;

    return NextResponse.json({
      ...task,
      solutions: undefined,
      userTask,
    });
  } catch (error) {
    console.error('Task GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки задачи' }, { status: 500 });
  }
}
