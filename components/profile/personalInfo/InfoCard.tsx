"use client";
import { FC } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";

interface InfoCardProps {
  label: string;
  value: string | number;
  editable?: boolean;
  addable?: boolean;
  verified?: boolean;
  onAction?: () => void;
}

const InfoCard: FC<InfoCardProps> = ({
  label,
  value,
  editable = false,
  addable = false,
  verified = false,
  onAction,
}) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800/40 last:border-none text-right">

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{label}</p>

          {verified && (
            <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
              تاییدشده
            </span>
          )}
        </div>

        <p className="text-slate-800 dark:text-slate-200 font-bold text-sm min-h-[1.25rem]">
          {value || <span className="text-slate-350 dark:text-slate-600 font-normal">ثبت نشده</span>}
        </p>
      </div>

      {/* دکمه‌های اقدام شناور گرد */}
      {(editable || addable) && (
        <button
          type="button"
          className="
            w-8 h-8 rounded-xl flex items-center justify-center transition duration-200
            bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 
            text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0
            active:scale-95
          "
          onClick={onAction}
        >
          {editable && <FaEdit className="text-sm text-blue-500 dark:text-blue-400" />}
          {addable && <FaPlus className="text-xs text-emerald-500 dark:text-emerald-400" />}
        </button>
      )}

    </div>
  );
};

export default InfoCard;