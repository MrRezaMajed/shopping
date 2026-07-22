// components/profile/addresses/AddAddressButton.tsx
"use client";

import { FaPlus } from "react-icons/fa";

type AddAddressButtonProps = {
  onOpen: () => void;
};

export default function AddAddressButton({ onOpen }: AddAddressButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="
        bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
        dark:bg-blue-500 dark:hover:bg-blue-600 
        text-white text-sm font-semibold px-5 py-3 rounded-xl 
        flex items-center justify-center gap-2 transition-all duration-200 shadow-sm w-full sm:w-auto
      "
    >
      <FaPlus className="text-xs" />
      ایجاد آدرس جدید
    </button>
  );
}