import type { Category } from "@/data/products";

const styles: Record<Category, string> = {
  Accessories: "bg-teal-100 text-teal-900",
  Carpets: "bg-amber-100 text-amber-900",
  Boxes: "bg-purple-100 text-purple-900",
  Wearables: "bg-rose-100 text-rose-900",
};

export function CategoryBadge({ category, className = "" }: { category: Category; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${styles[category]} ${className}`}
    >
      {category}
    </span>
  );
}
