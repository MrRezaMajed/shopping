import { FC } from "react";
import ProductOverview from "./components/ProductOverview";
import Suggestions from "@/components/home/suggestions/Suggestions";
import ProductDescription from "@/components/products/ProductDesceription";

const ProductPage: FC = () => {
  const images: string[] = [
    "/images/single-product/1.jpg",
    "/images/single-product/2.jpg",
    "/images/single-product/3.jpg",
    "/images/single-product/4.jpg",
    "/images/single-product/5.jpg",
  ];

  return (
    <main className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-9 gap-6 bg-gray-200 px-10 dark:bg-gray-800">
      {/* بخش اصلی محصول (گالری، اطلاعات، قیمت) */}
      <ProductOverview images={images} />

      {/* توضیحات تکمیلی محصول */}
      <div className="md:col-span-9">
        <ProductDescription />
      </div>

      {/* کالاهای پیشنهادی مرتبط */}
      <div className="md:col-span-9">
        <Suggestions title="کالاهای مرتبط" />
      </div>
      
    </main>
  );
};

export default ProductPage;