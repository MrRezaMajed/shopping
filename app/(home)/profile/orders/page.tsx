import { FC } from "react";
import OrderItem from "../../../../components/profile/orders/OrderItem";

interface Order {
  date: string;
  code: string;
  status: string;
  images: string[];
}

const MyOrders: FC = () => {
  const orders: Order[] = [
    {
      date: "24 مهر 1399",
      code: "14893857",
      status: "در انتظار پرداخت",
      images: ["/images/products/1.jpg", "/images/products/2.jpg"],
    },
    {
      date: "24 مهر 1399",
      code: "14893857",
      status: "در انتظار پرداخت",
      images: ["/images/products/20.jpg", "/images/products/18.jpg", "/images/products/17.jpg"],
    },
  ];

  const statusFilters = [
    { label: "در انتظار پرداخت", cls: "bg-sky-500" },
    { label: "در حال پردازش", cls: "bg-yellow-500" },
    { label: "تحویل شده", cls: "bg-green-500" },
    { label: "مرجوعی", cls: "bg-red-700" },
    { label: "لغو شده", cls: "bg-gray-600" },
  ];

  return (
    <section className="w-full flex flex-col md:flex-row container mx-auto gap-6">
      {/* Main Content */}
      <main className="w-full bg-white p-6 rounded-2xl shadow space-y-6 dark:bg-gray-900">
        <section className="flex justify-between items-center pb-3">
          <h2 className="text-xl font-bold border-b-2 border-red-500">تاریخچه سفارشات</h2>
        </section>

        {/* Status Filter */}
        <section className="flex flex-wrap justify-center gap-3">
          {statusFilters.map(({ label, cls }, i) => (
            <button
              key={i}
              className={`${cls} text-white px-4 py-1 rounded-lg hover:brightness-120 transition`}
            >
              {label}
            </button>
          ))}
        </section>

        <section>
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-2">
            در انتظار پرداخت
          </h3>
        </section>

        {/* Orders */}
        <section className="space-y-5">
          {orders.map((order, i) => (
            <OrderItem
              key={i}
              date={order.date}
              code={order.code}
              status={order.status}
              images={order.images}
            />
          ))}
        </section>
      </main>
    </section>
  );
};

export default MyOrders;
