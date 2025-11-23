export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface Task {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  examples: Example[];
  constraints: string[];
  testCases: TestCase[];
  starterCode: Record<string, string>;
  solution?: string;
  acceptanceRate: number;
  totalSubmissions: number;
  isSolved: boolean;
  isAttempted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  runtime?: number;
  memory?: number;
  testsPassed: number;
  totalTests: number;
  createdAt: Date;
}
