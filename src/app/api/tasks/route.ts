import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get('difficulty');
    const languageId = searchParams.get('languageId');
    const search = searchParams.get('search');

    const tasks = await prisma.task.findMany({
      where: {
        ...(difficulty && difficulty !== 'ALL' ? { difficulty: difficulty as any } : {}),
        ...(languageId && languageId !== 'ALL' ? { languageId: parseInt(languageId) } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { shortDescription: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        language: true,
        ...(userId
          ? {
              solutions: {
                where: { userId },
                select: { status: true },
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'asc' },
    });

    const formatted = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      shortDescription: task.shortDescription,
      difficulty: task.difficulty,
      price: task.price,
      preview: task.preview,
      languageId: task.languageId,
      language: task.language,
      userTask: userId && (task as any).solutions?.[0]
        ? { status: (task as any).solutions[0].status }
        : undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Tasks GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки задач' }, { status: 500 });
  }
}
