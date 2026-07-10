import React from 'react'
import { ColumnDef } from '@/components/ui/DataTable/types'
import { ProductWithRelations } from './types'
import Link from 'next/link'
import { toPersianNumber } from '@/lib/utils/persianNumbers'
import Image from 'next/image'

// Helper function to safely get product data
const getProductImages = (product: ProductWithRelations) => {
  return product.images || []
}

const getProductVariants = (product: ProductWithRelations) => {
  return product.variants || []
}

const getProductCategory = (product: ProductWithRelations) => {
  return product.category
}

const getProductBrand = (product: ProductWithRelations) => {
  return product.brand
}

export const productColumns: ColumnDef<ProductWithRelations>[] = [
  {
    id: 'image',
    header: 'تصویر',
    accessor: 'id' as keyof ProductWithRelations,
    width: '120px',
    cell: (product: ProductWithRelations): React.ReactNode => {
      const images = getProductImages(product)

      // فقط از فیلدهای موجود در اسکیما استفاده کنید
      const mainImage = images.length > 0 ? images[0] : null

      if (mainImage?.url) {
        return (
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src={mainImage.url}
                alt={product.title || 'تصویر محصول'}
                width={48}
                height={48}
                className="rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                onError={(e) => {
                  // جایگزین کردن با آیکون در صورت خطا
                  const imgElement = e.target as HTMLImageElement
                  imgElement.style.display = 'none'
                  const parent = imgElement.parentElement
                  if (parent) {
                    const fallbackDiv = document.createElement('div')
                    fallbackDiv.className =
                      'h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center'
                    const icon = document.createElement('div')
                    icon.innerHTML =
                      '<svg class="h-5 w-5 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
                    fallbackDiv.appendChild(icon)
                    parent.appendChild(fallbackDiv)
                  }
                }}
                loading="lazy"
                unoptimized={true} // اگر از دامنه خارجی استفاده می‌کنید
              />
            </div>
          </div>
        )
      }

      return (
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-gray-500 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      )
    },
  },
  {
    id: 'title',
    header: 'عنوان محصول',
    accessor: 'title' as keyof ProductWithRelations,
    width: '300px',
    cell: (product: ProductWithRelations): React.ReactNode => {
      return (
        <div className="text-right">
          <Link
            href={`/dashboard/content/products/${product.id}`}
            className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block mb-1"
          >
            {product.title || 'بدون عنوان'}
          </Link>
          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
            {product.description
              ? product.description.length > 80
                ? `${product.description.substring(0, 80)}...`
                : product.description
              : 'بدون توضیحات'}
          </div>
        </div>
      )
    },
  },
  {
    id: 'category',
    header: 'دسته‌بندی',
    accessor: 'categoryId' as keyof ProductWithRelations,
    width: '150px',
    cell: (product: ProductWithRelations): React.ReactNode => {
      const category = getProductCategory(product)
      return (
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium">
            {category?.name || 'بدون دسته'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'brand',
    header: 'برند',
    accessor: 'brandId' as keyof ProductWithRelations,
    width: '120px',
    cell: (product: ProductWithRelations): React.ReactNode => {
      const brand = getProductBrand(product)
      return (
        <div className="text-center">
          <span className="text-gray-800 dark:text-gray-300 font-medium">{brand?.name || '-'}</span>
        </div>
      )
    },
  },
  {
    id: 'price',
    header: 'قیمت (تومان)',
    accessor: 'price' as keyof ProductWithRelations,
    width: '180px',
    cell: (product: ProductWithRelations): React.ReactNode => {
      const variants = getProductVariants(product)

      // اگر محصول variant ندارد یا variants آرایه خالی است
      if (!variants || variants.length === 0) {
        return (
          <div className="text-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">تعریف نشده</span>
          </div>
        )
      }

      // فیلتر کردن variantهایی که قیمت دارند
      const variantsWithPrice = variants.filter((v) => v.price !== null && v.price !== undefined)

      if (variantsWithPrice.length === 0) {
        return (
          <div className="text-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">قیمت تعریف نشده</span>
          </div>
        )
      }

      const prices = variantsWithPrice.map((v) => v.price!)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const hasMultiplePrices = minPrice !== maxPrice && variants.length > 1

      return (
        <div className="text-left font-sans">
          <div className="font-bold text-gray-900 dark:text-gray-100">
            {toPersianNumber(minPrice.toLocaleString('fa-IR'))}
            {hasMultiplePrices && (
              <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">
                {` - ${toPersianNumber(maxPrice.toLocaleString('fa-IR'))}`}
              </span>
            )}
          </div>
          {variants.length > 1 && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {`${toPersianNumber(variants.length.toString())} مدل`}
            </div>
          )}
        </div>
      )
    },
  },
  {
    id: 'stock',
    header: 'موجودی',
    accessor: 'stock' as keyof ProductWithRelations,
    width: '100px',
    cell: (product: ProductWithRelations): React.ReactNode => {
      const variants = getProductVariants(product)

      // اگر محصول variant ندارد یا variants آرایه خالی است
      if (!variants || variants.length === 0) {
        return (
          <div className="text-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">0</span>
            <div className="text-xs text-red-600 dark:text-red-400 mt-0.5 font-medium">ناموجود</div>
          </div>
        )
      }

      // محاسبه موجودی کل
      const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      const isOutOfStock = totalStock === 0

      return (
        <div className="text-center">
          <span
            className={`font-medium ${isOutOfStock ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-gray-100'}`}
          >
            {toPersianNumber(totalStock.toString())}
          </span>
          {isOutOfStock && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-0.5 font-medium">ناموجود</div>
          )}
        </div>
      )
    },
  },
  {
    id: 'status',
    header: 'وضعیت',
    accessor: 'status' as keyof ProductWithRelations,
    width: '100px',
    cell: (product: ProductWithRelations): React.ReactNode => {
      const isActive = product.status === 'ACTIVE'
      const className = `inline-block px-3 py-1.5 rounded-full text-xs font-bold ${
        isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
      }`

      return (
        <div className="text-center">
          <span className={className}>{isActive ? 'فعال' : 'غیرفعال'}</span>
        </div>
      )
    },
  },
]
