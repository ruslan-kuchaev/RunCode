'use client';

import React, { useEffect, useState } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { GripVertical, GripHorizontal, RotateCcw, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResizableLayoutProps {
  descriptionPanel: React.ReactNode;
  editorPanel: React.ReactNode;
  consolePanel: React.ReactNode;
}

const STORAGE_KEY = 'runcode-solution-layout';
const LAYOUT_MODE_KEY = 'runcode-layout-mode';

const DEFAULT_SIZES = {
  horizontal: {
    description: 25,
    editor: 50,
    console: 25,
  },
  vertical: {
    description: 30,
    editor: 40,
    console: 30,
  },
};

type LayoutMode = 'horizontal' | 'vertical';

export function ResizableLayout({
  descriptionPanel,
  editorPanel,
  consolePanel,
}: ResizableLayoutProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');
  const [sizes, setSizes] = useState(DEFAULT_SIZES[layoutMode]);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved layout from localStorage
  useEffect(() => {
    setIsMounted(true);
    const savedSizes = localStorage.getItem(STORAGE_KEY);
    const savedMode = localStorage.getItem(LAYOUT_MODE_KEY) as LayoutMode | null;
    
    if (savedMode && (savedMode === 'horizontal' || savedMode === 'vertical')) {
      setLayoutMode(savedMode);
    }
    
    if (savedSizes) {
      try {
        const parsed = JSON.parse(savedSizes);
        setSizes(parsed);
      } catch (e) {
        console.error('Failed to parse saved layout:', e);
      }
    }
  }, []);

  // Save layout to localStorage
  const handleLayoutChange = (newSizes: number[]) => {
    const layoutSizes = layoutMode === 'horizontal'
      ? {
          description: newSizes[0],
          editor: newSizes[1],
          console: newSizes[2],
        }
      : {
          description: newSizes[0],
          editor: newSizes[1],
          console: newSizes[2],
        };
    setSizes(layoutSizes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutSizes));
  };

  // Toggle layout mode
  const handleToggleLayout = () => {
    const newMode: LayoutMode = layoutMode === 'horizontal' ? 'vertical' : 'horizontal';
    setLayoutMode(newMode);
    setSizes(DEFAULT_SIZES[newMode]);
    localStorage.setItem(LAYOUT_MODE_KEY, newMode);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Reset layout to default
  const handleReset = () => {
    setSizes(DEFAULT_SIZES[layoutMode]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!isMounted) {
    return null;
  }

  const GripIcon = layoutMode === 'horizontal' ? GripVertical : GripHorizontal;

  return (
    <div className="h-full w-full relative">
      {/* Control buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleLayout}
          title={`Switch to ${layoutMode === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          title="Reset layout"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <PanelGroup
        direction={layoutMode}
        onLayout={handleLayoutChange}
        className="h-full"
      >
        {/* Description Panel */}
        <Panel
          defaultSize={sizes.description}
          minSize={15}
          maxSize={layoutMode === 'horizontal' ? 50 : 60}
          className="relative"
        >
          {descriptionPanel}
        </Panel>

        <PanelResizeHandle className={`${layoutMode === 'horizontal' ? 'w-2' : 'h-2'} bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center justify-center group`}>
          <GripIcon className={`w-4 h-4 text-gray-400 group-hover:text-white`} />
        </PanelResizeHandle>

        {/* Editor Panel */}
        <Panel
          defaultSize={sizes.editor}
          minSize={30}
          className="relative"
        >
          {editorPanel}
        </Panel>

        <PanelResizeHandle className={`${layoutMode === 'horizontal' ? 'w-2' : 'h-2'} bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center justify-center group`}>
          <GripIcon className={`w-4 h-4 text-gray-400 group-hover:text-white`} />
        </PanelResizeHandle>

        {/* Console Panel */}
        <Panel
          defaultSize={sizes.console}
          minSize={15}
          maxSize={layoutMode === 'horizontal' ? 50 : 60}
          className="relative"
        >
          {consolePanel}
        </Panel>
      </PanelGroup>
    </div>
  );
}
