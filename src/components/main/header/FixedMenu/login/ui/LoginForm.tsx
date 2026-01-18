import {LogIn} from "lucide-react";
import React, {forwardRef, useActionState, useRef, useState} from "react";
import {signIn} from "next-auth/react";
import {useAuthStore} from "@/store/authStore";
import {ModalHeader} from "./ModalHeader";
import {AuthButton} from "./AuthButton";
import {Divider} from "./Divider";
import {SocialAuthButtons} from "./SocialAuthButtons";

interface LoginFormProps {
    colorHex: string,
    colorRgb: string,
    onClose: () => void,
}

export const LoginForm = forwardRef<HTMLDivElement, LoginFormProps>((
    {colorHex, colorRgb, onClose},
    ref
) =>
{
    const {loginFormData, updateLoginFormData} = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: loginFormData.email,
                password: loginFormData.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Неверный email или пароль');
            } else if (result?.ok) {
                // Успешная авторизация
                onClose();
                // Перезагружаем страницу для обновления сессии
                window.location.reload();
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Произошла ошибка при входе');
        } finally {
            setIsLoading(false);
        }
    };

    const icon = (
        <div
            style={{backgroundColor: `rgba(${colorRgb}, 0.4)`}}
            className="p-2 rounded-lg"
        >
            <LogIn style={{color: colorHex}} className="w-6 h-6"/>
        </div>
    );

    return (
        <div ref={ref}
            className="flex-1 rounded-2xl p-8 shadow-2xl bg-black/20 backdrop-blur-md border border-white/10 flex flex-col"
            style={{minHeight: '100%'}}>
            <ModalHeader
                icon={icon}
                title="Вход в систему"
                titleId="auth-modal-title"
                onClose={onClose}
            />

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" role="form"
                  aria-labelledby="auth-modal-title">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={loginFormData.email}
                        onChange={(e) => updateLoginFormData({email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:outline-none transition-all"
                        placeholder="your@email.com"
                        aria-label="Email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={loginFormData.password}
                        onChange={(e) => updateLoginFormData({password: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:outline-none transition-all"
                        placeholder="••••••••"
                        aria-label="Password"
                        required
                    />
                    <div className="flex justify-end mt-2">
                        <button type="button" className="text-sm text-gray-600 hover:text-white transition-colors">
                            Забыли пароль?
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        boxShadow: "none",
                    }}
                    className="w-full py-3.5 mt-4 bg-gray-800/60 backdrop-blur-xs text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                    onMouseEnter={(e) => {
                        if (!isLoading) {
                            e.currentTarget.style.boxShadow = `0 10px 25px ${colorHex}40`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"/>
                    {isLoading ? "Вход..." : "Войти в систему"}
                </button>

                <Divider text="Или войдите через"/>

                <SocialAuthButtons/>
            </form>
        </div>
    );
}
);

LoginForm.displayName = "LoginForm";

