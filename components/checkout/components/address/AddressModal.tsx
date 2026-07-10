// ایجاد آدرس جدید

"use client";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

interface Address {
  id: number;
  address: string;
  receiver: string;
  mobile: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
}

// کامپوننت محلی کوچک برای یکپارچه‌سازی و جلوگیری از تکرار کدهای استایل فیلدها
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

function FormInput({ className = "", ...props }: FormInputProps) {
  return (
    <input
      {...props}
      className={`
        w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800
        bg-slate-50/50 dark:bg-slate-950
        text-slate-800 dark:text-slate-100
        placeholder-slate-400 dark:placeholder-slate-500
        focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
        focus:ring-2 focus:ring-blue-500/10 transition-all duration-200
        text-sm font-medium ${className}
      `}
    />
  );
}

export default function AddressModal({ isOpen, onClose, onSave }: AddressModalProps) {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [receiver, setReceiver] = useState("");
  const [mobile, setMobile] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!province || !city || !address || !receiver || !mobile) {
      alert("لطفاً تمام فیلدها را پر کنید.");
      return;
    }

    onSave({
      id: Number(Date.now()),
      address: `${province}، ${city}، ${address}`,
      receiver,
      mobile,
    });
    
    onClose();

    // بازنشانی فیلدها
    setProvince("");
    setCity("");
    setAddress("");
    setPostalCode("");
    setReceiver("");
    setMobile("");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="
          bg-white dark:bg-slate-900
          w-full max-w-lg rounded-3xl
          p-6 shadow-xl border border-slate-100 dark:border-slate-800/80
          animate-fadeUp text-right
        "
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
            ایجاد آدرس جدید
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
            aria-label="بستن"
          >
            <FaTimes />
          </button>
        </div>

        {/* فرم ورودی‌ها */}
        <div className="grid grid-cols-2 gap-3.5">
          <FormInput
            placeholder="استان"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />

          <FormInput
            placeholder="شهر"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <FormInput
            className="col-span-2"
            placeholder="نشانی کامل"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <FormInput
            placeholder="کد پستی"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />

          <FormInput
            placeholder="نام گیرنده"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />

          <FormInput
            className="col-span-2"
            placeholder="شماره موبایل گیرنده"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* دکمه‌های کنترل */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-slate-200 text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750 transition text-sm font-medium"
          >
            بستن
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-700 transition text-sm font-semibold shadow-sm"
          >
            ذخیره آدرس
          </button>
        </div>
      </div>
    </div>
  );
}