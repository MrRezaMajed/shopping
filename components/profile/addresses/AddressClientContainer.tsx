// components/profile/addresses/AddressClientContainer.tsx
"use client";

import { useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import AddressList from "./AddressList";
import AddAddressButton from "./AddAddressButton";
import AddressModal from "./AddressModal";

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

type Props = {
  initialAddresses: AddressType[];
};

export default function AddressClientContainer({ initialAddresses }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  
  // به عنوان نمونه، اولین آدرس را به صورت پیش‌فرض فعال در نظر می‌گیریم
  const [selectedId, setSelectedId] = useState<number | null>(
    initialAddresses.length > 0 ? initialAddresses[0].id : null
  );

  const handleEditClick = (address: AddressType) => {
    setEditingAddress(address);
    setOpenModal(true);
  };

  const handleAddClick = () => {
    setEditingAddress(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingAddress(null);
  };

  return (
    <main className="w-full container mx-auto ">
      <section className="w-full bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FaMapMarkedAlt className="text-xl" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">آدرس‌های من</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">مدیریت و ویرایش آدرس‌های ارسال سفارش</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <AddAddressButton onOpen={handleAddClick} />
          </div>
        </header>

        {/* List of Addresses */}
        <AddressList
          addresses={initialAddresses}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={handleEditClick}
        />

        {/* Mobile Action Button */}
        <div className="block sm:hidden pt-2">
          <AddAddressButton onOpen={handleAddClick} />
        </div>
      </section>

      {/* Shared Modal for Adding and Editing */}
      <AddressModal
        open={openModal}
        onClose={handleCloseModal}
        addressToEdit={editingAddress}
      />
    </main>
  );
}