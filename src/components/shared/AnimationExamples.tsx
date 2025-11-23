/**
 * Animation Examples Component
 * 
 * Demonstrates the usage of GSAP animation hooks.
 * This file can be used as a reference for implementing animations.
 */

'use client';

import { useFadeIn, useSlideIn, useScrollAnimation } from '@/hooks';

export const FadeInExample = () => {
  const ref = useFadeIn({
    duration: 0.8,
    delay: 0.2,
    y: 30,
  });

  return (
    <div ref={ref} className="p-6 bg-blue-500 text-white rounded-lg">
      This element fades in on mount
    </div>
  );
};

export const SlideInExample = () => {
  const ref = useSlideIn({
    direction: 'left',
    duration: 0.6,
    distance: 100,
    opacity: true,
  });

  return (
    <div ref={ref} className="p-6 bg-green-500 text-white rounded-lg">
      This element slides in from the left
    </div>
  );
};

export const ScrollAnimationExample = () => {
  const ref = useScrollAnimation({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 1 },
    options: {
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  return (
    <div ref={ref} className="p-6 bg-purple-500 text-white rounded-lg">
      This element animates when scrolled into view
    </div>
  );
};

/**
 * Complete example showing all animations
 */
export const AnimationShowcase = () => {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-4">GSAP Animation Examples</h2>
      
      <section>
        <h3 className="text-xl font-semibold mb-2">Fade In Animation</h3>
        <FadeInExample />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Slide In Animation</h3>
        <SlideInExample />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Scroll Animation</h3>
        <div className="h-screen" />
        <ScrollAnimationExample />
        <div className="h-screen" />
      </section>
    </div>
  );
};
