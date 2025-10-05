import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface AnimationStore {
  isHelloComplete: boolean;
  isScrolled: boolean;
  isActionBarVisible: boolean;
  animationSpeed: number;
  
  // Actions
  completeHello: () => void;
  completeScroll: () => void;
  setActionBarVisible: (visible: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
  reset: () => void;
}

export const useAnimationStore = create<AnimationStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    isHelloComplete: false,
    isScrolled: false,
    isActionBarVisible: false,
    animationSpeed: 1,
    
    // Actions
    completeHello: () => set({ isHelloComplete: true }),
    completeScroll: () => set({ isScrolled: true }),
    setActionBarVisible: (visible: boolean) => set({ isActionBarVisible: visible }),
    setAnimationSpeed: (speed: number) => set({ animationSpeed: Math.max(0.1, Math.min(3, speed)) }),
    reset: () => set({
      isHelloComplete: false,
      isScrolled: false,
      isActionBarVisible: false,
      animationSpeed: 1
    })
  }))
);

export default useAnimationStore;