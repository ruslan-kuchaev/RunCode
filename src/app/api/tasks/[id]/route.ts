import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  fullDescription: z.string().min(1).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).optional(),
  price: z.number().min(0).optional(),
  languageId: z.number().min(1).optional(),
  startCode: z.string().min(1).optional(),
  solutionCode: z.string().optional(),
  testCases: z.string().optional(),
  hints: z.string().optional(),
  tags: z.string().optional(),
  preview: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        language: {
          select: {
            id: true,
            name: true,
            icon: true,
            extension: true,
            monacoLanguage: true,
          }
        },
        _count: {
          select: {
            submissions: true,
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Задание не найдено' }, { status: 404 });
    }

    // Get additional stats
    const [solvedCount, attemptsCount] = await Promise.all([
      prisma.userTask.count({
        where: { taskId, status: 'SOLVED' }
      }),
      prisma.submission.count({
        where: { taskId }
      })
    ]);

    // Increment view count
    await prisma.task.update({
      where: { id: taskId },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      task: {
        ...task,
        solvedCount,
        attemptsCount,
      }
    });

  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { id } = await params;
    const taskId = parseInt(id);
    const body = await request.json();
    const updateData = updateTaskSchema.parse(body);

    // Check if language exists (if being updated)
    if (updateData.languageId) {
      const language = await prisma.language.findUnique({
        where: { id: updateData.languageId }
      });

      if (!language) {
        return NextResponse.json(
          { error: 'Язык программирования не найден' },
          { status: 400 }
        );
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        language: {
          select: {
            id: true,
            name: true,
            icon: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Задание успешно обновлено',
      task
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { id } = await params;
    const taskId = parseInt(id);

    // Check if task has submissions
    const submissionCount = await prisma.submission.count({
      where: { taskId }
    });

    if (submissionCount > 0) {
      return NextResponse.json({
        error: 'Нельзя удалить задание с существующими решениями'
      }, { status: 400 });
    }

    // Delete task (cascade will handle related records)
    await prisma.task.delete({
      where: { id: taskId }
    });

    return NextResponse.json({
      message: 'Задание успешно удалено'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}