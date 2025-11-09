import React from "react"
import { ColorVariant, getColorScheme } from "@/config/ActionBarConfig"
import { Arrayicon } from "@/store/Arrayicon"

interface InformationBarProps {
  icon: number,
  title: string,
  description: string,
  color: ColorVariant,
}

export function InformationBar({ icon, title, description, color }: InformationBarProps) {
  const colorScheme = getColorScheme(color)

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 cursor-pointer group">
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 ${colorScheme.bgColor} bg-opacity-20 border-2 ${colorScheme.borderColor} group-hover:bg-opacity-30 transition-all duration-300`}>
        <span className={`${colorScheme.textColor} text-2xl`}>
          {Arrayicon[icon]?.icon}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
        {title}
      </h3>

      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  )
}