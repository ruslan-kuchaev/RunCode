'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function RatingHeader() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        if (titleRef.current && subtitleRef.current) {
            gsap.set([titleRef.current, subtitleRef.current], { opacity: 0, y: 20 });
            
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
            tl.to([titleRef.current, subtitleRef.current], {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
            });
        }
    }, []);

    return (
        <div className="text-center mb-12">
            <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-4">
                🏆 Рейтинг
            </h1>
            <p ref={subtitleRef} className="text-xl text-gray-400 max-w-2xl mx-auto">
                Лучшие программисты платформы RunCode. Соревнуйтесь, решайте задачи и поднимайтесь в рейтинге!
            </p>
        </div>
    );
}