import Link from "next/link";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { SearchBar } from "@/components/shop/SearchBar";
import { fetchAllProducts, fetchRootCategories, type AvailabilityFilter, type ProductSort } from "@/lib/shop";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";

type ProductsPageProps = {
  searchParams?: {
    q?: string;
    sort?: string;
    availability?: string;
  };
};

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "default", label: "Doporučené" },
  { value: "name", label: "Název" },
  { value: "price_asc", label: "Cena od nejnižší" },
  { value: "price_desc", label: "Cena od nejvyšší" },
];

export const metadata: Metadata = {
  title: "Katalog produktů",
};

export default async function ProduktyPage({ searchParams }: ProductsPageProps) {
  const query = searchParams?.q?.trim() ?? "";
  const sort = (searchParams?.sort as ProductSort) || "default";
  const availability = (searchParams?.availability as AvailabilityFilter) || "all";

  const [products, categories] = await Promise.all([
    fetchAllProducts({ query, sort, availability }),
    fetchRootCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Katalog</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Všechny produkty</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
            Prohlédněte si celý sortiment MASI-CO. Vyhledávání, řazení i filtrace pracují přímo nad daty v Supabase.
          </p>
        </div>

        <div className="w-full lg:max-w-xl">
          <SearchBar initialQuery={query} variant="inline" className="w-full" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <form className="grid gap-3 sm:grid-cols-3">
          {query ? <input type="hidden" name="q" value={query} /> : null}
          <label className="text-sm font-medium text-gray-700">
            <span className="mb-2 block">Řazení</span>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            <span className="mb-2 block">Dostupnost</span>
            <select
              name="availability"
              defaultValue={availability}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="all">Vše</option>
              <option value="in_stock">Jen skladem</option>
            </select>
          </label>

          <button
            type="submit"
            className="mt-auto inline-flex h-[50px] items-center justify-center rounded-md bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Použít
          </button>
        </form>
      </div>

      {query ? (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm leading-6 text-red-900">
          Výsledky vyhledávání pro dotaz <strong>„{query}“</strong>: nalezeno {products.length} produktů.
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {categories.map((category: Category) => (
          <Link
            key={category.id}
            href={`/produkty/${category.slug}`}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProductsGrid
          products={products}
          emptyTitle="Nebyly nalezeny žádné produkty"
          emptyText="Zkuste změnit vyhledávací dotaz, dostupnost nebo řazení."
        />
      </div>
    </div>
  );
}
