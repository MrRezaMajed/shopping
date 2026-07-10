// components/home/suggestions/Suggestions.tsx
"use client";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

// بارگذاری فایل‌های سبک سوئایپر
import "swiper/css";
import "swiper/css/pagination";

import SuggestionsHeader from "./SuggestionsHeader";
import NavigationButtons from "./NavigationButtons";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "./suggestions-data";

interface SuggestionsProps {
  title: string;
}

const Suggestions: FC<SuggestionsProps> = ({ title }) => {
  const slug = title.replace(/\s+/g, "-");
  const prevBtnClass = `custom-prev-${slug}`;
  const nextBtnClass = `custom-next-${slug}`;

  return (
    <section
      className="
        w-full overflow-hidden
        bg-white dark:bg-zinc-950/40
        border border-slate-100 dark:border-zinc-900/60
        rounded-3xl px-5 py-3 transition-all duration-350
        group/suggestions
      "
    >
      {/* استایل‌های شخصی‌سازی نقاط لودر (Pagination Bullets) مینی‌مال سوئایپر */}
      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet {
          background: #cbd5e1 !important;
          opacity: 0.6;
          width: 6px;
          height: 6px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .swiper-pagination-bullet-active {
          background: var(--brand-500) !important;
          width: 18px;
          border-radius: 9999px;
          opacity: 1;
        }
        .dark .swiper-pagination-bullet {
          background: #3f3f46 !important;
        }
      ` }} />

      {/* ۱. هدر بخش پیشنهادات */}
      <SuggestionsHeader title={title} />

      {/* ۲. اسلایدر و بدنه اصلی پیشنهادات شگفت‌انگیز */}
      <div className="relative">
        
        {/* دکمه‌های ناوبری چپ و راست سفارشی و تعاملی */}
        <NavigationButtons prevBtnClass={prevBtnClass} nextBtnClass={nextBtnClass} />
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          navigation={{
            nextEl: `.${nextBtnClass}`,
            prevEl: `.${prevBtnClass}`,
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          spaceBetween={16}
          slidesPerView={1.5}
          dir="rtl"
          grabCursor
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="!pt-4 !pb-8 suggestions-swiper"
        >
          {PRODUCTS.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Suggestions;