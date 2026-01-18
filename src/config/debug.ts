// Конфигурация для отладочных компонентов
export const DEBUG_CONFIG = {
  // Показывать ли Cache Debug компонент
  showCacheDebug: false, // Измените на true чтобы показать
  
  // Показывать ли FPS Counter
  showFpsCounter: true,
  
  // Показывать ли индикаторы загрузки из кеша
  showCacheIndicators: false,
  
  // Другие отладочные настройки можно добавить здесь
  enableConsoleLogging: false,
  enablePerformanceMetrics: false,
} as const;

// Утилита для проверки debug режима
export const isDebugEnabled = (feature: keyof typeof DEBUG_CONFIG): boolean => {
  return DEBUG_CONFIG[feature];
};