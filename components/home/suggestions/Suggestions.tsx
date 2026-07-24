// components/home/suggestions/Suggestions.tsx
"use client";

import { FC, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

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
  const [mounted, setMounted] = useState(false);
  const slug = title.replace(/\s+/g, "-");
  const prevBtnClass = `custom-prev-${slug}`;
  const nextBtnClass = `custom-next-${slug}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[370px] animate-pulse bg-slate-100/50 dark:bg-zinc-900/20 rounded-[24px]" />
    );
  }

  return (
    <section
      className="
        w-full overflow-hidden
        bg-slate-50/50 dark:bg-zinc-950/10
        border border-slate-100 dark:border-zinc-900/50
        rounded-[24px] px-5 py-4 transition-all duration-300
        group/suggestions
      "
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet {
          background: #cbd5e1 !important;
          opacity: 0.6;
          width: 5px;
          height: 5px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: var(--brand-500) !important;
          width: 14px;
          border-radius: 9999px;
          opacity: 1;
        }
        .dark .swiper-pagination-bullet {
          background: #3f3f46 !important;
        }
      ` }} />

      <SuggestionsHeader title={title} />

      <div className="relative">
        <NavigationButtons prevBtnClass={prevBtnClass} nextBtnClass={nextBtnClass} />
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          navigation={{
            nextEl: `.${nextBtnClass}`,
            prevEl: `.${prevBtnClass}`,
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          spaceBetween={16}
          slidesPerView={1.8} /* نمایش حدود ۱.۸ کارت در موبایل‌های کوچک */
          dir="rtl"
          grabCursor
          breakpoints={{
            480: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }, /* حدود ۴ کارت در تبلت‌های عریض و دسکتاپ کوچک */
            1280: { slidesPerView: 4.5 }, /* استاندارد ۴ الی ۵ کارت در دسکتاپ */
            1536: { slidesPerView: 5 }, /* حداکثر ۵ الی ۵.۵ کارت در مانیتورهای بزرگ */
          }}
          className="!pt-4 !pb-8 suggestions-swiper"
        >
          {PRODUCTS.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto flex">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Suggestions;