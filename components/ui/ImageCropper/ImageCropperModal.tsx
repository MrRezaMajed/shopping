"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiZoomIn, FiCheck, FiX } from "react-icons/fi";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

interface ImageCropperModalProps {
  imageSrc: string;
  aspectRatio: number; // پویایی نسبت تصویر بر اساس انتخاب کاربر
  targetWidth?: number; // عرض خروجی تصویر نهایی
  title?: string;
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropperModal({
  imageSrc,
  aspectRatio,
  targetWidth = 800,
  title = "برش و بهینه‌سازی تصویر",
  onCrop,
  onCancel,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleConfirmCrop = () => {
    if (!imageRef.current || !maskRef.current) return;

    const img = imageRef.current;
    const mask = maskRef.current;

    const maskRect = mask.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const cropX = (maskRect.left - imgRect.left) * scaleX;
    const cropY = (maskRect.top - imgRect.top) * scaleY;
    const cropWidth = maskRect.width * scaleX;
    const cropHeight = maskRect.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = Math.round(targetWidth / aspectRatio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        
        const croppedFile = new File([blob], "optimized-image.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        
        onCrop(croppedFile);
      },
      "image/jpeg",
      0.85
    );
  };

  // افزایش محدوده ابعاد ماسک برای پر کردن حداکثری فضای کانتینر در ابعاد ۱۶:۹
  const maxMaskWidth = 370;
  const maxMaskHeight = 270;

  let maskWidth = maxMaskWidth;
  let maskHeight = maxMaskWidth / aspectRatio;

  if (maskHeight > maxMaskHeight) {
    maskHeight = maxMaskHeight;
    maskWidth = maxMaskHeight * aspectRatio;
  }

  const maskStyle: React.CSSProperties = {
    width: `${maskWidth}px`,
    height: `${maskHeight}px`,
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px] cursor-not-allowed" 
        onClick={onCancel} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="
          relative w-full max-w-md p-6 rounded-3xl text-right z-10
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
          shadow-2xl space-y-5
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-rose-500 transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="
            relative w-full h-[300px] bg-slate-950 rounded-2xl overflow-hidden
            cursor-move select-none flex items-center justify-center
          "
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source to crop"
            draggable="false"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
            className="max-w-full max-h-full object-contain pointer-events-none"
          />

          <div
            ref={maskRef}
            style={maskStyle}
            className="
              absolute pointer-events-none rounded-xl border-2 border-dashed border-indigo-500
              shadow-[0_0_0_9999px_rgba(12,13,20,0.65)]
            "
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-bold">
            <span className="flex items-center gap-1"><FiZoomIn /> بزرگ‌نمایی</span>
            <span>{toPersianNumber(Math.round(zoom * 100))}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="3.5"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="
              flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold
              flex items-center justify-center gap-1.5 transition active:scale-[0.98]
            "
          >
            <FiCheck className="w-4 h-4" /> تایید و بهینه‌سازی
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="
              px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700
              text-slate-500 dark:text-slate-400 text-xs font-bold transition active:scale-[0.98]
            "
          >
            انصراف
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}