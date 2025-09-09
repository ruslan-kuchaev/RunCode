'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";
import PointOricon from "./PointOricon";
import { Arrayicon } from "@/store/Arrayicon";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import  useAnimationStore  from "@/store/AnimationCenter";
import { log } from "console";


export default function LeftMenu() {
    const [activeSection, setActiveSection] = useState(Arrayicon[0].id);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const complete = useAnimationStore((state) => state.isHelloComplete)

    useGSAP(() => {
        if(!complete) return console.log(complete);
        
        gsap.fromTo(".menu-item", {
            x: -80,
            opacity: 0,
        }, {
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.15,
            x:0,
            opacity: 1,
        });

        
    }, { scope: menuRef, dependencies: [complete] });

    return (

            <div className="fixed left-0 top-1/2 -translate-y-1/2 w-auto ml-8">
                <div ref={menuRef} className="relative flex flex-col gap-0.5">
                    {Arrayicon.map((s) => (
                        <div
                            key={s.id}
                            className="menu-item opacity-0"
                        >
                            <PointOricon 
                                Icon={s.icon} 
                                active={s.id === activeSection} 
                            />
                        </div>
                    ))}
                </div>
            </div>
    );
}
