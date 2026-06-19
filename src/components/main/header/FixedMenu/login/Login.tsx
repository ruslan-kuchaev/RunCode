'use client';
import {useRef, useEffect, useState} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
import {Ghost, User, LogOut, Shield, ChevronDown} from 'lucide-react';
import {useSession, signOut} from 'next-auth/react';
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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initializeHelloState();
    }, [initializeHelloState]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropdownOpen]);

    useGSAP(
        () => {
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

            if (!ModalOpen && !dropdownOpen) {
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
        { dependencies: [currentColor, ModalOpen, dropdownOpen], scope: loginRef }
    );

    const handleLogout = async () => {
        setDropdownOpen(false);
        await signOut({ redirect: false });
        router.push('/');
    };

    const handleProfileClick = () => {
        setDropdownOpen(false);
        router.push('/profile');
    };

    const handleAdminClick = () => {
        setDropdownOpen(false);
        router.push('/admin');
    };

    // Check if user is admin
    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    return (
        <div
            ref={loginRef}
            className='fixed top-5 left-[2%] z-55 will-change-auto opacity-0'
        >
            <div ref={dropdownRef} className="relative">
                <button
                    onClick={() => session ? setDropdownOpen(!dropdownOpen) : openAuthModal()}
                    className='focus:outline-none'
                >
                    <div
                        ref={GhostDiv}
                        className={`rounded-full w-12 h-12 flex transform origin-center ${session ? 'ring-2 ring-cyan-400/50' : ''}`}
                    >
                        <Ghost size={35} className='m-auto transform origin-center'/>
                    </div>
                </button>

                {/* Dropdown menu for logged in users */}
                {session && dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-700/50">
                            <p className="text-white font-semibold text-sm truncate">
                                {session.user?.name || 'Пользователь'}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                                {session.user?.email}
                            </p>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                            {isAdmin && (
                                <button
                                    onClick={handleAdminClick}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-purple-500/20 transition-colors flex items-center gap-3"
                                >
                                    <Shield size={18} className="text-purple-400" />
                                    <span className="text-sm">Admin Panel</span>
                                </button>
                            )}
                            
                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-2 text-left text-white hover:bg-cyan-500/20 transition-colors flex items-center gap-3"
                            >
                                <User size={18} className="text-cyan-400" />
                                <span className="text-sm">Профиль</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-3"
                            >
                                <LogOut size={18} />
                                <span className="text-sm">Выйти</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
