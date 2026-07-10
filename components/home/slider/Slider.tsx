// components/home/slideshow/Slider.tsx
"use client";

import { FC } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

// وارد کردن استایل‌های پایه Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SLIDES: readonly string[] = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.gif",
];

const Slider: FC = () => {
  return (
    <div dir="rtl" className="w-full">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        className="rounded-2xl overflow-hidden shadow-sm"
        slidesPerView={1}
      >
        {SLIDES.map((name, index) => {
          const isGif = name.endsWith(".gif");
          return (
            <SwiperSlide key={name}>
              <div className="relative w-full h-[220px] sm:h-[300px] md:h-[420px] lg:h-[500px]">
                <Image
                  src={`/images/slideshow/${name}`}
                  alt={`اسلاید ${index + 1}`}
                  fill
                  priority={index === 0} /* تصویر اول برای بهبود LCP زودتر لود می‌شود */
                  unoptimized={isGif}
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover rounded-2xl"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slider;