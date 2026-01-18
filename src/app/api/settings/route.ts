import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  siteDescription: z.string().min(1).optional(),
  siteUrl: z.string().url().optional(),
  adminEmail: z.string().email().optional(),
  registrationEnabled: z.boolean().optional(),
  emailVerificationRequired: z.boolean().optional(),
  maxTasksPerUser: z.number().min(1).optional(),
  defaultUserRating: z.number().min(0).optional(),
  sessionTimeout: z.number().min(1).optional(),
  maintenanceMode: z.boolean().optional(),
  allowGuestViewing: z.boolean().optional(),
  maxFileUploadSize: z.number().min(1).optional(),
  enableNotifications: z.boolean().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().min(1).max(65535).optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  enableSsl: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    // Get or create system settings
    let settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {}
      });
    }

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const updateData = updateSettingsSchema.parse(body);

    // Get or create system settings
    let settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: updateData
      });
    } else {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    }

    return NextResponse.json({
      message: 'Настройки успешно обновлены',
      settings
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}