import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface SubmitRequest {
  code: string;
  language: string;
}

/**
 * POST /api/tasks/[id]/submit
 * Submit a solution for a specific task
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body: SubmitRequest = await request.json();
    const { code, language } = body;

    // Validate input
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get task with test cases
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // TODO: Execute code against all test cases (including hidden ones)
    // This should use the same execution system as /execute endpoint
    // but with all test cases

    // Mock execution result
    const mockTestsPassed = Math.floor(Math.random() * 10) + 5;
    const mockTotalTests = 10;
    const mockStatus = mockTestsPassed === mockTotalTests ? 'Accepted' : 'Wrong Answer';
    const mockRuntime = Math.floor(Math.random() * 100) + 10;
    const mockMemory = Math.floor(Math.random() * 50) + 10;

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        taskId: id,
        code,
        language,
        status: mockStatus,
        runtime: mockRuntime,
        memory: mockMemory,
        testsPassed: mockTestsPassed,
        totalTests: mockTotalTests,
      },
    });

    // If accepted, update user's solved tasks
    if (mockStatus === 'Accepted') {
      // Check if user already solved this task
      const existingSolution = await prisma.userTask.findUnique({
        where: {
          userId_taskId: {
            userId: user.id,
            taskId: id,
          },
        },
      });

      if (!existingSolution) {
        await prisma.userTask.create({
          data: {
            userId: user.id,
            taskId: id,
            solved: true,
          },
        });
      }
    }

    return NextResponse.json({
      submissionId: submission.id,
      status: mockStatus,
      testsPassed: mockTestsPassed,
      totalTests: mockTotalTests,
      runtime: mockRuntime,
      memory: mockMemory,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
