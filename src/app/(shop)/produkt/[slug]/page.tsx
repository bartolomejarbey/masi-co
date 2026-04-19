import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { ProductDetailActions } from "@/components/shop/ProductDetailActions";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductAccordion } from "@/components/shop/ProductAccordion";
import type { Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  fetchAllCategories,
  fetchProductBySlug,
  fetchRelatedProducts,
  getStockLabel,
} from "@/lib/shop";
import { ChevronRight } from "lucide-react";

type ProductDetailPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  return {
    title: product ? product.name : "Detail produktu",
    description: product?.description ?? `Produkt ${product?.name} v e-shopu MASI-CO.`,
  };
}

export default async function ProduktDetailPage({ params }: ProductDetailPageProps) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) notFound();

  const [categories, relatedProducts] = await Promise.all([
    fetchAllCategories(),
    fetchRelatedProducts(product, 4),
  ]);

  const currentCategory =
    categories.find((category: Category) => category.id === product.category_id) ?? null;
  const isAvailable = product.stock_status !== "out_of_stock";

  const stockStatusColor =
    product.stock_status === "in_stock"
      ? "bg-green-100 text-green-700"
      : product.stock_status === "out_of_stock"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/" className="transition-colors hover:text-gray-600">
          Úvod
        </Link>
        <ChevronRight size={12} />
        <Link href="/sortiment" className="transition-colors hover:text-gray-600">
          Sortiment
        </Link>
        {currentCategory && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/sortiment/${currentCategory.slug}`}
              className="transition-colors hover:text-gray-600"
            >
              {currentCategory.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        {/* Gallery */}
        {product.image_url ? (
          <ProductGallery
            mainImage={product.image_url}
            gallery={product.gallery ?? []}
            productName={product.name}
          />
        ) : (
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-gray-400">Fotografie není k dispozici</p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex flex-col">
          {currentCategory && (
            <Link
              href={`/sortiment/${currentCategory.slug}`}
              className="text-sm font-medium uppercase tracking-[0.2em] text-primary transition-colors hover:text-primary-dark"
            >
              {currentCategory.name}
            </Link>
          )}

          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            {product.name}
          </h1>

          {product.badge && (
            <span className="mt-3 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          )}

          <span
            className={`mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${stockStatusColor}`}
          >
            {getStockLabel(product.stock_status)}
          </span>

          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="pb-1 text-base text-gray-500">/ {product.unit}</span>
          </div>

          {product.unit === "kg" && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Cena je orientační. Konečná cena odpovídá skutečné dodané hmotnosti.
            </div>
          )}

          {product.weight_info && (
            <p className="mt-3 text-sm text-gray-500">
              Balení: {product.weight_info}
            </p>
          )}

          <div className="mt-6">
            <ProductDetailActions product={product} isAvailable={isAvailable} />
          </div>

          {/* Accordion sections */}
          <div className="mt-8 border-t border-gray-200">
            <ProductAccordion
              sections={[
                ...(product.description
                  ? [{ title: "Popis", content: product.description }]
                  : []),
                {
                  title: "Doručení",
                  content:
                    "Doprava zdarma od 1 000 Kč. Rozvážíme po Praze a okolí vlastním chlazeným vozem. Objednávky do 12:00 expedujeme tentýž den.",
                },
                {
                  title: "Informace",
                  content: `Původ: České jatky. Jednotka: ${product.unit === "kg" ? "kilogram" : "kus"}.${
                    product.weight_info ? ` Balení: ${product.weight_info}.` : ""
                  } U váženého zboží účtujeme skutečně navážené množství.`,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="font-display text-2xl font-bold">Mohlo by vás zajímat</h2>
          <p className="mt-2 text-sm text-gray-500">
            Další produkty ze stejné kategorie.
          </p>
          <div className="mt-6">
            <ProductsGrid
              products={relatedProducts}
              emptyTitle="Další doporučení zatím nejsou k dispozici"
              emptyText="Jakmile bude ve stejné kategorii více produktů, zobrazí se zde."
            />
          </div>
        </section>
      )}
    </div>
  );
}
