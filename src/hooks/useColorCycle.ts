'use client';

import useAnimationStore from "@/store/AnimationCenter";
import { useEffect } from "react";

export const colors = {
    red: ["#fb2c36", "251, 44, 54"],
    yellow: ["#fe9a00", "254, 154, 0"],
    green: ["#00c950", "0, 201, 80"],
} as const;

export type ColorKey = keyof typeof colors;

// Singleton для таймера - один таймер на всё приложение
let colorCycleTimer: NodeJS.Timeout | null = null;
let activeComponentsCount = 0; // Счетчик активных компонентов

/**
 * Функция для перехода к следующему цвету в цикле
 */
const cycleToNextColor = () => {
    const colorOrder: ColorKey[] = ["red", "yellow", "green"];
    const currentColor = useAnimationStore.getState().currentLoginColor;
    const currentIndex = colorOrder.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colorOrder.length;
    useAnimationStore.getState().setColor(colorOrder[nextIndex]);
};

/**
 * Хук для получения текущего цвета и управления циклом цветов
 * Store только хранит состояние, вся логика цикла в хуке
 * @param interval - интервал для изменения цвета (по умолчанию 10000мс)
 * @returns массив [hex, rgb] текущего цвета
 */
export const useColorCycle = (interval = 10000) => {
    const keyColor = useAnimationStore((state) => state.currentLoginColor);
    const hex = colors[keyColor];

    useEffect(() => {
        // Увеличиваем счетчик активных компонентов
        activeComponentsCount++;

        // Останавливаем предыдущий таймер, если он существует
        if (colorCycleTimer) {
            clearInterval(colorCycleTimer);
        }

        // Запускаем новый таймер для бесконечного цикла
        colorCycleTimer = setInterval(() => {
            cycleToNextColor();
        }, interval);

        // Очистка при размонтировании компонента
        return () => {
            activeComponentsCount--;
            
            // Останавливаем таймер только если больше нет активных компонентов
            if (activeComponentsCount === 0 && colorCycleTimer) {
                clearInterval(colorCycleTimer);
                colorCycleTimer = null;
            }
        };
    }, [interval]);

    return hex;
};