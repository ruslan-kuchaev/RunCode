import { useState, useCallback } from 'react';
import { clientCache, persistentCache } from '@/lib/cache';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: boolean; // Использовать ли кеширование
  cacheTTL?: number; // Время жизни кеша в миллисекундах
  persistent?: boolean; // Использовать ли localStorage для кеширования
}

export function useApiWithCache<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    fromCache: false,
  });

  const request = useCallback(async (url: string, options: ApiOptions = {}) => {
    const {
      method = 'GET',
      cache = true,
      cacheTTL = 5 * 60 * 1000, // 5 минут по умолчанию
      persistent = false,
      ...fetchOptions
    } = options;

    // Кеширование только для GET запросов
    const shouldCache = cache && method === 'GET';
    const cacheKey = `${method}:${url}`;

    // Проверяем кеш перед запросом
    if (shouldCache) {
      const cacheInstance = persistent ? persistentCache : clientCache;
      const cachedData = cacheInstance.get<T>(cacheKey);
      
      if (cachedData) {
        setState({
          data: cachedData,
          loading: false,
          error: null,
          fromCache: true,
        });
        return cachedData;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null, fromCache: false }));

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка');
      }

      // Сохраняем в кеш только успешные GET запросы
      if (shouldCache) {
        const cacheInstance = persistent ? persistentCache : clientCache;
        cacheInstance.set(cacheKey, data, cacheTTL);
      }

      setState({ 
        data, 
        loading: false, 
        error: null, 
        fromCache: false 
      });
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
      setState({ 
        data: null, 
        loading: false, 
        error: errorMessage, 
        fromCache: false 
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, fromCache: false });
  }, []);

  const clearCache = useCallback((url?: string) => {
    if (url) {
      const cacheKey = `GET:${url}`;
      clientCache.delete(cacheKey);
      persistentCache.delete(cacheKey);
    } else {
      clientCache.clear();
      persistentCache.clear();
    }
  }, []);

  return {
    ...state,
    request,
    reset,
    clearCache,
  };
}