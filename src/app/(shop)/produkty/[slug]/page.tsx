import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { SearchBar } from "@/components/shop/SearchBar";
import {
  fetchAllCategories,
  fetchCategoriesByParent,
  fetchCategoryBySlug,
  fetchProductsByCategoryIds,
  type AvailabilityFilter,
  type ProductSort,
} from "@/lib/shop";
import type { Category } from "@/lib/types";

type CategoryPageProps = {
  params: { slug: string };
  searchParams?: {
    sort?: string;
    availability?: string;
  };
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await fetchCategoryBySlug(params.slug);

  return {
    title: category ? category.name : "Kategorie",
  };
}

export default async function KategoriePage({ params, searchParams }: CategoryPageProps) {
  const category = await fetchCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const sort = (searchParams?.sort as ProductSort) || "default";
  const availability = (searchParams?.availability as AvailabilityFilter) || "all";
  const [allCategories, subcategories] = await Promise.all([fetchAllCategories(), fetchCategoriesByParent(category.id)]);

  const typedSubcategories = subcategories as Category[];
  const hasSubcategories = typedSubcategories.length > 0;
  const typedCategories = allCategories as Category[];
  const rootCategories = typedCategories.filter((item) => item.parent_id === null).sort((a, b) => a.sort_order - b.sort_order);

  if (hasSubcategories) {
    const categorySections = await Promise.all(
      typedSubcategories.map(async (subcategory: Category) => ({
        category: subcategory,
        products: await fetchProductsByCategoryIds([subcategory.id], { sort, availability }),
      }))
    );

    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Kategorie</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
            {category.description || "Přehled produktů rozdělených podle podkategorií."}
          </p>
          <div className="mt-6 max-w-2xl">
            <SearchBar variant="inline" className="w-full" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl bg-gray-50 px-5 py-4 text-sm leading-6 text-gray-700">
            Kategorie <strong>{category.name}</strong> je přehledně rozdělená do podkategorií, aby se v sortimentu lépe hledalo.
          </div>
          <aside className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Rychlá navigace</p>
            <p className="mt-2 font-display text-2xl font-bold">Podkategorie</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {typedSubcategories.map((subcategory: Category) => (
                <a
                  key={subcategory.id}
                  href={`#${subcategory.slug}`}
                  className="rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
                >
                  {subcategory.name}
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 space-y-12">
          {categorySections.map(({ category: sectionCategory, products }) => (
            <section key={sectionCategory.id} id={sectionCategory.slug}>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-display text-3xl font-bold">{sectionCategory.name}</h2>
                  {sectionCategory.description ? (
                    <p className="mt-2 text-sm leading-6 text-gray-600">{sectionCategory.description}</p>
                  ) : null}
                </div>
              </div>
              <ProductsGrid
                products={products}
                emptyTitle={`Kategorie ${sectionCategory.name} je zatím prázdná`}
                emptyText="Jakmile budou produkty dostupné, objeví se zde."
              />
            </section>
          ))}
        </div>
      </div>
    );
  }

  const products = await fetchProductsByCategoryIds([category.id], { sort, availability });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="border-b border-gray-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Kategorie</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
          {category.description || "Produkty v této kategorii."}
        </p>
        <div className="mt-6 max-w-2xl">
          <SearchBar variant="inline" className="w-full" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {rootCategories.map((rootCategory) => (
          <Link
            key={rootCategory.id}
            href={`/produkty/${rootCategory.slug}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              rootCategory.id === category.id
                ? "border-primary bg-red-50 text-primary"
                : "border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
            }`}
          >
            {rootCategory.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProductsGrid
          products={products}
          emptyTitle="V této kategorii zatím nic není"
          emptyText="Vyberte jinou kategorii nebo se vraťte později."
        />
      </div>
    </div>
  );
}
