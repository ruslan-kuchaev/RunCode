import { UserPlus } from "lucide-react";
import { forwardRef, useActionState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { ModalHeader } from "./ModalHeader";
import { AuthButton } from "./AuthButton";
import { Divider } from "./Divider";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { TextLinkButton } from "./TextLinkButton";

interface RegisterFormProps {
    colorHex: string;
    colorRgb: string;
    onClose: () => void;
    onSwitchToLogin: () => void;
    disabled?: boolean;
}

async function registerAction(prevState: any, formData: FormData) {
    return { success: true };
}

export const RegisterForm = forwardRef<HTMLDivElement, RegisterFormProps>(
    ({ colorHex, colorRgb, onClose, onSwitchToLogin, disabled }, ref) => {
        const { registerFormData, updateRegisterFormData } = useAuthStore();
        const [state, formAction, isPending] = useActionState(registerAction, null);
        const formRef = useRef<HTMLFormElement>(null);

        const icon = (
            <div
                style={{ backgroundColor: `rgba(${colorRgb}, 0.4)` }}
                className="p-2 rounded-lg"
            >
                <UserPlus style={{ color: colorHex }} className="w-6 h-6" />
            </div>
        );

        return (
            <div
                ref={ref}
                className="flex-1 rounded-2xl p-8 shadow-2xl bg-black/20 backdrop-blur-md border border-white/10 flex flex-col"
                style={{ minHeight: '100%' }}
            >
                <ModalHeader
                    icon={icon}
                    title="Создать аккаунт"
                    titleId="auth-modal-title"
                    onClose={onClose}
                />

                <form ref={formRef} action={formAction} className="space-y-6" role="form" aria-labelledby="auth-modal-title">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Никнейм</label>
                        <input
                            type="text"
                            name="username"
                            value={registerFormData.username || ''}
                            onChange={(e) => !disabled && updateRegisterFormData({ username: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Ваш никнейм"
                            aria-label="Username"
                            disabled={disabled || isPending}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={registerFormData.email}
                            onChange={(e) => !disabled && updateRegisterFormData({ email: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="your@email.com"
                            aria-label="Email"
                            disabled={disabled || isPending}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={registerFormData.password}
                            onChange={(e) => !disabled && updateRegisterFormData({ password: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="••••••••"
                            aria-label="Password"
                            disabled={disabled || isPending}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Подтвердите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={registerFormData.confirmPassword || ''}
                            onChange={(e) => !disabled && updateRegisterFormData({ confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="••••••••"
                            aria-label="Confirm Password"
                            disabled={disabled || isPending}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={disabled || isPending}
                        style={{
                            boxShadow: "none",
                        }}
                        className="w-full py-3.5 mt-4 bg-gray-800/60 backdrop-blur-xs text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                        onMouseEnter={(e) => {
                            if (!disabled && !isPending) {
                                e.currentTarget.style.boxShadow = `0 10px 25px ${colorHex}40`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <UserPlus className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        {isPending ? "Создание..." : "Создать аккаунт"}
                    </button>

                    <Divider text="Или зарегистрируйтесь через" />

                    <SocialAuthButtons />


                </form>
            </div>
        );
    }
);

RegisterForm.displayName = "RegisterForm";