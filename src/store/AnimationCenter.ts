import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ColorKey } from "@/hooks/useColorCycle";

interface AnimationStore {
    isHelloComplete: boolean;
    completeHello: () => void;
    initializeHelloState: () => void;

    currentLoginColor: ColorKey;
    setColor: (color: ColorKey) => void;
}

const getInitialHelloState = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("runcode-visited") === "true";
};

export const useAnimationStore = create<AnimationStore>()(
    devtools(
        persist(
            (set) => ({
                isHelloComplete: getInitialHelloState(),
                completeHello: () => {
                    if (typeof window !== "undefined") {
                        localStorage.setItem("runcode-visited", "true");
                    }
                    set({ isHelloComplete: true }, false, "completeHello");
                },

                initializeHelloState: () =>
                    set({ isHelloComplete: getInitialHelloState() }, false, "initializeHelloState"),

                currentLoginColor: 'yellow' as ColorKey,
                setColor: (color) =>
                    set({ currentLoginColor: color }, false, "setColor"),
            }),
            {
                name: "animation-storage", // ключ для localStorage
                partialize: (state) => ({
                    currentLoginColor: state.currentLoginColor
                }), // сохраняем только цвет
            }
        ),
        {
            name: "AnimationStore",
        }
    )
);

export default useAnimationStore;