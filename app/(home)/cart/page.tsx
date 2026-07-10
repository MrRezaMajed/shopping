import { FC } from "react";
import CartList from "@/components/cart/cartList/CartList";
import CartSummary from "@/components/cart/cartSummary/CartSummary";

const CartPage: FC = () => {
  return (
    <div className="container mx-auto p-6">
      <span className="text-xl font-bold mb-4 text-right border-b-2 border-red-500">
        سبد خرید شما
      </span>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
        <div className="col-span-1 md:col-span-4">
          <CartList />
        </div>
        <div className="col-span-1 md:col-span-1">
          <CartSummary
            itemCount={3}
            totalPrice={450000}
            discount={50000}
            shipping={20000}
            canContinue={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
