interface PaymentCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
}

export default function PaymentCard({ icon, title, subtitle, value }: PaymentCardProps) {
  return (
    <label className="relative block cursor-pointer group h-full select-none">
      {/* رادیو باکس مخفی جهت مدیریت وضعیت */}
      <input 
        type="radio" 
        name="payment_type" 
        value={value} 
        className="sr-only peer" 
        defaultChecked={value === "1"} 
      />
      
      {/* بدنه اصلی کارت */}
      <div className="
        flex flex-col h-full p-5 rounded-2xl border-2 transition-all duration-300
        bg-white dark:bg-gray-900 
        border-gray-100 dark:border-gray-800/80
        hover:border-gray-300 dark:hover:border-gray-700
        peer-checked:border-blue-600 dark:peer-checked:border-blue-500
        peer-checked:bg-blue-50/10 dark:peer-checked:bg-blue-950/20
        peer-checked:shadow-md peer-checked:shadow-blue-500/5
        peer-checked:[&_.icon-box]:bg-blue-600 dark:peer-checked:[&_.icon-box]:bg-blue-500
        peer-checked:[&_.icon-box]:text-white
        peer-checked:[&_.radio-circle]:border-blue-600 dark:peer-checked:[&_.radio-circle]:border-blue-500
        peer-checked:[&_.radio-dot]:scale-100
      ">
        {/* ردیف اول: آیکون و نشانگر رادیو */}
        <div className="flex justify-between items-start mb-5">
          <div className="icon-box w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <span className="text-lg">{icon}</span>
          </div>
          
          {/* دایره رادیویی سفارشی */}
          <div className="radio-circle w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            <span className="radio-dot w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 transition-transform duration-300 scale-0" />
          </div>
        </div>

        {/* متون کارت */}
        <div className="space-y-1">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
            {title}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>
      </div>
    </label>
  );
}