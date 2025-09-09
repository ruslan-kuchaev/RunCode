'use client'

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface PointOriconProps {
    Icon?: React.ReactNode;
    active?: boolean;
}




export default function PointOricon({ Icon, active = false }: PointOriconProps) {
    const refIcon = useRef<HTMLDivElement | null>(null)


    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${active ? ' text-white scale-110' : 'bg-amber-50 text-amber-700 scale-10'}`}>
            <div ref={refIcon} className={`transition-opacity duration-200 ${active ? 'opacity-100 ' : 'opacity-0'}`}>
                {Icon}
            </div>
        </div>
    );
}