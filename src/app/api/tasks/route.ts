import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const getTasksSchema = z.object({
  page: z.string().nullable().optional(),
  limit: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  languageId: z.string().nullable().optional(),
  isActive: z.string().nullable().optional(),
  all: z.string().nullable().optional(),
}).transform((data) => ({
  page: data.page || '1',
  limit: data.limit || '10',
  search: data.search || undefined,
  difficulty: (data.difficulty && ['EASY', 'MEDIUM', 'HARD', 'EXPERT', 'ALL'].includes(data.difficulty)) 
    ? data.difficulty as 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'ALL' 
    : 'ALL',
  languageId: data.languageId || undefined,
  isActive: data.isActive || undefined,
  all: data.all === 'true',
}));

const createTaskSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  shortDescription: z.string().min(1, 'Краткое описание обязательно'),
  fullDescription: z.string().min(1, 'Полное описание обязательно'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  languageId: z.number().min(1, 'Язык программирования обязателен'),
  startCode: z.string().min(1, 'Стартовый код обязателен'),
  solutionCode: z.string().optional(),
  testCases: z.string().optional(),
  hints: z.string().optional(),
  tags: z.string().optional(),
  preview: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, search, difficulty, languageId, isActive, all } = getTasksSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      difficulty: searchParams.get('difficulty'),
      languageId: searchParams.get('languageId'),
      isActive: searchParams.get('isActive'),
      all: searchParams.get('all'),
    });

    // Если запрашиваются все задачи, не применяем пагинацию и серверную фильтрацию
    if (all) {
      const tasks = await prisma.task.findMany({
        include: {
          language: {
            select: {
              id: true,
              name: true,
              icon: true,
            }
          },
          _count: {
            select: {
              submissions: true,
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ]
      });

      // Получаем количество решенных задач отдельным запросом
      const tasksWithCounts = await Promise.all(
        tasks.map(async (task) => {
          const solvedCount = await prisma.userTask.count({
            where: { 
              taskId: task.id,
              status: 'SOLVED' 
            }
          });

          return {
            ...task,
            solvedCount,
            attemptsCount: task._count.submissions,
          };
        })
      );

      return NextResponse.json({
        tasks: tasksWithCounts,
        pagination: {
          page: 1,
          limit: tasks.length,
          total: tasks.length,
          pages: 1,
        }
      });
    }

    // Оригинальная логика с пагинацией для админки
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (difficulty !== 'ALL') {
      where.difficulty = difficulty;
    }

    if (languageId) {
      where.languageId = parseInt(languageId);
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          language: {
            select: {
              id: true,
              name: true,
              icon: true,
            }
          },
          _count: {
            select: {
              solutions: true,
              submissions: true,
            }
          }
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);

    // Calculate additional stats for each task
    const tasksWithStats = await Promise.all(
      tasks.map(async (task) => {
        const solvedCount = await prisma.userTask.count({
          where: { taskId: task.id, status: 'SOLVED' }
        });

        const attemptsCount = await prisma.submission.count({
          where: { taskId: task.id }
        });

        return {
          ...task,
          solvedCount,
          attemptsCount,
        };
      })
    );

    return NextResponse.json({
      tasks: tasksWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const taskData = createTaskSchema.parse(body);

    // Check if language exists
    const language = await prisma.language.findUnique({
      where: { id: taskData.languageId }
    });

    if (!language) {
      return NextResponse.json(
        { error: 'Язык программирования не найден' },
        { status: 400 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: taskData,
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
      message: 'Задание успешно создано',
      task
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}