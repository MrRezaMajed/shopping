interface BannerPositionCellProps {
  position: "TOP" | "RIGHT" | "DOWN";
}

const positionLabels: Record<BannerPositionCellProps["position"], string> = {
  TOP: "بالا",
  RIGHT: "راست",
  DOWN: "پایین",
};

export default function BannerPositionCell({ position }: BannerPositionCellProps) {
  const getBadgeColor = (pos: string) => {
    switch (pos) {
      case "TOP":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "RIGHT":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "DOWN":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${getBadgeColor(position)}`}>
      {positionLabels[position]}
    </span>
  );
}