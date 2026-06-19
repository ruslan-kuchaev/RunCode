'use client';

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useAnimationStore } from '@/store/AnimationCenter';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
    label: string;
    href: string;
    id: string;
}

const navItems: NavItem[] = [
    { label: 'Главная', href: '/', id: 'home' },
    { label: 'Задачи', href: '/tasks', id: 'tasks' },
    { label: 'Рейтинг', href: '/rating', id: 'rating' },
];

export default function NavMenu() {
    const navRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const complete = useAnimationStore((state) => state.isHelloComplete);
    const initializeHelloState = useAnimationStore((state) => state.initializeHelloState);
    const pathname = usePathname();
    const router = useRouter();

    // derive active id from current pathname
    const getActiveId = (path: string) => {
        if (path === '/') return 'home';
        const match = navItems.find((item) => item.href !== '/' && path.startsWith(item.href));
        return match ? match.id : 'home';
    };

    const [activeId, setActiveId] = useState(() => getActiveId(pathname));

    useEffect(() => {
        initializeHelloState();
    }, [initializeHelloState]);

    // sync active id when pathname changes (back/forward navigation)
    useEffect(() => {
        setActiveId(getActiveId(pathname));
    }, [pathname]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
        e.preventDefault();
        if (item.id === activeId) return;

        setActiveId(item.id);

        // View Transition API for smooth page change
        if ('startViewTransition' in document) {
            (document as Document & { startViewTransition: (cb: () => void) => void })
                .startViewTransition(() => {
                    router.push(item.href);
                });
        } else {
            router.push(item.href);
        }
    };

    useGSAP(
        () => {
            if (!complete) return;

            const tl = gsap.timeline({
                defaults: { ease: 'power3.inOut', duration: 0.5 },
                paused: true,
            });

            tl.fromTo(
                navRef.current,
                { autoAlpha: 0, y: -20 },
                { autoAlpha: 1, y: 0 }
            );

            itemsRef.current.forEach((item, index) => {
                if (item) {
                    tl.fromTo(
                        item,
                        { autoAlpha: 0, y: -20 },
                        { autoAlpha: 1, y: 0, duration: 0.5 },
                        index * 0.1
                    );
                }
            });

            tl.play();

            let lastScrollY = 0;
            const handleScroll = () => {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    if (tl.progress() > 0) tl.reverse();
                } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
                    if (tl.progress() < 1) tl.play();
                }
                lastScrollY = currentScrollY;
            };

            let ticking = false;
            const throttledScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', throttledScroll);
            return () => window.removeEventListener('scroll', throttledScroll);
        },
        { dependencies: [complete], revertOnUpdate: true }
    );

    return (
        <div className="fixed top-0 left-[50%] transform -translate-x-1/2 z-50 will-change-auto opacity-100">
            <nav
                ref={navRef}
                className="relative flex flex-nowrap gap-8 mt-4 px-6 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10"
            >
                {navItems.map((item, index) => (
                    <a
                        key={item.id}
                        ref={(el) => { itemsRef.current[index] = el; }}
                        className={cn(
                            'relative px-4 py-2 font-medium text-sm tracking-wide opacity-0',
                            'transition-colors duration-200 ease-out',
                            'hover:cursor-pointer select-none rounded-lg',
                            activeId === item.id ? 'text-white' : 'text-white/60 hover:text-white/90'
                        )}
                        href={item.href}
                        onClick={(e) => handleClick(e, item)}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
        </div>
    );
}
