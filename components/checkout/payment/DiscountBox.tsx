import { FaInfoCircle, FaTicketAlt } from "react-icons/fa";

export default function DiscountBox() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <FaTicketAlt className="text-blue-600 dark:text-blue-400 text-lg animate-pulse" />
        کد تخفیف
      </h3>

      <div className="flex items-start gap-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40 p-3.5 rounded-2xl text-blue-700 dark:text-blue-400 text-xs leading-relaxed">
        <FaInfoCircle className="text-sm shrink-0 mt-0.5" />
        <span>کد تخفیف خود را در این بخش وارد کنید.</span>
      </div>

      <div className="max-w-md">
        <div className="flex gap-2.5">
          <input
            type="text"
            className="
              flex-1 border border-gray-200 dark:border-gray-800
              rounded-xl px-4 py-2.5 text-sm
              bg-gray-50/50 dark:bg-gray-850
              text-gray-800 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
              focus:ring-2 focus:ring-blue-500/10 transition duration-200
            "
            placeholder="کد تخفیف را وارد کنید"
          />
          <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold px-5 rounded-xl text-sm transition shadow-sm active:scale-95">
            اعمال کد
          </button>
        </div>
      </div>
    </div>
  );
}