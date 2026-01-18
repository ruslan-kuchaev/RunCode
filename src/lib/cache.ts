// Система кеширования для клиента
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // в миллисекундах
}

class ClientCache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 минут

  // Получить данные из кеша
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Проверяем, не истек ли кеш
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Сохранить данные в кеш
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    });
  }

  // Удалить из кеша
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Очистить весь кеш
  clear(): void {
    this.cache.clear();
  }

  // Очистить истекшие записи
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiresIn) {
        this.cache.delete(key);
      }
    }
  }

  // Получить размер кеша
  size(): number {
    return this.cache.size;
  }
}

// Создаем глобальный экземпляр кеша
export const clientCache = new ClientCache();

// Автоматическая очистка каждые 10 минут
if (typeof window !== 'undefined') {
  setInterval(() => {
    clientCache.cleanup();
  }, 10 * 60 * 1000);
}

// Утилита для получения статистики кеша
export const getCacheStats = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    memoryCache: {
      size: clientCache.size(),
      items: Array.from((clientCache as any).cache.keys()),
    },
    localStorage: {
      items: Object.keys(localStorage).filter(key => key.startsWith('runcode_cache_')),
      size: Object.keys(localStorage).filter(key => key.startsWith('runcode_cache_')).length,
    }
  };
};

// Утилиты для работы с localStorage (для персистентного кеширования)
export class PersistentCache {
  private readonly prefix = 'runcode_cache_';

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item) as CacheItem<T>;
      
      // Проверяем срок действия
      if (Date.now() - parsed.timestamp > parsed.expiresIn) {
        this.delete(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Error reading from persistent cache:', error);
      return null;
    }
  }

  set<T>(key: string, data: T, ttl: number = 30 * 60 * 1000): void {
    if (typeof window === 'undefined') return;

    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: ttl,
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Error writing to persistent cache:', error);
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const persistentCache = new PersistentCache();