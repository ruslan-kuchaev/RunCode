import {LogIn} from "lucide-react";
import React, {forwardRef, useActionState, useRef} from "react";
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
// unknown
async function loginAction(prevState: unknown, formData: FormData) {
    return {success: true};
}

export const LoginForm = forwardRef<HTMLDivElement, LoginFormProps>((
    {colorHex, colorRgb, onClose},
    ref
) =>
{
    const {loginFormData, updateLoginFormData} = useAuthStore();
    const [state, formAction, isPending] = useActionState(loginAction, null);
    const formRef = useRef<HTMLFormElement>(null);

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

            <form ref={formRef} action={formAction} className="space-y-6" role="form"
                  aria-labelledby="auth-modal-title">
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
                    />
                    <div className="flex justify-end mt-2">
                        <button type="button" className="text-sm text-gray-600 hover:text-white transition-colors">
                            Забыли пароль?
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    style={{
                        boxShadow: "none",
                    }}
                    className="w-full py-3.5 mt-4 bg-gray-800/60 backdrop-blur-xs text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                    onMouseEnter={(e) => {
                        if (!isPending) {
                            e.currentTarget.style.boxShadow = `0 10px 25px ${colorHex}40`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"/>
                    {isPending ? "Вход..." : "Войти в систему"}
                </button>

                <Divider text="Или войдите через"/>

                <SocialAuthButtons/>
            </form>
        </div>
    );
}
);


LoginForm.displayName = "LoginForm";

