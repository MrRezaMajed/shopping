"use client";
import { FaPlus } from "react-icons/fa";

type AddAddressModalProps = {
  open: boolean;
  onCloseAction: () => void;
};

export default function AddAddressModal({ open, onCloseAction }: AddAddressModalProps) {
  if (!open) return null;

  return (
    <section className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <section className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 shadow-xl dark:shadow-gray-900/40">

        {/* Header */}
        <section className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FaPlus /> ایجاد آدرس جدید
          </h3>

          <button
            onClick={onCloseAction}
            className="text-red-500 dark:text-red-400 text-xl"
          >
            ✕
          </button>
        </section>

        {/* Form */}
        <form className="grid grid-cols-2 gap-3">
          {/* ... فیلدها همانند قبل */}
        </form>

        {/* Footer */}
        <section className="flex justify-end mt-4 gap-2">
          <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded">
            ثبت آدرس
          </button>

          <button
            onClick={onCloseAction}
            className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded"
          >
            بستن
          </button>
        </section>

      </section>
    </section>
  );
}
