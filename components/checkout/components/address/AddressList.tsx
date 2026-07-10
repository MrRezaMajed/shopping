// مدیریت لیست آدرس‌ها

'use client';
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddressModal from "./AddressModal";
import AddressCard from "./AddressCard";
import InfoBanner from "../InfoBanner";

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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-right">
      <h2 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">
        انتخاب آدرس و مشخصات گیرنده
      </h2>

      <InfoBanner message="پس از ایجاد آدرس جدید، حتماً آن را از بین لیست زیر انتخاب کنید." />

      <div className="space-y-4">
        {addresses.map((item) => (
          <AddressCard
            key={item.id}
            item={item}
            isSelected={selected === item.id}
            onSelect={() => onSelect(item.id)}
          />
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