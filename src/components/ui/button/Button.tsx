import React from 'react';

type Props = {
  text: string;
  size?: number;
  height?: number; // Новая опция для высоты кнопки
  minWidth?: number;
  paddingX?: number;
  colorText?: string;
  colorBackground?: string;
  colorBorder?: string;
  onClick?: () => void;
}

const Button = (props: Props) => {
  const {
    text,
    size = 22,
    height = 40, // Опциональная высота, если не задана - используем size
    minWidth = 70,
    paddingX = 16,
    colorText = 'rgba(0, 0, 0, 0.7)',
    colorBackground = 'rgb(221, 221, 221)',
    colorBorder = 'white',
    onClick
  } = props;

  // Используем переданную высоту или размер по умолчанию
  const buttonHeight = height || size;
  
  // Рассчитываем ширину на основе длины текста
  const textWidth = text.length * (size * 0.45);
  const buttonWidth = Math.max(minWidth, textWidth + paddingX * 2);

  // Динамические стили для кнопки
  const buttonStyle = {
    borderBottom: `2px solid ${colorBorder}`,
    backgroundColor: colorBackground,
    height: `${buttonHeight}px`,
    width: `${buttonWidth}px`,
    borderRadius: '8px',
    color: colorText,
    fontSize: `${size * 0.7}px`,
    padding: `0 ${paddingX}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Динамические стили для обертки
  const coverStyle = {
    height: `${buttonHeight + 4}px`,
    width: `${buttonWidth + 5}px`,
  };

  return (
    <div className="[transform-style:preserve-3d] [perspective:100px] flex items-center justify-center scale-100">
      <div 
        className="z-20 flex items-center justify-center pb-3 bg-black rounded-lg [transform:rotateX(13deg)] shadow-[0px_1px_1px_1px_white]"
        style={coverStyle}
      >
        <button 
          className="cursor-pointer border-none transition-all duration-80 [transform:rotateX(13deg)] z-30 font-medium shadow-[0px_4px_0px_0.2px_rgb(116,116,116)] active:shadow-[0px_4px_0px_0.2px_rgba(116,116,116,0)] active:translate-y-1.5 whitespace-nowrap relative w-full h-full"
          style={buttonStyle}
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    </div>
  );
}

export default Button;