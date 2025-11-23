import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get users with their solved tasks count
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        rating: 'desc',
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        rating: true,
        createdAt: true,
        solvedTasks: {
          where: {
            status: 'SOLVED',
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Calculate rank and format response
    const ratingUsers = users.map((user, index) => ({
      rank: offset + index + 1,
      userId: user.id.toString(),
      username: user.username,
      avatar: user.avatar || undefined,
      rating: user.rating,
      solvedTasks: user.solvedTasks.length,
      streak: 0, // TODO: Calculate streak from activity
      change: 0, // TODO: Calculate change from previous period
    }));

    return NextResponse.json({
      users: ratingUsers,
      total: users.length,
      period,
    });
  } catch (error) {
    console.error('Error fetching rating:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении рейтинга' },
      { status: 500 }
    );
  }
}

