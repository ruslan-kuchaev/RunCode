import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const { id } = await params;
    const taskId = parseInt(id);
    const userId = parseInt(session.user.id);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Неверный ID задачи' }, { status: 400 });
    }

    const { code, status } = await req.json();

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 });
    }

    const userTask = await prisma.userTask.upsert({
      where: { userId_taskId: { userId, taskId } },
      create: {
        userId,
        taskId,
        code,
        status: status || 'STARTED',
        ...(status === 'SOLVED' ? { solvedAt: new Date() } : {}),
      },
      update: {
        code,
        status: status || 'STARTED',
        ...(status === 'SOLVED' ? { solvedAt: new Date() } : {}),
      },
    });

    // Update user rating if solved (only if it wasn't solved before)
    if (status === 'SOLVED') {
      // Check if this task was already solved by this user
      const wasPreviouslySolved = await prisma.userTask.findFirst({
        where: { 
          userId, 
          taskId, 
          status: 'SOLVED',
          id: { not: userTask.id }
        },
      });

      // Only increment rating if this is the first time solving
      if (!wasPreviouslySolved) {
        await prisma.user.update({
          where: { id: userId },
          data: { rating: { increment: task.price } },
        });
      }
    }

    return NextResponse.json({ success: true, userTask });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Ошибка отправки решения' }, { status: 500 });
  }
}
