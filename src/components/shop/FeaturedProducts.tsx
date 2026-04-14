import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-primary mb-3">
              Doporučujeme
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              Nejprodávanější produkty
            </h2>
            <p className="text-gray-500 text-sm">
              Oblíbené produkty našich zákazníků
            </p>
          </div>
          <Link
            href="/produkty"
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Celý sortiment
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
