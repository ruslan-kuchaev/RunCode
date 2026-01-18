import { useState, useEffect, useCallback } from 'react';
import { useApiWithCache } from './useApiWithCache';

export interface Language {
  id: number;
  name: string;
  icon: string;
  extension: string;
  monacoLanguage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tasksCount: number;
  usersCount: number;
}

export interface LanguagesResponse {
  languages: Language[];
}

export interface CreateLanguageData {
  name: string;
  icon: string;
  extension: string;
  monacoLanguage: string;
}

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
  });

  const { request, loading, error, fromCache, clearCache } = useApiWithCache<LanguagesResponse>();

  const fetchLanguages = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.isActive && { isActive: filters.isActive }),
      });

      const url = `/api/languages?${params}`;
      const response = await request(url, {
        cache: true,
        cacheTTL: 15 * 60 * 1000, // 15 минут для языков (они редко меняются)
        persistent: true, // Сохраняем в localStorage
      });
      setLanguages(response.languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  }, [request, filters]);

  const createLanguage = useCallback(async (languageData: CreateLanguageData) => {
    try {
      await request('/api/languages', {
        method: 'POST',
        body: languageData,
        cache: false,
      });
      // Очищаем кеш после создания
      clearCache();
      await fetchLanguages(); // Refresh languages list
    } catch (error) {
      throw error;
    }
  }, [request, fetchLanguages, clearCache]);

  const updateLanguage = useCallback(async (id: number, languageData: Partial<CreateLanguageData & { isActive: boolean }>) => {
    try {
      await request(`/api/languages/${id}`, {
        method: 'PATCH',
        body: languageData,
        cache: false,
      });
      // Очищаем кеш после обновления
      clearCache();
      await fetchLanguages(); // Refresh languages list
    } catch (error) {
      throw error;
    }
  }, [request, fetchLanguages, clearCache]);

  const deleteLanguage = useCallback(async (id: number) => {
    try {
      await request(`/api/languages/${id}`, {
        method: 'DELETE',
        cache: false,
      });
      // Очищаем кеш после удаления
      clearCache();
      await fetchLanguages(); // Refresh languages list
    } catch (error) {
      throw error;
    }
  }, [request, fetchLanguages, clearCache]);

  const toggleLanguageActive = useCallback(async (id: number, isActive: boolean) => {
    try {
      await updateLanguage(id, { isActive });
    } catch (error) {
      throw error;
    }
  }, [updateLanguage]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return {
    languages,
    filters,
    loading,
    error,
    fromCache, // Показывает, загружены ли данные из кеша
    setFilters,
    fetchLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    toggleLanguageActive,
    clearCache,
  };
}