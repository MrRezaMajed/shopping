// lib/utils/smartCrop.ts
import smartcrop from 'smartcrop';

/**
 * برش و فشرده‌سازی هوشمند تصویر در پس‌زمینه
 */
export const autoSmartCrop = (
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        // ۱. آنالیز محتوای عکس و تشخیص هوشمند بهترین کادر (بدون دخالت کاربر)
        const result = await smartcrop.crop(img, { width: targetWidth, height: targetHeight });
        const crop = result.topCrop;

        // ۲. پیاده‌سازی کادر برش روی کانواس
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          targetWidth,
          targetHeight
        );

        // ۳. ذخیره و فشرده‌سازی عکس خروجی با فرمت سبک jpeg
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed"));
              return;
            }
            const croppedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            
            URL.revokeObjectURL(img.src);
            resolve(croppedFile);
          },
          "image/jpeg",
          0.85
        );
      } catch (error) {
        URL.revokeObjectURL(img.src);
        reject(error);
      }
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};