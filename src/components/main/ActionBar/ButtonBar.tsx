import React from "react";
import { ColorVariant, getColorScheme } from "@/config/ActionBarConfig";
import { Button } from "@/components/ui/Button";

interface ButtonBarProps {
  title?: string;
  description?: string[];
  color: ColorVariant;
}

export function ButtonBar({ title, description = [], color }: ButtonBarProps) {
  const colorScheme = getColorScheme(color);
  const buttons = description.slice(0, 4);
  const emptySlots = Math.max(0, 4 - buttons.length);
  const emptyButtons = Array.from({ length: emptySlots }, (_, i) => `Опция ${buttons.length + i + 1}`);

  const handleButtonClick = (label: string) => {
    console.log(`${title} - ${label} clicked`);
  };

  return (
    <div className="p-5 h-60 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <div className="text-white text-2xl font-bold mb-6 text-center">
        <div className={`inline-block px-4 py-2 rounded-lg ${colorScheme.bgColor} bg-opacity-20 border border-opacity-30 ${colorScheme.borderColor}`}>
          {title}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {buttons.map((label, index) => (
          <Button
            key={`btn-${index}`}
            onClick={() => handleButtonClick(label)}
            className={`${colorScheme.borderColor} ${colorScheme.textColor} hover:${colorScheme.bgColor} hover:bg-opacity-20 transition-all duration-200`}
          >
            {label}
          </Button>
        ))}

        {emptyButtons.map((label, index) => (
          <Button
            key={`empty-${index}`}
            onClick={() => handleButtonClick(label)}
            className={`${colorScheme.borderColor} ${colorScheme.textColor} hover:${colorScheme.bgColor} hover:bg-opacity-20 transition-all duration-200 opacity-60`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}