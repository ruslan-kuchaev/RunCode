export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface APIResponse<T> {
  data?: T;
  error?: APIError;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
