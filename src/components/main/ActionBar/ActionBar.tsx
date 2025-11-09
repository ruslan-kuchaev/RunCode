import React from 'react'
import { InformationBar } from './InformationBar'
import { ButtonBar } from './ButtonBar'
import { ColorVariant } from '@/config/ActionBarConfig'

type Props = Record<string, never>

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
  return (
    <div className='mt-10 py-16'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
        {informationItems.map((item, index) => (
          <InformationBar
            key={`info-${index}`}
            icon={item.icon}
            title={item.title}
            description={item.description}
            color={item.color}
          />
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-16'>
        {buttonItems.map((item, index) => (
          <ButtonBar
            key={`button-${index}`}
            title={item.title}
            description={item.description}
            color={item.color}
          />
        ))}
      </div>
    </div>
  )
}