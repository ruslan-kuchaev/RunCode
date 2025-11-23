"use client";

import React from "react";
import { ColorVariant } from "@/config/ActionBarConfig";
import { useActionBarStore, ActionBarSection } from "@/store/actionBarStore";
import { ActionButton } from "./ActionButton";
import ActionContent from "./ActionContent";

type Props = Record<string, never>;
const actionButtons = [
  {
    id: "about" as ActionBarSection,
    title: "О нас",
    dicription: "$ cd about",
    color: "green" as ColorVariant,
  },
  {
    id: "features" as ActionBarSection,
    title: "Возможности",
    dicription: "$ cd features",
    color: "purple" as ColorVariant,
  },
  {
    id: "getting-started" as ActionBarSection,
    title: "Как начать",
    dicription: "$ cd get-start",
    color: "blue" as ColorVariant,
  },
  {
    id: "community" as ActionBarSection,
    title: "Сообщество",
    dicription: "$ cd community",
    color: "orange" as ColorVariant,
  },
];

export default function ActionBar({}: Props) {
  const { activeSection, toggleSection } = useActionBarStore();

  return (
    <div className="mt-1 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Исследуйте RunCode
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actionButtons.map((button) => (
          <ActionButton
            key={button.id}
            title={button.title}
            dicription={button.dicription}
            color={button.color}
            isActive={activeSection === button.id}
            onClick={() => toggleSection(button.id)}
          />
        ))}
      </div>
      <ActionContent />
    </div>
  );
}
