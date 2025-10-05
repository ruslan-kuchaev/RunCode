// Определяем структуру цветовой схемы
export interface ColorScheme {
  bgColor: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
}

export const ColorSchemes: Record<string, ColorScheme> = {
  green: {
    bgColor: "bg-green-500",
    iconColor: "text-green-400",
    textColor: "text-green-400",
    borderColor: "border-green-500",
  },
  purple: {
    bgColor: "bg-purple-500",
    iconColor: "text-purple-400",
    textColor: "text-purple-400",
    borderColor: "border-purple-500",
  },
  blue: {
    bgColor: "bg-blue-500",
    iconColor: "text-blue-400",
    textColor: "text-blue-400",
    borderColor: "border-blue-500",
  },
  red: {
    bgColor: "bg-red-500",
    iconColor: "text-red-400",
    textColor: "text-red-400",
    borderColor: "border-red-500",
  },
  yellow: {
    bgColor: "bg-yellow-500",
    iconColor: "text-yellow-400",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500",
  },
};


export type ColorVariant = keyof typeof ColorSchemes;


export const getColorScheme = (variant: ColorVariant): ColorScheme => {
  return ColorSchemes[variant] || ColorSchemes.purple; // Fallback на purple
};


export const addColorScheme = (name: string, scheme: ColorScheme) => {
  ColorSchemes[name] = scheme;
};