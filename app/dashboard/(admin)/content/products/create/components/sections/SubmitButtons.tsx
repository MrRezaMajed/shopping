"use client";

import { useRouter } from "next/navigation";

interface SubmitButtonsProps {
  isSubmitting: boolean;
  isValid: boolean;
  hasCategory: boolean;
}

export default function SubmitButtons({
  isSubmitting,
  isValid,
  hasCategory,
}: SubmitButtonsProps) {
  const router = useRouter();
  const isDisabled = isSubmitting || !isValid || !hasCategory;

  return (
    <div className="flex justify-start gap-4">
      <button
        type="submit"
        disabled={isDisabled}
        className={`px-6 py-2 rounded-lg transition-colors ${
          isDisabled
            ? "bg-blue-400 dark:bg-blue-800 text-white cursor-not-allowed"
            : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            در حال ایجاد...
          </span>
        ) : (
          "ایجاد محصول"
        )}
      </button>
      
      <button
        type="button"
        onClick={() => router.back()}
        disabled={isSubmitting}
        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50
          transition-colors"
      >
        انصراف
      </button>
    </div>
  );
}