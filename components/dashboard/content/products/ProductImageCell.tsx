import Image from "next/image";
import { useState } from "react";

interface ProductImageCellProps {
  imageUrl: string;
  altText: string;
  size?: "sm" | "md" | "lg";
  showPreview?: boolean;
}

export default function ProductImageCell({ 
  imageUrl, 
  altText, 
  size = "md",
  showPreview = false 
}: ProductImageCellProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageClick = () => {
    if (showPreview) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className={`relative ${sizeClasses[size]} cursor-pointer ${showPreview ? 'hover:scale-105 transition-transform' : ''}`} onClick={handleImageClick}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          <Image
            src={imageUrl || '/images/placeholder-product.jpg'}
            alt={altText || 'محصول'}
            fill
            sizes="(max-width: 768px) 48px, 64px"
            className={`object-cover rounded ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleImageLoad}
            onError={() => {
              setIsLoading(false);
            }}
          />
        </div>
      </div>

      {/* Modal برای نمایش بزرگ تصویر */}
      {showModal && showPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
              onClick={() => setShowModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full h-[70vh]">
              <Image
                src={imageUrl || '/images/placeholder-product.jpg'}
                alt={altText || 'محصول'}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-900 dark:text-gray-100 text-sm text-center">{altText}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}