import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

const taskSchema = z.object({
  title: z.string().min(3, 'Название минимум 3 символа'),
  shortDescription: z.string().min(10, 'Краткое описание минимум 10 символов'),
  fullDescription: z.string().min(20, 'Полное описание минимум 20 символов'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  price: z.number().min(1, 'Цена минимум 1'),
  languageId: z.number(),
  startCode: z.string().min(1, 'Стартовый код обязателен'),
  preview: z.string().optional(),
});

// GET - Get all tasks for admin
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const tasks = await prisma.task.findMany({
      include: {
        language: true,
        _count: {
          select: {
            solutions: { where: { status: 'SOLVED' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = tasks.map((t) => ({
      ...t,
      solvedCount: t._count.solutions,
      _count: undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Admin tasks GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки задач' }, { status: 500 });
  }
}

// POST - Create new task
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: parsed.data,
      include: { language: true },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Admin task POST error:', error);
    return NextResponse.json({ error: 'Ошибка создания задачи' }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'ID задачи не указан' }, { status: 400 });
    }

    await prisma.task.delete({ where: { id: taskId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin task DELETE error:', error);
    return NextResponse.json({ error: 'Ошибка удаления задачи' }, { status: 500 });
  }
}
