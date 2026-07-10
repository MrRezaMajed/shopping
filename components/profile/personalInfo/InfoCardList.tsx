"use client";
import { useState } from "react";
import InfoCard from "./InfoCard";
import Modal from "./Modal";

interface User {
  name: string;
  nationalId: string;
  mobile: string;
  email?: string;
  birthday?: string;
  job?: string;
  economicCode?: string;
  disability?: string;
}

interface Item {
  label: string;
  value: string | number;
  editable?: boolean;
  addable?: boolean;
  verified?: boolean;
}

interface InfoCardListProps {
  user: User;
}

export default function InfoCardList({ user }: InfoCardListProps) {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<Item | null>(null);

  const items: Item[] = [
    { label: "نام و نام خانوادگی", value: user.name, editable: true },
    { label: "کد ملی", value: user.nationalId, editable: true },
    { label: "شماره موبایل", value: user.mobile, verified: true, editable: true },
    { label: "ایمیل", value: user.email || "", addable: true },
    { label: "رمز عبور", value: "•••••••", editable: true },
    { label: "روش بازگرداندن پول من", value: "", addable: true },
    { label: "تاریخ تولد", value: user.birthday || "", addable: true },
    { label: "شغل", value: user.job || "", addable: true },
    { label: "کد اقتصادی", value: user.economicCode || "", addable: true },
    { label: "نوع معلولیت", value: user.disability || "تعریف نشده", addable: true },
  ];

  return (
    <>
      {/* Cards List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-1">
          {items.map((item, i) => (
            <InfoCard
              key={i}
              label={item.label}
              value={item.value}
              editable={item.editable}
              verified={item.verified}
              addable={item.addable}
              onAction={() => {
                setModalContent(item);
                setOpenModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalContent?.label || ""}
      >
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-right leading-relaxed">
          مقدار فعلی:{" "}
          <span className="font-extrabold text-slate-800 dark:text-slate-200">
            {modalContent?.value || "—"}
          </span>
        </p>

        <input
          type="text"
          className="
            w-full px-4 py-2.5 rounded-xl text-sm border text-right
            bg-slate-50/50 dark:bg-slate-950
            border-slate-200 dark:border-slate-800
            text-slate-800 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-550
            focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
            focus:ring-2 focus:ring-blue-500/10 transition duration-200
          "
          placeholder={`ویرایش یا افزودن ${modalContent?.label}`}
        />

        <button
          className="
            mt-4 bg-blue-600 dark:bg-blue-500
            text-white px-5 py-3 rounded-xl w-full
            hover:bg-blue-700 dark:hover:bg-blue-600
            font-bold text-sm transition-all shadow-sm active:scale-[0.98]
          "
        >
          ذخیره تغییرات
        </button>
      </Modal>
    </>
  );
}