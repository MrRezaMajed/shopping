import { FC } from "react";
import Slider from "./Slider";
import SideBanner from "./SideBanner";

const FullSlider: FC = () => {
  return (
    /* 
      با تغییر mt-4 به mt-2 pt-2، فاصله کلی از هدر حفظ می‌شود 
      اما اسلایدر و بنرها فضای خالی کوچکی در بالای خود پیدا می‌کنند تا در هاور بریده نشوند.
    */
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full overflow-hidden">
      {/* اسلایدر اصلی مدرن */}
      <div className="md:col-span-2 w-full">
        <Slider />
      </div>

      {/* ستون بنرهای جانبی با پویانمایی‌های تعاملی هاور فریم‌ورک فراموشن */}
      <div className="flex flex-col gap-4 sm:gap-6">
        
        {/* بنر اول (بالا سمت چپ) */}
        <SideBanner
          src="/images/slideshow/12.gif"
          alt="بنر تبلیغاتی ۱"
          width={800}
          height={480}
          rotateDirection="clockwise"
          priority
        />

        {/* بنر دوم (پایین سمت چپ) */}
        <SideBanner
          src="/images/slideshow/11.jpg"
          alt="بنر تبلیغاتی ۲"
          width={800}
          height={480}
          rotateDirection="counterclockwise"
        />

      </div>
    </section>
  );
};

export default FullSlider;