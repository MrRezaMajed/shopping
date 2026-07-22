// components/profile/addresses/AddressItem.tsx
"use client";

import { useState, useTransition } from "react";
import { FaMapMarkerAlt, FaUser, FaPhoneAlt, FaEdit, FaTrashAlt, FaBarcode, FaSpinner, FaCheck, FaCopy } from "react-icons/fa";
import { deleteAddress } from "@/app/actions/address";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

type AddressType = {
  id: number;
  province: string;
  city: string;
  address: string;
  postal: string;
  user: {
    name: string;
    mobile: string | null;
  };
};

type AddressItemProps = {
  address: AddressType;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
};

export default function AddressItem({ address, isSelected, onSelect, onEdit }: AddressItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }

    startTransition(async () => {
      try {
        await deleteAddress(address.id);
      } catch (err) {
        alert("خطایی در حذف آدرس پیش آمد.");
      }
    });
  };

  const handleCopyPostal = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address.postal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      onClick={onSelect}
      className={`
        p-6 rounded-3xl relative transition-all duration-300 border text-right cursor-pointer select-none
        hover:-translate-y-1 active:scale-[0.99]
        ${
          isSelected
            ? "border-blue-500 bg-blue-50/10 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10 dark:border-blue-500/80 dark:bg-blue-950/20 dark:shadow-blue-500/5 dark:ring-1 dark:ring-blue-500/30"
            : "border-slate-100 bg-white hover:border-slate-200 shadow-sm hover:shadow-md dark:border-slate-800/80 dark:bg-[#0F172A] dark:hover:border-slate-700 dark:shadow-none"
        }
      `}
    >
      {/* Actions (Top Left) */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onEdit}
          className="
            bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 
            dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-400 dark:hover:text-blue-400
            px-2.5 py-1.5 rounded-lg transition duration-200 flex items-center gap-1 text-xs font-semibold
          "
        >
          <FaEdit className="text-xs" />
          <span>ویرایش</span>
        </button>

        <button
          onClick={handleDeleteClick}
          disabled={isPending}
          className={`
            px-2.5 py-1.5 rounded-lg transition duration-200 flex items-center gap-1 text-xs font-semibold
            ${
              confirmDelete
                ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                : "bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/30 dark:text-slate-400 dark:hover:text-red-400"
            }
          `}
        >
          {isPending ? (
            <FaSpinner className="text-xs animate-spin" />
          ) : (
            <FaTrashAlt className="text-xs" />
          )}
          <span>{confirmDelete ? "تایید حذف؟" : "حذف"}</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 pr-1">
        
        {/* Main Address */}
        <div className="flex items-start gap-3 pl-32">
          <span className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-100/50 dark:border-slate-700/50 shadow-sm">
            <FaMapMarkerAlt className="text-base text-blue-500 dark:text-blue-400" />
          </span>
          <div className="space-y-1">
            {/* تگ‌های متمایز استان و شهر با مرزهای نوری دارک‌مود */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/20 dark:border-blue-900/30">
                استان {address.province}
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/20 dark:border-indigo-900/30">
                شهر {address.city}
              </span>
            </div>
            {/* متن آدرس اصلی */}
            <p className="text-slate-800 dark:text-slate-100 font-bold text-sm leading-relaxed">
              {toPersianNumber(address.address)}
            </p>
          </div>
        </div>

        {/* Details Grid (بخش اطلاعات به صورت کارت‌های متمایز در حالت دارک‌مود) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-50 dark:border-slate-800/60">
          
          {/* گیرنده */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/50 dark:bg-[#0B0F19]/60 border border-transparent dark:border-slate-800/60">
            <FaUser className="text-slate-400 dark:text-slate-500 text-xs shrink-0" />
            <div className="text-right">
              <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-medium">گیرنده</span>
              <span className="text-xs text-slate-800 dark:text-slate-100 font-bold truncate max-w-[120px] block">{address.user.name}</span>
            </div>
          </div>

          {/* موبایل */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/50 dark:bg-[#0B0F19]/60 border border-transparent dark:border-slate-800/60">
            <FaPhoneAlt className="text-slate-400 dark:text-slate-500 text-xs shrink-0" />
            <div className="text-right">
              <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-medium">موبایل</span>
              <span className="text-xs text-slate-800 dark:text-slate-100 font-bold tracking-wide block">{toPersianNumber(address.user.mobile || "ثبت نشده")}</span>
            </div>
          </div>

          {/* کد پستی تعاملی با کپی سریع */}
          <div 
            onClick={handleCopyPostal}
            className="group/postal flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/50 dark:bg-[#0B0F19]/60 border border-transparent dark:border-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
            title="کلیک برای کپی کد پستی"
          >
            <div className="flex items-center gap-2.5">
              <FaBarcode className="text-slate-400 dark:text-slate-500 text-xs shrink-0" />
              <div className="text-right">
                <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-medium">کد پستی</span>
                <span className="text-xs text-slate-800 dark:text-slate-100 font-bold tracking-wider block">{toPersianNumber(address.postal)}</span>
              </div>
            </div>
            
            {/* دکمه کپی بصری */}
            <div className="text-slate-400 dark:text-slate-500 group-hover/postal:text-blue-500 dark:group-hover/postal:text-blue-400 transition duration-150 pl-0.5">
              {copied ? (
                <FaCheck className="text-[10px] text-emerald-500 dark:text-emerald-400 transition-transform scale-110" />
              ) : (
                <FaCopy className="text-[10px] opacity-60 group-hover/postal:opacity-100" />
              )}
            </div>
          </div>
          
        </div>

        {isSelected && (
          <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
            {/* افکت تپنده (Pulsing Effect) برای نشانگر فعال */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>ارسال سفارشات به این آدرس انجام می‌شود</span>
          </div>
        )}
      </div>
    </section>
  );
}