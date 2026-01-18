import { create } from 'zustand';

interface FormData {
    email: string;
    password: string;
    username?: string;
    confirmPassword?: string;
}

interface AuthModalState {
    isAuthModalOpen: boolean;
    defaultTab: 'login' | 'register';
    loginFormData: FormData;
    registerFormData: FormData;
    openAuthModal: (tab?: 'login' | 'register') => void;
    closeAuthModal: () => void;
    updateLoginFormData: (data: Partial<FormData>) => void;
    updateRegisterFormData: (data: Partial<FormData>) => void;
    clearFormData: () => void;
}

export const useAuthStore = create<AuthModalState>((set, get) => ({
    isAuthModalOpen: false,
    defaultTab: 'login',
    loginFormData: {
        email: '',
        password: '',
    },
    registerFormData: {
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
    },
    openAuthModal: (tab) => {
        const currentTab = tab ?? get().defaultTab ?? 'login';
        set({ isAuthModalOpen: true, defaultTab: currentTab });
    },
    closeAuthModal: () => set({ isAuthModalOpen: false }),
    updateLoginFormData: (data) =>
        set((state) => ({
            loginFormData: { ...state.loginFormData, ...data },
        })),
    updateRegisterFormData: (data) =>
        set((state) => ({
            registerFormData: { ...state.registerFormData, ...data },
        })),
    clearFormData: () =>
        set({
            loginFormData: { email: '', password: '' },
            registerFormData: { email: '', password: '', username: '', confirmPassword: '' },
        }),
}));