import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    
    // Users can only view their own tasks unless they're admin/moderator
    if (session.user.id !== id && 
        session.user.role !== 'ADMIN' && 
        session.user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const userTasks = await prisma.userTask.findMany({
      where: { userId },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            price: true,
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json({ userTasks });

  } catch (error) {
    console.error('Get user tasks error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}