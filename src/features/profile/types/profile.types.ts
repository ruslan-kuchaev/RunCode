export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  rating: number;
  rank: number;
  solvedTasks: number;
  streak: number;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityData {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
}
