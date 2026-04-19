import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { Pagination } from "@/components/shop/Pagination";
import {
  fetchAllCategories,
  fetchCategoriesByParent,
  fetchCategoryBySlug,
  fetchProductsByCategoryIdsPaginated,
  type AvailabilityFilter,
  type ProductSort,
} from "@/lib/shop";
import type { Category } from "@/lib/types";

const PRODUCTS_PER_PAGE = 18;

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "default", label: "Doporučené" },
  { value: "name", label: "Název" },
  { value: "price_asc", label: "Cena od nejnižší" },
  { value: "price_desc", label: "Cena od nejvyšší" },
];

type CategoryPageProps = {
  params: { slug: string };
  searchParams?: {
    sort?: string;
    availability?: string;
    page?: string;
    sub?: string;
  };
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await fetchCategoryBySlug(params.slug);
  return { title: category ? category.name : "Kategorie" };
}

export default async function KategoriePage({ params, searchParams }: CategoryPageProps) {
  const category = await fetchCategoryBySlug(params.slug);
  if (!category) notFound();

  const sort = (searchParams?.sort as ProductSort) || "default";
  const availability = (searchParams?.availability as AvailabilityFilter) || "all";
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);
  const activeSub = searchParams?.sub || "all";

  const [allCategories, subcategories] = await Promise.all([
    fetchAllCategories(),
    fetchCategoriesByParent(category.id),
  ]);

  const typedSubcategories = subcategories as Category[];
  const typedCategories = allCategories as Category[];
  const rootCategories = typedCategories
    .filter((item) => item.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Determine which category IDs to fetch products from
  let categoryIds: string[];
  if (activeSub !== "all" && typedSubcategories.length > 0) {
    const selectedSub = typedSubcategories.find((sc) => sc.slug === activeSub);
    categoryIds = selectedSub ? [selectedSub.id] : [category.id];
  } else if (typedSubcategories.length > 0) {
    categoryIds = typedSubcategories.map((sc) => sc.id);
  } else {
    categoryIds = [category.id];
  }

  const { products, total } = await fetchProductsByCategoryIdsPaginated(categoryIds, {
    sort,
    availability,
    page,
    perPage: PRODUCTS_PER_PAGE,
  });

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  // Build searchParams for pagination links (without page)
  const paginationParams: Record<string, string> = {};
  if (sort !== "default") paginationParams.sort = sort;
  if (availability !== "all") paginationParams.availability = availability;
  if (activeSub !== "all") paginationParams.sub = activeSub;

  // Build subcategory filter URL helper
  const buildSubUrl = (subSlug: string) => {
    const p = new URLSearchParams();
    if (sort !== "default") p.set("sort", sort);
    if (availability !== "all") p.set("availability", availability);
    if (subSlug !== "all") p.set("sub", subSlug);
    const qs = p.toString();
    return `/produkty/${params.slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      {/* Header */}
      <div className="border-b border-gray-200 pb-8">
        <Link href="/sortiment" className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
          &larr; Naše produkty
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Category navigation + filters */}
      <div className="mt-6 flex flex-col gap-6">
        {/* Root category pills */}
        <div className="flex flex-wrap gap-2">
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

        {/* Subcategory filter pills */}
        {typedSubcategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildSubUrl("all")}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                activeSub === "all"
                  ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              Vše
            </Link>
            {typedSubcategories.map((sub) => (
              <Link
                key={sub.id}
                href={buildSubUrl(sub.slug)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                  activeSub === sub.slug
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Sort & filter */}
        <form className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium text-gray-700">
            <span className="mb-1.5 block text-xs">Řazení</span>
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">
            <span className="mb-1.5 block text-xs">Dostupnost</span>
            <select
              name="availability"
              defaultValue={availability}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              <option value="all">Vše</option>
              <option value="in_stock">Jen skladem</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Použít
          </button>
        </form>
      </div>

      {/* Products grid */}
      <div id="produkty" className="mt-8">
        <ProductsGrid
          products={products}
          emptyTitle="V této kategorii zatím nic není"
          emptyText="Vyberte jinou kategorii nebo se vraťte později."
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseHref={`/produkty/${params.slug}`}
        searchParams={paginationParams}
      />
    </div>
  );
}
