import { create } from "zustand";
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

export const useAnimationStore = create<AnimationStore>((set) => ({
    isHelloComplete: getInitialHelloState(),
    completeHello: () => set({ isHelloComplete: true }),
    initializeHelloState: () => set({ isHelloComplete: getInitialHelloState() }),

    currentLoginColor: 'yellow',
    setColor: (color) => set({ currentLoginColor: color }),
}));

export default useAnimationStore;