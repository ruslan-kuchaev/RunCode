'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface RatingSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function RatingSearch({ searchQuery, onSearchChange }: RatingSearchProps) {
    const searchRef = useRef<HTMLDivElement>(null);
    const searchIconRef = useRef<HTMLDivElement>(null);
    const clearButtonRef = useRef<HTMLButtonElement>(null);

    useGSAP(() => {
        if (searchRef.current && searchIconRef.current) {
            gsap.fromTo(
                searchRef.current,
                {
                    opacity: 0,
                    y: -20,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'back.out(1.4)',
                    delay: 0.2,
                }
            );

            gsap.fromTo(
                searchIconRef.current,
                {
                    opacity: 0,
                    scale: 0,
                    rotation: -180,
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    delay: 0.4,
                }
            );
        }
    }, []);

    useGSAP(() => {
        if (clearButtonRef.current) {
            if (searchQuery) {
                gsap.fromTo(
                    clearButtonRef.current,
                    {
                        opacity: 0,
                        scale: 0,
                        rotation: -90,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: 'back.out(1.7)',
                    }
                );
            } else {
                gsap.to(clearButtonRef.current, {
                    opacity: 0,
                    scale: 0,
                    rotation: 90,
                    duration: 0.2,
                    ease: 'power2.in',
                });
            }
        }
    }, { dependencies: [searchQuery] });

    return (
        <div ref={searchRef} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Поиск по имени пользователя или уровню..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-6 py-4 pl-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                />
                <div ref={searchIconRef} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <button
                    ref={clearButtonRef}
                    onClick={() => onSearchChange('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    style={{ display: searchQuery ? 'block' : 'none' }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}