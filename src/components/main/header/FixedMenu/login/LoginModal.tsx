"use client";
import { createPortal } from "react-dom";
import {useEffect, useState, useRef, useCallback} from "react";
import { useAuthStore } from "@/store/authStore";
import { useColorCycle } from "@/hooks/useColorCycle";
import { ModalBackdrop } from "./ui/ModalBackdrop";
import { LoginForm } from "./ui/LoginForm";
import { RegisterForm } from "./ui/RegisterForm";
import { RegisterPanel } from "./ui/RegisterPanel";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const LoginModal = () => {
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const { isAuthModalOpen, closeAuthModal, defaultTab, openAuthModal } = useAuthStore();
    const currentColor = useColorCycle();
    const currentColorHex = currentColor[0];
    const currentColorRgb = currentColor[1];

    const LoginFromRef = useRef<HTMLDivElement | null>(null);
    const RegisterPanelRef = useRef<HTMLDivElement | null>(null);
    const ModalBackdropRef = useRef<HTMLDivElement | null>(null);
    const RegisterFormRef = useRef<HTMLDivElement | null>(null);


    const handleClose = useCallback(() => {
        if (isAnimating) return;
        //оптимизировать if TODO

        setIsAnimating(true);

        if (RegisterFormRef.current !== null) {
            gsap.to(RegisterFormRef.current, {
                x: -200,
                opacity: 0,
                duration: 0.6,
                ease: "power3.in",
            });
        } else {
            gsap.to(LoginFromRef.current, {
                x: -200,
                opacity: 0,
                duration: 0.6,
                ease: "power3.in",
            });

        }
        gsap.to(RegisterPanelRef.current, {
            x: 200,
            opacity: 0,
            duration: 0.6,
            ease: "power3.in",
        });

        gsap.to(ModalBackdropRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power3.in",
        });


        setTimeout(() => {
            closeAuthModal();
            setIsAnimating(false);
        }, 1000);
    }, [closeAuthModal, isAnimating]);


    useGSAP(() => {
        if (!mounted || !isAuthModalOpen || isAnimating) return;
        setIsAnimating(true)
        gsap.from(RegisterPanelRef.current, {
            x: 200,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
        });
        if (RegisterFormRef.current !== null) {
            gsap.from(RegisterFormRef.current, {
                x: -200,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });
        } else {
            gsap.from(LoginFromRef.current, {
                x: -200,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });

        }

        gsap.from(ModalBackdropRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => setIsAnimating(false),
        });

    }, { dependencies: [isAuthModalOpen, mounted] });

    useScrollLock(isAuthModalOpen && mounted && !isAnimating);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !isAuthModalOpen || isAnimating) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", onKey);

        modalRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKey);
        };
    }, [isAuthModalOpen, mounted, isAnimating, handleClose]);

    if (!mounted || (!isAuthModalOpen && !isAnimating)) return null;

    const handleTabSwitch = (tab: "login" | "register") => {


        openAuthModal(tab);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            aria-hidden={false}
        >
            <ModalBackdrop ref={ModalBackdropRef} onClick={handleClose} />

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
                tabIndex={-1}
                className="relative z-10 w-full max-w-4xl flex gap-16 items-center"
            >
                {defaultTab === "login" ? (
                    <LoginForm
                        ref={LoginFromRef}
                        colorHex={currentColorHex}
                        colorRgb={currentColorRgb}
                        onClose={handleClose}
                    />
                ) : (
                    <RegisterForm

                        ref={RegisterFormRef}
                        colorHex={currentColorHex}
                        colorRgb={currentColorRgb}
                        onClose={handleClose}
                        onSwitchToLogin={() => handleTabSwitch("login")}
                    />
                )}

                <RegisterPanel
                    ref={RegisterPanelRef}
                    colorHex={currentColorHex}
                    colorRgb={currentColorRgb}
                    onSwitchToLogin={() => handleTabSwitch("login")}
                    onRegister={() => handleTabSwitch("register")}
                />
            </div>
        </div>,
        document.body
    );
};