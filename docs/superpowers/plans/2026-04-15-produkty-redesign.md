# Produkty Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/produkty` into a storytelling landing page with category sections, add pagination to `/produkty/[slug]`, and rebuild product cards with hover overlay.

**Architecture:** Three independent changes: (1) New landing page replaces product listing at `/produkty`, (2) Pagination component + data layer for category pages, (3) New ProductCard with hover overlay for desktop and always-visible controls on mobile. Changes are additive — existing routing structure preserved.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Supabase, TypeScript

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/lib/shop.ts` | Modify | Add paginated fetch + count functions |
| `src/components/shop/Pagination.tsx` | Create | Reusable pagination UI component |
| `src/components/shop/ProductCard.tsx` | Rewrite | New card design with hover overlay |
| `src/components/shop/ProductsGrid.tsx` | Modify | Pass through new props |
| `src/app/(shop)/produkty/page.tsx` | Rewrite | Landing page with category storytelling |
| `src/app/(shop)/produkty/[slug]/page.tsx` | Modify | Add pagination, sorting, filters |

---

### Task 1: Add paginated data fetching to shop.ts

**Files:**
- Modify: `src/lib/shop.ts`

- [ ] **Step 1: Add `fetchProductsByCategoryIdsPaginated` function**

Add this function after the existing `fetchProductsByCategoryIds` (around line 361):

```typescript
export async function fetchProductsByCategoryIdsPaginated(
  categoryIds: string[],
  filters: ProductFilters & { page?: number; perPage?: number } = {}
): Promise<{ products: Product[]; total: number }> {
  if (categoryIds.length === 0) {
    return { products: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 18;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Get total count
  const { count, error: countError } = await db
    .from("products")
    .select("id", { count: "exact", head: true })
    .in("category_id", categoryIds)
    .eq("is_active", true);

  if (countError) {
    throw new Error(countError.message);
  }

  // Get paginated products
  const { data, error } = await db
    .from("products")
    .select("*")
    .in("category_id", categoryIds)
    .eq("is_active", true)
    .order("sort_order")
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const filtered = filterProducts(data ?? [], filters.availability ?? "all");
  const sorted = sortProducts(filtered, filters.sort ?? "default");

  return { products: sorted, total: count ?? 0 };
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/shop.ts
git commit -m "feat: add paginated product fetch function"
```

---

### Task 2: Create Pagination component

**Files:**
- Create: `src/components/shop/Pagination.tsx`

- [ ] **Step 1: Create the Pagination component**

```tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, baseHref, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  }

  // Build page numbers: show first, last, current, and neighbors
  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav aria-label="Stránkování" className="mt-12 flex items-center justify-center gap-1.5">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Předchozí</span>
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-100 px-3 text-sm font-medium text-gray-300 cursor-not-allowed">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Předchozí</span>
        </span>
      )}

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`e${i}`} className="inline-flex h-10 w-10 items-center justify-center text-sm text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-white"
                : "border border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          <span className="hidden sm:inline">Další</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-100 px-3 text-sm font-medium text-gray-300 cursor-not-allowed">
          <span className="hidden sm:inline">Další</span>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/shop/Pagination.tsx
git commit -m "feat: add Pagination component"
```

---

### Task 3: Redesign ProductCard with hover overlay

**Files:**
- Rewrite: `src/components/shop/ProductCard.tsx`

Important context: The current ProductCard has stock management logic (`manage_stock`, `stock_quantity`, `low_stock_threshold`, `max_per_order`, `allow_backorders`) added by a recent linter/user change. This logic MUST be preserved. The card is used by both `ProductsGrid` and `FeaturedProducts`.

- [ ] **Step 1: Rewrite ProductCard.tsx with hover overlay design**

Replace the entire file content with:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const stockLabels: Record<string, { text: string; className: string }> = {
  in_stock: { text: "Skladem", className: "bg-green-50 text-green-700" },
  out_of_stock: { text: "Vyprodáno", className: "bg-gray-100 text-gray-400" },
  on_order: { text: "Na objednávku", className: "bg-orange-50 text-orange-600" },
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(product.unit === "kg" ? 1 : 1);
  const stock = stockLabels[product.stock_status] || stockLabels.in_stock;
  const isAvailable = product.stock_status !== "out_of_stock";
  const step = product.unit === "kg" ? 0.5 : 1;
  const min = product.unit === "kg" ? 0.5 : 1;

  const stockMax =
    product.manage_stock && product.stock_quantity !== null && product.allow_backorders === "no"
      ? product.stock_quantity
      : Infinity;
  const orderMax = product.max_per_order ?? Infinity;
  const maxQty = Math.min(stockMax, orderMax);

  const isLowStock =
    product.manage_stock &&
    product.stock_quantity !== null &&
    product.low_stock_threshold !== null &&
    product.stock_quantity <= product.low_stock_threshold &&
    product.stock_quantity > 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image with hover overlay (desktop) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#f4f4f5,#d4d4d8)]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,25,57,0.16),transparent_30%)]" />
            <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-sm">
              MASI-CO
            </div>
          </>
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Stock tag */}
        <span className={`absolute top-3 right-3 z-10 rounded-md px-2 py-0.5 text-[10px] font-semibold ${stock.className}`}>
          {stock.text}
        </span>

        {/* Hover overlay — desktop only */}
        {isAvailable && (
          <div className="absolute inset-0 hidden items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 md:flex md:flex-col">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, qty);
              }}
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
            >
              <ShoppingCart size={16} />
              Do košíku
            </button>
            <Link
              href={`/produkt/${product.slug}`}
              className="flex items-center gap-1.5 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <Eye size={14} />
              Detail
            </Link>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/produkt/${product.slug}`}>
          <h3 className="font-display text-sm font-bold leading-snug line-clamp-2 min-h-[2.5rem] transition-colors hover:text-primary sm:text-base">
            {product.name}
          </h3>
        </Link>

        {product.weight_info && (
          <p className="mt-1 text-xs text-gray-400">{product.weight_info}</p>
        )}

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
          <span className="text-xs text-gray-400">/{product.unit}</span>
        </div>

        {isLowStock && (
          <p className="mt-1 text-[10px] text-amber-600">
            Posledn{product.stock_quantity === 1 ? "í kus" : `ích ${Math.floor(product.stock_quantity!)} ${product.unit}`}
          </p>
        )}
        {product.stock_status === "on_order" && product.allow_backorders === "notify" && (
          <p className="mt-1 text-[10px] text-orange-500">Delší dodací lhůta</p>
        )}

        {/* Mobile-only: always-visible add to cart */}
        <div className="mt-auto pt-3 md:hidden">
          {isAvailable ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-gray-200">
                <button
                  onClick={() => setQty(Math.max(min, qty - step))}
                  className="flex h-9 w-8 items-center justify-center text-gray-500 transition-colors hover:text-black"
                  aria-label="Snížit množství"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(maxQty, qty + step))}
                  disabled={qty >= maxQty}
                  className="flex h-9 w-8 items-center justify-center text-gray-500 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Zvýšit množství"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary"
              >
                <ShoppingCart size={14} />
                Do košíku
              </button>
            </div>
          ) : (
            <button
              disabled
              className="flex h-9 w-full items-center justify-center rounded-lg bg-gray-100 px-3 text-xs font-medium uppercase tracking-wider text-gray-400 cursor-not-allowed"
            >
              Vyprodáno
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/shop/ProductCard.tsx
git commit -m "feat: redesign ProductCard with hover overlay"
```

---

### Task 4: Rewrite landing page `/produkty`

**Files:**
- Rewrite: `src/app/(shop)/produkty/page.tsx`

- [ ] **Step 1: Rewrite produkty/page.tsx as storytelling landing page**

Replace the entire file with:

```tsx
import Image from "next/image";
import Link from "next/link";
import { fetchRootCategories } from "@/lib/shop";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naše produkty",
};

const categoryContent: Record<string, { headline: string; text: string }> = {
  maso: {
    headline: "Čerstvé maso",
    text: "Naše hovězí ještě včera mělo plány na víkend. Steaky, roštěnky, svíčkové — vše ručně porcované, jak se na pořádné řeznictví sluší.",
  },
  hotovky: {
    headline: "Hotová jídla",
    text: "Pro ty, co chtějí jíst dobře, ale vařit? To ne. Sekaná, řízky, guláš — domácí chuť bez domácího nepořádku.",
  },
  "uzene-maso": {
    headline: "Uzené speciality",
    text: "Uzené po staročesku. Žádné tekuté kouře, žádné zkratky. Jen dřevo, čas a trocha řeznické magie.",
  },
  zverina: {
    headline: "Zvěřina",
    text: "Pro dobrodruhy u plotny. Jelení, srnčí, divočák — maso s příběhem z českých lesů.",
  },
  ryby: {
    headline: "Ryby",
    text: "I řezník ví, že pátek patří rybě. Čerstvé, filetované, připravené skočit na pánev.",
  },
  uzeniny: {
    headline: "Uzeniny",
    text: "Klobásky, párky, šunka — to, co dělá svačinu svačinou a piknik piknikem.",
  },
  "ostatni-sortiment": {
    headline: "Ostatní dobroty",
    text: "Bramboráky, knedlíky, přílohy a věci, bez kterých by maso bylo osamělé.",
  },
};

export default async function NaseProduktyPage() {
  const categories = await fetchRootCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(204,25,57,0.06),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            MASI-CO Sortiment
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Naše produkty
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Poctivé maso, domácí hotovky a speciality z našeho řeznictví.
            Vybíráme jen to nejlepší — od lokálních dodavatelů, co znají své řemeslo.
          </p>
        </div>
      </section>

      {/* Category sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {categories.map((category: Category, index: number) => {
          const content = categoryContent[category.slug] ?? {
            headline: category.name,
            text: category.description ?? "Prohlédněte si produkty v této kategorii.",
          };
          const isEven = index % 2 === 1;

          return (
            <section
              key={category.id}
              className="border-b border-gray-100 py-16 last:border-b-0 sm:py-20 lg:py-24"
            >
              <div className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f4f4f5,#d4d4d8)] lg:w-1/2">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full border border-white/70 bg-white/30 px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] text-gray-400 backdrop-blur-sm">
                        {category.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col lg:w-1/2">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Kategorie
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                    {content.headline}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                    {content.text}
                  </p>
                  <div className="mt-8">
                    <Link
                      href={`/produkty/${category.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary"
                    >
                      Prozkoumat
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/(shop)/produkty/page.tsx
git commit -m "feat: rewrite /produkty as storytelling landing page"
```

---

### Task 5: Add pagination to category page `/produkty/[slug]`

**Files:**
- Modify: `src/app/(shop)/produkty/[slug]/page.tsx`

- [ ] **Step 1: Update the category page with pagination**

Replace the entire file with:

```tsx
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

  const [allCategories, subcategories] = await Promise.all([
    fetchAllCategories(),
    fetchCategoriesByParent(category.id),
  ]);

  const typedSubcategories = subcategories as Category[];
  const typedCategories = allCategories as Category[];
  const rootCategories = typedCategories
    .filter((item) => item.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Collect all relevant category IDs (parent + subcategories)
  const categoryIds = typedSubcategories.length > 0
    ? typedSubcategories.map((sc) => sc.id)
    : [category.id];

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      {/* Header */}
      <div className="border-b border-gray-200 pb-8">
        <Link href="/produkty" className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
          &larr; Naše produkty
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Category navigation + filters */}
      <div className="mt-6 flex flex-col gap-6">
        {/* Category pills */}
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
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/(shop)/produkty/[slug]/page.tsx
git commit -m "feat: add pagination to category product pages"
```

---

### Task 6: Visual verification and final commit

**Files:** None new — verification only.

- [ ] **Step 1: Start dev server and verify landing page**

Run: `npx next dev`
Navigate to `http://localhost:3000/produkty`
Verify: Hero section visible, category sections with alternating layout, "Prozkoumat" buttons link correctly.

- [ ] **Step 2: Verify category page with pagination**

Navigate to `http://localhost:3000/produkty/maso` (or any category with products)
Verify: Products shown in grid, pagination visible at bottom, page navigation works, sorting/filtering resets to page 1.

- [ ] **Step 3: Verify product card hover overlay**

Hover over a product card on desktop.
Verify: Dark overlay appears over image with "Do košíku" and "Detail" buttons. Card lifts with shadow. Clicking "Do košíku" adds to cart.

- [ ] **Step 4: Verify mobile card layout**

Resize browser to mobile width.
Verify: Hover overlay hidden, "Do košíku" button always visible below card info, quantity selector works.

- [ ] **Step 5: Final commit with all changes**

```bash
git add -A
git commit -m "feat: produkty redesign — landing page, pagination, card hover overlay"
```
