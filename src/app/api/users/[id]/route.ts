import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateUserSchema = z.object({
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'BLOCKED', 'PENDING']).optional(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    
    // Users can view their own profile, admins/moderators can view any profile
    if (session.user.id !== id && 
        session.user.role !== 'ADMIN' && 
        session.user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
        rating: true,
        totalPoints: true,
        country: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        websiteUrl: true,
        isEmailVerified: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            solvedTasks: true,
            submissions: true,
            achievements: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Get additional stats
    const [solvedCount, totalAttempts, recentSubmissions] = await Promise.all([
      prisma.userTask.count({
        where: { userId, status: 'SOLVED' }
      }),
      prisma.submission.count({
        where: { userId }
      }),
      prisma.submission.findMany({
        where: { userId },
        include: {
          task: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              price: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return NextResponse.json({
      ...user,
      solvedTasks: solvedCount,
      totalAttempts,
      recentSubmissions,
    });

  } catch (error) {
    console.error('Get user error:', error);
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
    
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();
    const updateData = updateUserSchema.parse(body);

    // Check permissions
    const isOwnProfile = session.user.id === id;
    const isAdmin = session.user.role === 'ADMIN';
    const isModerator = session.user.role === 'MODERATOR';

    if (!isOwnProfile && !isAdmin && !isModerator) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    // Only admins can change roles and status
    if ((updateData.role || updateData.status) && !isAdmin) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    // Prevent self-demotion for admins
    if (isOwnProfile && isAdmin && updateData.role && updateData.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Нельзя изменить собственную роль администратора' 
      }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      message: 'Пользователь успешно обновлен',
      user
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update user error:', error);
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
    const userId = parseInt(id);

    // Check if user exists and is not admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    if (user.role === 'ADMIN') {
      return NextResponse.json({ 
        error: 'Нельзя удалить администратора' 
      }, { status: 400 });
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      message: 'Пользователь успешно удален'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}