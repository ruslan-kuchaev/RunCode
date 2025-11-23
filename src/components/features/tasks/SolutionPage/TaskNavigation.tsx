'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

interface TaskNavigationProps {
  currentTaskId: string;
  tasks: Array<{
    id: string;
    title: string;
    difficulty: string;
  }>;
}

export function TaskNavigation({ currentTaskId, tasks }: TaskNavigationProps) {
  const currentIndex = tasks.findIndex((task) => task.id === currentTaskId);
  const previousTask = currentIndex > 0 ? tasks[currentIndex - 1] : null;
  const nextTask = currentIndex < tasks.length - 1 ? tasks[currentIndex + 1] : null;

  const taskOptions = tasks.map((task) => ({
    value: task.id,
    label: `${task.title} (${task.difficulty})`,
  }));

  const handleTaskChange = (taskId: string) => {
    window.location.href = `/tasks/${taskId}`;
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Previous Task Button */}
      {previousTask ? (
        <Link href={`/tasks/${previousTask.id}`}>
          <Button variant="ghost" size="sm" title={`Previous: ${previousTask.title}`}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button variant="ghost" size="sm" disabled>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
      )}

      {/* Task Dropdown */}
      <div className="flex-1 flex items-center gap-2">
        <List className="w-4 h-4 text-gray-500" />
        <Dropdown
          value={currentTaskId}
          onChange={handleTaskChange}
          options={taskOptions}
          className="flex-1 max-w-md"
        />
      </div>

      {/* Next Task Button */}
      {nextTask ? (
        <Link href={`/tasks/${nextTask.id}`}>
          <Button variant="ghost" size="sm" title={`Next: ${nextTask.title}`}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      ) : (
        <Button variant="ghost" size="sm" disabled>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
