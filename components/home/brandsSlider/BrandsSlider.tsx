// components/home/brands/BrandsSlider.tsx
"use client";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay } from "swiper/modules";

// بارگذاری فایل‌های سبک سوئایپر
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import BrandsHeader from "./BrandsHeader";
import BrandCard from "./BrandCard";
import { BRANDS_DATA } from "./brands-data";

const BrandsSlider: FC = () => {
  return (
    <section className="w-full overflow-hidden bg-white/70 dark:bg-zinc-950/70 border border-slate-100 dark:border-zinc-900/60 rounded-2xl shadow-sm px-4 py-6 mb-10 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto">
        {/* هدر دسته‌بندی و عنوان برندها */}
        <BrandsHeader />

        {/* بدنه اسلایدر برندها */}
        <div className="mt-6 relative">
          <Swiper
            modules={[Navigation, A11y, Autoplay]}
            spaceBetween={16}
            slidesPerView={2.5} // مقدار پیش‌فرض اعشاری برای ایجاد راهنمای بصری روی موبایل‌های کوچک
            navigation
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            loop
            grabCursor
            breakpoints={{
              360: { slidesPerView: 3 },       // موبایل‌های استاندارد
              480: { slidesPerView: 3.5 },     // موبایل‌های بزرگ‌تر
              640: { slidesPerView: 4.5 },     // تبلت‌ها در حالت پرتره
              768: { slidesPerView: 5 },       // تبلت‌ها در حالت لنداسکیپ / لپ‌تاپ‌های کوچک
              1024: { slidesPerView: 6 },      // دسکتاپ‌های معمولی
              1280: { slidesPerView: 7 },      // دسکتاپ استاندارد (نمایش دقیق ۷ برند متناسب با درخواست شما)
              1440: { slidesPerView: 7 },      // مانیتورهای عریض
            }}
            className="brands-swiper"
          >
            {BRANDS_DATA.map((src, index) => (
              <SwiperSlide key={index}>
                <BrandCard src={src} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BrandsSlider;