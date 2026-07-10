"use client";

import CRUDEditForm from "@/components/CRUDEditForm";
import { createBanner, BannerFormValues } from "@/app/actions/banner/banner.actions";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const schema = Yup.object().shape({
  title: Yup.string().required("عنوان بنر الزامی است"),
  url: Yup.string().required("URL الزامی است"),
  position: Yup.string().oneOf(["TOP","RIGHT","DOWN"]).required(),
  status: Yup.string().oneOf(["ACTIVE","INACTIVE"]).required(),
  image: Yup.mixed().required("تصویر الزامی است"),
});

export default function BannerCreatePage() {
  const router = useRouter();

  const fields = [
    { name: "title", label: "عنوان بنر" },
    { name: "url", label: "آدرس URL" },
    { name: "position", label: "موقعیت", type: "select", options: [{value:"TOP",label:"بالا"},{value:"RIGHT",label:"راست"},{value:"DOWN",label:"پایین"}] },
    { name: "status", label: "وضعیت", type: "select", options: [{value:"ACTIVE",label:"فعال"},{value:"INACTIVE",label:"غیرفعال"}] },
    { name: "image", label: "تصویر بنر", type: "file" },
  ];

  const handleSubmit = async (values: BannerFormValues) => {
    const res = await createBanner(values);
    if (res.success) {
      toast.success("بنر ایجاد شد");
      router.push("/dashboard/banner");
    } else {
      toast.error(res.error || "خطا در ایجاد بنر");
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 rounded-2xl text-gray-800
      dark:text-gray-100">
      <CRUDEditForm
        title="ایجاد بنر جدید"
        initialValues={{ title: "", url: "", position: "TOP", status: "ACTIVE", image: undefined }}
        validationSchema={schema}
        onSubmit={handleSubmit}
        fields={fields}
        imageField="image"
        onCancel={() => router.push("/dashboard/banner")}
        onBack={() => router.back()}
      />
    </div>
  );
}
