import { Link } from "@/components/ui/link";
import Image from "next/image";

interface CategoryItemProps {
  category: {
    name: string;
    slug: string;
    image_url: string | null;
  };
  imageLoading: "eager" | "lazy";
}

export default function CategoryItem({ category, imageLoading }: CategoryItemProps) {
  return (
    <Link
      prefetch={true}
      className="flex w-[125px] flex-col items-center text-center"
      href={`/products/${category.slug}`}
    >
      <Image
        loading={imageLoading}
        decoding="sync"
        src={category.image_url ?? "/placeholder.svg"}
        alt={`A small picture of ${category.name}`}
        className="mb-2 h-14 w-14 border hover:bg-accent2"
        width={48}
        height={48}
        quality={65}
      />
      <span className="text-xs">{category.name}</span>
    </Link>
  );
}
