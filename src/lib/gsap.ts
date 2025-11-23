/**
 * GSAP Configuration and Plugin Registration
 * 
 * This file configures GSAP with all necessary plugins and provides
 * a centralized place for GSAP-related utilities and defaults.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Register GSAP plugins globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

// Default GSAP configuration
gsap.config({
  // Prevent GSAP from throwing warnings in production
  nullTargetWarn: false,
  // Use force3D for better performance
  force3D: true,
});

// Default animation settings
export const defaultAnimationConfig = {
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.1,
};

// Easing presets for consistent animations
export const easings = {
  smooth: 'power2.inOut',
  snappy: 'power3.out',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'bounce.out',
  linear: 'none',
} as const;

// Common animation durations
export const durations = {
  fast: 0.3,
  normal: 0.6,
  slow: 1,
  verySlow: 1.5,
} as const;

// ScrollTrigger defaults
export const scrollTriggerDefaults = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
} as const;

/**
 * Initialize ScrollSmoother for smooth scrolling experience
 * Call this in your root layout or main component
 */
export const initScrollSmoother = () => {
  if (typeof window === 'undefined') return null;

  return ScrollSmoother.create({
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.1,
  });
};

/**
 * Cleanup function to kill all GSAP animations and ScrollTriggers
 * Useful for component unmounting or route changes
 */
export const cleanupGSAP = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
};

/**
 * Refresh ScrollTrigger instances
 * Call this after dynamic content changes
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

// Export GSAP and plugins for direct use
export { gsap, ScrollTrigger, ScrollSmoother };
