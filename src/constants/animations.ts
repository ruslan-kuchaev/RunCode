export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

export const ANIMATION_EASINGS = {
  easeInOut: 'power2.inOut',
  easeOut: 'power2.out',
  easeIn: 'power2.in',
  elastic: 'elastic.out(1, 0.5)',
} as const;
