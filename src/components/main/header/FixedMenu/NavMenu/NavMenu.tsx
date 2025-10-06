"use client"
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useAnimationStore } from "@/store/AnimationCenter";
import { ActivedPoint } from "./ActivedPoint";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

export default function NavMenu() {
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const complete = useAnimationStore((state) => state.isHelloComplete);
  const [activeId, setActiveId] = useState("home");


  const handleClicked = (id: string) => {
    setActiveId(id);
  };

  const navItems: NavItem[] = [
    { label: "Главная", href: "/", id: "home" },
    { label: "Задачи", href: "/tasks", id: "tasks" },
    { label: "Рейтинг", href: "/rating", id: "rating" }
  ];

  useGSAP(() => {
    if (!complete) return;


    const tl = gsap.timeline({
      defaults: {
        ease: "power3.inOut",
        duration: 0.5,
      },
      paused: true
    });


    tl.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    itemsRef.current.forEach((item, index) => {
      if (item) {
        tl.fromTo(
          item,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5 },
          index * 0.1
        );
      }
    });


    tl.play();


    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {

        if (tl.progress() > 0) {
          tl.reverse();
        }
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {

        if (tl.progress() < 1) {
          tl.play();
        }
      }

      lastScrollY = currentScrollY;
    };

    // Троттлинг
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };

  }, { dependencies: [complete], revertOnUpdate: true });

  return (
    <div
      ref={navRef}
      className="fixed top-0 left-[50%] transform -translate-x-1/2 z-50 opacity-0 will-change-auto"
    >
      <nav className="flex flex-nowrap gap-8 mt-4 px-6 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">

        {navItems.map((item, index) => (
          <a
            key={item.id}
            ref={(el) => { itemsRef.current[index] = el; }}
            className={cn(
              "relative px-4 py-2 text-white font-medium text-sm tracking-wide opacity-0",
              "transition-all duration-300 ease-out",
              "hover:cursor-pointer select-none",
              "rounded-lg",
            )}
            href={item.href}
            onClick={() => handleClicked(item.id)}
          >
            {item.label}

            {activeId === item.id && (
              <ActivedPoint />
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}