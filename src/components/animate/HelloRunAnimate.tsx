"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import TextType from "../shadcn/TextType";
import useAnimationStore from "@/store/AnimationCenter";

interface HelloRunAnimateProps {
	onComplete?: () => void;
}

export default function HelloRunAnimate({ onComplete }: HelloRunAnimateProps) {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const [shouldShowAnimation, setShouldShowAnimation] = useState(true);
    
    const completeHello = useAnimationStore((state) => state.completeHello);

    // Проверяем первый визит только на клиенте после гидратации
    useEffect(() => {
        setIsHydrated(true);
        const hasVisited = localStorage.getItem('runcode-visited');
        setShouldShowAnimation(!hasVisited);
    }, []);

    // Если не первый визит, сразу скрываем анимацию
    useEffect(() => {
        if (isHydrated && !shouldShowAnimation) {
            const overlay = overlayRef.current;
            if (overlay) {
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            }
            onComplete?.();
            completeHello();
        }
    }, [isHydrated, shouldShowAnimation, onComplete, completeHello]);

    const handleComplete = () => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        // Помечаем, что пользователь уже посетил сайт
        localStorage.setItem('runcode-visited', 'true');

        const tl = gsap.timeline();
        tl.to(overlay, { opacity: 0, duration: 0.2, ease: "power2.out" })
            .set(overlay, { display: "none", pointerEvents: "none" })
            .call(() => {
                onComplete?.();
                completeHello();
            });
    };

    // Показываем анимацию только после гидратации и если это первый визит
    if (!isHydrated) {
        return (
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            />
        );
    }

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            style={{ display: shouldShowAnimation ? 'flex' : 'none' }}
        >
            {shouldShowAnimation && (
                <TextType
                    as="h1"
                    className="text-white text-4xl sm:text-5xl md:text-6xl font-bold"
                    text={["Hello, RunCode!", " "]}
                    typingSpeed={135}
                    deletingSpeed={80}
                    pauseDuration={1000}
                    initialDelay={150}
                    loop={false}
                    showCursor
                    cursorCharacter="|"
                    textColors={["#ffffff"]}
                    onSentenceComplete={handleComplete}
                />
            )}
        </div>
    );
}
