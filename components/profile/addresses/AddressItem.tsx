import { FaMapMarkerAlt, FaUserTag, FaMobileAlt, FaEdit } from "react-icons/fa";
import Link from "next/link";

type Address = {
  full: string;
  receiver: string;
  mobile: string;
  selected?: boolean;
};

type AddressItemProps = {
  address: Address;
};

export default function AddressItem({ address }: AddressItemProps) {
  return (
    <section 
      className={`
        p-5 rounded-2xl relative transition-all duration-300 border-2 text-right
        ${
          address.selected
            ? "border-blue-600 dark:border-blue-500 bg-blue-50/10 dark:bg-blue-950/20 shadow-md shadow-blue-500/5"
            : "border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
        }
      `}
    >

      {/* Edit Button - Top Left */}
      <Link
        href="#"
        className="
          absolute top-4 left-4 
          bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 
          hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 
          px-3 py-1.5 rounded-xl transition duration-200 flex items-center gap-1.5 text-xs font-semibold
        "
      >
        <FaEdit className="text-xs" />
        <span>ویرایش</span>
      </Link>

      {/* Content */}
      <div className="space-y-3.5 pr-1">
        {/* آدرس اصلی */}
        <p className="flex items-start gap-2.5 text-slate-800 dark:text-slate-100 font-bold text-sm leading-relaxed">
          <span className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
            <FaMapMarkerAlt className="text-sm" />
          </span>
          <span className="mt-1">آدرس: {address.full}</span>
        </p>

        {/* مشخصات فرعی در ساختار منظم‌تر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-50 dark:border-slate-850">
          <p className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <FaUserTag className="text-slate-400 text-sm" />
            <span>گیرنده: <strong className="text-slate-700 dark:text-slate-300 font-medium">{address.receiver}</strong></span>
          </p>

          <p className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <FaMobileAlt className="text-slate-400 text-sm" />
            <span>موبایل: <strong className="text-slate-700 dark:text-slate-300 font-medium">{address.mobile}</strong></span>
          </p>
        </div>

        {address.selected && (
          <div className="pt-2">
            <span className="inline-block px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg">
              کالاها به این آدرس ارسال می‌شود
            </span>
          </div>
        )}
      </div>

    </section>
  );
}