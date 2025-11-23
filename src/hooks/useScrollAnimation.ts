/**
 * useScrollAnimation Hook
 * 
 * Provides scroll-triggered animations using GSAP ScrollTrigger.
 * Automatically cleans up ScrollTrigger instances on unmount.
 */

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export interface ScrollAnimationOptions {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  pin?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export interface ScrollAnimationConfig {
  from?: gsap.TweenVars;
  to: gsap.TweenVars;
  options?: ScrollAnimationOptions;
}

/**
 * Hook for creating scroll-triggered animations
 * 
 * @example
 * ```tsx
 * const ref = useScrollAnimation({
 *   from: { opacity: 0, y: 50 },
 *   to: { opacity: 1, y: 0 },
 *   options: {
 *     start: 'top 80%',
 *     end: 'bottom 20%',
 *     scrub: true
 *   }
 * });
 * 
 * return <div ref={ref}>Animated content</div>;
 * ```
 */
export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>(
  config: ScrollAnimationConfig
) => {
  const elementRef = useRef<T>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const { from, to, options = {} } = config;
    const element = elementRef.current;

    // Create the animation
    const animation = from
      ? gsap.fromTo(element, from, {
          ...to,
          scrollTrigger: {
            trigger: options.trigger || element,
            start: options.start || 'top 80%',
            end: options.end || 'bottom 20%',
            scrub: options.scrub ?? false,
            markers: options.markers ?? false,
            pin: options.pin ?? false,
            toggleActions: options.toggleActions || 'play none none reverse',
            onEnter: options.onEnter,
            onLeave: options.onLeave,
            onEnterBack: options.onEnterBack,
            onLeaveBack: options.onLeaveBack,
          },
        })
      : gsap.to(element, {
          ...to,
          scrollTrigger: {
            trigger: options.trigger || element,
            start: options.start || 'top 80%',
            end: options.end || 'bottom 20%',
            scrub: options.scrub ?? false,
            markers: options.markers ?? false,
            pin: options.pin ?? false,
            toggleActions: options.toggleActions || 'play none none reverse',
            onEnter: options.onEnter,
            onLeave: options.onLeave,
            onEnterBack: options.onEnterBack,
            onLeaveBack: options.onLeaveBack,
          },
        });

    // Store the ScrollTrigger instance
    scrollTriggerRef.current = animation.scrollTrigger as ScrollTrigger;

    // Cleanup
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      animation.kill();
    };
  }, [config]);

  return elementRef;
};

/**
 * Hook for creating multiple scroll animations on child elements
 * 
 * @example
 * ```tsx
 * const ref = useScrollAnimationBatch({
 *   selector: '.item',
 *   from: { opacity: 0, y: 30 },
 *   to: { opacity: 1, y: 0, stagger: 0.1 },
 *   options: { start: 'top 80%' }
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     <div className="item">Item 1</div>
 *     <div className="item">Item 2</div>
 *   </div>
 * );
 * ```
 */
export const useScrollAnimationBatch = <T extends HTMLElement = HTMLDivElement>(
  config: ScrollAnimationConfig & { selector: string }
) => {
  const containerRef = useRef<T>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { selector, from, to, options = {} } = config;
    const elements = containerRef.current.querySelectorAll(selector);

    if (elements.length === 0) return;

    // Create the batch animation
    const animation = from
      ? gsap.fromTo(elements, from, {
          ...to,
          scrollTrigger: {
            trigger: options.trigger || containerRef.current,
            start: options.start || 'top 80%',
            end: options.end || 'bottom 20%',
            scrub: options.scrub ?? false,
            markers: options.markers ?? false,
            toggleActions: options.toggleActions || 'play none none reverse',
            onEnter: options.onEnter,
            onLeave: options.onLeave,
            onEnterBack: options.onEnterBack,
            onLeaveBack: options.onLeaveBack,
          },
        })
      : gsap.to(elements, {
          ...to,
          scrollTrigger: {
            trigger: options.trigger || containerRef.current,
            start: options.start || 'top 80%',
            end: options.end || 'bottom 20%',
            scrub: options.scrub ?? false,
            markers: options.markers ?? false,
            toggleActions: options.toggleActions || 'play none none reverse',
            onEnter: options.onEnter,
            onLeave: options.onLeave,
            onEnterBack: options.onEnterBack,
            onLeaveBack: options.onLeaveBack,
          },
        });

    scrollTriggerRef.current = animation.scrollTrigger as ScrollTrigger;

    // Cleanup
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      animation.kill();
    };
  }, [config]);

  return containerRef;
};
