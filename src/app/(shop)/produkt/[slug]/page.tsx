import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { ProductDetailActions } from "@/components/shop/ProductDetailActions";
import { ProductGallery } from "@/components/shop/ProductGallery";
import type { Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { fetchAllCategories, fetchProductBySlug, fetchRelatedProducts, getStockLabel } from "@/lib/shop";

type ProductDetailPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);

  return {
    title: product ? product.name : "Detail produktu",
  };
}

export default async function ProduktDetailPage({ params }: ProductDetailPageProps) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [categories, relatedProducts] = await Promise.all([
    fetchAllCategories(),
    fetchRelatedProducts(product, 4),
  ]);

  const currentCategory = categories.find((category: Category) => category.id === product.category_id) ?? null;
  const isAvailable = product.stock_status !== "out_of_stock";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {product.image_url ? (
          <ProductGallery
            mainImage={product.image_url}
            gallery={product.gallery ?? []}
            productName={product.name}
          />
        ) : (
          <div className="relative aspect-square rounded-[2rem] border border-gray-200 bg-[linear-gradient(135deg,#f5f5f5,#d4d4d8)] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,25,57,0.18),transparent_28%)]" />
            <div className="absolute left-6 top-6 rounded-full border border-white/70 bg-white/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-sm">
              MASI-CO
            </div>
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/40 bg-white/10 px-5 py-4 text-sm text-white/90 backdrop-blur-sm">
              Ilustrační produktová fotografie
            </div>
          </div>
        )}

        <div className="flex flex-col">
          {currentCategory ? (
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{currentCategory.name}</p>
          ) : null}
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{product.name}</h1>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
            <span className="pb-1 text-base text-gray-500">/ {product.unit}</span>
          </div>

          <p className="mt-4 inline-flex w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            {getStockLabel(product.stock_status)}
          </p>

          {product.weight_info ? (
            <p className="mt-4 text-sm leading-6 text-gray-600">Balení a orientační gramáž: {product.weight_info}</p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Cena je orientační a finální částka se může upravit podle skutečné hmotnosti produktu.
            </p>
          )}

          {product.description ? <p className="mt-4 text-sm leading-7 text-gray-700">{product.description}</p> : null}

          <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-4 text-sm leading-6 text-gray-700">
            U váženého zboží účtujeme skutečně navážené množství. Orientační cena v košíku i v pokladně vám dává přesný rámec před odesláním objednávky.
          </div>

          <div className="mt-8">
            <ProductDetailActions product={product} isAvailable={isAvailable} />
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold">Mohlo by vás zajímat</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Další produkty ze stejné kategorie, které se k vašemu výběru hodí.
          </p>
        </div>
        <ProductsGrid
          products={relatedProducts}
          emptyTitle="Další doporučení zatím nejsou k dispozici"
          emptyText="Jakmile bude ve stejné kategorii více produktů, zobrazí se zde."
        />
      </section>
    </div>
  );
}
