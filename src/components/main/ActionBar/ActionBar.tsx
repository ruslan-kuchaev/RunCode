'use client'
import React, { useRef, useMemo } from 'react'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { InformationBar } from './InformationBar'
import { ButtonBar } from './ButtonBar'
import { ColorVariant } from '@/config/ActionBarConfig'
import { getAnimationConfig } from '@/utils/performance'

// Регистрируем ScrollTrigger только один раз
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type Props = {}

const informationItems = [
  {
    icon: 0,
    title: "Интерфейс командной строки",
    description: "Перемещайтесь по RunCode, используя знакомые команды терминала",
    color: "green" as ColorVariant
  },
  {
    icon: 1,
    title: "Аутентификация пользователя",
    description: "Войдите или зарегистрируйтесь напрямую через интерфейс терминала",
    color: "purple" as ColorVariant
  },
  {
    icon: 2,
    title: "Интерактивный опыт",
    description: "Обратная связь в реальном времени и эффекты пишущей машинки для иммерсивного кодирования",
    color: "blue" as ColorVariant
  }
]

const buttonItems = [
  {
    title: "Редактор кода",
    description: ['Писать', 'Редактировать', 'Отладка', 'Деплой'],
    color: "green" as ColorVariant
  },
  {
    title: "Шаблоны",
    description: ['React', 'Vue', 'Angular', 'Node.js'],
    color: "purple" as ColorVariant
  },
  {
    title: "Инструменты",
    description: ['Git', 'Терминал', 'Превью', 'Поделиться'],
    color: "blue" as ColorVariant
  }
]

export default function ActionBar({ }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const informationRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  // Мемоизируем конфигурацию анимации на основе производительности устройства
  const animationConfig = useMemo(() => {
    const perfConfig = getAnimationConfig()
    return {
      duration: {
        fast: perfConfig.duration * 0.7,
        normal: perfConfig.duration
      },
      ease: {
        smooth: "power2.inOut",
        bounce: perfConfig.ease
      },
      trigger: {
        start: "top 50%",
        end: "bottom 25%"
      },
      enabled: perfConfig.enabled,
      stagger: perfConfig.stagger
    }
  }, [])

  useGSAP(() => {
    if (!containerRef.current || !informationRef.current || !buttonRef.current || !animationConfig.enabled) return

    const { duration, ease, trigger } = animationConfig

    // Оптимизированные начальные состояния
    gsap.set(buttonRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      pointerEvents: 'none'
    })

    gsap.set(informationRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      pointerEvents: 'auto'
    })

    // Создаем единый timeline для лучшей производительности
    const tl = gsap.timeline({ 
      paused: true,
      defaults: { ease: ease.smooth }
    })
      .to(informationRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        pointerEvents: 'none',
        duration: duration.fast
      })
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: 'auto',
        duration: duration.normal,
        ease: ease.bounce
      }, "-=0.1")

    // Оптимизированный ScrollTrigger с лучшей производительностью
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: trigger.start,
      end: trigger.end,
      toggleActions: "play reverse play reverse",
      fastScrollEnd: true,
      preventOverlaps: true,
      onToggle: (self) => {
        if (self.isActive) {
          tl.play()
        } else {
          tl.reverse()
        }
      }
    })

    return () => {
      scrollTrigger.kill()
      tl.kill()
    }
  }, [animationConfig])

  return (
    <div ref={containerRef} className='relative mt-10 py-16'>
      {/* Information Bar - показывается по умолчанию */}
      <div
        ref={informationRef}
        className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'
      >
        {informationItems.map((item, index) => (
          <InformationBar
            key={`info-${index}`}
            icon={item.icon}
            title={item.title}
            description={item.description}
            color={item.color}
            index={index}
          />
        ))}
      </div>

      {/* Button Bar - показывается при скролле */}
      <div
        ref={buttonRef}
        className='absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-8 text-center'
      >
        {buttonItems.map((item, index) => (
          <ButtonBar
            key={`button-${index}`}
            title={item.title}
            description={item.description}
            color={item.color}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}