"use client";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useAnimationStore } from "@/store/AnimationCenter";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

export default function NavMenu() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const complete = useAnimationStore((state) => state.isHelloComplete);
  const initializeHelloState = useAnimationStore(
    (state) => state.initializeHelloState
  );
  const [activeId, setActiveId] = useState("home");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    initializeHelloState();
  }, [initializeHelloState]);

  // Определяем активную страницу на основе pathname
  useEffect(() => {
    const currentPath = pathname;
    if (currentPath === '/') {
      setActiveId('home');
    } else if (currentPath.startsWith('/tasks')) {
      setActiveId('tasks');
    } else if (currentPath.startsWith('/rating')) {
      setActiveId('rating');
    }
  }, [pathname]);

  const handleClicked = (id: string) => {
    setActiveId(id);
  };

  // Базовые пункты меню
  const navItems: NavItem[] = [
    { label: "Главная", href: "/", id: "home" },
    { label: "Задачи", href: "/tasks", id: "tasks" },
    { label: "Рейтинг", href: "/rating", id: "rating" },
  ];

  useGSAP(
    () => {
      if (!complete || hasAnimated) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.inOut",
          duration: 0.5,
        },
        paused: true,
      });

      tl.fromTo(
        navRef.current,
        { autoAlpha: 0, y: -20, duration: 0.5, force3D: true },
        { autoAlpha: 1, y: 0, duration: 0.5,  force3D: true }
      );

      // Анимируем все дочерние элементы навигации
      const navItems = navRef.current?.children;
      if (navItems) {
        Array.from(navItems).forEach((item, index) => {
          tl.fromTo(
            item,
            { autoAlpha: 0, y: -20 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            index * 0.1
          );
        });
      }

      tl.play();
      setHasAnimated(true);

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

      window.addEventListener("scroll", throttledScroll);

      return () => {
        window.removeEventListener("scroll", throttledScroll);
      };
    },
    { dependencies: [complete, hasAnimated], revertOnUpdate: false }
  );

  return (
    <div className="fixed top-0 left-[50%] transform -translate-x-1/2 z-50  will-change-auto opacity-100">
      <nav className="flex flex-nowrap gap-8 mt-4 px-6 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10"
           ref={navRef}>
        {navItems.map((item, index) => (
          <Link
            key={item.id}
            className={cn(
              "relative px-4 py-2 text-white font-medium text-sm tracking-wide opacity-0",
              "transition-all duration-300 ease-out",
              "hover:cursor-pointer select-none",
              "rounded-lg"
            )}
            href={item.href}
            onClick={() => handleClicked(item.id)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
