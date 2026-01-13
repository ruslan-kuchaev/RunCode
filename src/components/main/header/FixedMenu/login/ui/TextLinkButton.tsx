import { ReactNode } from "react";

interface TextLinkButtonProps {
  children: ReactNode;
  onClick: () => void;
  colorHex: string;
  className?: string;
}

export const TextLinkButton = ({
  children,
  onClick,
  colorHex,
  className = "",
}: TextLinkButtonProps) => {
  return (
    <button
      style={{
        color: colorHex,
        textDecoration: "none",
      }}
      onClick={onClick}
      className={`font-medium transition-all duration-300 relative hover:underline hover:underline-offset-4 ${className}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.textShadow = `0 0 8px ${colorHex}80`;
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textShadow = "none";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
};
