export const ROUTES = {
  HOME: '/',
  TASKS: '/tasks',
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  RATING: '/rating',
  PROFILE: '/profile',
  USER_PROFILE: (id: string) => `/profile/${id}`,
  ADMIN: '/admin',
} as const;
