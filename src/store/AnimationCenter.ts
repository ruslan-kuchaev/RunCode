import { create } from "zustand";

interface AnimateStore {
    isHelloComplete: boolean,
    completeHello: () => void,
}

const useAnimationStore = create<AnimateStore>((set) => ({
    isHelloComplete: false,
    
    completeHello: () => set({ isHelloComplete: true }),
    
  }));

export default useAnimationStore;