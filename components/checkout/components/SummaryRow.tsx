// مشترک برای فاکتورها

interface SummaryRowProps {
  label: string;
  value: string;
  className?: string;
}

export default function SummaryRow({ 
  label, 
  value, 
  className = "text-gray-500 dark:text-gray-400" 
}: SummaryRowProps) {
  return (
    <div className={`flex justify-between items-center text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}