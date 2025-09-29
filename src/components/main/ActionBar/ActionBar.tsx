import React from 'react'
import { InformationBar } from './InformationBar'
import { ColorVariant } from '@/config/ActionBarConfig'
import { ButtonBar } from './ButtonBar'

type Props = {}

const informationItems = [
  {
    icon: 0, // индекс иконки из Arrayicon
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

const ButtonItems = [
  {
    icon: 0, // индекс иконки из Arrayicon
    title: "Info",
    description: ['about', 'main', "the best", "galery"],
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


export default function ActionBar({}: Props) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
        {/* {informationItems.map((item, index) => (
        <InformationBar
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          color={item.color}
        />
      ))} */}
      <ButtonBar color='green' title='info' description={['about', 'main', "the best", "galery"]}/>
      
    </div>
  )
}