// app/page.tsx
import { FC } from "react";

// موقتاً کامپوننت‌ها کامنت شده‌اند تا تکی تکی تست شوند
import AdsGallery from "@/components/home/adsGallery/AdsGallery";
import BrandsSlider from "@/components/home/brandsSlider/BrandsSlider";
import FullSlider from "@/components/home/slider/FullSlider";
import Suggestions from "@/components/home/suggestions/Suggestions";

const Home: FC = () => {
  return (
    <main className="w-full mx-auto flex flex-col gap-8 md:gap-12 pt-14 px-12 sm:px-6 lg:px-8 xl:px-10">
      
       <FullSlider /> 
      
       <section className="w-full">
        <Suggestions title="پیشنهاد آمازون به شما" />
      </section> 

       <section className="w-full">
        <Suggestions title="پیشنهاد ویژه برای شما" />
      </section> 

       <AdsGallery /> 
      
       <BrandsSlider /> 

    </main>
  );
};

export default Home;