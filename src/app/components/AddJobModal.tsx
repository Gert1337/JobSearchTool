import AddJobFormWrapper from "./AddJobFormWrapper";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddJobModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>
        <AddJobFormWrapper />
      </div>
    </div>
  );
}
