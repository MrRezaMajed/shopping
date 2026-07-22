// components/profile/addresses/AddressList.tsx
import { FaInbox } from "react-icons/fa";
import AddressItem from "./AddressItem";

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

type AddressListProps = {
  addresses: AddressType[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (address: AddressType) => void;
};

export default function AddressList({ addresses, selectedId, onSelect, onEdit }: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/10">
        <FaInbox className="text-4xl text-slate-300 dark:text-slate-700 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">هیچ آدرسی ثبت نشده است.</p>
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">جهت ثبت سفارش، ابتدا باید آدرس خود را ایجاد کنید.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4">
      {addresses.map((item) => (
        <AddressItem
          key={item.id}
          address={item}
          isSelected={selectedId === item.id}
          onSelect={() => onSelect(item.id)}
          onEdit={() => onEdit(item)}
        />
      ))}
    </section>
  );
}