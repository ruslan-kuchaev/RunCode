import { create } from 'zustand';

export interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success';
}




interface TerminalState {
  // Простое состояние для UI
  isProcessing: boolean;
  currentUser: string | null;
  
  // Простые actions
  setProcessing: (processing: boolean) => void;
  setUser: (username: string | null) => void;
  simulateLogin: (username: string) => Promise<void>;
  simulateLogout: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  // Initial state
  isProcessing: false,
  currentUser: null,

  // Actions
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  setUser: (username) => set({ currentUser: username }),
  
  simulateLogin: async (username: string) => {
    set({ isProcessing: true });
    await new Promise(resolve => setTimeout(resolve, 800)); // Имитация задержки
    set({ currentUser: username, isProcessing: false });
  },
  
  simulateLogout: async () => {
    set({ isProcessing: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ currentUser: null, isProcessing: false });
  }
}));