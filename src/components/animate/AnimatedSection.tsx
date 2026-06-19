import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type AnimationOrigin = 'left' | 'right' | 'top' | 'bottom';

interface AnimatedSectionProps {
    children: React.ReactNode;
    isVisible: boolean;
    animationOrigin?: AnimationOrigin;
    delay?: number;
}

const ORIGINS: AnimationOrigin[] = ['left', 'right', 'top', 'bottom'];

function getRandomOrigin(): AnimationOrigin {
    return ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
}

function getInitialValues(origin: AnimationOrigin) {
    const distance = 50;
    switch (origin) {
        case 'left':  return { x: -distance, y: 0, opacity: 0 };
        case 'right': return { x: distance,  y: 0, opacity: 0 };
        case 'top':   return { x: 0, y: -distance, opacity: 0 };
        case 'bottom':
        default:      return { x: 0, y: distance,  opacity: 0 };
    }
}

export const AnimatedSection = ({
    children,
    isVisible,
    animationOrigin,
    delay = 0,
}: AnimatedSectionProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    // каждый раз при монтировании выбираем рандомное направление
    const originRef = useRef<AnimationOrigin>(animationOrigin ?? getRandomOrigin());

    useEffect(() => {
        if (!sectionRef.current || !isVisible) return;

        // при каждом появлении — новое рандомное направление
        if (!animationOrigin) {
            originRef.current = getRandomOrigin();
        }

        const initial = getInitialValues(originRef.current);

        gsap.fromTo(
            sectionRef.current,
            { ...initial },
            {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 0.55,
                delay,
                ease: 'power3.out',
            }
        );
    }, [isVisible, delay, animationOrigin]);

    return (
        <div ref={sectionRef} style={{ opacity: 0 }}>
            {children}
        </div>
    );
};
