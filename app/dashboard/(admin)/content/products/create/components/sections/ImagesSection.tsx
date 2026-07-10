"use client";

import { ImageForm } from "../CreateProductForm";

interface ImagesSectionProps {
  images: ImageForm[];
  imageFiles: File[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function ImagesSection({
  images,
  imageFiles,
  setFieldValue,
}: ImagesSectionProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImageFiles = [...imageFiles, ...newFiles];
      const newImages = [...images];
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: ImageForm = {
            url: reader.result as string,
            isMain: newImages.length === 0,
            file
          };
          newImages.push(newImage);
          
          // به روز رسانی state با آخرین تغییرات
          setFieldValue("images", [...newImages]);
          setFieldValue("imageFiles", newImageFiles);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    
    // اگر تصویر اصلی حذف شد، اولین تصویر را اصلی کن
    if (images[index].isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    
    setFieldValue("images", newImages);
    setFieldValue("imageFiles", newFiles);
  };

  const setMainImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    setFieldValue("images", newImages);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-900">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
        تصاویر محصول
      </h2>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          آپلود تصاویر (حداکثر ۱۰ تصویر)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2
            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 dark:file:bg-blue-900
            file:text-blue-700 dark:file:text-blue-300
            hover:file:bg-blue-100 dark:hover:file:bg-blue-800
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          اولین تصویر به عنوان تصویر اصلی انتخاب می‌شود
        </p>
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 
                opacity-0 group-hover:opacity-70 transition-opacity rounded-lg 
                flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600
                    dark:bg-red-600 dark:hover:bg-red-700"
                  title="حذف"
                >
                  🗑️
                </button>
                <button
                  type="button"
                  onClick={() => setMainImage(index)}
                  className={`p-2 rounded-full ${image.isMain 
                    ? 'bg-green-500 dark:bg-green-600' 
                    : 'bg-blue-500 dark:bg-blue-600'
                  } text-white hover:opacity-90`}
                  title={image.isMain ? "تصویر اصلی" : "تنظیم به عنوان اصلی"}
                >
                  {image.isMain ? "⭐" : "☆"}
                </button>
              </div>
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-blue-500 dark:bg-blue-600 
                  text-white px-2 py-1 rounded text-xs">
                  اصلی
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 
          dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            هنوز تصویری آپلود نشده است
          </p>
        </div>
      )}
    </div>
  );
}