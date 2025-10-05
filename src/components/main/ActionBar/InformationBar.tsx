import React, { memo, useRef, useMemo } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ColorVariant, getColorScheme } from "@/config/ActionBarConfig"
import { Arrayicon } from "@/store/Arrayicon"

interface InformationBarProps {
  icon: number,
  title: string,
  description: string,
  color: ColorVariant,
  index: number,
}

export const InformationBar = memo(({ icon, title, description, color, index }: InformationBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  
  // Мемоизируем цветовую схему
  const colorScheme = useMemo(() => getColorScheme(color), [color])

  useGSAP(() => {
    if (!containerRef.current || !iconRef.current) return

    // Начальная анимация появления с задержкой на основе индекса
    const delay = index * 0.15
    
    gsap.fromTo([iconRef.current, titleRef.current, descRef.current], 
      {
        opacity: 0,
        y: 30,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "back.out(1.4)",
        stagger: 0.1
      }
    )

    // Оптимизированные hover эффекты
    const handleMouseEnter = () => {
      gsap.to(iconRef.current, {
        scale: 1.15,
        rotation: 8,
        duration: 0.4,
        ease: "back.out(1.7)"
      })
    }

    const handleMouseLeave = () => {
      gsap.to(iconRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      })
    }

    const container = containerRef.current
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [index])

  return (
    <div
      ref={containerRef}
      className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 cursor-pointer group"
    >
      <div
        ref={iconRef}
        className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 ${colorScheme.bgColor} bg-opacity-20 border-2 ${colorScheme.borderColor} group-hover:bg-opacity-30 transition-all duration-300`}
      >
        <span className={`${colorScheme.textColor} text-2xl`}>
          {Arrayicon[icon]?.icon}
        </span>
      </div>

      <h3
        ref={titleRef}
        className="text-xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300"
      >
        {title}
      </h3>

      <p
        ref={descRef}
        className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300"
      >
        {description}
      </p>
    </div>
  )
})

InformationBar.displayName = 'InformationBar'