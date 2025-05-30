import { ReactNode } from "react";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string
};

export default function Modal({ isOpen, onClose, title,  children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed bg-black/75 inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl shadow-lg max-h-[90vh] relative overflow-hidden">
        <h1 className="pl-6 font-bold text-3xl">{title}</h1>
        <div
          className="overflow-y-scroll modal max-h-[80vh] pr-2 "
          style={{ scrollbarGutter: "stable" }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
