import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const difficultyMap: Record<string, 'Easy' | 'Medium' | 'Hard' | 'Expert'> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get('difficulty');
    const languageId = searchParams.get('languageId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }
    
    if (languageId) {
      where.languageId = parseInt(languageId);
    }

    const tasks = await prisma.task.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        language: true,
        solutions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format tasks for frontend
    const formattedTasks = tasks.map((task) => ({
      id: task.id.toString(),
      title: task.title,
      slug: task.id.toString(),
      description: task.fullDescription || task.shortDescription,
      difficulty: difficultyMap[task.difficulty] || 'Easy',
      tags: [task.language.name],
      examples: [],
      constraints: [],
      testCases: [],
      starterCode: {
        javascript: task.startCode || '',
        python: task.startCode || '',
        cpp: task.startCode || '',
        java: task.startCode || '',
      },
      acceptanceRate: 0, // TODO: Calculate from submissions
      totalSubmissions: task.solutions.length,
      isSolved: false, // TODO: Check if current user solved it
      isAttempted: false, // TODO: Check if current user attempted it
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return NextResponse.json({
      tasks: formattedTasks,
      total: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении задач' },
      { status: 500 }
    );
  }
}

