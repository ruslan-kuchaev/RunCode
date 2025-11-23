'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, XCircle, Clock, MemoryStick } from 'lucide-react';

interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  error?: string;
}

interface ExecutionResult {
  status: 'success' | 'error' | 'running';
  testResults?: TestResult[];
  runtime?: number;
  memory?: number;
  error?: string;
  output?: string;
}

interface ConsolePanelProps {
  result: ExecutionResult | null;
}

export function ConsolePanel({ result }: ConsolePanelProps) {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No output yet</p>
          <p className="text-sm">Run your code to see the results here</p>
        </div>
      </div>
    );
  }

  if (result.status === 'running') {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Running your code...</p>
        </div>
      </div>
    );
  }

  const passedTests = result.testResults?.filter((t) => t.passed).length || 0;
  const totalTests = result.testResults?.length || 0;

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 p-6">
      {/* Header with stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Console Output
          </h2>
          {result.status === 'success' && result.testResults && (
            <Badge
              className={
                passedTests === totalTests
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }
            >
              {passedTests}/{totalTests} Tests Passed
            </Badge>
          )}
        </div>

        {/* Runtime and Memory */}
        {(result.runtime !== undefined || result.memory !== undefined) && (
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            {result.runtime !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Runtime: {result.runtime}ms</span>
              </div>
            )}
            {result.memory !== undefined && (
              <div className="flex items-center gap-1">
                <MemoryStick className="w-4 h-4" />
                <span>Memory: {result.memory}MB</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {result.error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                Error
              </h3>
              <pre className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap font-mono">
                {result.error}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* General output */}
      {result.output && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
            Output:
          </h3>
          <pre className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-mono">
            {result.output}
          </pre>
        </div>
      )}

      {/* Test results */}
      {result.testResults && result.testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Test Cases:
          </h3>
          {result.testResults.map((test, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                test.passed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {test.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <h4
                  className={`font-semibold ${
                    test.passed
                      ? 'text-green-900 dark:text-green-200'
                      : 'text-red-900 dark:text-red-200'
                  }`}
                >
                  Test Case {index + 1}: {test.passed ? 'Passed' : 'Failed'}
                </h4>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Input:
                  </span>
                  <pre className="mt-1 p-2 bg-white dark:bg-gray-900 rounded text-gray-900 dark:text-gray-100 font-mono">
                    {test.input}
                  </pre>
                </div>

                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Expected Output:
                  </span>
                  <pre className="mt-1 p-2 bg-white dark:bg-gray-900 rounded text-gray-900 dark:text-gray-100 font-mono">
                    {test.expectedOutput}
                  </pre>
                </div>

                {test.actualOutput !== undefined && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Your Output:
                    </span>
                    <pre
                      className={`mt-1 p-2 rounded font-mono ${
                        test.passed
                          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200'
                      }`}
                    >
                      {test.actualOutput}
                    </pre>
                  </div>
                )}

                {test.error && (
                  <div>
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      Error:
                    </span>
                    <pre className="mt-1 p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-900 dark:text-red-200 font-mono">
                      {test.error}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
