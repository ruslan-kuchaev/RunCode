// Определяем структуру цветовой схемы
export interface ColorScheme {
  bgColor: string;
  iconColor: string;
  
}


export const ColorSchemes: Record<string, ColorScheme> = {
  green: {
    bgColor: "bg-green-500/20",
    iconColor: "text-green-400",
  },
  purple: {
    bgColor: "bg-purple-500/20",
    iconColor: "text-purple-400",
  },
  blue: {
    bgColor: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
  red: {
    bgColor: "bg-red-500/20",
    iconColor: "text-red-400",
  },
  yellow: {
    bgColor: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
  },
 
};


export type ColorVariant = keyof typeof ColorSchemes;


export const getColorScheme = (variant: ColorVariant): ColorScheme => {
  return ColorSchemes[variant] || ColorSchemes.purple; // Fallback на purple
};


export const addColorScheme = (name: string, scheme: ColorScheme) => {
  ColorSchemes[name] = scheme;
};