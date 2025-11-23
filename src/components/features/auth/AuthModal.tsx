'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import gsap from 'gsap';

export default function AuthModal() {
  const { isAuthModalOpen, defaultTab, closeAuthModal } = useAuthStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(defaultTab || 'login');

  useEffect(() => {
    if (isAuthModalOpen && contentRef.current) {
      // Animate modal content on open
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    if (isAuthModalOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [isAuthModalOpen, defaultTab]);

  const handleClose = () => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: closeAuthModal,
      });
    } else {
      closeAuthModal();
    }
  };

  const handleSuccess = () => {
    handleClose();
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={handleClose}>
      <div ref={contentRef} className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Добро пожаловать в RunCode
        </h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue={defaultTab || 'login'}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}
