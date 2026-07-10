import { FaPlus } from "react-icons/fa";

type AddAddressButtonProps = {
  onOpen: () => void;
};

export default function AddAddressButton({ onOpen }: AddAddressButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="
        bg-blue-600 dark:bg-blue-500 text-white 
        w-full py-3 rounded-2xl flex items-center justify-center gap-2 mt-6 
        font-semibold text-sm transition-all duration-250
        hover:bg-blue-700 dark:hover:bg-blue-600 
        shadow-sm hover:shadow-md active:scale-[0.98]
      "
    >
      <FaPlus className="text-xs" />
      ایجاد آدرس جدید
    </button>
  );
}