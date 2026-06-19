import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

// GET - Get all users
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { username: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {},
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        rating: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            solvedTasks: { where: { status: 'SOLVED' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u) => ({
      ...u,
      solvedTasks: u._count.solvedTasks,
      _count: undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки пользователей' }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя не указан' }, { status: 400 });
    }

    // Prevent deleting yourself
    const session = await getServerSession(authOptions);
    if (session?.user?.id === String(userId)) {
      return NextResponse.json({ error: 'Нельзя удалить себя' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin user DELETE error:', error);
    return NextResponse.json({ error: 'Ошибка удаления пользователя' }, { status: 500 });
  }
}
