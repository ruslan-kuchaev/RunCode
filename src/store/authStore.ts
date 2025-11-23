import { create } from 'zustand';

interface AuthModalState {
  isAuthModalOpen: boolean;
  defaultTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthModalState>((set) => ({
  isAuthModalOpen: false,
  defaultTab: 'login',
  openAuthModal: (tab = 'login') => set({ isAuthModalOpen: true, defaultTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
