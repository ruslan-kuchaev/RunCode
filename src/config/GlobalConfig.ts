// Глобальные настройки приложения

export const ANIMATION_CONFIG = {
  // Базовые настройки анимации
  DEFAULT_DURATION: 0.5,
  FAST_DURATION: 0.3,
  SLOW_DURATION: 0.8,

  // Easing функции
  EASING: {
    SMOOTH: "power2.out",
    BOUNCE: "back.out(1.7)",
    ELASTIC: "elastic.out(1, 0.3)",
    SHARP: "power2.inOut",
  },

  // Задержки
  STAGGER: {
    FAST: 0.05,
    NORMAL: 0.1,
    SLOW: 0.2,
  },

  // Пороги для ScrollTrigger
  SCROLL_TRIGGERS: {
    ACTION_BAR: {
      START: "top 50%",
      END: "bottom 25%",
    },
    FADE_IN: {
      START: "top 80%",
      END: "bottom 20%",
    },
  },
} as const;

export const PERFORMANCE_CONFIG = {
  // Настройки для разных уровней производительности
  HIGH_PERFORMANCE: {
    enableComplexAnimations: true,
    maxConcurrentAnimations: 10,
    useGPUAcceleration: true,
    enableParticles: true,
  },

  MEDIUM_PERFORMANCE: {
    enableComplexAnimations: true,
    maxConcurrentAnimations: 5,
    useGPUAcceleration: true,
    enableParticles: false,
  },

  LOW_PERFORMANCE: {
    enableComplexAnimations: false,
    maxConcurrentAnimations: 2,
    useGPUAcceleration: false,
    enableParticles: false,
  },
} as const;

export const UI_CONFIG = {
  // Размеры компонентов
  SIZES: {
    ICON: {
      SMALL: 16,
      MEDIUM: 20,
      LARGE: 24,
      XLARGE: 32,
    },
    BUTTON: {
      HEIGHT: 48,
      MIN_WIDTH: 120,
    },
    CARD: {
      PADDING: 24,
      BORDER_RADIUS: 16,
    },
  },

  // Цветовые схемы
  COLORS: {
    PRIMARY: "blue",
    SECONDARY: "purple",
    SUCCESS: "green",
    WARNING: "yellow",
    ERROR: "red",
  },

  // Breakpoints для адаптивности
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
} as const;

export const DEBUG_CONFIG = {
  // Настройки отладки
  ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === "development",
  ENABLE_GSAP_MARKERS: process.env.NODE_ENV === "development",
  ENABLE_PERFORMANCE_MONITORING: true,
  LOG_ANIMATION_EVENTS: false,
} as const;

// Типы для TypeScript
export type AnimationEasing = keyof typeof ANIMATION_CONFIG.EASING;
export type PerformanceLevel =
  | "HIGH_PERFORMANCE"
  | "MEDIUM_PERFORMANCE"
  | "LOW_PERFORMANCE";
export type ColorVariant = keyof typeof UI_CONFIG.COLORS;
