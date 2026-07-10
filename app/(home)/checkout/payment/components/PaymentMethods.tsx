import { FC } from "react";
import { FaCreditCard, FaIdCard, FaMoneyCheckAlt } from "react-icons/fa";
import PaymentCard from "@/components/checkout/payment/PaymentCard";

interface PaymentMethodItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
}

const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    icon: <FaCreditCard />,
    title: "پرداخت آنلاین",
    subtitle: "درگاه پرداخت زرین پال",
    value: "1",
  },
  {
    icon: <FaIdCard />,
    title: "پرداخت آفلاین",
    subtitle: "حداکثر در 2 روز کاری بررسی می‌شود",
    value: "2",
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "پرداخت در محل",
    subtitle: "پرداخت به پیک هنگام دریافت کالا",
    value: "3",
  },
];

const PaymentMethods: FC = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">
        انتخاب نوع پرداخت
      </h3>

      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.value}
            className="w-full md:w-1/3 transition transform hover:-translate-y-1 hover:shadow-xl rounded-2xl duration-300"
          >
            <PaymentCard
              icon={method.icon}
              title={method.title}
              subtitle={method.subtitle}
              value={method.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;