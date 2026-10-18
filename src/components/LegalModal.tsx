
interface LegalModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export default function LegalModal({ isOpen, title, content, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>
        <div className="my-4 max-h-60 overflow-y-auto text-sm text-gray-600">
          <p>{content}</p>
        </div>
        <div className="flex justify-end pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#3B0454] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2A033C]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
