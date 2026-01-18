import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSubmissionSchema = z.object({
  taskId: z.number().min(1, 'ID задания обязателен'),
  code: z.string().min(1, 'Код решения обязателен'),
});

const getSubmissionsSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  taskId: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(['PENDING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'ALL']).optional().default('ALL'),
});

// Mock code execution function
async function executeCode(code: string, language: string, testCases?: string) {
  // This is a mock implementation
  // In a real application, you would integrate with a code execution service
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution time
  
  const isSuccess = Math.random() > 0.3; // 70% success rate for demo
  
  if (isSuccess) {
    return {
      status: 'ACCEPTED' as const,
      result: JSON.stringify({
        passed: 5,
        total: 5,
        testResults: [
          { input: 'test1', expected: 'output1', actual: 'output1', passed: true },
          { input: 'test2', expected: 'output2', actual: 'output2', passed: true },
          { input: 'test3', expected: 'output3', actual: 'output3', passed: true },
          { input: 'test4', expected: 'output4', actual: 'output4', passed: true },
          { input: 'test5', expected: 'output5', actual: 'output5', passed: true },
        ]
      }),
      executionTime: Math.floor(Math.random() * 1000) + 100,
      memoryUsage: Math.floor(Math.random() * 1024 * 1024) + 1024 * 512,
      score: 100
    };
  } else {
    const statuses = ['WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR'];
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    
    return {
      status,
      result: JSON.stringify({
        passed: Math.floor(Math.random() * 3),
        total: 5,
        error: 'Mock error message',
        testResults: [
          { input: 'test1', expected: 'output1', actual: 'output1', passed: true },
          { input: 'test2', expected: 'output2', actual: 'wrong', passed: false },
        ]
      }),
      executionTime: status === 'TIME_LIMIT_EXCEEDED' ? 5000 : Math.floor(Math.random() * 1000) + 100,
      memoryUsage: Math.floor(Math.random() * 1024 * 1024) + 1024 * 512,
      score: Math.floor(Math.random() * 60)
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, taskId, userId, status } = getSubmissionsSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      taskId: searchParams.get('taskId'),
      userId: searchParams.get('userId'),
      status: searchParams.get('status'),
    });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    // Users can only see their own submissions unless they're admin/moderator
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
      where.userId = parseInt(session.user.id);
    } else if (userId) {
      where.userId = parseInt(userId);
    }

    if (taskId) {
      where.taskId = parseInt(taskId);
    }

    if (status !== 'ALL') {
      where.status = status;
    }

    // Get submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            }
          },
          task: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              price: true,
              language: {
                select: {
                  name: true,
                  icon: true,
                }
              }
            }
          }
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.submission.count({ where })
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, code } = createSubmissionSchema.parse(body);

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        language: {
          select: {
            name: true,
            monacoLanguage: true,
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Задание не найдено' },
        { status: 404 }
      );
    }

    if (!task.isActive) {
      return NextResponse.json(
        { error: 'Задание неактивно' },
        { status: 400 }
      );
    }

    // Create submission with PENDING status
    const submission = await prisma.submission.create({
      data: {
        userId: parseInt(session.user.id),
        taskId,
        code,
        status: 'PENDING',
      },
      include: {
        task: {
          select: {
            title: true,
            testCases: true,
            language: {
              select: {
                name: true,
                monacoLanguage: true,
              }
            }
          }
        }
      }
    });

    // Execute code asynchronously
    setTimeout(async () => {
      try {
        const result = await executeCode(
          code, 
          task.language.monacoLanguage, 
          task.testCases || undefined
        );

        // Update submission with results
        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status: result.status,
            result: result.result,
            executionTime: result.executionTime,
            memoryUsage: result.memoryUsage,
            score: result.score,
          }
        });

        // If accepted, update or create UserTask
        if (result.status === 'ACCEPTED') {
          const existingUserTask = await prisma.userTask.findUnique({
            where: {
              userId_taskId: {
                userId: parseInt(session.user.id),
                taskId: taskId
              }
            }
          });

          if (existingUserTask) {
            if (existingUserTask.status !== 'SOLVED') {
              await prisma.userTask.update({
                where: { id: existingUserTask.id },
                data: {
                  status: 'SOLVED',
                  solvedAt: new Date(),
                  code: code,
                }
              });

              // Update user points
              await prisma.user.update({
                where: { id: parseInt(session.user.id) },
                data: {
                  totalPoints: { increment: task.price },
                  rating: { increment: Math.floor(task.price / 10) }
                }
              });
            }
          } else {
            await prisma.userTask.create({
              data: {
                userId: parseInt(session.user.id),
                taskId: taskId,
                status: 'SOLVED',
                solvedAt: new Date(),
                code: code,
              }
            });

            // Update user points
            await prisma.user.update({
              where: { id: parseInt(session.user.id) },
              data: {
                totalPoints: { increment: task.price },
                rating: { increment: Math.floor(task.price / 10) }
              }
            });
          }
        }

      } catch (error) {
        console.error('Code execution error:', error);
        
        // Update submission with error
        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status: 'RUNTIME_ERROR',
            result: JSON.stringify({ error: 'Ошибка выполнения кода' }),
          }
        });
      }
    }, 100);

    return NextResponse.json({
      message: 'Решение отправлено на проверку',
      submission: {
        id: submission.id,
        status: submission.status,
        createdAt: submission.createdAt,
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create submission error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}