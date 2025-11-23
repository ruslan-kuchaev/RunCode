# GSAP Animation Hooks

This directory contains custom React hooks for GSAP animations. All hooks are optimized for performance and automatically handle cleanup.

## Available Hooks

### useScrollAnimation

Triggers animations based on scroll position using ScrollTrigger.

```tsx
import { useScrollAnimation } from '@/hooks';

const MyComponent = () => {
  const ref = useScrollAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1 },
    options: {
      start: 'top 80%',
      scrub: true
    }
  });

  return <div ref={ref}>Content</div>;
};
```

### useFadeIn

Fades in elements on mount with optional slide effect.

```tsx
import { useFadeIn } from '@/hooks';

const MyComponent = () => {
  const ref = useFadeIn({
    duration: 0.8,
    delay: 0.2,
    y: 30, // Slide up while fading
  });

  return <div ref={ref}>Content</div>;
};
```

### useSlideIn

Slides in elements from any direction.

```tsx
import { useSlideIn } from '@/hooks';

const MyComponent = () => {
  const ref = useSlideIn({
    direction: 'left',
    duration: 0.6,
    distance: 100,
    opacity: true
  });

  return <div ref={ref}>Content</div>;
};
```

### useOptimizedGSAP

Provides optimized GSAP utilities for complex animations.

```tsx
import { useOptimizedGSAP } from '@/hooks';

const MyComponent = () => {
  const { createTimeline, animateIn, animateOut } = useOptimizedGSAP();

  useEffect(() => {
    const tl = createTimeline();
    tl.to('.element1', { x: 100 })
      .to('.element2', { y: 50 });
  }, []);

  return <div>Content</div>;
};
```

## Batch Animations

All hooks have batch variants for animating multiple elements:

- `useScrollAnimationBatch` - Animate multiple elements on scroll
- `useFadeInBatch` - Fade in multiple elements with stagger
- `useSlideInBatch` - Slide in multiple elements with stagger

```tsx
import { useFadeInBatch } from '@/hooks';

const MyComponent = () => {
  const ref = useFadeInBatch('.item', {
    duration: 0.6,
    stagger: 0.1,
    y: 20
  });

  return (
    <div ref={ref}>
      <div className="item">Item 1</div>
      <div className="item">Item 2</div>
      <div className="item">Item 3</div>
    </div>
  );
};
```

## Controlled Animations

Some hooks provide controlled variants for manual triggering:

```tsx
import { useFadeInControlled } from '@/hooks';

const MyComponent = () => {
  const { ref, fadeIn, fadeOut } = useFadeInControlled({
    duration: 0.5
  });

  return (
    <>
      <button onClick={fadeIn}>Show</button>
      <button onClick={fadeOut}>Hide</button>
      <div ref={ref}>Content</div>
    </>
  );
};
```

## Configuration

All hooks use centralized configuration from `@/lib/gsap`:

- `durations` - Predefined animation durations (fast, normal, slow, verySlow)
- `easings` - Predefined easing functions (smooth, snappy, elastic, bounce)
- `scrollTriggerDefaults` - Default ScrollTrigger settings

## Performance Tips

1. All hooks automatically clean up animations on unmount
2. Use `will-change` CSS property for animated elements
3. Prefer `transform` and `opacity` for best performance
4. Use batch variants for multiple elements instead of individual hooks
5. Consider using `scrub: true` for scroll animations to sync with scroll position

## Examples

See `src/components/shared/AnimationExamples.tsx` for complete working examples.
