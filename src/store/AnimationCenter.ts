import { create } from "zustand";

interface AnimationStore {
  isHelloComplete: boolean;
  isScrolled: boolean;
  completeHello: () => void;
  completeScroll: () => void;
  initializeHelloState: () => void;
}

// Проверяем localStorage только на клиенте
const getInitialHelloState = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("runcode-visited") === "true";
};

export const useAnimationStore = create<AnimationStore>((set) => ({
  isHelloComplete: getInitialHelloState(),
  completeHello: () => set({ isHelloComplete: true }),
  isScrolled: false,
  completeScroll: () => set({ isScrolled: true }),
  initializeHelloState: () => set({ isHelloComplete: getInitialHelloState() }),
}));

export default useAnimationStore;
