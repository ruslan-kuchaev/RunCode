import { create } from 'zustand';
import { executeTerminalCommand, commandRegistry } from '@/components/features/terminal/TerminalCommands';
import { ReactNode } from 'react';

export interface TerminalHistoryEntry {
  id: string;
  command: string;
  output: string | ReactNode;
  type: 'command' | 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

interface TerminalState {
  // History of commands and outputs
  history: TerminalHistoryEntry[];
  
  // Command history for navigation
  commandHistory: string[];
  
  // Processing state
  isProcessing: boolean;
  
  // Actions
  executeCommand: (command: string) => Promise<void>;
  addOutput: (output: string | ReactNode, type: TerminalHistoryEntry['type']) => void;
  clearHistory: () => void;
  getCommandSuggestions: (input: string) => string[];
  loadHistoryFromStorage: () => void;
  saveHistoryToStorage: () => void;
}

// Load command history from localStorage
const loadCommandHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('terminal_command_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save command history to localStorage
const saveCommandHistory = (history: string[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Keep only last 100 commands
    const trimmed = history.slice(-100);
    localStorage.setItem('terminal_command_history', JSON.stringify(trimmed));
  } catch {
    // Ignore storage errors
  }
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  // Initial state
  history: [],
  commandHistory: loadCommandHistory(),
  isProcessing: false,

  // Execute a command
  executeCommand: async (command: string) => {
    const state = get();
    
    // Add command to history
    const commandEntry: TerminalHistoryEntry = {
      id: `${Date.now()}-command`,
      command,
      output: '',
      type: 'command',
      timestamp: new Date()
    };

    set({ 
      history: [...state.history, commandEntry],
      isProcessing: true 
    });

    // Add to command history for navigation
    const newCommandHistory = [...state.commandHistory, command];
    set({ commandHistory: newCommandHistory });
    saveCommandHistory(newCommandHistory);

    // Execute the command
    const result = await executeTerminalCommand(command);

    // Handle special clear command
    if (result.output === '__CLEAR__') {
      set({ 
        history: [],
        isProcessing: false 
      });
      return;
    }

    // Add output to history
    const outputEntry: TerminalHistoryEntry = {
      id: `${Date.now()}-output`,
      command: '',
      output: result.output,
      type: result.type,
      timestamp: new Date()
    };

    set({ 
      history: [...get().history, outputEntry],
      isProcessing: false 
    });
  },

  // Add output without command
  addOutput: (output: string | ReactNode, type: TerminalHistoryEntry['type']) => {
    const state = get();
    const entry: TerminalHistoryEntry = {
      id: `${Date.now()}-output`,
      command: '',
      output,
      type,
      timestamp: new Date()
    };

    set({ history: [...state.history, entry] });
  },

  // Clear terminal history
  clearHistory: () => {
    set({ history: [] });
  },

  // Get command suggestions for autocomplete
  getCommandSuggestions: (input: string) => {
    if (!input.trim()) return [];
    
    const commandNames = commandRegistry.getCommandNames();
    return commandNames.filter(name => name.startsWith(input.toLowerCase()));
  },

  // Load history from storage
  loadHistoryFromStorage: () => {
    set({ commandHistory: loadCommandHistory() });
  },

  // Save history to storage
  saveHistoryToStorage: () => {
    const state = get();
    saveCommandHistory(state.commandHistory);
  }
}));