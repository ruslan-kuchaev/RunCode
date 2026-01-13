import { UserPlus } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { TextLinkButton } from "./TextLinkButton";
import { BgPoint } from "./BgPoint";
import React, { forwardRef } from "react";

interface RegisterPanelProps {
    colorHex: string;
    colorRgb: string;
    onSwitchToLogin: () => void;
    onRegister: () => void;
}

export const RegisterPanel = forwardRef<HTMLDivElement, RegisterPanelProps>(
    (
        {
            colorHex,
            colorRgb,
            onSwitchToLogin,
            onRegister,
        },
        ref
    ) => {
        const benefits = [
            "Доступ ко всем задачам",
            "Отслеживание прогресса",
            "Персональные рекомендации",
            "Участие в рейтинге",
        ];

        const icon = (
            <div
                style={{ backgroundColor: `rgba(${colorRgb}, 0.3)` }}
                className="p-2 rounded-lg"
            >
                <UserPlus className="w-6 h-6" style={{ color: colorHex }} />
            </div>
        );

        return (
            <div
                ref={ref}
                className="flex-1 rounded-2xl p-8 shadow-2xl backdrop-blur-md border flex flex-col self-center"
                style={{
                    backgroundColor: `rgba(${colorRgb}, 0.2)`,
                    borderColor: `rgba(${colorRgb}, 0.3)`,
                    minHeight: "fit-content",
                }}
            >
                <div className="flex items-center gap-3 mb-8">
                    {icon}
                    <h2 className="text-2xl font-bold text-white">Присоединяйтесь к нам</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Создайте аккаунт и получите:
                        </h3>

                        <ul className="space-y-3">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <BgPoint bgRGABFont={colorRgb} bgHEXPoint={colorHex} />
                                    <span className="text-gray-200">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4">
                        <AuthButton
                            icon={<UserPlus className="w-5 h-5" />}
                            onClick={onRegister}
                            colorHex={colorHex}
                            colorRgb={colorRgb}
                            variant="primary"
                        >
                            Создать аккаунт
                        </AuthButton>

                        <p className="text-center text-gray-300 text-sm mt-6">
                            Уже есть аккаунт?{" "}
                            <TextLinkButton onClick={onSwitchToLogin} colorHex={colorHex}>
                                Войти
                            </TextLinkButton>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
);

RegisterPanel.displayName = "RegisterPanel";