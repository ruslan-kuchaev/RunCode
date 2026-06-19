import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

// PATCH - Update task
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { id } = await params;
    const taskId = parseInt(id);
    const body = await req.json();

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: body,
      include: { language: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin task PATCH error:', error);
    return NextResponse.json({ error: 'Ошибка обновления задачи' }, { status: 500 });
  }
}
