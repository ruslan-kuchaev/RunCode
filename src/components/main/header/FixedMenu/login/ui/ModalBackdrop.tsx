import {forwardRef} from "react";

interface ModalBackdropProps {
  onClick: () => void;
}

export const ModalBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>( (
    {
        onClick
    }, ref
    ) => {
  return (
    <div
        ref={ref}
      className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      onClick={onClick}
      aria-hidden="true"
    />
  );
});

ModalBackdrop.displayName = "ModalBackdrop";