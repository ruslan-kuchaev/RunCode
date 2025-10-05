import React, { memo } from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = memo(({
  text,
  onClick,
  className = "",
  disabled = false
}: ButtonProps) => {
  
  const baseClasses = `
    flex items-center justify-center
    font-medium rounded-lg border-2
    transition-all duration-200
    hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    cursor-pointer select-none
    w-full h-12
    bg-gray-800/50 border-gray-600
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {text}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;