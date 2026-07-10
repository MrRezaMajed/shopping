interface CategoryGroup {
  title: string;
  items: string[];
}

interface Category {
  title: string;
  icon: string; // emoji یا icon name
  groups: CategoryGroup[];
}

export const DIGIKALA_CATEGORIES: Category[] = [
  {
    title: "کالای دیجیتال",
    icon: "💻",
    groups: [
      {
        title: "موبایل",
        items: [
          "گوشی موبایل",
          "گوشی سامسونگ",
          "گوشی شیائومی",
          "گوشی اپل",
          "گوشی میان‌رده",
          "گوشی اقتصادی",
        ],
      },
      {
        title: "لپ‌تاپ و کامپیوتر",
        items: [
          "لپ تاپ",
          "لپ تاپ گیمینگ",
          "کامپیوتر آماده",
          "قطعات کامپیوتر",
          "هارد، فلش، SSD",
        ],
      },
      {
        title: "صوتی و تصویری",
        items: ["مانیتور", "اسپیکر", "تلویزیون", "هدفون"],
      },
    ],
  },

  {
    title: "مد و پوشاک",
    icon: "👗",
    groups: [
      {
        title: "زنانه",
        items: ["لباس زنانه", "کفش زنانه", "کیف و اکسسوری"],
      },
      {
        title: "مردانه",
        items: ["لباس مردانه", "کفش مردانه", "اکسسوری مردانه"],
      },
      {
        title: "بچگانه",
        items: ["لباس کودک", "کفش کودک", "کالرپوش"],
      },
    ],
  },

  {
    title: "خانه و آشپزخانه",
    icon: "🏠",
    groups: [
      {
        title: "آشپزخانه",
        items: ["ظروف پخت و پز", "سرویس غذاخوری", "کارد و چنگال"],
      },
      {
        title: "دکوراسیون",
        items: ["فرش", "لوستر", "کوسن", "لوازم دکوری"],
      },
    ],
  },
];
