// کارت تکی انتخاب آدرس

import { FaMapMarkerAlt, FaUserTag, FaMobileAlt, FaEdit } from "react-icons/fa";
import { Address } from "./AddressList";

interface AddressCardProps {
  item: Address;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AddressCard({ item, isSelected, onSelect }: AddressCardProps) {
  return (
    <label className="relative block cursor-pointer group select-none">
      <input
        type="radio"
        name="address"
        className="sr-only peer"
        checked={isSelected}
        onChange={onSelect}
      />

      <div className="
        p-5 rounded-2xl text-right transition-all duration-300 border-2
        bg-white dark:bg-slate-900
        border-slate-100 dark:border-slate-800
        hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md
        peer-checked:border-blue-600 dark:peer-checked:border-blue-500
        peer-checked:bg-blue-50/10 dark:peer-checked:bg-blue-950/20
        peer-checked:shadow-lg peer-checked:shadow-blue-500/5
        peer-checked:[&_.active-badge]:scale-100 peer-checked:[&_.active-badge]:opacity-100
        peer-checked:[&_.circle-radio]:border-blue-600 dark:peer-checked:[&_.circle-radio]:border-blue-500
        peer-checked:[&_.circle-radio]:bg-blue-600 dark:peer-checked:[&_.circle-radio]:bg-blue-500
        peer-checked:[&_.dot-radio]:scale-100
      ">
        
        <div className="flex justify-between items-start mb-3 gap-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 shrink-0 mt-0.5">
              <FaMapMarkerAlt className="text-sm text-slate-500 dark:text-slate-400" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              {item.address}
            </p>
          </div>

          <div className="circle-radio w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-slate-300 dark:border-slate-750 bg-white dark:bg-slate-900 shrink-0 mt-1">
            <span className="dot-radio w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 scale-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-3">
          <div className="flex items-center gap-2">
            <FaUserTag className="text-slate-400 shrink-0" />
            <span>گیرنده: <strong className="text-slate-700 dark:text-slate-300 font-medium">{item.receiver}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <FaMobileAlt className="text-slate-400 shrink-0" />
            <span>موبایل: <strong className="text-slate-700 dark:text-slate-300 font-medium">{item.mobile}</strong></span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/40">
          <button
            type="button"
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 text-xs transition font-medium"
          >
            <FaEdit className="text-xs" /> ویرایش آدرس
          </button>

          <span className="active-badge opacity-0 scale-95 origin-left transition-all duration-300 text-green-600 dark:text-green-400 font-bold text-xs bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-lg">
            کالاها به این آدرس ارسال می‌شوند
          </span>
        </div>

      </div>
    </label>
  );
}