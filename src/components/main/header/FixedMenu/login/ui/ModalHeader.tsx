import { ReactNode } from "react";

interface ModalHeaderProps {
  icon: ReactNode;
  title: string;
  titleId?: string;
  onClose: () => void;
}

export const ModalHeader = ({ icon, title, titleId, onClose }: ModalHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        {icon}
        <h2 id={titleId} className="text-2xl font-bold text-white">
          {title}
        </h2>
      </div>
      <button
        onClick={onClose}
        aria-label="Close auth modal"
        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
      >
        ✕
      </button>
    </div>
  );
};
