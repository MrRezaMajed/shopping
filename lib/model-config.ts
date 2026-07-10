export const modelConfig = {
  banner: {
    fileFields: {
      image: { multiple: false, required: true },
    },
  },
  product: {
    fileFields: {
      images: { multiple: true, required: false },
    },
  },
  brand: {
    fileFields: {
      logo: { multiple: false, required: false },
    },
  },
  category: {},
} as const;

export type ModelKey = keyof typeof modelConfig;
