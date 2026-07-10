'use client';
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaUserTag,
  FaMobileAlt,
  FaEdit,
  FaInfoCircle,
  FaPlus,
} from "react-icons/fa";
import AddressModal from "./AddressModal";

export interface Address {
  id: number;
  address: string;
  receiver: string;
  mobile: string;
}

interface AddressListProps {
  addresses: Address[];
  selected: number | null;
  onSelect: (id: number) => void;
  onSave: (newAddress: Address) => void;
}

export default function AddressList({
  addresses,
  selected,
  onSelect,
  onSave,
}: AddressListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
      
      <h2 className="font-bold text-lg mb-4 text-right text-slate-800 dark:text-slate-100">
        انتخاب آدرس و مشخصات گیرنده
      </h2>

      <div className="flex items-start gap-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40 p-3.5 rounded-2xl text-blue-700 dark:text-blue-400 text-xs leading-relaxed mb-5">
        <FaInfoCircle className="text-sm shrink-0 mt-0.5" />
        <span>پس از ایجاد آدرس جدید، حتماً آن را از بین لیست زیر انتخاب کنید.</span>
      </div>

      <div className="space-y-4">
        {addresses.map((item) => (
          <label
            key={item.id}
            className="relative block cursor-pointer group select-none"
          >
            <input
              type="radio"
              name="address"
              className="sr-only peer"
              checked={selected === item.id}
              onChange={() => onSelect(item.id)}
            />

            {/* کارت آدرس مدرن با استایل تعاملی */}
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
              
              {/* بخش بالایی کارت */}
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                    <FaMapMarkerAlt className="text-sm text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {item.address}
                  </p>
                </div>

                {/* دایره رادیویی سفارشی */}
                <div className="circle-radio w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 mt-1">
                  <span className="dot-radio w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 scale-0" />
                </div>
              </div>

              {/* جزییات گیرنده */}
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

              {/* دکمه‌های اقدام زیرین */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/40">
                <button
                  type="button"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 text-xs transition font-medium"
                >
                  <FaEdit className="text-xs" /> ویرایش آدرس
                </button>

                {/* تگ انتخاب شده */}
                <span className="active-badge opacity-0 scale-95 origin-left transition-all duration-300 text-green-600 dark:text-green-400 font-bold text-xs bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-lg">
                  کالاها به این آدرس ارسال می‌شوند
                </span>
              </div>

            </div>
          </label>
        ))}

        <button
          onClick={() => setIsModalOpen(true)}
          className="
            w-full rounded-xl py-3
            border-2 border-dashed border-blue-600/30 dark:border-blue-400/30
            text-blue-600 dark:text-blue-400 font-bold text-sm
            hover:border-blue-600 dark:hover:border-blue-400
            hover:bg-blue-50/50 dark:hover:bg-blue-950/10
            transition flex items-center justify-center gap-2
          "
        >
          <FaPlus className="text-xs" /> ایجاد آدرس جدید
        </button>

        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(newAddress) => {
            onSave(newAddress);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}