import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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

export const useAuthStore = create<AuthModalState>()(
    devtools(
        (set, get) => ({
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
                set({ isAuthModalOpen: true, defaultTab: currentTab }, false, 'auth/openModal');
            },
            closeAuthModal: () => set({ isAuthModalOpen: false }, false, 'auth/closeModal'),
            updateLoginFormData: (data) =>
                set(
                    (state) => ({
                        loginFormData: { ...state.loginFormData, ...data },
                    }),
                    false,
                    'auth/updateLoginForm'
                ),
            updateRegisterFormData: (data) =>
                set(
                    (state) => ({
                        registerFormData: { ...state.registerFormData, ...data },
                    }),
                    false,
                    'auth/updateRegisterForm'
                ),
            clearFormData: () =>
                set({
                    loginFormData: { email: '', password: '' },
                    registerFormData: { email: '', password: '', username: '', confirmPassword: '' },
                }, false, 'auth/clearForms'),
        }),
        {
            name: 'AuthStore',
            // Дополнительные опции для DevTools
            // enabled: process.env.NODE_ENV !== 'production',
            // anonymousActionType: 'AUTH_ACTION',
        }
    )
);