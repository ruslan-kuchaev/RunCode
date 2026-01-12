"use client";

import React, {useRef, useEffect, useState} from "react";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";
import {useTerminalStore} from "@/store/terminalStore";
import {gsap} from 'gsap';
import {useGSAP} from "@gsap/react";
import useAnimationStore from "@/store/AnimationCenter";
import {ColorKey, useColorCycle} from "@/hooks/useColorCycle";

const WELCOME_MESSAGE = `
    Добро пожаловать в RunCode Terminal beta                                                                                
    Это твой помо́щник в работе с RunCode.
    Введи команду, чтобы получить информацию.
    help         
`;

export default function Terminal() {
    const outputRef = useRef<HTMLDivElement>(null);
    // Используем хук для гарантии запуска цикла и получения цвета
    useColorCycle(); // Запускаем цикл (если еще не запущен)
    const currentColor = useAnimationStore((state) => state.currentLoginColor);
    const redPointDiv = useRef<HTMLDivElement>(null)
    const yellowPointDiv = useRef<HTMLDivElement>(null)
    const greenPointDiv = useRef<HTMLDivElement>(null)
    const [hasShownWelcome, setHasShownWelcome] = useState(false);
    const {history, addOutput} = useTerminalStore();


    const pointRefs: Record<ColorKey, React.RefObject<HTMLDivElement | null>> = {
        red: redPointDiv,
        yellow: yellowPointDiv,
        green: greenPointDiv,
    };

    useEffect(() => {
        if (!hasShownWelcome && history.length === 0) {
            addOutput(WELCOME_MESSAGE, "info");
            setHasShownWelcome(true);
        }
    }, [hasShownWelcome, history.length, addOutput]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [history]);

    useGSAP(() => {
        const ref = pointRefs[currentColor];
        if (!ref?.current) return;

        const tl = gsap.timeline({overwrite: true});

        tl.to(ref.current, {
            y: -7,
            duration: 0.3,
            ease: "none",
            delay: 0.8,
        })
        tl.to(ref.current, {
            y: 0,
            duration: 0.3,
            ease: "bounce.out",

        })

        return () => {
            tl.kill();
        };
    }, {dependencies: [currentColor], scope: outputRef})

    return (
        <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden font-mono text-sm">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 border-b border-gray-700">
                <div className="flex space-x-2">
                    <div ref={redPointDiv}
                         className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                    <div ref={yellowPointDiv}
                         className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                    <div ref={greenPointDiv}
                         className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
                </div>
                <div className="flex-1 text-center text-gray-400 text-xs">
                    Terminal — user@RunCode
                </div>
            </div>

            {/* Terminal Content */}
            <div
                ref={outputRef}
                className="p-4 h-64 md:h-80 overflow-y-auto overflow-hidden bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            >
                {/* Output Area */}
                <TerminalOutput/>

                {/* Input Line */}
                <TerminalInput/>
            </div>
        </div>
    );
}
