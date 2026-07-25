import * as Yup from "yup";
import Image from "next/image";
import { CRUDField } from "@/components/ui/CRUDPage/types";

export const bannerConfig = {
  modelKey: "banner" as const,
  modelName: "بنر",
  enableStatusToggle: true,
  hiddenOnMobile: ["url", "status", "createdAt"],
  validationSchema: Yup.object().shape({
    title: Yup.string().required("وارد کردن عنوان بنر الزامی است").min(2),
    image: Yup.string().required("بارگذاری تصویر بنر الزامی است"),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
    url: Yup.string().required("وارد کردن آدرس لینک الزامی است"),
    position: Yup.string().required("انتخاب موقعیت الزامی است"),
  }),
  filterTranslations: {
    keys: { search: "جستجو بنرها", status: "وضعیت نمایش", position: "موقعیت نمایش" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال", TOP: "بالا", DOWN: "پایین", RIGHT: "راست" },
  },
  getFields: (): CRUDField[] => [
    { name: "title", label: "عنوان" },
    {
      name: "image",
      label: "تصویر",
      cellRenderer: (item: any) =>
        item.image ? (
          <div className="w-16 h-10 relative rounded-lg overflow-hidden border border-slate-100 bg-slate-100">
            <Image src={item.image} alt={item.title || "تصویر"} fill sizes="64px" className="object-cover" />
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      name: "url",
      label: "لینک",
      cellRenderer: (item: any) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 inline-block truncate max-w-[200px]">
          {item.url || "-"}
        </span>
      ),
    },
    {
      name: "position",
      label: "موقعیت",
      cellRenderer: (item: any) => {
        const positionMap: Record<string, { label: string; color: string }> = {
          TOP: { label: "بالا", color: "bg-blue-50 text-blue-600 border-blue-100" },
          DOWN: { label: "پایین", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          RIGHT: { label: "راست", color: "bg-purple-50 text-purple-600 border-purple-100" },
        };
        const pos = item.position;
        const { label, color } = positionMap[pos] || { label: pos || "-", color: "bg-slate-5" };
        return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${color}`}>{label}</span>;
      },
    },
    { name: "status", label: "وضعیت" },
  ],
  formFields: [
    { name: "title", label: "عنوان", type: "text" },
    { name: "url", label: "لینک", type: "text" },
    {
      name: "position",
      label: "موقعیت",
      type: "select",
      options: [
        { value: "TOP", label: "بالا" },
        { value: "DOWN", label: "پایین" },
        { value: "RIGHT", label: "راست" },
      ],
    },
    {
      name: "status",
      label: "وضعیت",
      type: "select",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
    // فیلد آپلود مجهز به پیکربندی ابعاد بنر عریض به صورت کاملاً خودکار
    { 
      name: "image", 
      label: "تصویر", 
      type: "file",
      aspectRatio: 16 / 9,
      targetWidth: 1280
    },
  ],
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجوی بنر..." },
    {
      key: "position",
      type: "select",
      placeholder: "موقعیت",
      options: [
        { value: "TOP", label: "بالا" },
        { value: "DOWN", label: "پایین" },
        { value: "RIGHT", label: "راست" },
      ],
    },
    {
      key: "status",
      type: "select",
      placeholder: "وضعیت",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],
};