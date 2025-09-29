'use client'
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAnimationStore } from "@/store/AnimationCenter";
import { ColorVariant, getColorScheme } from "@/config/ActionBarConfig";
import { Arrayicon } from "@/store/Arrayicon";
import Button from "@/components/ui/button/Button";

interface ButtonBarProps {
  title?: string;
  description?: string[];
  color: ColorVariant;
}

export const ButtonBar = ({
  title,
  description,
  color,
}: ButtonBarProps) => {
  const complet = useAnimationStore((state) => state.isScrolled);
  const ThisColor = getColorScheme(color);

  
  const buttonCount = 4;

  useGSAP(
    () => {
      if (!complet) return;
    },
    { dependencies: [complet] }
  );

  return (
    <div className={`p-6  rounded-2xl`}>
      <div className={`text-white text-2xl font-bold mb-4`}> <p>{title}</p></div>
      <div className="border-2  rounded-2xl grid grid-cols-2 gap-6 p-5"> 
        {Array.from({ length: buttonCount }, (_, index) => (
          
          <Button
            key={index}
            text={`Button ${index + 1}`}
            onClick={() => console.log(`Button ${index + 1} clicked`)}
          />
        ))}
        </div>
    </div>
  );
};