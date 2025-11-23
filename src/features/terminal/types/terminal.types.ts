export interface TerminalCommand {
  command: string;
  output: string | React.ReactNode;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
}

export interface TerminalState {
  history: TerminalCommand[];
  currentInput: string;
  historyIndex: number;
  isProcessing: boolean;
}

export interface BuiltInCommand {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<string | React.ReactNode>;
}
