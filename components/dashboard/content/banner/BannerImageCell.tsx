import Image from "next/image";

interface BannerImageCellProps {
  image: string;
  alt: string;
}

export default function BannerImageCell({ image, alt }: BannerImageCellProps) {
  return (
    <div className="flex justify-center">
      <Image
        src={image}
        alt={alt}
        width={80}
        height={60}
        className="object-cover rounded"
      />
    </div>
  );
}