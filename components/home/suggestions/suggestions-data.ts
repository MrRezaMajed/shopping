export type Product = {
  id: number;
  name: string;
  img: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  colors: string[];
};

export const PRODUCTS: readonly Product[] = [
  {
    id: 1,
    name: "دستگاه آبمیوه گیری دنویر با کد 1016",
    img: "/images/products/2.jpg",
    price: "264,000 تومان",
    oldPrice: "342,000",
    discount: "22%",
    colors: ["white", "#3b82f6", "#ef4444"],
  },
  {
    id: 2,
    name: "کتاب اثر مرکب اثر دارن هاردی با کد 87",
    img: "/images/products/1.jpg",
    price: "56,000 تومان",
    colors: [],
  },
  {
    id: 3,
    name: "پکیج آموزش خطاطی و خوشنویسی با کد 624",
    img: "/images/products/3.jpg",
    price: "115,000 تومان",
    colors: ["#fbbf24", "#22c55e", "white", "#3b82f6", "#ef4444"],
  },
  {
    id: 4,
    name: "مجموعه داستان های هزار و یک شب",
    img: "/images/products/4.jpg",
    price: "207,000 تومان",
    oldPrice: "230,000",
    discount: "10%",
    colors: [],
  },
  {
    id: 5,
    name: "کتاب اطلاعات عمومی انتشارات فارابی با کد 3087",
    img: "/images/products/5.jpg",
    price: "870,000 تومان",
    colors: [],
  },
  {
    id: 6,
    name: "کتاب شیوه گرگ اثر جردن بلفورت",
    img: "/images/products/6.jpg",
    price: "29,000 تومان",
    oldPrice: "59,000",
    discount: "50%",
    colors: [],
  },
  {
    id: 7,
    name: "مجموعه داستان های قصه های مشهور جهان",
    img: "/images/products/7.jpg",
    price: "450,000 تومان",
    colors: [],
  },
  {
    id: 8,
    name: "کتاب برای سفر خودآموز مکالمات انگلیسی",
    img: "/images/products/8.jpg",
    price: "64,000 تومان",
    colors: [],
  },
  {
    id: 9,
    name: "کتاب برای سفر خودآموز مکالمات انگلیسی",
    img: "/images/products/8.jpg",
    price: "64,000 تومان",
    colors: [],
  },
  {
    id: 10,
    name: "کتاب اثر مرکب اثر دارن هاردی انتشارات معیار علم",
    img: "/images/products/1.jpg",
    price: "663,000 تومان",
    colors: [],
  },
];