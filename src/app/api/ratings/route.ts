import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        rating: true,
        solvedTasks: {
          where: { status: 'SOLVED' },
          select: { id: true },
        },
      },
      orderBy: { rating: 'desc' },
      take: 50,
    });

    const formatted = users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      rating: u.rating,
      solved: u.solvedTasks.length,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Ratings GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки рейтинга' }, { status: 500 });
  }
}
