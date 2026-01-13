import { ReactNode } from "react";

interface AuthButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick: () => void;
  colorHex: string;
  colorRgb: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export const AuthButton = ({
  children,
  icon,
  onClick,
  colorHex,
  colorRgb,
  variant = "primary",
  className = "",
}: AuthButtonProps) => {
  const isPrimary = variant === "primary";

  if (isPrimary) {
    return (
      <button
        style={{
          backgroundColor: `rgba(${colorRgb}, 0.7)`,
          boxShadow: "none",
        }}
        onClick={onClick}
        className={`w-full py-3.5 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] group ${className}`}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `rgba(${colorRgb}, 0.85)`;
          e.currentTarget.style.boxShadow = `0 10px 25px ${colorHex}50`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `rgba(${colorRgb}, 0.7)`;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {icon && (
          <span className="transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  }

  return (
    <button
      style={{
        boxShadow: "none",
      }}
      onClick={onClick}
      className={`w-full py-3.5 mt-4 bg-gray-800/60 backdrop-blur-xs text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group ${className}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 25px ${colorHex}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {icon && (
        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};
