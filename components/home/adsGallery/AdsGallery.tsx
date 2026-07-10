// components/home/ads/AdsGallery.tsx
"use client";

import { FC } from "react";
import AdBanner from "./AdBanner";

const AdsGallery: FC = () => {
  return (
    <section className="w-full overflow-hidden pt-1">
      {/* 
        - هماهنگ کردن حداکثر عرض کانتینر با پکیج سراسری پروژه (1440px)
        - اعمال پدینگ‌های افقی امن جهت هم‌راستایی کامل با هدر، اسلایدرها و فوتر
      */}
      <div className="max-w-[1440px] mx-auto ">

        {/* --- تک ستونه (بنر عریض سراسری) --- */}
        <div className="">
          <AdBanner
            src="/images/ads/one-col-1.jpg"
            alt="one col"
            width={1600}
            height={600}
            priority
          />
        </div>

        {/* --- دو ستونه --- */}
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            <AdBanner
              src="/images/ads/two-col-1.jpg"
              alt="two col 1"
              width={800}
              height={500}
            />
            <AdBanner
              src="/images/ads/two-col-2.jpg"
              alt="two col 2"
              width={800}
              height={500}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default AdsGallery;