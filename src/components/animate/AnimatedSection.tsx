
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {useActionBarStore} from "@/store";

interface AnimatedSectionProps {
    children: React.ReactNode;
    isVisible: boolean;
    animationOrigin?: 'left' | 'right' | 'top' | 'bottom';
    delay?: number;
}

export const AnimatedSection = ({
                                    children,
                                    isVisible,
                                    animationOrigin = 'bottom',
                                    delay = 0
                                }: AnimatedSectionProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);
    const { activeSection, openedSections } = useActionBarStore();

    useEffect(() => {
        if (!sectionRef.current || !isVisible) return;

        const getInitialValues = () => {
            const distance = 40;
            switch (animationOrigin) {
                case 'left': return { x: -distance, opacity: 0 };
                case 'right': return { x: distance, opacity: 0 };
                case 'top': return { y: -distance, opacity: 0 };
                case 'bottom':
                default: return { y: distance, opacity: 0 };
            }
        };

        if (!hasAnimatedRef.current || (activeSection == openedSections[1])) {
            const initial = getInitialValues();
            gsap.fromTo(sectionRef.current,
                initial,
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay,
                    ease: "power2.out",
                    onComplete: () => {
                        hasAnimatedRef.current = true;
                    }
                }
            );
        }
    }, [isVisible, animationOrigin, delay, activeSection, openedSections]);

    return (
        <div ref={sectionRef} className="opacity-0">
            {children}
        </div>
    );
};