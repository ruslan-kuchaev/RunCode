'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Task } from '@/features/tasks/types/tasks.types';

interface DescriptionPanelProps {
  task: Task;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function DescriptionPanel({ task }: DescriptionPanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {task.title}
          </h1>
          <Badge className={difficultyColors[task.difficulty]}>
            {task.difficulty}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-3 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Acceptance: {task.acceptanceRate}%</span>
          <span>Submissions: {task.totalSubmissions}</span>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6 p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Description
        </h2>
        <div
          className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: task.description }}
        />
      </Card>

      {/* Examples */}
      {task.examples.length > 0 && (
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Examples
          </h2>
          {task.examples.map((example, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                Example {index + 1}:
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-2">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Input:
                  </span>
                  <pre className="mt-1 text-gray-900 dark:text-gray-100 font-mono">
                    {example.input}
                  </pre>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-2">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Output:
                  </span>
                  <pre className="mt-1 text-gray-900 dark:text-gray-100 font-mono">
                    {example.output}
                  </pre>
                </div>
              </div>
              {example.explanation && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span className="font-semibold">Explanation: </span>
                  {example.explanation}
                </div>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* Constraints */}
      {task.constraints.length > 0 && (
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Constraints
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {task.constraints.map((constraint, index) => (
              <li key={index} className="text-sm">
                {constraint}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Test Cases (non-hidden only) */}
      {task.testCases.filter((tc) => !tc.isHidden).length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Test Cases
          </h2>
          {task.testCases
            .filter((tc) => !tc.isHidden)
            .map((testCase, index) => (
              <div
                key={index}
                className="mb-3 last:mb-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
              >
                <div className="text-sm mb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Input:
                  </span>
                  <pre className="mt-1 text-gray-900 dark:text-gray-100 font-mono text-xs">
                    {testCase.input}
                  </pre>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Expected Output:
                  </span>
                  <pre className="mt-1 text-gray-900 dark:text-gray-100 font-mono text-xs">
                    {testCase.expectedOutput}
                  </pre>
                </div>
              </div>
            ))}
        </Card>
      )}
    </div>
  );
}
