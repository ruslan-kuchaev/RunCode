import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createLanguageSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  icon: z.string().min(1, 'Иконка обязательна'),
  extension: z.string().min(1, 'Расширение файла обязательно'),
  monacoLanguage: z.string().min(1, 'Monaco Language ID обязателен'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { extension: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const languages = await prisma.language.findMany({
      where,
      include: {
        _count: {
          select: {
            tasks: true,
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Calculate additional stats for each language
    const languagesWithStats = await Promise.all(
      languages.map(async (language) => {
        const usersCount = await prisma.user.count({
          where: {
            solvedTasks: {
              some: {
                task: {
                  languageId: language.id
                }
              }
            }
          }
        });

        return {
          ...language,
          tasksCount: language._count.tasks,
          usersCount,
        };
      })
    );

    return NextResponse.json({ languages: languagesWithStats });

  } catch (error) {
    console.error('Get languages error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const languageData = createLanguageSchema.parse(body);

    // Check if language with same name already exists
    const existingLanguage = await prisma.language.findFirst({
      where: {
        OR: [
          { name: languageData.name },
          { extension: languageData.extension },
          { monacoLanguage: languageData.monacoLanguage }
        ]
      }
    });

    if (existingLanguage) {
      return NextResponse.json(
        { error: 'Язык с таким названием, расширением или Monaco ID уже существует' },
        { status: 400 }
      );
    }

    // Create language
    const language = await prisma.language.create({
      data: languageData,
    });

    return NextResponse.json({
      message: 'Язык программирования успешно создан',
      language
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create language error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}