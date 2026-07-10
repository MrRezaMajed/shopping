'use client';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';

interface ProductGalleryProps {
  images?: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // کنترل وضعیت لایت‌باکس
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  if (!images || images.length === 0) return null;

  const selectedImage = images[currentIndex];

  // مدیریت حرکت ماوس برای ایجاد افکت پان و زوم در حالت هاور
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
      
      {/* فریم اصلی تصویر */}
      <div 
        className="relative group overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100/50 dark:border-zinc-800/30 cursor-zoom-in aspect-square md:aspect-[4/3]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
      >
        {/* تصویر اصلی با قابلیت زوم محلی بر اساس حرکت ماوس */}
        <div className="w-full h-full overflow-hidden relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full flex items-center justify-center p-4"
          >
            <img
              src={selectedImage}
              alt="تصویر محصول"
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transform: isHovered ? 'scale(1.7)' : 'scale(1)',
              }}
              className="max-w-full max-h-full object-contain rounded-xl transition-transform duration-150 ease-out"
            />
          </motion.div>
        </div>

        {/* دکمه‌های ناوبری روی عکس با طراحی شیشه‌ای (فقط در هاور ماوس ظاهر می‌شوند) */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center bg-white/70 dark:bg-zinc-900/75 backdrop-blur-md text-zinc-800 dark:text-zinc-200 shadow-lg border border-white/20 dark:border-zinc-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all transform hover:scale-110"
            aria-label="تصویر قبلی"
          >
            <FiChevronRight size={20} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center bg-white/70 dark:bg-zinc-900/75 backdrop-blur-md text-zinc-800 dark:text-zinc-200 shadow-lg border border-white/20 dark:border-zinc-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all transform hover:scale-110"
            aria-label="تصویر بعدی"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>

        {/* دکمه باز کردن تمام‌صفحه در گوشه */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-lg bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-300 border border-white/20 shadow-sm">
            <FiMaximize2 size={14} />
          </div>
        </div>
      </div>

      {/* لیست تصاویر کوچک با افکت لغزنده حاشیه فعال */}
      <div className="flex gap-3 justify-center mt-5 overflow-x-auto py-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="relative focus:outline-none p-1 rounded-xl"
          >
            <img
              src={src}
              alt={`بندانگشتی ${i}`}
              className={`w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg transition-transform duration-200 ${
                currentIndex === i ? 'scale-95' : 'hover:scale-105'
              }`}
            />
            {/* افکت لغزش حاشیه فعال از یک دکمه به دکمه دیگر */}
            {currentIndex === i && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-xl border-2 border-rose-600 pointer-events-none"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* مودال لایت‌باکس تمام‌صفحه */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            {/* دکمه بستن لایت‌باکس */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-6 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <FiX size={22} />
            </button>

            {/* محفظه تصویر لایت‌باکس */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center relative p-2"
            >
              <img
                src={selectedImage}
                alt="نمای بزرگ محصول"
                className="max-w-full max-h-full object-contain rounded-2xl"
              />

              {/* ناوبری چپ و راست در لایت‌باکس */}
              <button
                onClick={prevImage}
                className="absolute right-4 p-3 rounded-full bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <FiChevronRight size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-4 p-3 rounded-full bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <FiChevronLeft size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;