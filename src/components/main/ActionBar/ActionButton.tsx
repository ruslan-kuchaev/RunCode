"use client";

import React from "react";
import { ColorVariant, getColorScheme } from "@/config/ActionBarConfig";

interface ActionButtonProps {
  title: string;
  dicription?: string;
  color: ColorVariant;
  isActive: boolean;
  onClick: () => void;
}

export function ActionButton({
  title,
  color,
  dicription,
  isActive,
  onClick,
}: ActionButtonProps) {
  const colorScheme = getColorScheme(color);

  return (
    <button
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl transition-all duration-300
        bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm
        border-2`}
    >
      <div className="flex flex-col items-center gap-1">
        <h3
          className={`
            text-xl font-semibold transition-colors duration-300
            ${isActive ? "text-white" : "text-gray-300"}
          `}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-400 italic">{dicription}</p>
      </div>
    </button>
  );
}
