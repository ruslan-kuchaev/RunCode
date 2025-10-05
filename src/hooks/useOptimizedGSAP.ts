import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

interface GSAPConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
}

export const useOptimizedGSAP = () => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  // Создание оптимизированного timeline
  const createTimeline = useCallback((config?: GSAPConfig) => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    timelineRef.current = gsap.timeline({
      defaults: {
        duration: config?.duration || 0.5,
        ease: config?.ease || "power2.out"
      }
    });
    
    return timelineRef.current;
  }, []);

  // Анимация появления элементов
  const animateIn = useCallback((
    elements: gsap.TweenTarget,
    config?: GSAPConfig & { from?: gsap.TweenVars; to?: gsap.TweenVars }
  ) => {
    const tween = gsap.fromTo(elements, 
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
        ...config?.from
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: config?.duration || 0.6,
        ease: config?.ease || "back.out(1.7)",
        delay: config?.delay || 0,
        stagger: config?.stagger || 0,
        ...config?.to
      }
    );
    
    animationsRef.current.push(tween);
    return tween;
  }, []);

  // Анимация исчезновения элементов
  const animateOut = useCallback((
    elements: gsap.TweenTarget,
    config?: GSAPConfig & { to?: gsap.TweenVars }
  ) => {
    const tween = gsap.to(elements, {
      opacity: 0,
      y: -20,
      scale: 0.9,
      duration: config?.duration || 0.4,
      ease: config?.ease || "power2.inOut",
      delay: config?.delay || 0,
      stagger: config?.stagger || 0,
      ...config?.to
    });
    
    animationsRef.current.push(tween);
    return tween;
  }, []);

  // Hover анимации
  const createHoverAnimation = useCallback((
    element: gsap.TweenTarget,
    hoverConfig?: gsap.TweenVars,
    leaveConfig?: gsap.TweenVars
  ) => {
    const defaultHover = {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    };
    
    const defaultLeave = {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    };

    return {
      onMouseEnter: () => gsap.to(element, { ...defaultHover, ...hoverConfig }),
      onMouseLeave: () => gsap.to(element, { ...defaultLeave, ...leaveConfig })
    };
  }, []);

  // Очистка всех анимаций
  const cleanup = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    
    animationsRef.current.forEach(tween => tween.kill());
    animationsRef.current = [];
  }, []);

  // Автоматическая очистка при размонтировании
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    createTimeline,
    animateIn,
    animateOut,
    createHoverAnimation,
    cleanup,
    timeline: timelineRef.current
  };
};