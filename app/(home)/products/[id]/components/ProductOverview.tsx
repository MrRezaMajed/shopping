import { FC } from "react";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductPriceBox from "@/components/products/ProductPriceBox";

interface ProductOverviewProps {
  images: string[];
}

const ProductOverview: FC<ProductOverviewProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-9 gap-6 col-span-9 mt-4">
      {/* گالری تصاویر محصول (۳ ستون) */}
      <div className="md:col-span-3">
        <ProductGallery images={images} />
      </div>

      {/* اطلاعات متنی محصول (۴ ستون) */}
      <div className="md:col-span-4">
        <ProductInfo />
      </div>

      {/* باکس خرید و قیمت (۲ ستون) */}
      <div className="md:col-span-2">
        <ProductPriceBox />
      </div>
    </div>
  );
};

export default ProductOverview;