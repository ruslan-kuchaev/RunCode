import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateLanguageSchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  extension: z.string().min(1).optional(),
  monacoLanguage: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const languageId = parseInt(id);

    const language = await prisma.language.findUnique({
      where: { id: languageId },
      include: {
        _count: {
          select: {
            tasks: true,
          }
        }
      }
    });

    if (!language) {
      return NextResponse.json({ error: 'Язык не найден' }, { status: 404 });
    }

    // Get users count who solved tasks in this language
    const usersCount = await prisma.user.count({
      where: {
        solvedTasks: {
          some: {
            task: {
              languageId: languageId
            }
          }
        }
      }
    });

    return NextResponse.json({
      ...language,
      tasksCount: language._count.tasks,
      usersCount,
    });

  } catch (error) {
    console.error('Get language error:', error);
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
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { id } = await params;
    const languageId = parseInt(id);
    const body = await request.json();
    const updateData = updateLanguageSchema.parse(body);

    // Check for duplicates if updating unique fields
    if (updateData.name || updateData.extension || updateData.monacoLanguage) {
      const where: any = {
        id: { not: languageId },
        OR: []
      };

      if (updateData.name) {
        where.OR.push({ name: updateData.name });
      }
      if (updateData.extension) {
        where.OR.push({ extension: updateData.extension });
      }
      if (updateData.monacoLanguage) {
        where.OR.push({ monacoLanguage: updateData.monacoLanguage });
      }

      if (where.OR.length > 0) {
        const existingLanguage = await prisma.language.findFirst({ where });
        
        if (existingLanguage) {
          return NextResponse.json(
            { error: 'Язык с таким названием, расширением или Monaco ID уже существует' },
            { status: 400 }
          );
        }
      }
    }

    const language = await prisma.language.update({
      where: { id: languageId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Язык программирования успешно обновлен',
      language
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update language error:', error);
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
    const languageId = parseInt(id);

    // Check if language has tasks
    const taskCount = await prisma.task.count({
      where: { languageId }
    });

    if (taskCount > 0) {
      return NextResponse.json({
        error: `Нельзя удалить язык, так как он используется в ${taskCount} заданиях`
      }, { status: 400 });
    }

    // Delete language
    await prisma.language.delete({
      where: { id: languageId }
    });

    return NextResponse.json({
      message: 'Язык программирования успешно удален'
    });

  } catch (error) {
    console.error('Delete language error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}