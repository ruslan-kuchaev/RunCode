'use client'
import React, { memo, useRef, useMemo, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ColorVariant, getColorScheme } from "@/config/ActionBarConfig";
import Button from "@/components/ui/button/Button";

interface ButtonBarProps {
  title?: string;
  description?: string[];
  color: ColorVariant;
  index: number;
}

export const ButtonBar = memo(({
  title,
  description = [],
  color,
  index,
}: ButtonBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  // Мемоизируем цветовую схему и данные кнопок
  const colorScheme = useMemo(() => getColorScheme(color), [color]);
  const buttonData = useMemo(() => {
    const buttons = description.slice(0, 4);
    const emptySlots = Math.max(0, 4 - buttons.length);
    return {
      buttons,
      emptySlots: Array.from({ length: emptySlots }, (_, i) => `Опция ${buttons.length + i + 1}`)
    };
  }, [description]);

  useGSAP(() => {
    if (!buttonsRef.current) return;

    // Анимация появления кнопок с задержкой
    const buttons = Array.from(buttonsRef.current.children);
    gsap.fromTo(buttons, 
      {
        opacity: 0,
        scale: 0.8,
        y: 20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );
  }, [index]);

  const handleButtonClick = useCallback((buttonIndex: number, label: string) => {
    console.log(`${title} - ${label} clicked`);
    
    // Оптимизированная анимация клика
    const button = buttonsRef.current?.children[buttonIndex] as HTMLElement;
    if (button) {
      gsap.to(button, {
        scale: 0.92,
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  }, [title]);

  return (
    <div 
      ref={containerRef}
      className={`p-5 h-60 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300`}
    >
      {/* Заголовок */}
      <div 
        ref={titleRef}
        className={`text-white text-2xl font-bold mb-6 text-center`}
      >
        <div className={`inline-block px-4 py-2 rounded-lg ${colorScheme.bgColor} bg-opacity-20 border border-opacity-30 ${colorScheme.borderColor}`}>
          {title}
        </div>
      </div>

      {/* Кнопки в сетке 2x2 */}
      <div 
        ref={buttonsRef}
        className="grid grid-cols-2 gap-4"
      > 
        {buttonData.buttons.map((label, buttonIndex) => (
          <Button
            key={`btn-${buttonIndex}`}
            text={label}
            onClick={() => handleButtonClick(buttonIndex, label)}
            className={`${colorScheme.borderColor} ${colorScheme.textColor} hover:${colorScheme.bgColor} hover:bg-opacity-20 transition-all duration-200`}
          />
        ))}
        
        {/* Заполняем пустые слоты */}
        {buttonData.emptySlots.map((label, emptyIndex) => (
          <Button
            key={`empty-${emptyIndex}`}
            text={label}
            onClick={() => handleButtonClick(buttonData.buttons.length + emptyIndex, label)}
            className={`${colorScheme.borderColor} ${colorScheme.textColor} hover:${colorScheme.bgColor} hover:bg-opacity-20 transition-all duration-200 opacity-60`}
          />
        ))}
      </div>
    </div>
  );
});

ButtonBar.displayName = 'ButtonBar';