// components/FPSCounter.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function FPSCounter() {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationRef = useRef<number>(null);

  useEffect(() => {
    const updateFPS = (currentTime: number) => {
      frameCount.current++;

      if (currentTime >= lastTime.current + 1000) {
        const currentFps = Math.round(
          (frameCount.current * 1000) / (currentTime - lastTime.current)
        );
        setFps(currentFps);
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(updateFPS);
    };

    animationRef.current = requestAnimationFrame(updateFPS);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getColor = () => {
    if (fps > 50) return 'text-green-500';
    if (fps > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg font-mono text-sm">
      FPS: <span className={getColor()}>{fps}</span>
    </div>
  );
}