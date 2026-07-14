import { getModelConfig } from "../config/modelConfigs";
import { getCategories, getBrands } from "@/app/actions/crud/read";
import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { notFound } from "next/navigation";
import { FilterField } from "@/components/GenericFilterBar";

interface PageProps {
  params: Promise<{ model: string }>;
}

export default async function ModelPage({ params }: PageProps) {
  const { model } = await params;

  let config;
  try {
    config = getModelConfig(model);
  } catch {
    notFound();
  }

  const dynamicOptions: Record<string, { value: string; label: string; parentId?: number | string | null }[]> = {};

  if (model === "category") {
    const categories = await getCategories();
    dynamicOptions["parentId"] = categories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
      parentId: cat.parentId,
    }));
  }

  if (model === "product") {
    const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
    dynamicOptions["categoryId"] = categories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    }));
    dynamicOptions["brandId"] = [
      { value: "", label: "بدون برند" },
      ...brands.map((brand) => ({
        value: String(brand.id),
        label: brand.name,
      })),
    ];
  }

  const enrichedFilterFields = config.filterFields.map((field) => {
    if (field.key && dynamicOptions[field.key]) {
      return {
        ...field,
        options: [
          { value: "", label: "همه" },
          ...dynamicOptions[field.key],
        ],
      };
    }
    return field;
  });

  // validationSchema را حذف می‌کنیم
  return (
    <CRUDPage
      model={config.model}
      modelName={config.modelName}
      fields={config.fields}
      formFields={config.formFields}
      filterFields={enrichedFilterFields as FilterField[]}
      // validationSchema حذف شد
      enableStatusToggle={config.enableStatusToggle}
      hiddenOnMobile={config.hiddenOnMobile}
      dynamicOptions={dynamicOptions}
      filterTranslations={config.filterTranslations}
    />
  );
}