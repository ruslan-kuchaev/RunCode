"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import type { Task } from '@/features/tasks/types/tasks.types';
import {
  ResizableLayout,
  DescriptionPanel,
  EditorPanel,
  ConsolePanel,
  TaskNavigation,
} from '@/components/features/tasks/SolutionPage';

interface ExecutionResult {
  status: 'success' | 'error' | 'running';
  testResults?: Array<{
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed: boolean;
    error?: string;
  }>;
  runtime?: number;
  memory?: number;
  error?: string;
  output?: string;
}

export default function SolutionPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const { tasks, loading: tasksLoading } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Find current task
  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find((t) => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        setLoading(false);
        setError(null);
      } else {
        setError('Task not found');
        setLoading(false);
      }
    }
  }, [tasks, taskId]);

  // Handle code execution
  const handleRun = async (code: string, language: string) => {
    if (!task) return;

    setExecutionResult({ status: 'running' });

    try {
      const response = await fetch(`/api/tasks/${taskId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute code');
      }

      const data = await response.json();
      setExecutionResult(data);
    } catch (err) {
      setExecutionResult({
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  // Handle solution submission
  const handleSubmit = async (code: string, language: string) => {
    if (!task) return;

    setExecutionResult({ status: 'running' });

    try {
      const response = await fetch(`/api/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit solution');
      }

      const data = await response.json();
      setExecutionResult(data);

      // If all tests passed, show success message
      if (data.status === 'success' && data.testResults?.every((t: any) => t.passed)) {
        // Optionally redirect or show success notification
        setTimeout(() => {
          router.push('/tasks');
        }, 2000);
      }
    } catch (err) {
      setExecutionResult({
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  // Prepare tasks for navigation (simplified titles)
  const navigationTasks = useMemo(() => {
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      difficulty: t.difficulty,
    }));
  }, [tasks]);

  // Loading state
  if (loading || tasksLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading task...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !task) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Task not found</h2>
          <p className="text-gray-400 mb-6">{error || 'The task you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/tasks')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* Navigation Bar */}
      <TaskNavigation currentTaskId={taskId} tasks={navigationTasks} />

      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <ResizableLayout
          descriptionPanel={<DescriptionPanel task={task} />}
          editorPanel={
            <EditorPanel
              taskId={taskId}
              starterCode={task.starterCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
            />
          }
          consolePanel={<ConsolePanel result={executionResult} />}
        />
      </div>
    </div>
  );
}

