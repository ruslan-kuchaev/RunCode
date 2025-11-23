/**
 * useFadeIn Hook
 * 
 * Provides fade-in animations for elements on mount or scroll.
 * Supports stagger animations for multiple elements.
 */

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { durations, easings } from '@/lib/gsap';

export interface FadeInOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  y?: number;
  x?: number;
  scale?: number;
  autoAlpha?: boolean;
  onComplete?: () => void;
}

/**
 * Hook for fade-in animation on mount
 * 
 * @example
 * ```tsx
 * const ref = useFadeIn({
 *   duration: 0.8,
 *   delay: 0.2,
 *   y: 30,
 *   stagger: 0.1
 * });
 * 
 * return <div ref={ref}>Fading in content</div>;
 * ```
 */
export const useFadeIn = <T extends HTMLElement = HTMLDivElement>(
  options: FadeInOptions = {}
) => {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const {
      duration = durations.normal,
      delay = 0,
      ease = easings.smooth,
      stagger = 0,
      y = 0,
      x = 0,
      scale = 1,
      autoAlpha = true,
      onComplete,
    } = options;

    const element = elementRef.current;

    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: y,
      x: x,
      scale: scale === 1 ? 1 : 0.95,
    });

    // Animate in
    animationRef.current = gsap.to(element, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      delay,
      ease,
      stagger,
      autoAlpha: autoAlpha ? 1 : undefined,
      onComplete,
    });

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [options]);

  return elementRef;
};

/**
 * Hook for fade-in animation on multiple child elements
 * 
 * @example
 * ```tsx
 * const ref = useFadeInBatch('.item', {
 *   duration: 0.6,
 *   stagger: 0.15,
 *   y: 20
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     <div className="item">Item 1</div>
 *     <div className="item">Item 2</div>
 *     <div className="item">Item 3</div>
 *   </div>
 * );
 * ```
 */
export const useFadeInBatch = <T extends HTMLElement = HTMLDivElement>(
  selector: string,
  options: FadeInOptions = {}
) => {
  const containerRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const {
      duration = durations.normal,
      delay = 0,
      ease = easings.smooth,
      stagger = 0.1,
      y = 20,
      x = 0,
      scale = 1,
      autoAlpha = true,
      onComplete,
    } = options;

    const elements = containerRef.current.querySelectorAll(selector);

    if (elements.length === 0) return;

    // Set initial state
    gsap.set(elements, {
      opacity: 0,
      y: y,
      x: x,
      scale: scale === 1 ? 1 : 0.95,
    });

    // Animate in with stagger
    animationRef.current = gsap.to(elements, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      delay,
      ease,
      stagger,
      autoAlpha: autoAlpha ? 1 : undefined,
      onComplete,
    });

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [selector, options]);

  return containerRef;
};

/**
 * Hook for controlled fade-in animation (manual trigger)
 * 
 * @example
 * ```tsx
 * const { ref, fadeIn, fadeOut } = useFadeInControlled({
 *   duration: 0.5
 * });
 * 
 * return (
 *   <>
 *     <button onClick={fadeIn}>Fade In</button>
 *     <button onClick={fadeOut}>Fade Out</button>
 *     <div ref={ref}>Controlled content</div>
 *   </>
 * );
 * ```
 */
export const useFadeInControlled = <T extends HTMLElement = HTMLDivElement>(
  options: FadeInOptions = {}
) => {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const fadeIn = () => {
    if (!elementRef.current) return;

    const {
      duration = durations.normal,
      delay = 0,
      ease = easings.smooth,
      onComplete,
    } = options;

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Animate in
    animationRef.current = gsap.to(elementRef.current, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      delay,
      ease,
      onComplete,
    });
  };

  const fadeOut = () => {
    if (!elementRef.current) return;

    const {
      duration = durations.fast,
      ease = easings.smooth,
      onComplete,
    } = options;

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Animate out
    animationRef.current = gsap.to(elementRef.current, {
      opacity: 0,
      y: -10,
      scale: 0.95,
      duration,
      ease,
      onComplete,
    });
  };

  useEffect(() => {
    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return {
    ref: elementRef,
    fadeIn,
    fadeOut,
  };
};
