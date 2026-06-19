import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

// PATCH - Update user
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const { role, rating } = await req.json();

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role !== undefined && { role }),
        ...(rating !== undefined && { rating }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        rating: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin user PATCH error:', error);
    return NextResponse.json({ error: 'Ошибка обновления пользователя' }, { status: 500 });
  }
}
