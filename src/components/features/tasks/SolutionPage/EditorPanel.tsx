'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Play, Send, RotateCcw } from 'lucide-react';

interface EditorPanelProps {
  taskId: string;
  starterCode: Record<string, string>;
  onRun: (code: string, language: string) => void;
  onSubmit: (code: string, language: string) => void;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
];

const STORAGE_KEY_PREFIX = 'runcode-solution-';

export function EditorPanel({
  taskId,
  starterCode,
  onRun,
  onSubmit,
}: EditorPanelProps) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Load saved code from localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${taskId}-${language}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      setCode(saved);
    } else {
      setCode(starterCode[language] || '');
    }
  }, [taskId, language, starterCode]);

  // Save code to localStorage
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    const storageKey = `${STORAGE_KEY_PREFIX}${taskId}-${language}`;
    localStorage.setItem(storageKey, newCode);
  };

  // Reset code to starter code
  const handleReset = () => {
    const defaultCode = starterCode[language] || '';
    setCode(defaultCode);
    const storageKey = `${STORAGE_KEY_PREFIX}${taskId}-${language}`;
    localStorage.setItem(storageKey, defaultCode);
  };

  // Run code
  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRun(code, language);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit solution
  const handleSubmit = async () => {
    setIsRunning(true);
    try {
      await onSubmit(code, language);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Language:
          </span>
          <Dropdown
            value={language}
            onChange={setLanguage}
            options={LANGUAGES}
            className="w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            title="Reset to starter code"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning}
          >
            <Send className="w-4 h-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading editor...</div>
            </div>
          }
        />
      </div>
    </div>
  );
}
