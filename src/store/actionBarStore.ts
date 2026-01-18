import { create } from "zustand";
import { useTerminalStore } from "./terminalStore";

export type ActionBarSection =
    | "about"
    | "features"
    | "getting-started"
    | "community"
    | null;

interface ActionBarState {
    activeSection: ActionBarSection;
    openedSections: ActionBarSection[];
    setActiveSection: (section: ActionBarSection) => void;
    toggleSection: (section: ActionBarSection) => void;
    addOpenedSection: (section: ActionBarSection) => void;
}

export const useActionBarStore = create<ActionBarState>((set, get) => ({
    activeSection: null,
    openedSections: [],

    setActiveSection: (section) => set({ activeSection: section }),

    toggleSection: (section) => {
        const currentSection = get().activeSection;
        const newSection = currentSection === section ? null : section;

        set({ activeSection: newSection });

        if (newSection) {
            get().addOpenedSection(newSection);

            const { executeCommand } = useTerminalStore.getState();
            executeCommand(`cd ${newSection}`);
        }
    },

    addOpenedSection: (section) => {
        const state = get();
        const currentSections = [...state.openedSections];

        const filteredSections = currentSections.filter((s) => s !== section);

        set({ openedSections: [section, ...filteredSections] });

    },
}));
