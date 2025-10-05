// Утилиты для оптимизации производительности

// Debounce функция для оптимизации событий
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle функция для ограничения частоты вызовов
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Проверка поддержки анимаций
export const supportsAnimations = (): boolean => {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Оптимизация для мобильных устройств
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Проверка производительности устройства
export const getDevicePerformance = (): 'high' | 'medium' | 'low' => {
  const hardwareConcurrency = navigator.hardwareConcurrency || 1;
  const memory = (navigator as any).deviceMemory || 1;
  
  if (hardwareConcurrency >= 8 && memory >= 4) return 'high';
  if (hardwareConcurrency >= 4 && memory >= 2) return 'medium';
  return 'low';
};

// Адаптивные настройки анимации на основе производительности
export const getAnimationConfig = () => {
  const performance = getDevicePerformance();
  const mobile = isMobile();
  const animationsEnabled = supportsAnimations();
  
  if (!animationsEnabled) {
    return {
      duration: 0,
      ease: "none",
      stagger: 0,
      enabled: false
    };
  }
  
  switch (performance) {
    case 'high':
      return {
        duration: mobile ? 0.4 : 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
        enabled: true
      };
    case 'medium':
      return {
        duration: mobile ? 0.3 : 0.4,
        ease: "power2.out",
        stagger: 0.05,
        enabled: true
      };
    case 'low':
      return {
        duration: 0.2,
        ease: "power1.out",
        stagger: 0,
        enabled: true
      };
    default:
      return {
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.05,
        enabled: true
      };
  }
};

// Intersection Observer для ленивой загрузки анимаций
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Оптимизация CSS классов
export const optimizeClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};