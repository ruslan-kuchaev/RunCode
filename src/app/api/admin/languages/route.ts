import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const languages = await prisma.language.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Admin languages GET error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки языков' }, { status: 500 });
  }
}
