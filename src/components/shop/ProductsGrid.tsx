import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductsGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyText?: string;
}

export function ProductsGrid({
  products,
  emptyTitle = "Žádné produkty",
  emptyText = "Zkuste upravit filtr nebo vyhledávací dotaz.",
}: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-black">{emptyTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
