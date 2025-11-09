import { create } from "zustand";

interface AnimationStore {
  isHelloComplete: boolean;
  isScrolled: boolean;
  completeHello: () => void;
  completeScroll: () => void;
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  isHelloComplete: false,
  completeHello: () => set({ isHelloComplete: true }),
  isScrolled: false,
  completeScroll: () => set({ isScrolled: true }),
}));

export default useAnimationStore;
