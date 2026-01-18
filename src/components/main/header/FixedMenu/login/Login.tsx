'use client';
import {useRef, useEffect} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
import {Ghost, User} from 'lucide-react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

import useAnimationStore from '@/store/AnimationCenter';
import {useAuthStore} from '@/store/authStore';
import {useColorCycle} from "@/hooks/useColorCycle";

export const Login = () => {
    const loginRef = useRef<HTMLDivElement>(null);
    const complete = useAnimationStore((state) => state.isHelloComplete);
    const currentColor = useColorCycle(6000)
    const GhostDiv = useRef<HTMLDivElement>(null);
    const ModalOpen = useAuthStore((state) => state.isAuthModalOpen);
    const initializeHelloState = useAnimationStore(
        (state) => state.initializeHelloState,
    );
    const openAuthModal = useAuthStore((state) => state.openAuthModal);
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        initializeHelloState();
    }, [initializeHelloState]);

    const handleClick = () => {
        if (session) {
            // Если пользователь авторизован, перенаправляем на профиль
            router.push('/profile');
        } else {
            // Если не авторизован, открываем модальное окно
            openAuthModal();
        }
    };

    useGSAP(
        () => {
            //TODO
            if (!complete) return;

            gsap.fromTo(
                loginRef.current,
                {opacity: 0, y: -50, scale: 0.5},
                {
                    scale: 1,
                    delay: 0.5,
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.inOut",
                }
            );
        },
        {dependencies: [complete], scope: loginRef}
    );
    
    useGSAP(
        () => {
            if (!complete || !loginRef.current) return;

            const tl = gsap.timeline({ overwrite: true });

            if (!ModalOpen) {
                tl.to(GhostDiv.current, {
                    x: gsap.utils.wrap([-2, 2]),
                    scale: 1,
                    duration: 0.1,
                    repeat: 6,
                    ease: 'none',
                })

                    .to(GhostDiv.current, {
                        backgroundColor: currentColor[0],
                        boxShadow: `0 4px 15px ${currentColor[0]}80`,
                        x: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: 'bounce.out',
                    })

            } else {
                tl.to(GhostDiv.current, {
                    backgroundColor: currentColor[0],
                    boxShadow: `0 4px 15px ${currentColor[0]}80`,
                })
            }
            return () => tl.kill();
        },
        { dependencies: [currentColor], scope: loginRef }
    );

    return (
        <div
            ref={loginRef}
            className='fixed top-5 left-[2%] z-55 will-change-auto opacity-0'
        >
            <button
                onClick={handleClick}
                className='focus:outline-none'
                title={session ? 'Перейти в профиль' : 'Войти или зарегистрироваться'}
            >
                <div
                    ref={GhostDiv}
                    className={`rounded-full w-12 h-12 flex transform origin-center`}>
                    {session ? (
                        <User size={35} className='m-auto transform origin-center'/>
                    ) : (
                        <Ghost size={35} className='m-auto transform origin-center'/>
                    )}
                </div>
            </button>
        </div>
    );
};
