/**
 * useSlideIn Hook
 * 
 * Provides slide-in animations from different directions.
 * Supports multiple elements with stagger effects.
 */

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { durations, easings } from '@/lib/gsap';

export type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

export interface SlideInOptions {
  direction?: SlideDirection;
  duration?: number;
  delay?: number;
  distance?: number;
  ease?: string;
  stagger?: number;
  opacity?: boolean;
  scale?: number;
  onComplete?: () => void;
}

/**
 * Get initial position based on direction
 */
const getInitialPosition = (direction: SlideDirection, distance: number) => {
  switch (direction) {
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    case 'top':
      return { x: 0, y: -distance };
    case 'bottom':
      return { x: 0, y: distance };
    default:
      return { x: 0, y: distance };
  }
};

/**
 * Hook for slide-in animation on mount
 * 
 * @example
 * ```tsx
 * const ref = useSlideIn({
 *   direction: 'left',
 *   duration: 0.8,
 *   distance: 100,
 *   opacity: true
 * });
 * 
 * return <div ref={ref}>Sliding in content</div>;
 * ```
 */
export const useSlideIn = <T extends HTMLElement = HTMLDivElement>(
  options: SlideInOptions = {}
) => {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const {
      direction = 'bottom',
      duration = durations.normal,
      delay = 0,
      distance = 50,
      ease = easings.smooth,
      stagger = 0,
      opacity = true,
      scale = 1,
      onComplete,
    } = options;

    const element = elementRef.current;
    const initialPos = getInitialPosition(direction, distance);

    // Set initial state
    gsap.set(element, {
      x: initialPos.x,
      y: initialPos.y,
      opacity: opacity ? 0 : 1,
      scale: scale === 1 ? 1 : scale,
    });

    // Animate in
    animationRef.current = gsap.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease,
      stagger,
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
 * Hook for slide-in animation on multiple child elements
 * 
 * @example
 * ```tsx
 * const ref = useSlideInBatch('.card', {
 *   direction: 'bottom',
 *   duration: 0.6,
 *   stagger: 0.1,
 *   distance: 30
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     <div className="card">Card 1</div>
 *     <div className="card">Card 2</div>
 *     <div className="card">Card 3</div>
 *   </div>
 * );
 * ```
 */
export const useSlideInBatch = <T extends HTMLElement = HTMLDivElement>(
  selector: string,
  options: SlideInOptions = {}
) => {
  const containerRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const {
      direction = 'bottom',
      duration = durations.normal,
      delay = 0,
      distance = 50,
      ease = easings.smooth,
      stagger = 0.1,
      opacity = true,
      scale = 1,
      onComplete,
    } = options;

    const elements = containerRef.current.querySelectorAll(selector);

    if (elements.length === 0) return;

    const initialPos = getInitialPosition(direction, distance);

    // Set initial state
    gsap.set(elements, {
      x: initialPos.x,
      y: initialPos.y,
      opacity: opacity ? 0 : 1,
      scale: scale === 1 ? 1 : scale,
    });

    // Animate in with stagger
    animationRef.current = gsap.to(elements, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease,
      stagger,
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
 * Hook for controlled slide-in animation (manual trigger)
 * 
 * @example
 * ```tsx
 * const { ref, slideIn, slideOut } = useSlideInControlled({
 *   direction: 'right',
 *   duration: 0.5
 * });
 * 
 * return (
 *   <>
 *     <button onClick={slideIn}>Slide In</button>
 *     <button onClick={slideOut}>Slide Out</button>
 *     <div ref={ref}>Controlled content</div>
 *   </>
 * );
 * ```
 */
export const useSlideInControlled = <T extends HTMLElement = HTMLDivElement>(
  options: SlideInOptions = {}
) => {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const slideIn = () => {
    if (!elementRef.current) return;

    const {
      direction = 'bottom',
      duration = durations.normal,
      delay = 0,
      distance = 50,
      ease = easings.smooth,
      opacity = true,
      scale = 1,
      onComplete,
    } = options;

    const initialPos = getInitialPosition(direction, distance);

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Set initial position
    gsap.set(elementRef.current, {
      x: initialPos.x,
      y: initialPos.y,
      opacity: opacity ? 0 : 1,
      scale: scale === 1 ? 1 : scale,
    });

    // Animate in
    animationRef.current = gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease,
      onComplete,
    });
  };

  const slideOut = (outDirection?: SlideDirection) => {
    if (!elementRef.current) return;

    const {
      direction = 'bottom',
      duration = durations.fast,
      distance = 50,
      ease = easings.smooth,
      opacity = true,
      scale = 1,
      onComplete,
    } = options;

    const finalDirection = outDirection || direction;
    const finalPos = getInitialPosition(finalDirection, distance);

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Animate out
    animationRef.current = gsap.to(elementRef.current, {
      x: finalPos.x,
      y: finalPos.y,
      opacity: opacity ? 0 : 1,
      scale: scale === 1 ? 1 : scale,
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
    slideIn,
    slideOut,
  };
};
