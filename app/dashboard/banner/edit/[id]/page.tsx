"use client";

import CRUDEditForm from "@/components/CRUDEditForm";
import { getBannerById, updateBanner, BannerFormValues } from "@/app/actions/banner/banner.actions";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const schema = Yup.object().shape({
  title: Yup.string().required("عنوان بنر الزامی است"),
  url: Yup.string().required("URL الزامی است"),
  position: Yup.string().oneOf(["TOP","RIGHT","DOWN"]).required(),
  status: Yup.string().oneOf(["ACTIVE","INACTIVE"]).required(),
});

export default function BannerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [initialValues, setInitialValues] = useState<BannerFormValues | null>(null);

  useEffect(() => {
    async function fetchData() {
      const banner = await getBannerById(id);
      if (!banner) return toast.error("بنر پیدا نشد");
      setInitialValues({
        title: banner.title,
        url: banner.url,
        position: banner.position,
        status: banner.status,
        image: undefined,
      });
    }
    fetchData();
  }, [id]);

  const fields = [
    { name: "title", label: "عنوان بنر" },
    { name: "url", label: "آدرس URL" },
    { name: "position", label: "موقعیت", type: "select", options: [{value:"TOP",label:"بالا"},{value:"RIGHT",label:"راست"},{value:"DOWN",label:"پایین"}] },
    { name: "status", label: "وضعیت", type: "select", options: [{value:"ACTIVE",label:"فعال"},{value:"INACTIVE",label:"غیرفعال"}] },
    { name: "image", label: "تصویر بنر", type: "file" },
  ];

  const handleSubmit = async (values: BannerFormValues) => {
    const res = await updateBanner(id, values);
    if (res.success) {
      toast.success("بنر بروزرسانی شد");
      router.push("/dashboard/banner");
    } else {
      toast.error(res.error || "خطا در بروزرسانی بنر");
    }
  };

  if (!initialValues) return <div>در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">ویرایش بنر</h1>
      <CRUDEditForm
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
        fields={fields}
        imageField="image"
      />
    </div>
  );
}
