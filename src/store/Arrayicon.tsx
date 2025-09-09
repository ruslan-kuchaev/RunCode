import { Home, Layers, List, Rocket, AlignHorizontalJustifyStart } from "lucide-react";
import type { ReactNode } from "react";

export interface Arrayicon {
    id: string;
    icon: ReactNode;
}

export const Arrayicon: Arrayicon[] = [
    { id: "Arrayicon-0", icon: <Home size={18} /> },
    { id: "Arrayicon-1", icon: <Layers size={18} /> },
    { id: "Arrayicon-2", icon: <List size={18} /> },
    { id: "Arrayicon-3", icon: <Rocket size={18} /> },
    { id: "Arrayicon-4", icon: <AlignHorizontalJustifyStart size={18} /> },
];

